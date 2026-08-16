import ConnectDB from "@/lib/dbConnect";
import SessionModel from "@/models/Session.model";
import { validateSession } from "@/lib/validateSession";

interface RouteContext {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: RouteContext,
) {
  try {
    // ==================================================
    // 1. Validate current session
    // ==================================================

    const auth = await validateSession();

    if (!auth.valid) {
      return Response.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: 401,
        },
      );
    }

    // ==================================================
    // 2. Get target session ID
    // ==================================================

    const { sessionId } = await params;

    if (!sessionId) {
      return Response.json(
        {
          success: false,
          message: "Session ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    // ==================================================
    // 3. Prevent signing out current session
    // ==================================================

    if (
      sessionId ===
      auth.session.user.sessionId
    ) {
      return Response.json(
        {
          success: false,
          message:
            "You cannot sign out your current session here.",
        },
        {
          status: 400,
        },
      );
    }

    // ==================================================
    // 4. Connect database
    // ==================================================

    await ConnectDB();

    // ==================================================
    // 5. Find target session
    // ==================================================

    const targetSession =
      await SessionModel.findOne({
        sessionId,
        userId: auth.session.user._id,
      });

    if (!targetSession) {
      return Response.json(
        {
          success: false,
          message: "Session not found.",
        },
        {
          status: 404,
        },
      );
    }

    // ==================================================
    // 6. Check if already revoked
    // ==================================================

    if (targetSession.revokedAt) {
      return Response.json(
        {
          success: false,
          message:
            "This session has already been signed out.",
        },
        {
          status: 400,
        },
      );
    }

    // ==================================================
    // 7. Revoke session
    // ==================================================

    targetSession.revokedAt =
      new Date();

    await targetSession.save();

    // ==================================================
    // 8. Success
    // ==================================================

    return Response.json(
      {
        success: true,
        message:
          "Session signed out successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "SIGN OUT SESSION ERROR:",
      error,
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to sign out session.",
      },
      {
        status: 500,
      },
    );
  }
}
import ConnectDB from "@/lib/dbConnect";
import SessionModel from "@/models/Session.model";
import { validateSession } from "@/lib/validateSession";

export async function POST() {
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
    // 2. Connect database
    // ==================================================

    await ConnectDB();

    const currentSessionId =
      auth.session.user.sessionId;

    const userId =
      auth.session.user._id;

    // ==================================================
    // 3. Revoke every other active session
    // ==================================================

    const result =
      await SessionModel.updateMany(
        {
          userId,
          sessionId: {
            $ne: currentSessionId,
          },
          revokedAt: null,
          expiresAt: {
            $gt: new Date(),
          },
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        },
      );

    // ==================================================
    // 4. Success
    // ==================================================

    return Response.json(
      {
        success: true,
        message:
          "All other sessions have been signed out.",
        revokedSessions:
          result.modifiedCount,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "REVOKE OTHER SESSIONS ERROR:",
      error,
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to sign out other sessions.",
      },
      {
        status: 500,
      },
    );
  }
}
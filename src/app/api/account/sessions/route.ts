import ConnectDB from "@/lib/dbConnect";
import SessionModel from "@/models/Session.model";
import { validateSession } from "@/lib/validateSession";

export async function GET() {
  try {
    // ==================================================
    // 1. Validate authentication + current session
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
    // 2. Connect to database
    // ==================================================

    await ConnectDB();

    // ==================================================
    // 3. Get all active sessions
    // ==================================================

    const sessions =
      await SessionModel.find({
        userId: auth.session.user._id,
        revokedAt: null,
        expiresAt: {
          $gt: new Date(),
        },
      })
        .sort({
          lastActiveAt: -1,
        })
        .select(
          "_id sessionId device browser operatingSystem ipAddress lastActiveAt expiresAt createdAt",
        )
        .lean();

    // ==================================================
    // 4. Mark current session
    // ==================================================

    const sessionsWithCurrent =
      sessions.map((session) => ({
        ...session,

        isCurrent:
          session.sessionId ===
          auth.session.user.sessionId,
      }));

    // ==================================================
    // 5. Return sessions
    // ==================================================

    return Response.json(
      {
        success: true,
        sessions: sessionsWithCurrent,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "GET ACTIVE SESSIONS ERROR:",
      error,
    );

    return Response.json(
      {
        success: false,
        message: "Failed to fetch active sessions.",
      },
      {
        status: 500,
      },
    );
  }
}
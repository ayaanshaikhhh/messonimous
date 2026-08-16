import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ConnectDB from "@/lib/dbConnect";
import SessionModel from "@/models/Session.model";

export async function validateSession() {
  // ==================================================
  // 1. Get NextAuth session
  // ==================================================

  const session = await getServerSession(
    authOptions,
  );

  if (!session?.user?._id) {
    return {
      valid: false as const,
      session: null,
      sessionRecord: null,
      message: "Not authenticated.",
    };
  }

  // ==================================================
  // 2. Make sure our custom session ID exists
  // ==================================================

  if (!session.user.sessionId) {
    return {
      valid: false as const,
      session: null,
      sessionRecord: null,
      message: "Invalid session.",
    };
  }

  // ==================================================
  // 3. Connect DB
  // ==================================================

  await ConnectDB();

  // ==================================================
  // 4. Find session registry record
  // ==================================================

  const sessionRecord =
    await SessionModel.findOne({
      sessionId: session.user.sessionId,
      userId: session.user._id,
    });

  if (!sessionRecord) {
    return {
      valid: false as const,
      session: null,
      sessionRecord: null,
      message: "Session not found.",
    };
  }

  // ==================================================
  // 5. Check revoked session
  // ==================================================

  if (sessionRecord.revokedAt) {
    return {
      valid: false as const,
      session: null,
      sessionRecord,
      message: "Session has been revoked.",
    };
  }

  // ==================================================
  // 6. Check expiration
  // ==================================================

  if (
    sessionRecord.expiresAt.getTime() <=
    Date.now()
  ) {
    return {
      valid: false as const,
      session: null,
      sessionRecord,
      message: "Session has expired.",
    };
  }

  // ==================================================
  // 7. Update last activity
  // ==================================================

  sessionRecord.lastActiveAt =
    new Date();

  await sessionRecord.save();

  // ==================================================
  // 8. Session is valid
  // ==================================================

  return {
    valid: true as const,
    session,
    sessionRecord,
    message: null,
  };
}
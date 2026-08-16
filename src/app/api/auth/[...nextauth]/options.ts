import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import SessionModel from "@/models/Session.model";

import { getSessionMetadata } from "@/lib/getSessionMetadata";

import bcrypt from "bcryptjs";
import crypto from "crypto";

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const MAX_ACTIVE_SESSIONS = 5;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter your email or username",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials): Promise<any> {
        await ConnectDB();

        try {
          // Validate credentials

          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Provide Username and Password");
          }

        //  Find user by username or email

          const user = await UserModel.findOne({
            $or: [
              {
                username: credentials.identifier,
              },
              {
                email: credentials.identifier,
              },
            ],
          });

          if (!user) {
            throw new Error("No user found");
          }

          // Check password

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect Password");
          }

          //  Check account deletion status

          if (user.isDeleted) {
            throw new Error("ACCOUNT_SCHEDULED_FOR_DELETION");
          }

          //  Generate unique session ID

          const sessionId = crypto.randomUUID();

          //  Get session metadata

          const metadata = await getSessionMetadata();

          //  Find active sessions

          const activeSessions = await SessionModel.find({
            userId: user._id,

            // Only active sessions
            revokedAt: null,

            // Ignore expired sessions
            expiresAt: {
              $gt: new Date(),
            },
          })
            .sort({
              createdAt: 1,
            })
            .select("_id sessionId");

          // 8. Enforce maximum active sessions

          if (activeSessions.length >= MAX_ACTIVE_SESSIONS) {
            // Number of sessions that need to be revoked.
            //
            // Example:
            // 5 active + new login
            // 5 - 5 + 1 = 1
            //
            // 7 active + new login
            // 7 - 5 + 1 = 3
            const sessionsToRevoke =
              activeSessions.length - MAX_ACTIVE_SESSIONS + 1;

            // Because the sessions are sorted by
            // createdAt ascending, the first sessions
            // are the oldest ones.
            const sessionsToRevokeIds = activeSessions
              .slice(0, sessionsToRevoke)
              .map((session) => session._id);

            await SessionModel.updateMany(
              {
                _id: {
                  $in: sessionsToRevokeIds,
                },
              },
              {
                $set: {
                  revokedAt: new Date(),
                },
              },
            );
          }

          //
          //  Create new session registry record
          //

          await SessionModel.create({
            userId: user._id,

            sessionId,

            device: metadata.device,

            browser: metadata.browser,

            operatingSystem: metadata.operatingSystem,

            ipAddress: metadata.ipAddress,

            userAgent: metadata.userAgent,

            lastActiveAt: new Date(),

            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

            revokedAt: null,
          });

          //
          // Return authenticated user
          //

          return {
            ...user.toObject(),

            // Pass custom session ID
            // to the JWT callback.
            sessionId,
          };
        } catch (error) {
          console.error("NEXTAUTH AUTHORIZE ERROR:", error);

          throw error;
        }
      },
    }),
  ],

  callbacks: {
    // SESSION CALLBACK
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;

        session.user.isVerified = token.isVerified;

        session.user.isAcceptingMessage = token.isAcceptingMessage;

        session.user.username = token.username;

        //
        // Account deletion
        //
        session.user.isDeleted = token.isDeleted;

        session.user.deletionRequestedAt = token.deletionRequestedAt;

        session.user.deletionScheduledFor = token.deletionScheduledFor;

        // Active session

        session.user.sessionId = token.sessionId;
      }

      return session;
    },

    // JWT CALLBACK

    async jwt({ token, user }) {
      // This block runs when the user signs in.
      if (user) {
        // User information

        token._id = user._id?.toString();

        token.isVerified = user.isVerified;

        token.isAcceptingMessage = user.isAcceptingMessage;

        token.username = user.username;

        // Account deletion

        token.isDeleted = user.isDeleted;

        token.deletionRequestedAt = user.deletionRequestedAt;

        token.deletionScheduledFor = user.deletionScheduledFor;

        // Active session

        token.sessionId = user.sessionId;
      }

      return token;
    },
  },

  // AUTH PAGES

  pages: {
    signIn: "/sign-in",
  },

  // SESSION CONFIGURATION

  session: {
    strategy: "jwt",
  },

  // SECRET

  secret: process.env.NEXTAUTH_SECRET,
};

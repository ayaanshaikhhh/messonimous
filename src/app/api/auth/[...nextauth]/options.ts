// import ConnectDB from "@/lib/dbConnect";
// import UserModel from "@/models/User.model";
// import bcrypt from "bcryptjs";
// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// import crypto from "crypto";
// import SessionModel from "@/models/Session.model";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",

//       credentials: {
//         identifier: {
//           label: "Email or Username",
//           type: "text",
//           placeholder: "Enter your email or username",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },

//       async authorize(credentials): Promise<any> {
//         await ConnectDB();

//         try {
//           // Validating credentials

//           if (!credentials?.identifier || !credentials?.password) {
//             throw new Error("Provide Username and Password");
//           }

//           // Find user by username or email

//           const user = await UserModel.findOne({
//             $or: [
//               { username: credentials.identifier },
//               { email: credentials.identifier },
//             ],
//           });

//           if (!user) {
//             throw new Error("No user found");
//           }

//           //Checking password

//           const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.password,
//           );

//           if (!isPasswordCorrect) {
//             throw new Error("Incorrect Password");
//           }

//           // Checking account deletion status

//           if (user.isDeleted) {
//             throw new Error("ACCOUNT_SCHEDULED_FOR_DELETION");
//           }

//           // Login

//           return user;
//         } catch (error) {
//           console.error("NEXTAUTH AUTHORIZE ERROR:", error);

//           throw error;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token) {
//         session.user._id = token._id;
//         session.user.isVerified = token.isVerified;
//         session.user.isAcceptingMessage = token.isAcceptingMessage;
//         session.user.username = token.username;

//         session.user.isDeleted = token.isDeleted;
//         session.user.deletionRequestedAt = token.deletionRequestedAt;
//         session.user.deletionScheduledFor = token.deletionScheduledFor;
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user._id?.toString();
//         token.isVerified = user.isVerified;
//         token.isAcceptingMessage = user.isAcceptingMessage;
//         token.username = user.username;

//         token.isDeleted = user.isDeleted;
//         token.deletionRequestedAt = user.deletionRequestedAt;
//         token.deletionScheduledFor = user.deletionScheduledFor;
//       }

//       return token;
//     },
//   },
//   pages: {
//     signIn: "/sign-in",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };


import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import SessionModel from "@/models/Session.model";

import { getSessionMetadata } from "@/lib/getSessionMetadata";

import bcrypt from "bcryptjs";
import crypto from "crypto";

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
          // ==================================================
          // 1. Validate credentials
          // ==================================================

          if (
            !credentials?.identifier ||
            !credentials?.password
          ) {
            throw new Error(
              "Provide Username and Password",
            );
          }

          // ==================================================
          // 2. Find user by username or email
          // ==================================================

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

          // ==================================================
          // 3. Check password
          // ==================================================

          const isPasswordCorrect =
            await bcrypt.compare(
              credentials.password,
              user.password,
            );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect Password");
          }

          // ==================================================
          // 4. Check account deletion status
          // ==================================================

          if (user.isDeleted) {
            throw new Error(
              "ACCOUNT_SCHEDULED_FOR_DELETION",
            );
          }

          // ==================================================
          // 5. Generate unique session ID
          // ==================================================

          const sessionId =
            crypto.randomUUID();

          // ==================================================
          // 6. Get session metadata
          // ==================================================

          const metadata =
            await getSessionMetadata();

          // ==================================================
          // 7. Create session registry record
          // ==================================================

          await SessionModel.create({
            userId: user._id,

            sessionId,

            device: metadata.device,
            browser: metadata.browser,
            operatingSystem:
              metadata.operatingSystem,

            ipAddress:
              metadata.ipAddress,

            userAgent:
              metadata.userAgent,

            lastActiveAt: new Date(),

            expiresAt: new Date(
              Date.now() +
                30 *
                  24 *
                  60 *
                  60 *
                  1000,
            ),

            revokedAt: null,
          });

          // ==================================================
          // 8. Return authenticated user
          // ==================================================

          return {
            ...user.toObject(),

            // Pass sessionId to JWT callback
            sessionId,
          };
        } catch (error) {
          console.error(
            "NEXTAUTH AUTHORIZE ERROR:",
            error,
          );

          throw error;
        }
      },
    }),
  ],

  callbacks: {
    // ======================================================
    // SESSION CALLBACK
    // ======================================================

    async session({ session, token }) {
      if (token) {
        session.user._id =
          token._id;

        session.user.isVerified =
          token.isVerified;

        session.user.isAcceptingMessage =
          token.isAcceptingMessage;

        session.user.username =
          token.username;

        // Account deletion
        session.user.isDeleted =
          token.isDeleted;

        session.user.deletionRequestedAt =
          token.deletionRequestedAt;

        session.user.deletionScheduledFor =
          token.deletionScheduledFor;

        // Active session
        session.user.sessionId =
          token.sessionId;
      }

      return session;
    },

    // ======================================================
    // JWT CALLBACK
    // ======================================================

    async jwt({ token, user }) {
      // This block runs when the user signs in.
      if (user) {
        token._id =
          user._id?.toString();

        token.isVerified =
          user.isVerified;

        token.isAcceptingMessage =
          user.isAcceptingMessage;

        token.username =
          user.username;

        // Account deletion
        token.isDeleted =
          user.isDeleted;

        token.deletionRequestedAt =
          user.deletionRequestedAt;

        token.deletionScheduledFor =
          user.deletionScheduledFor;

        // Active session
        token.sessionId =
          user.sessionId;
      }

      return token;
    },
  },

  // ========================================================
  // AUTH PAGES
  // ========================================================

  pages: {
    signIn: "/sign-in",
  },

  // ========================================================
  // SESSION CONFIGURATION
  // ========================================================

  session: {
    strategy: "jwt",
  },

  // ========================================================
  // SECRET
  // ========================================================

  secret: process.env.NEXTAUTH_SECRET,
};

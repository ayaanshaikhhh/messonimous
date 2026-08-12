import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "../../../../models/User.model";

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
          const user = await UserModel.findOne({
            $or: [
              { username: credentials?.identifier },
              { email: credentials?.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found");
          }

          if (!user.isVerified) {
            throw new Error("Please verify yourself before login");
          }

          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          // Comparing password
          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password,
            user.password,
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;

        session.user.isDeleted = token.isDeleted;
        session.user.deletionRequestedAt = token.deletionRequestedAt;
        session.user.deletionScheduledFor = token.deletionScheduledFor;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;

        token.isDeleted = user.isDeleted;
        token.deletionRequestedAt = user.deletionRequestedAt;
        token.deletionScheduledFor = user.deletionScheduledFor;
      }

      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

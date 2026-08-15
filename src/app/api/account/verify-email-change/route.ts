import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import EmailChangeVerificationModel from "@/models/EmailChangeVerification.model";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

import { verifyEmailChangeSchema } from "@/schemas/verifyEmailChange";

export async function POST(request: Request) {
  try {
    //  Authenticate user

    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 },
      );
    }

    //  Connect database

    await ConnectDB();

    //  Parse request body

    const body = await request.json();

    //  Validate OTP

    const validationResult =
      verifyEmailChangeSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code.",
          errors: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { verificationCode } =
      validationResult.data;

    //  Find authenticated user

    const user = await UserModel.findById(
      session.user._id,
    );

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    //  Find pending email change

    const verification =
      await EmailChangeVerificationModel.findOne({
        userId: user._id,
        verificationCode,
      });

    if (!verification) {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code.",
        },
        { status: 400 },
      );
    }

    //  Check OTP expiry

    if (
      verification.verificationCodeExpiry.getTime() <
      Date.now()
    ) {
      await EmailChangeVerificationModel.deleteOne({
        _id: verification._id,
      });

      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please request a new code.",
        },
        { status: 400 },
      );
    }

    //  Get the pending new email

    const newEmail =
      verification.newEmail
        .trim()
        .toLowerCase();

    //  Check email uniqueness AGAIN

    const existingUser =
      await UserModel.findOne({
        email: newEmail,
        _id: { $ne: user._id },
      }).select("_id");

    if (existingUser) {
      await EmailChangeVerificationModel.deleteOne({
        _id: verification._id,
      });

      return Response.json(
        {
          success: false,
          message:
            "Email address is already registered.",
        },
        { status: 409 },
      );
    }

    //  Update user's email

    user.email = newEmail;

    await user.save();

    //  Delete verification record

    await EmailChangeVerificationModel.deleteOne({
      _id: verification._id,
    });

    //  Success

    return Response.json(
      {
        success: true,
        message:
          "Email address changed successfully. Please sign in again.",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(
      "VERIFY EMAIL CHANGE ERROR:",
      error,
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to verify email change.",
      },
      { status: 500 },
    );
  }
}
import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import EmailChangeVerificationModel from "@/models/EmailChangeVerification.model";
import { sendEmailChangeVerificationCode } from "@/helpers/sendEmailChangeVerificationCode";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

import { changeEmailSchema } from "@/schemas/changeEmail";

import crypto from "crypto";

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

    //  Connect to database

    await ConnectDB();

    // Parse request body

    const body = await request.json();

    //  Validate new email

    const validationResult = changeEmailSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid email address.",
          errors: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { newEmail } = validationResult.data;

    //  Find authenticated user

    const user = await UserModel.findById(session.user._id);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    // Check if email is actually changing

    if (user.email.toLowerCase() === newEmail) {
      return Response.json(
        {
          success: false,
          message: "This is already your current email address.",
        },
        { status: 400 },
      );
    }

    // Check email uniqueness

    const existingUser = await UserModel.findOne({
      email: newEmail,
      _id: { $ne: user._id },
    }).select("_id");

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Email address is already registered.",
        },
        { status: 409 },
      );
    }

    // Generate 6-digit OTP

    const verificationCode = crypto.randomInt(100000, 1000000).toString();

    // Set OTP expiry for 10 minutes

    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Remove previous email-change request

    await EmailChangeVerificationModel.deleteMany({
      userId: user._id,
    });

    //  Create new email-change request

    await EmailChangeVerificationModel.create({
      userId: user._id,
      newEmail,
      verificationCode,
      verificationCodeExpiry,
    });

    //  Send OTP to new email
    const emailResponse = await sendEmailChangeVerificationCode(
      newEmail,
      user.username,
      verificationCode,
    );

    if (!emailResponse.success) {
      // Removing the pending verification request
      // because the email was not successfully sent.
      await EmailChangeVerificationModel.deleteMany({
        userId: user._id,
      });

      return Response.json(
        {
          success: false,
          message: "Failed to send verification code.",
        },
        { status: 500 },
      );
    }

    //  Success

    return Response.json(
      {
        success: true,
        message: "Verification code sent to your new email address.",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("CHANGE EMAIL ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to request email change.",
      },
      { status: 500 },
    );
  }
}

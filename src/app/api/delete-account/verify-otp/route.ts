import ConnectDB from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import { AccountDeletionVerification } from "@/models/AccountDeletion.model";

export async function POST(request: Request) {
  try {
    await ConnectDB();

    const session = await getServerSession(authOptions);
    // const userId = session?.user._id

    if (!session?.user._id) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 },
      );
    }

    const user = await UserModel.findById(session?.user._id);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // Get the Code from Client
    const { verificationCode } = await request.json();

    if (!verificationCode) {
      return Response.json(
        {
          success: false,
          message: "OTP is required.",
        },
        { status: 400 },
      );
    }

    // Finding the OTP
    const FindVerificationCode = await AccountDeletionVerification.findOne({
      userId: user._id,
      verificationCode,
    });

    if (!FindVerificationCode) {
      return Response.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 },
      );
    }

    // Checking OTP Expiry

    if (FindVerificationCode.verificationCodeExpiry < Date.now()) {
      await AccountDeletionVerification.deleteOne({
        _id: FindVerificationCode._id,
      });

      return Response.json(
        {
          success: false,
          message: "OTP has expired. Please request a new OTP.",
        },
        { status: 400 },
      );
    }

    // Scheduling Account Deletion After 7 days
    const now = new Date();

    const deleteDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    user.isDeleted = true;
    user.deletionRequestedAt = now;
    user.deletionScheduledFor = deleteDate;

    await user.save();

    // Delete OTP

    await AccountDeletionVerification.deleteOne({
      _id: FindVerificationCode._id,
    });

    return Response.json(
      {
        success: true,
        message:
          "Your account has been scheduled for deletion. You have 7 days to recover it.",
        deleteDate,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to verify deletion OTP.",
      },
      { status: 500 },
    );
  }
}

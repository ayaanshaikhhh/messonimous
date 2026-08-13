import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
  try {
    await ConnectDB();

    // Get Credentials
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return Response.json(
        {
          success: false,
          message: "Provide Credentials First.",
        },
        { status: 400 },
      );
    }

    // Find the User
    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid Credentials",
        },
        { status: 400 },
      );
    }

    // IF user found, then verifying PASSWORD
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Invalid Password",
        },
        { status: 401 },
      );
    }

    // IF Password is CORRECT , then Checking User's Account DELETION Status
    if (!user.isDeleted) {
      return Response.json(
        {
          success: false,
          message: "Your account is not scheduled for deletion.",
        },
        { status: 400 },
      );
    }

    // Check RECOVERY PERIOD
    if (user.deletionScheduledFor && user.deletionScheduledFor <= new Date()) {
      return Response.json(
        {
          success: false,
          message: "Your account recovery period has expired.",
        },
        { status: 410 },
      );
    }

    // OR ELSE FINAALLYY RECOVER THE ACCOUNT
    ((user.isDeleted = false), (user.deletionRequestedAt = null));
    user.deletionScheduledFor = null;

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Your account is successfully restored.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("ERROR RECOVERING YOU DELETION SCHEDULED ACCOUNT", error);

    return Response.json(
      {
        success: false,
        message: "Failed to recover your account.",
      },
      { status: 500 },
    );
  }
}

import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "@/schemas/changePassword";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    await ConnectDB();

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

    const body = await request.json();

    //VALIDATE REQUEST BODY

    const validationResult = changePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = z.treeifyError(validationResult.error);

      return Response.json(
        {
          success: false,
          message: "Invalid password data.",
          errors: errors.properties,
        },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // FIND USER

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

    // CHECK IF ACCOUNT IS SCHEDULED FOR DELETION

    if (user.isDeleted) {
      return Response.json(
        {
          success: false,
          message: "Your account is scheduled for deletion.",
        },
        { status: 403 },
      );
    }

    // VERIFY CURRENT PASSWORD

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Current password is incorrect.",
        },
        { status: 400 },
      );
    }

    // PREVENT SAME PASSWORD

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return Response.json(
        {
          success: false,
          message: "New password must be different from your current password.",
        },
        { status: 400 },
      );
    }

    // HASHINGG NEW PASSWORD

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // UPDATING PASSWORD

    user.password = hashedPassword;

    await user.save();

    // SUCCESS RESP

    return Response.json(
      {
        success: true,
        message: "Password changed successfully. Please sign in again.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong while changing your password.",
      },
      { status: 500 },
    );
  }
}

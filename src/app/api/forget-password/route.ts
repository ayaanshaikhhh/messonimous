import { sendPasswordResetLink } from "@/helpers/sendPasswordResetLink";
import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import crypto from "crypto";

export async function POST(request: Request) {
    
    try {
    await ConnectDB();
    const { email } = await request.json();
    const user = await UserModel.findOne({ email });

    // if user does not exist
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 },
      );
    }

    // Generating a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    // Setting Expiry for 15 minutes
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Setting both in Mongo DB
    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpiry = resetTokenExpiry;

    await user.save();

    // Generating Reset URL
    const resetUrl = `${process.env.APP_URL}/reset-password/${resetToken}`;

    // Sending the URL via Email

    const emailResponse = await sendPasswordResetLink(
      user.email,
      user.username,
      resetUrl,
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Password reset link sent successfully",
      },
      { status: 200 },
    );


  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

import { sendVerificationCode } from "@/helpers/sendVerificationEmail";
import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { email, success } from "zod";

export async function POST(request: Request) {
  await ConnectDB();

  try {
    const { username } = await request.json();

    if (!username) {
      return Response.json(
        {
          success: false,
          message: "Username is required",
        },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 },
      );
    }

    if (user.isVerified) {
      return Response.json({
        success: false,
        message: "User is already verified",
      });
    }

    // Generated a verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Expires in 1 hour
    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

    // Saving new Verification Code and Verification code expiry time
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = verifyCodeExpiry;

    await user.save()

    const emailResponse = await sendVerificationCode(
        user.email,
        user.username,
        user.verifyCode,
    )

    console.log("EMAIL RESPONSE ::::::::::::::::::::",emailResponse);

    if(!emailResponse.success){
        return Response.json({
            success:true,
            message:emailResponse.message || "Something went wrong sending Email"
        },{status:500})
    }

    return Response.json({
        success:true,
        message:`A new verification code has been sent to ${user.email} email`
    },{status:200})

  } catch (error) {
    console.log("RESEND OTP ERROR",error);

    return Response.json({
        success:false,
        message:"Something went wrong"
    },{status:500})
  }
}

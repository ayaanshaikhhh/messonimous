import { sendVerificationCode } from "@/helpers/sendVerificationEmail";
import ConnectDB from "@/lib/dbConnect";
import PendingVerification from "@/models/PendingVerification.model";

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

    const decodedUsername = decodeURIComponent(username).trim();

    const user = await PendingVerification.findOne({
      username: decodedUsername,
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

    // Generated a verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Expires in 1 hour
    const verifyCodeExpiry = new Date( Date.now() + 10 * 60 * 1000 );

    // Saving new Verification Code and Verification code expiry time
    user.verificationCode = verifyCode;
    user.verificationCodeExpiry = verifyCodeExpiry;

    await user.save()

    const emailResponse = await sendVerificationCode(
        user.email,
        user.username,
        user.verificationCode
    )

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

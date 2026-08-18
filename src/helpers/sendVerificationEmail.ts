import { transporter } from "@/lib/nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationCode(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    const html = await render(
      VerificationEmail({
        username,
        verificationCode,
      })
    );

    // Sending Email
    await transporter.sendMail({
      from: `"Messonimous" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Messonimous Verification Code",
      html,
    });

    return {
      success: true,
      message: "Verification code sent successfully",
    };
  } catch (error) {
    
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
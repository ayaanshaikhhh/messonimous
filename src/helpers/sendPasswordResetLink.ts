import { transporter } from "@/lib/nodemailer";
import { render } from "@react-email/render";
import ResetPasswordEmail from "../../emails/PasswordResetLink";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendPasswordResetLink(
  email: string,
  username: string,
  resetUrl: string
): Promise<ApiResponse> {
  try {
    const html = await render(
      ResetPasswordEmail({
        username,
        resetUrl,
      })
    );

    await transporter.sendMail({
      from: `"Messonimous" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html,
    });

    return {
      success: true,
      message: "Password reset link sent successfully",
    };
  } catch (error) {
    console.error("NODEMAILER PASSWORD RESET ERROR:", error);

    return {
      success: false,
      message: "Failed to send password reset email",
    };
  }
}
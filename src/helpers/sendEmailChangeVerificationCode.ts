import { transporter } from "@/lib/nodemailer";
import { render } from "@react-email/render";
import EmailChangeVerificationEmail from "../../emails/EmailChangeVerificationEmail"
import { ApiResponse } from "@/types/ApiResponse";

export async function sendEmailChangeVerificationCode(
  email: string,
  username: string,
  verificationCode: string,
): Promise<ApiResponse> {
  try {
    const html = await render(
      EmailChangeVerificationEmail({
        username,
        verificationCode,
      }),
    );

    await transporter.sendMail({
      from: `"Messonimous" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Messonimous Email Change Verification Code",
      html,
    });

    return {
      success: true,
      message:
        "Email change verification code sent successfully.",
    };
  } catch (error) {
    console.error(
      "EMAIL CHANGE VERIFICATION EMAIL ERROR:",
      error,
    );

    return {
      success: false,
      message:
        "Failed to send email change verification code.",
    };
  }
}
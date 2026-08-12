import { transporter } from "@/lib/nodemailer";
import { render } from "@react-email/render";
import AccountDeletionEmail from "../../emails/AccountDeletionEmail";

export async function sendAccountDeletionEmail(
  email: string,
  username: string,
  verificationCode: string,
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const html = await render(
      AccountDeletionEmail({
        username,
        verificationCode,
      }),
    );

    await transporter.sendMail({
      from: `"Messonimous" <${process.env.EMAIL_USER}>`,
      to: email,
      subject:
        "Messonimous Account Deletion Verification",
      html,
    });

    return {
      success: true,
      message:
        "Account deletion verification code sent successfully",
    };
  } catch (error) {
    console.error(
      "SEND ACCOUNT DELETION EMAIL ERROR:",
      error,
    );

    return {
      success: false,
      message:
        "Failed to send account deletion verification email",
    };
  }
}
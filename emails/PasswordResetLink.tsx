import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  username: string;
  resetUrl: string;
}

export default function ResetPasswordEmail({
  username,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Reset your Messonimous password</Preview>

      <Body
        style={{
          backgroundColor: "#f8fafc",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "40px auto",
            padding: "40px",
            borderRadius: "12px",
            maxWidth: "560px",
            border: "1px solid #e5e7eb",
          }}
        >
          <Heading
            style={{
              textAlign: "center",
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            Reset Your Password
          </Heading>

          <Text
            style={{
              color: "#4b5563",
              fontSize: "16px",
              lineHeight: "26px",
            }}
          >
            Hi <strong>{username}</strong>,
          </Text>

          <Text
            style={{
              color: "#4b5563",
              fontSize: "16px",
              lineHeight: "26px",
            }}
          >
            We received a request to reset your password for your
            <strong> Messonimous</strong> account.
          </Text>

          <Section
            style={{
              textAlign: "center",
              margin: "32px 0",
            }}
          >
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#6d28d9",
                color: "#ffffff",
                padding: "14px 28px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Reset Password
            </Button>
          </Section>

          <Text
            style={{
              color: "#6b7280",
              fontSize: "14px",
              lineHeight: "24px",
            }}
          >
            This password reset link will expire in{" "}
            <strong>15 minutes</strong>.
          </Text>

          <Text
            style={{
              color: "#6b7280",
              fontSize: "14px",
              lineHeight: "24px",
            }}
          >
            If you didn't request a password reset, you can safely ignore
            this email. Your password will remain unchanged.
          </Text>

          <Hr
            style={{
              borderColor: "#e5e7eb",
              margin: "32px 0",
            }}
          />

          <Text
            style={{
              color: "#9ca3af",
              fontSize: "13px",
              wordBreak: "break-all",
            }}
          >
            If the button doesn't work, copy and paste this link into your
            browser:
          </Text>

          <Text
            style={{
              color: "#2563eb",
              fontSize: "13px",
              wordBreak: "break-all",
            }}
          >
            {resetUrl}
          </Text>

          <Text
            style={{
              color: "#9ca3af",
              fontSize: "13px",
              marginTop: "32px",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Messonimous. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
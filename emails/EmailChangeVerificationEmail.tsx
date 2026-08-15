import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailChangeVerificationEmailProps {
  username: string;
  verificationCode: string;
}

const EmailChangeVerificationEmail = ({
  username,
  verificationCode,
}: EmailChangeVerificationEmailProps) => {
  return (
    <Html>
      <Head />

      <Preview>
        Your Messonimous email change verification code
      </Preview>

      <Body
        style={{
          backgroundColor: "#f1f5f9",
          fontFamily:
            "Arial, Helvetica, sans-serif",
          padding: "40px 20px",
        }}
      >
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <Heading
            style={{
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            Verify Your New Email
          </Heading>

          <Text
            style={{
              color: "#475569",
              fontSize: "16px",
            }}
          >
            Hi {username},
          </Text>

          <Text
            style={{
              color: "#475569",
              fontSize: "15px",
              lineHeight: "24px",
            }}
          >
            We received a request to change the email
            address associated with your Messonimous
            account.
          </Text>

          <Section
            style={{
              textAlign: "center",
              margin: "30px 0",
            }}
          >
            <Text
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                letterSpacing: "8px",
                color: "#6366f1",
              }}
            >
              {verificationCode}
            </Text>
          </Section>

          <Text
            style={{
              color: "#64748b",
              fontSize: "14px",
              lineHeight: "22px",
            }}
          >
            This verification code will expire in
            10 minutes.
          </Text>

          <Text
            style={{
              color: "#64748b",
              fontSize: "14px",
              lineHeight: "22px",
            }}
          >
            If you did not request an email change,
            you can safely ignore this email.
          </Text>

          <Text
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            © Messonimous
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailChangeVerificationEmail;
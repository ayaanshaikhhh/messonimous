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

interface AccountDeletionEmailProps {
  username: string;
  verificationCode: string;
}

const AccountDeletionEmail = ({
  username,
  verificationCode,
}: AccountDeletionEmailProps) => {
  return (
    <Html>
      <Head />

      <Preview>
        Your Messonimous account deletion verification code
      </Preview>

      <Body
        style={{
          margin: 0,
          padding: "40px 0",
          backgroundColor: "#f8fafc",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            padding: "32px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
          }}
        >
          <Heading
            style={{
              margin: "0 0 16px",
              fontSize: "24px",
              fontWeight: "700",
              color: "#0f172a",
            }}
          >
            Account deletion verification
          </Heading>

          <Text
            style={{
              fontSize: "15px",
              lineHeight: "24px",
              color: "#475569",
            }}
          >
            Hi {username},
          </Text>

          <Text
            style={{
              fontSize: "15px",
              lineHeight: "24px",
              color: "#475569",
            }}
          >
            We received a request to schedule your
            Messonimous account for deletion.
          </Text>

          <Text
            style={{
              fontSize: "15px",
              lineHeight: "24px",
              color: "#475569",
            }}
          >
            Use the verification code below to confirm
            this request:
          </Text>

          <Section
            style={{
              margin: "28px 0",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                display: "inline-block",
                margin: 0,
                padding: "16px 24px",
                backgroundColor: "#f1f5f9",
                borderRadius: "12px",
                color: "#4f46e5",
                fontSize: "28px",
                fontWeight: "700",
                letterSpacing: "8px",
              }}
            >
              {verificationCode}
            </Text>
          </Section>

          <Text
            style={{
              fontSize: "14px",
              lineHeight: "22px",
              color: "#64748b",
            }}
          >
            This verification code expires in 10
            minutes.
          </Text>

          <Text
            style={{
              fontSize: "14px",
              lineHeight: "22px",
              color: "#64748b",
            }}
          >
            After verification, your account will be
            scheduled for permanent deletion after 7
            days. You can recover your account during
            this period.
          </Text>

          <Text
            style={{
              marginTop: "24px",
              fontSize: "14px",
              lineHeight: "22px",
              color: "#64748b",
            }}
          >
            If you did not request account deletion,
            you can safely ignore this email.
          </Text>

          <Text
            style={{
              marginTop: "32px",
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            — Messonimous
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AccountDeletionEmail;
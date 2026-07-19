import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verificationCode: string;
}

export default function VerificationEmail({
  username,
  verificationCode,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Verify your email address</Preview>

      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto mt-10 max-w-xl rounded-lg bg-white p-10 shadow-lg">

            <Heading className="text-center text-3xl font-bold text-gray-900">
              Verify your Email
            </Heading>

            <Text className="mt-6 text-gray-700">
              Hi <strong>{username}</strong>,
            </Text>

            <Text className="text-gray-700">
              Thank you for creating your account. Please use the verification
              code below to verify your email address.
            </Text>

            <Section className="my-8 text-center">
              <Text className="inline-block rounded-md bg-gray-900 px-8 py-4 text-3xl font-bold tracking-[10px] text-white">
                {verificationCode}
              </Text>
            </Section>

            <Text className="text-gray-600">
              This verification code will expire in <strong>10 minutes</strong>.
            </Text>

            <Text className="text-gray-600">
              If you didn't create this account, you can safely ignore this
              email.
            </Text>

            <Text className="mt-10 text-sm text-gray-400">
              © {new Date().getFullYear()} Messonimous. All rights reserved.
            </Text>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
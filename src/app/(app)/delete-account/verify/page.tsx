"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import axios from "axios";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const DeleteAccountVerifyPage = () => {
  const router = useRouter();

  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyDeletion = async () => {

    // Validate OTP

    if (!verificationCode) {
      toast.error("Please enter the verification code.");
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      toast.error("Verification code must be 6 digits.");
      return;
    }

    try {
      setIsVerifying(true);

      //  Verify OTP

      const response = await axios.post(
        "/api/delete-account/verify-otp",
        {
          verificationCode,
        },
      );

      // Success Message
      toast.success(response.data.message);

      // Logout user

      await signOut({
        redirect: false,
      });

      // Redirect to sign-in

      router.replace("/sign-in");
    } catch (error) {
      console.error(
        "VERIFY DELETE ACCOUNT ERROR:",
        error,
      );

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Failed to verify deletion code.",
        );
      } else {
        toast.error(
          "Failed to verify deletion code.",
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
            <ShieldAlert className="h-6 w-6 text-violet-600" />
          </div>

          <CardTitle className="text-2xl">
            Verify account deletion
          </CardTitle>

          <CardDescription className="leading-relaxed">
            We've sent a 6-digit verification code
            to your registered email address.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="verificationCode"
              className="text-sm font-medium"
            >
              Verification code
            </label>

            <Input
              id="verificationCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={verificationCode}
              onChange={(event) => {
                const value = event.target.value;

                // Only allow numbers
                if (/^\d*$/.test(value)) {
                  setVerificationCode(value);
                }
              }}
              className="h-12 rounded-xl text-center text-lg font-semibold tracking-[0.4em]"
              disabled={isVerifying}
            />
          </div>

          <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-medium">
              Important
            </p>

            <p className="mt-1 leading-relaxed">
              After verification, your account will be
              scheduled for permanent deletion after 7
              days. You can recover your account during
              this period.
            </p>
          </div>

          <Button
            type="button"
            className="h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.99]"
            onClick={handleVerifyDeletion}
            disabled={
              isVerifying ||
              verificationCode.length !== 6
            }
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Confirm Account Deletion"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full cursor-pointer"
            disabled={isVerifying}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default DeleteAccountVerifyPage;
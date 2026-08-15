"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { changeEmailSchema } from "@/schemas/changeEmail";
import { verifyEmailChangeSchema } from "@/schemas/verifyEmailChange";

import { signOut } from "next-auth/react";

type ApiResponse = {
  success: boolean;
  message: string;
};

const ChangeEmailPage = () => {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "verify">(
    "email",
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isVerifying, setIsVerifying] =
    useState(false);

  const [newEmail, setNewEmail] = useState("");

  // --------------------------------------------------
  // Email Form
  // --------------------------------------------------

  const emailForm = useForm<
    z.infer<typeof changeEmailSchema>
  >({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  // --------------------------------------------------
  // OTP Form
  // --------------------------------------------------

  const otpForm = useForm<
    z.infer<typeof verifyEmailChangeSchema>
  >({
    resolver: zodResolver(
      verifyEmailChangeSchema,
    ),
    defaultValues: {
      verificationCode: "",
    },
  });

  // --------------------------------------------------
  // Request Email Change
  // --------------------------------------------------

  const handleRequestEmailChange = async (
    data: z.infer<typeof changeEmailSchema>,
  ) => {
    setIsSubmitting(true);

    try {
      const response =
        await axios.post<ApiResponse>(
          "/api/account/change-email",
          data,
        );

      toast.success(response.data.message);

      setNewEmail(data.newEmail);

      setStep("verify");

      otpForm.reset();
    } catch (error) {
      console.error(
        "CHANGE EMAIL ERROR:",
        error,
      );

      const axiosError =
        error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data?.message ||
          "Failed to request email change.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Verify Email Change
  // --------------------------------------------------

  const handleVerifyEmailChange = async (
    data: z.infer<typeof verifyEmailChangeSchema>,
  ) => {
    setIsVerifying(true);

    try {
      const response =
        await axios.post<ApiResponse>(
          "/api/account/verify-email-change",
          data,
        );

      toast.success(response.data.message);

      /*
       * Email is now changed.
       *
       * Force the user to authenticate again.
       */

      await signOut({
        redirect: false,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error(
        "VERIFY EMAIL CHANGE ERROR:",
        error,
      );

      const axiosError =
        error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data?.message ||
          "Failed to verify email change.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // --------------------------------------------------
  // Back to Email Step
  // --------------------------------------------------

  const handleBack = () => {
    setStep("email");
    otpForm.reset();
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">

          {/* ==========================================
              STEP 1 — EMAIL
          ========================================== */}

          {step === "email" && (
            <>
              {/* Header */}

              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                  <Mail className="h-6 w-6 text-violet-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Change Email
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Enter your new email address. We&apos;ll
                  send a verification code to confirm it.
                </p>
              </div>

              {/* Email Form */}

              <form
                onSubmit={emailForm.handleSubmit(
                  handleRequestEmailChange,
                )}
                className="space-y-5"
              >
                <Controller
                  name="newEmail"
                  control={emailForm.control}
                  render={({
                    field,
                    fieldState,
                  }) => (
                    <Field
                      data-invalid={
                        fieldState.invalid
                      }
                    >
                      <FieldLabel htmlFor={field.name}>
                        New Email Address
                      </FieldLabel>

                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        autoComplete="email"
                        placeholder="tonyindustries@example.com"
                        aria-invalid={
                          fieldState.invalid
                        }
                        className="h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-violet-500"
                      />

                      {fieldState.error && (
                        <FieldError
                          errors={[
                            fieldState.error,
                          ]}
                        />
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 font-medium text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </form>

              <Button
                type="button"
                variant="ghost"
                className="mt-3 w-full"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </>
          )}

          {/* ==========================================
              STEP 2 — OTP
          ========================================== */}

          {step === "verify" && (
            <>
              {/* Header */}

              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                  <ShieldCheck className="h-6 w-6 text-violet-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Verify New Email
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  We sent a 6-digit verification code
                  to:
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-violet-600">
                  {newEmail}
                </p>
              </div>

              {/* OTP Form */}

              <form
                onSubmit={otpForm.handleSubmit(
                  handleVerifyEmailChange,
                )}
                className="space-y-5"
              >
                <Controller
                  name="verificationCode"
                  control={otpForm.control}
                  render={({
                    field,
                    fieldState,
                  }) => (
                    <Field
                      data-invalid={
                        fieldState.invalid
                      }
                    >
                      <FieldLabel htmlFor={field.name}>
                        Verification Code
                      </FieldLabel>

                      <Input
                        {...field}
                        id={field.name}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="000000"
                        aria-invalid={
                          fieldState.invalid
                        }
                        className="h-12 rounded-xl border-slate-300 text-center text-xl font-semibold tracking-[0.5em] focus-visible:ring-2 focus-visible:ring-violet-500"
                        onChange={(event) => {
                          const value =
                            event.target.value.replace(
                              /\D/g,
                              "",
                            );

                          field.onChange(value);
                        }}
                      />

                      {fieldState.error && (
                        <FieldError
                          errors={[
                            fieldState.error,
                          ]}
                        />
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 font-medium text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </form>

              {/* Back */}

              <Button
                type="button"
                variant="ghost"
                className="mt-3 w-full"
                onClick={handleBack}
                disabled={isVerifying}
              >
                Use Different Email
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailPage;
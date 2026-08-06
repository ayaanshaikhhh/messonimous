"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { Loader2Icon, RotateCcwIcon } from "lucide-react";
import { toast } from "sonner";

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(0);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  // ---------------- Verify ----------------

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast.success("Account Verified", {
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Verification Failed", {
        description:
          axiosError.response?.data.message ?? "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- Resend ----------------

  useEffect(() => {
    if (timer === 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    setIsResending(true);

    try {
      const response = await axios.post<ApiResponse>("/api/resend-code", {
        username: params.username,
      });

      toast.success("OTP Sent", {
        description: response.data.message,
      });

      setTimer(60);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Unable to resend", {
        description: axiosError.response?.data.message ?? "Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Heading */}

        <div className="mb-8 text-center space-y-3">
          <h1 className="font-(family-name:--font-heading) text-4xl font-black tracking-tight">
            Verify{" "}
            <span className="bg-linear-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              Account
            </span>
          </h1>

          <p className="text-slate-500">
            Enter the 6-digit verification code sent to your email.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="items-center">
                <FieldLabel className="w-full justify-center text-md">
                  Verification Code
                </FieldLabel>

                <div className="flex justify-center">
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="gap-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-10 w-10 rounded-xl text-lg font-semibold transition-all"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>
                    The code expires in 5 minutes.
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            // This will disable till user enters 6 digits of code
            disabled={isSubmitting || form.watch("code").length !== 6}
            className="h-11 w-full rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-500/20"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Verifying Account...
              </>
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">Didn't receive the code?</p>

          <Button
            variant="ghost"
            className="
            mt-2
            cursor-pointer
            border
            border-[#2F54FA]
            h-auto
            p-2
            text-[#2F54FA]
            
            hover:bg-[#2F54FA]
            hover:text-white
            hover:scale-99
            hover:transition-all delay-19
            font-medium
        "
            disabled={timer > 0 || isResending}
            onClick={handleResend}
          >
            {isResending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : timer > 0 ? (
              `Resend in ${timer}s`
            ) : (
              <>
                <RotateCcwIcon className="mr-2 h-4 w-4" />
                Resend Code
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

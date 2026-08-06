"use client";

import { useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { ApiResponse } from "@/types/ApiResponse";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof forgotPasswordSchema>
  ) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>(
        "/api/forget-password",
        data
      );

      toast.success("Email Sent", {
        description: response.data.message,
      });

      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Request Failed", {
        description:
          axiosError.response?.data.message ??
          "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-start justify-center bg-slate-100 px-4 py-8 sm:items-center sm:py-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        {/* Heading */}

        <div className="mb-6 space-y-2 text-center sm:mb-8 sm:space-y-3">
          <h1 className="font-(family-name:--font-heading) text-3xl font-black tracking-tight sm:text-4xl">
            Forgot{" "}
            <span className="bg-linear-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              Password
            </span>
          </h1>

          <p className="text-sm leading-6 text-slate-500 sm:text-base">
            Enter your registered email address and we'll send you a secure
            password reset link.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="space-y-2"
              >
                <FieldLabel htmlFor={field.name}>
                  Email Address
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="tony@starkindustries.com"
                  className="h-11 rounded-xl border-slate-300 transition-all focus-visible:ring-2 focus-visible:ring-violet-500"
                />

                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>
                    We'll email you a secure password reset link.
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Sending Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-md text-slate-600">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-violet-600 transition-colors hover:text-violet-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
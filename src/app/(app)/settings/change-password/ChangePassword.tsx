"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { changePasswordSchema } from "@/schemas/changePassword";

import { getSession, signOut } from "next-auth/react";

const ChangePasswordForm = () => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/account/change-password", data);

      toast.success(response.data.message);

      form.reset();

      await signOut({
        redirect: false,
      });

      const sessionAfterLogout = await getSession();

console.log(
  "SESSION AFTER PASSWORD CHANGE:",
  sessionAfterLogout,
);

      router.replace("/sign-in");
    } catch (error) {

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          success: boolean;
          message: string;
        }>;

        toast.error(
          axiosError.response?.data?.message || "Failed to change password.",
        );
      } else {
        toast.error("Something went wrong while changing your password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          {/* Header */}

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Change Password
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Update your account password. You will need to sign in again after
              changing it.
            </p>
          </div>

          {/* Form */}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Current Password */}

            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showCurrentPassword ? "text" : "password"}
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-slate-300 pr-11 focus-visible:ring-2 focus-visible:ring-violet-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* New Password */}

            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-slate-300 pr-11 focus-visible:ring-2 focus-visible:ring-violet-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Confirm New Password
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-slate-300 pr-11 focus-visible:ring-2 focus-visible:ring-violet-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirmation password"
                          : "Show confirmation password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Submit */}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 font-medium text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 disabled:pointer-events-none disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>

          {/* Cancel */}

          <Button
            type="button"
            variant="ghost"
            className="mt-3 w-full"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;

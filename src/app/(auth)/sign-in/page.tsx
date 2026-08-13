"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import ShinyText from "@/components/ui/ShinyText";

import { Dialog } from "@base-ui/react";
import axios from "axios";

const signInPage = () => {
  const router = useRouter();``

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isRecoverDialogOpen, setIsRecoverDialogOpen] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      // IF THE ACCOUNT IS SCHEDULED FOR DELETION

      if (result?.error?.includes("ACCOUNT_SCHEDULED_FOR_DELETION")) {
        setRecoveryIdentifier(data.identifier);
        setRecoveryPassword(data.password);
        setIsRecoverDialogOpen(true);

        return;
      }

      if (result?.error) {
        toast.error("Log  in Failed", {
          description: result?.error || "Incorrect Credentials",
        });

        return;
      }

      if (result?.ok) {
        router.replace(`/dashboard`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoveryAccount = async () => {
    setIsRecovering(true);

    try {
      // Restoring the account
      const response = await axios.post(`/api/recover-account`, {
        identifier: recoveryIdentifier,
        password: recoveryPassword,
      });

      toast.success(response.data.message || "Your account is successfully restored");

      // After Revovering and Processing , Creating NextAuth Session
      const result = await signIn("credentials", {
        redirect: false,
        identifier: recoveryIdentifier,
        password: recoveryPassword,
      });

      // Tackling and ERROR
      if (result?.error) {
        toast.error("Account recovered, But Login failed", {
          description: result.error,
        });
        return;
      }

      // Login Successful
      if (result?.ok) {
        setIsRecoverDialogOpen(false);

        // Clear sensitive recovery state
        setRecoveryIdentifier("");
        setRecoveryPassword("");

        router.replace(`/dashboard`);
      }
    } catch (error) {
      console.error("RECOVER ACCOUNT ERROR:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to recover your account.",
        );
      } else {
        toast.error("Failed to recover your account.");
      }
    } finally {
      setIsRecoverDialogOpen(false);
    }
  }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-2 space-y-3 text-center">
            <h1 className="font-(family-name:--font-heading) text-4xl font-black tracking-tight md:text-5xl">
              Join{" "}
              <ShinyText
                text="Messonimous"
                className="inline-block"
                speed={2}
                delay={0}
                color="#6366F1"
                shineColor="#06B6D4"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
              />
            </h1>

            <p className="font-sans text-slate-500">
              Sign in and start receiving anonymous messages from anyone.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Or Email */}

            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="space-y-2"
                  >
                    <FieldLabel htmlFor={field.name}>
                      Username / Email
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        {...field}
                        id={field.name}
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                        placeholder="TonyStark"
                        className="h-11 rounded-xl border-slate-300 pr-10 transition-all focus-visible:ring-2 focus-visible:ring-violet-500"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </div>

                    {/* Validation / API Status */}
                  </Field>
                );
              }}
            />

            {/* Password */}

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  {" "}
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>{" "}
                  <div className="relative">
                    {" "}
                    <Input
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-slate-300 pr-11 transition-all focus-visible:ring-2 focus-visible:ring-violet-500"
                    />{" "}
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {" "}
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}{" "}
                    </button>{" "}
                  </div>{" "}
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}{" "}
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white cursor-pointer font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Logging your account...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-md text-slate-600">
            Don't have an Account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-violet-600 transition-colors hover:text-violet-700"
            >
              Register
            </Link>
          </div>

          <div className="mt-1 text-center text-md text-slate-600">
            <Link
              href="/forgot-password"
              className="font-medium text-violet-600 transition-colors hover:text-violet-700"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* ACCOUNT RECOVERY DIALOG */}

        <Dialog.Root
          open={isRecoverDialogOpen}
          onOpenChange={setIsRecoverDialogOpen}
        >
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50" />

            <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl outline-none">
              <Dialog.Title className="text-xl font-semibold text-slate-900">
                Account Scheduled for Deletion
              </Dialog.Title>

              <Dialog.Description className="mt-3 text-sm leading-relaxed text-slate-500">
                This account is currently scheduled for permanent deletion. Your
                account can still be recovered during the 7-day recovery period.
              </Dialog.Description>

              <div className="mt-6 rounded-xl bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  Do you want to restore this account and continue logging in?
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsRecoverDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  className="bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white"
                  onClick={() => {
                    handleRecoveryAccount()
                  }}
                >
                  Restore Account
                </Button>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    );
  };


export default signInPage;

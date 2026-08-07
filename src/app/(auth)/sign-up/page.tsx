"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import {
  Loader2Icon,
  CircleCheckIcon,
  CircleXIcon,
} from "lucide-react";
import { toast } from "sonner";

import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

 import ShinyText from '../../../components/ui/ShinyText';

const Page = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!username.trim()) {
      setUsernameMessage("");
      return;
    }

    const checkUsernameUniqueness = async () => {
      setIsCheckingUsername(true);

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${username}`
        );

        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

        setUsernameMessage(
          axiosError.response?.data.message ??
            "Unable to check username."
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsernameUniqueness();
  }, [username]);

  const onSubmit = async (
    data: z.infer<typeof signUpSchema>
  ) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>(
        "/api/sign-up",
        data
      );

      toast.success("Success", {
        description: response.data.message,
      });

      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Sign Up Failed", {
        description:
          axiosError.response?.data.message ??
          "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

 



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
            Create your account and start receiving anonymous
            messages from anyone.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >


        {/* Username */}

          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => {
              const isAvailable =
                usernameMessage === "Username is available";

              return (
                <Field
                  data-invalid={fieldState.invalid}
                  className="space-y-2"
                >
                  <FieldLabel htmlFor={field.name}>
                    Username
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
                        debounced(e.target.value);
                      }}
                    />

                    {/* Loading */}

                    {isCheckingUsername && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <Loader2Icon className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    )}

                    {/* Available */}

                    {!isCheckingUsername &&
                      usernameMessage &&
                      isAvailable &&
                      !fieldState.error && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <CircleCheckIcon className="h-4 w-4 text-green-500" />
                        </div>
                      )}

                    {/* Unavailable */}

                    {!isCheckingUsername &&
                      usernameMessage &&
                      !isAvailable &&
                      !fieldState.error && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <CircleXIcon className="h-4 w-4 text-red-500" />
                        </div>
                      )}
                  </div>

                  {/* Validation / API Status */}

                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : isCheckingUsername ? (
                    <FieldDescription className="flex items-center gap-2 text-slate-500">
                      <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                      Checking username availability...
                    </FieldDescription>
                  ) : usernameMessage ? (
                    <FieldDescription
                      className={
                        isAvailable
                          ? "flex items-center gap-2 text-green-600"
                          : "flex items-center gap-2 text-red-600"
                      }
                    >
                      {isAvailable ? (
                        <CircleCheckIcon className="h-4 w-4" />
                      ) : (
                        <CircleXIcon className="h-4 w-4" />
                      )}

                      {usernameMessage}
                    </FieldDescription>
                  ) : (
                    <FieldDescription>
                      Choose a unique username.
                    </FieldDescription>
                  )}
                </Field>
              );
            }}
          />

                    {/* Email */}

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="space-y-2"
              >
                <FieldLabel htmlFor={field.name}>
                  Email
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="tony@messonimous.com"
                  className="h-11 rounded-xl border-slate-300 transition-all focus-visible:ring-2 focus-visible:ring-violet-500"
                />

                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Password */}

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="space-y-2"
              >
                <FieldLabel htmlFor={field.name}>
                  Password
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-slate-300 transition-all focus-visible:ring-2 focus-visible:ring-violet-500"
                />

                {fieldState.error &&(
                  <FieldError errors={[fieldState.error]} />
                )}
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
                Creating your account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-md text-slate-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-violet-600 transition-colors hover:text-violet-700"
          >
            Sign In
          </Link>
        </div>
      </div>
      </div>
  );
};

export default Page;
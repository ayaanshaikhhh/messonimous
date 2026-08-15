"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Loader2, UserCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const ChangeUsernamePage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChangeUsername = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Username is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "/api/account/change-username",
        {
          username: trimmedUsername,
        },
      );

      toast.success(response.data.message);

      setUsername("");

      // Go back to Settings after successful change
      router.push("/settings");
    } catch (error) {
      console.error(
        "CHANGE USERNAME ERROR:",
        error,
      );

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message =
          error.response?.data?.message ||
          "Failed to change username.";

        if (status === 409) {
          setError("Username is already taken.");
        } else if (status === 429) {
          setError(message);
        } else if (status === 400) {
          setError(message);
        } else {
          toast.error(message);
        }
      } else {
        toast.error(
          "Something went wrong while changing your username.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-lg">

        {/* Back */}

        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/settings")}
          className="mb-4 cursor-pointer gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Button>

        {/* Card */}

        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">

          {/* Header */}

          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
              <UserCircle className="h-6 w-6 text-violet-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Change Username
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Choose a new username for your account.
              You can change your username once every
              14 days.
            </p>
          </div>

          {/* Form */}

          <form
            onSubmit={handleChangeUsername}
            className="space-y-5"
          >
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="username">
                New Username
              </FieldLabel>

              <Input
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="TonyStark"
                autoComplete="username"
                aria-invalid={!!error}
                disabled={isSubmitting}
                className="h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-violet-500"
              />

              {error && (
                <FieldError
                  errors={[
                    {
                      message: error,
                    },
                  ]}
                />
              )}
            </Field>

            {/* Info */}

            <div className="rounded-xl bg-violet-50 p-4">
              <p className="text-sm leading-relaxed text-violet-800">
                Your username must be 3–20 characters
                and can only contain letters, numbers,
                and underscores.
              </p>
            </div>

            {/* Submit */}

            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !username.trim()
              }
              className="h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 disabled:pointer-events-none disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Username...
                </>
              ) : (
                "Change Username"
              )}
            </Button>
          </form>

          {/* Warning */}

          <p className="mt-5 text-center text-xs text-slate-400">
            Username changes are limited to once every
            14 days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangeUsernamePage;
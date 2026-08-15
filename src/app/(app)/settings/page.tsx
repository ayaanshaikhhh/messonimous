"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  LockKeyhole,
  Mail,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ShinyText from "@/components/ui/ShinyText";

const SettingsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}

        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 cursor-pointer gap-2 text-slate-600 hover:text-slate-900"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Account{" "}
              <ShinyText
                text="Settings"
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

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage your profile and account security.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          {/* Settings Navigation */}

          <Card className="h-fit p-2">
            <nav className="space-y-1">
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700"
              >
                <UserCircle className="h-4 w-4" />
                Account
              </Link>

              <Link
                href="/settings/security"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <LockKeyhole className="h-4 w-4" />
                Security
              </Link>
            </nav>
          </Card>

          {/* Settings Content */}

          <div className="space-y-6">
            {/* Profile */}

            <Card className="overflow-hidden">
              <div className="border-b px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your public account information.
                </p>
              </div>

              <div className="divide-y">
                {/* Username */}

                <Link
                  href="/settings/change-username"
                  className="group flex items-center justify-between px-6 py-5 transition-colors hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <UserCircle className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        Username
                      </p>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {user?.username || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-violet-600">
                    <span className="hidden sm:inline">
                      Change
                    </span>

                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                {/* Email */}

                <Link
                  href="/settings/email"
                  className="group flex items-center justify-between px-6 py-5 transition-colors hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Mail className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        Email Address
                      </p>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {user?.email || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-violet-600">
                    <span className="hidden sm:inline">
                      Change
                    </span>

                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            </Card>

            {/* Security */}

            <Card className="overflow-hidden">
              <div className="border-b px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Security
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep your account secure.
                </p>
              </div>

              <Link
                href="/settings/change-password"
                className="group flex items-center justify-between px-6 py-5 transition-colors hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <LockKeyhole className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Password
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Change your account password
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-violet-600">
                  <span className="hidden sm:inline">
                    Change
                  </span>

                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;


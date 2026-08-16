import Link from "next/link";
import { ArrowLeft, ChevronRight, LockKeyhole } from "lucide-react";

import ActiveSessions from "@/app/(app)/settings/ActiveSessions"

import { Button } from "@/components/ui/button";

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Link href="/settings">
              <Button
                variant="ghost"
                className="cursor-pointer rounded-xl text-slate-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Security
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your password and keep your account secure.
          </p>
        </div>

        {/* Security Options */}
        <div className="space-y-4">

          {/* Change Password */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between gap-4">

              <div className="flex min-w-0 items-center gap-4">
                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                  <LockKeyhole className="h-5 w-5 text-violet-600" />
                </div>

                {/* Information */}
                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-900">
                    Password
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Change your account password.
                  </p>
                </div>
              </div>

              {/* Action */}
              <Link href="/settings/change-password">
                <Button
                  variant="outline"
                  className="shrink-0 cursor-pointer rounded-xl"
                >
                  Change Password
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

            </div>
          </div>

          {/* Active Sessions  */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <ActiveSessions/>
            <div className="flex items-center justify-between gap-4">

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
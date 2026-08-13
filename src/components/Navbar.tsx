"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { UserCircle, Mail, Trash2, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import ShinyText from "./ui/ShinyText";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import axios from "axios";
import { toast } from "sonner";
import { Dialog } from "@base-ui/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [isRecovering, setIsRecovering] = useState(false);

  // Delete account dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Sending deletion OTP
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const user = session?.user as User | undefined;

  // RECOVER ACCOUNT

  const handleRecoverAccount = async () => {
    try {
      setIsRecovering(true);

      const response = await axios.post("/api/delete-account/cancel");

      toast.success(response.data.message);

      window.location.reload();
    } catch (error) {
      console.error("RECOVER ACCOUNT ERROR:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to recover account.",
        );
      } else {
        toast.error("Failed to recover account.");
      }
    } finally {
      setIsRecovering(false);
    }
  };

  // OPEN DELETE ACCOUNT DIALOG

  const handleDeleteProfile = () => {
    setIsDeleteDialogOpen(true);
  };

  // SEND DELETE ACCOUNT OTP

  const handleSendDeletionOTP = async () => {
    try {
      setIsSendingOTP(true);

      const response = await axios.post("/api/delete-account/send-otp");

      toast.success(response.data.message);

      setIsDeleteDialogOpen(false);

      // Move user to OTP verification page
      router.push("/delete-account/verify");
    } catch (error) {
      console.error("SEND DELETE ACCOUNT OTP ERROR:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to send deletion OTP.",
        );
      } else {
        toast.error("Failed to send deletion OTP.");
      }
    } finally {
      setIsSendingOTP(false);
    }
  };

  return (
    <header className="w-full border-b">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          href="/"
          className="text-2xl font-black tracking-tight transition-opacity hover:opacity-90"
        >
          <span className="bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
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
          </span>
        </Link>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        {session?.user ? (
          <div className="flex items-center gap-3">
            {/* =================================================
                USER DROPDOWN
            ================================================= */}

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="lg"
                    className="cursor-pointer rounded-2xl"
                  >
                    <UserCircle className="h-4 w-4" />
                  </Button>
                }
              />

              <DropdownMenuContent align="end" className="w-64">
                {/* Account Header */}

                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">My Account</span>

                    <span className="text-xs font-normal text-muted-foreground">
                      Account information
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Username */}

                <DropdownMenuItem disabled className="cursor-default">
                  <UserCircle className="mr-2 h-4 w-4" />

                  <div className="flex min-w-0 flex-col">
                    <span className="text-xs text-muted-foreground">
                      Username
                    </span>

                    <span className="truncate text-sm font-medium">
                      {user?.username || "Unknown"}
                    </span>
                  </div>
                </DropdownMenuItem>

                {/* Email */}

                <DropdownMenuItem disabled className="cursor-default">
                  <Mail className="mr-2 h-4 w-4" />

                  <div className="flex min-w-0 flex-col">
                    <span className="text-xs text-muted-foreground">Email</span>

                    <span className="truncate text-sm font-medium">
                      {user?.email || "Unknown"}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* =================================================
                    DELETE PROFILE
                ================================================= */}

                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => {
                    console.log("Delete Profile clicked");
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Profile
                </DropdownMenuItem>

                {/* =================================================
                    LOGOUT
                ================================================= */}

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* DELETE ACCOUNT DIALOG */}

            <Dialog.Root
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50" />

                <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6 shadow-xl outline-none">
                  <Dialog.Title className="text-lg font-semibold">
                    Delete your account?
                  </Dialog.Title>

                  <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    We'll send a verification code to{" "}
                    <span className="font-medium text-foreground">
                      {user?.email}
                    </span>
                    . Your account will remain recoverable for 7 days before
                    permanent deletion.
                  </Dialog.Description>

                  <div className="mt-6 flex justify-end gap-2">
                    {/* Cancel */}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>

                    {/* Send OTP */}

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleSendDeletionOTP}
                      disabled={isSendingOTP}
                    >
                      {isSendingOTP ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </div>
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        ) : (
          /* =====================================================
             LOGIN
          ===================================================== */

          <Link href="/sign-in">
            <Button
              className="
                cursor-pointer
                rounded-xl
                bg-linear-to-r
                from-violet-600
                via-indigo-600
                to-blue-600
                px-6
                text-white
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-lg
                hover:shadow-violet-500/20
                active:scale-[0.98]
              "
            >
              Login
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

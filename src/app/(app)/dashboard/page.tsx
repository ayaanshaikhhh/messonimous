"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import { acceptMessageSchema } from "@/schemas/acceptMessage";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/types/Message";

import MessageCard from "@/components/MessageCard";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import {
  Loader2,
  RefreshCcw,
  Copy,
  MessageCircle,
  Inbox,
  Share2,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  // Remove deleted message from UI
  const handleDeleteMessages = (messageId: string) => {
    setMessages((prev) =>
      prev.filter((message) => message._id !== messageId)
    );
  };

  // Remove all messages from UI
  const handleDeleteAllMessages = async () => {
    setIsDeleting(true);

    try {
      const response = await axios.delete<ApiResponse>(
        "/api/delete-all-messages"
      );

      setMessages([]);

      toast.success("Messages deleted", {
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Error", {
        description:
          axiosError.response?.data.message ??
          "Failed to delete all messages.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch whether user is accepting messages
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>(
        "/api/accept-messages"
      );

      setValue(
        "acceptMessages",
        response.data.isAcceptingMessage ?? false
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Error", {
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings.",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch messages
  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/get-me");

      setMessages(response.data.messages ?? []);

      if (refresh) {
        toast.success("Messages refreshed", {
          description: "Showing latest anonymous messages.",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Error", {
        description:
          axiosError.response?.data.message ??
          "Failed to fetch messages.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load dashboard data
  useEffect(() => {
    if (!session?.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  // Toggle accepting messages
  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.post<ApiResponse>(
        "/api/accept-messages",
        {
          acceptMessages: checked,
        }
      );

      setValue("acceptMessages", checked);

      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Error", {
        description:
          axiosError.response?.data.message ??
          "Failed to update settings.",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // Public profile URL
  const profileUrl = useMemo(() => {
    if (!session?.user?.username) return "";

    if (typeof window === "undefined") return "";

    return `${window.location.origin}/u/${session.user.username}`;
  }, [session?.user?.username]);

  // Loading session
  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  // Not logged in
  if (!session?.user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold">
            Please Login
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            You need to be logged in to access your dashboard.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <div className="space-y-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-7 w-7 text-violet-600" />

              <h1 className="text-3xl font-bold">
                Welcome,
                <span className="text-violet-600">
                  {" "}
                  {session.user.username}
                </span>
              </h1>
            </div>

            <p className="mt-2 text-muted-foreground">
              Manage your anonymous messages from one place.
            </p>
          </div>

          <Button
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}

            Refresh
          </Button>
        </div>

        {/* ================= PUBLIC LINK ================= */}

        <Card className="p-6">
          <div className="flex flex-col gap-5">

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-950">
                <Share2 className="h-5 w-5 text-violet-600" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Your Public Link
                </h2>

                <p className="text-sm text-muted-foreground">
                  Share this link so people can send you anonymous
                  messages.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <input
                readOnly
                value={profileUrl}
                className="h-10 flex-1 rounded-md border bg-muted px-3 text-sm outline-none"
              />

              <Button
                className="cursor-pointer"
                onClick={() => {
                  if (!profileUrl) return;

                  navigator.clipboard.writeText(profileUrl);

                  toast.success("Copied to clipboard!");
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>

            </div>

          </div>
        </Card>

        {/* ================= ACCEPT MESSAGES ================= */}

        <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-950">
              <Inbox className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <h2 className="font-semibold">
                Accept Anonymous Messages
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Turn this off if you don't want to receive anonymous
                messages.
              </p>
            </div>
          </div>

          <Switch
            className="cursor-pointer"
            checked={acceptMessages ?? false}
            disabled={isSwitchLoading}
            onCheckedChange={handleSwitchChange}
          />

        </Card>

        {/* ================= MESSAGES ================= */}

        <section>

          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold">
                Anonymous Messages
              </h2>

              <p className="text-sm text-muted-foreground">
                Messages people have sent you anonymously.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <span className="w-fit rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                {messages.length}{" "}
                {messages.length === 1 ? "message" : "messages"}
              </span>

              {/* Delete All button only appears when there are 2+ messages */}
              {messages.length >= 2 && (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                        className="cursor-pointer"
                      >
                        {isDeleting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}

                        Delete All
                      </Button>
                    }
                  />

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete all messages?
                      </AlertDialogTitle>

                      <AlertDialogDescription>
                        This will permanently delete all{" "}
                        <span className="font-semibold">
                          {messages.length}
                        </span>{" "}
                        anonymous messages from your inbox. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        Cancel
                      </AlertDialogCancel>

                      <AlertDialogAction
                        onClick={handleDeleteAllMessages}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete All"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

            </div>

          </div>

          {/* Loading */}

          {isLoading ? (
            <Card className="flex min-h-60 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-violet-600" />

                <p className="text-sm text-muted-foreground">
                  Loading your messages...
                </p>
              </div>
            </Card>
          ) : messages.length === 0 ? (

            /* Empty state */

            <Card className="flex min-h-60 flex-col items-center justify-center p-10 text-center">

              <div className="mb-4 rounded-full bg-violet-100 p-4 dark:bg-violet-950">
                <MessageCircle className="h-8 w-8 text-violet-600" />
              </div>

              <h3 className="text-lg font-semibold">
                No messages yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Share your public link with friends and let them
                send you anonymous messages.
              </p>

              <Button
                className="mt-5"
                onClick={() => {
                  if (!profileUrl) return;

                  navigator.clipboard.writeText(profileUrl);

                  toast.success("Public link copied!");
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Public Link
              </Button>

            </Card>

          ) : (

            /* Message cards */

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessages}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;



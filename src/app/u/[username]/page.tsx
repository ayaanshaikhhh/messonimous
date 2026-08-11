"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { Loader2, Sparkles } from "lucide-react";

import { ApiResponse } from "@/types/ApiResponse";

type SuggestionResponse = {
  success: boolean;
  suggestions?: string[];
  message?: string;
};

const MessagePage = () => {
  const params = useParams();
  const username = params.username as string;

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // it ffill textarea when user clicks a suggestion
  const handleSuggestionClick = (text: string) => {
    setMessage(text);
  };

  // Send anonymous message
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please write a message.");
      return;
    }

    setIsSending(true);

    try {
      const response = await axios.post<ApiResponse>(
        "/api/send-message",
        {
          username,
          content: message,
        }
      );

      toast.success(response.data.message);

      setMessage("");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ||
          "Failed to send message."
      );
    } finally {
      setIsSending(false);
    }
  };

  // Generate AI suggestions using Groq
  const handleSuggestMessages = async () => {
    setIsSuggesting(true);

    try {
      const response = await axios.post<SuggestionResponse>(
        "/api/suggest-messages"
      );

      if (
        response.data.success &&
        response.data.suggestions &&
        response.data.suggestions.length > 0
      ) {
        setSuggestions(response.data.suggestions);

        // Automatically put the first AI suggestion
        // into the textarea
        setMessage(response.data.suggestions[0]);

        toast.success("AI suggestion generated!");
      } else {
        toast.error(
          response.data.message ||
            "Failed to generate suggestions."
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<SuggestionResponse>;

      toast.error(
        axiosError.response?.data.message ||
          "Failed to generate AI suggestions."
      );
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Card className="space-y-8 p-6 sm:p-8">

          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">
              Send Anonymous Message
            </h1>

            <p className="text-muted-foreground">
              to{" "}
              <span className="font-semibold text-violet-600">
                @{username}
              </span>
            </p>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <Textarea
              placeholder="Write your anonymous message..."
              className="min-h-40 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button
              className="w-full"
              disabled={isSending}
              onClick={handleSendMessage}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>

          {/* AI Suggestions */}
          <div className="space-y-4">

            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />

              <div>
                <h2 className="font-semibold">
                  Need ideas?
                </h2>

                <p className="text-sm text-muted-foreground">
                  Let AI suggest something to ask anonymously.
                </p>
              </div>
            </div>

            {/* Generate button */}
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleSuggestMessages}
              disabled={isSuggesting}
            >
              {isSuggesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Suggest Messages
                </>
              )}
            </Button>

            {/* AI generated suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">

                {suggestions.map((suggestion, index) => (
                  <Card
                    key={`${suggestion}-${index}`}
                    onClick={() =>
                      handleSuggestionClick(suggestion)
                    }
                    className="cursor-pointer p-4 transition-all hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950"
                  >
                    {suggestion}
                  </Card>
                ))}

              </div>
            )}

          </div>

        </Card>
      </div>
    </div>
  );
};

export default MessagePage;


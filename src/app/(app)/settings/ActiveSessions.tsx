"use client";

import axios from "axios";
import {
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ActiveSession {
  _id: string;
  sessionId: string;

  device: string;
  browser: string;
  operatingSystem: string;

  ipAddress: string | null;

  lastActiveAt: string;
  expiresAt: string;
  createdAt: string;

  isCurrent: boolean;
}

interface SessionsResponse {
  success: boolean;
  sessions: ActiveSession[];
  message?: string;
}

interface RevokeSessionResponse {
  success: boolean;
  message: string;
}

function getDeviceIcon(device: string) {
  const normalizedDevice = device.toLowerCase();

  if (normalizedDevice.includes("mobile")) {
    return Smartphone;
  }

  if (normalizedDevice.includes("tablet")) {
    return Tablet;
  }

  return Monitor;
}

function formatLastActive(date: string) {
  const lastActive = new Date(date);
  const now = new Date();

  const difference =
    now.getTime() - lastActive.getTime();

  const minutes = Math.floor(
    difference / (1000 * 60),
  );

  if (minutes < 1) {
    return "Active now";
  }

  if (minutes < 60) {
    return `${minutes} minute${
      minutes === 1 ? "" : "s"
    } ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${
      hours === 1 ? "" : "s"
    } ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${
    days === 1 ? "" : "s"
  } ago`;
}

export default function ActiveSessions() {
  const [sessions, setSessions] =
    useState<ActiveSession[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [revokingSessionId, setRevokingSessionId] =
    useState<string | null>(null);

  const [revokingAll, setRevokingAll] =
    useState(false);

  // ==================================================
  // Fetch sessions
  // ==================================================

  useEffect(() => {
    async function fetchSessions() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await axios.get<SessionsResponse>(
            "/api/account/sessions",
          );

        if (!response.data.success) {
          throw new Error(
            response.data.message ||
              "Failed to fetch sessions.",
          );
        }

        setSessions(
          response.data.sessions,
        );
      } catch (error) {
        console.error(
          "FETCH ACTIVE SESSIONS ERROR:",
          error,
        );

        setError(
          "Unable to load active sessions.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  // ==================================================
  // Revoke single session
  // ==================================================

  async function handleSignOut(
    sessionId: string,
  ) {
    try {
      setRevokingSessionId(sessionId);

      const response =
        await axios.delete<RevokeSessionResponse>(
          `/api/account/sessions/${sessionId}`,
        );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Failed to sign out session.",
        );
      }

      setSessions((currentSessions) =>
        currentSessions.filter(
          (session) =>
            session.sessionId !== sessionId,
        ),
      );
    } catch (error) {
      console.error(
        "SIGN OUT SESSION ERROR:",
        error,
      );
    } finally {
      setRevokingSessionId(null);
    }
  }

  // ==================================================
  // Revoke all other sessions
  // ==================================================

  async function handleSignOutAllOthers() {
    try {
      setRevokingAll(true);

      const response =
        await axios.post<RevokeSessionResponse>(
          "/api/account/sessions/revoke-others",
        );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Failed to sign out other sessions.",
        );
      }

      // Keep current session
      setSessions((currentSessions) =>
        currentSessions.filter(
          (session) => session.isCurrent,
        ),
      );
    } catch (error) {
      console.error(
        "SIGN OUT ALL OTHER SESSIONS ERROR:",
        error,
      );
    } finally {
      setRevokingAll(false);
    }
  }

  const hasOtherSessions = sessions.some(
    (session) => !session.isCurrent,
  );

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Active Sessions
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage the devices currently signed
            into your account.
          </p>
        </div>

        {/* Sign out all others */}
        {!loading && hasOtherSessions && (
          <button
            type="button"
            disabled={revokingAll}
            onClick={
              handleSignOutAllOthers
            }
            className="flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {revokingAll && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {revokingAll
              ? "Signing out..."
              : "Sign out all others"}
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center rounded-xl border p-8">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        sessions.length === 0 && (
          <div className="rounded-xl border p-8 text-center">
            <p className="font-medium">
              No active sessions
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              There are currently no active
              sessions on your account.
            </p>
          </div>
        )}

      {/* Sessions */}
      {!loading &&
        !error &&
        sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map((session) => {
              const DeviceIcon =
                getDeviceIcon(
                  session.device,
                );

              const isRevoking =
                revokingSessionId ===
                session.sessionId;

              return (
                <div
                  key={session.sessionId}
                  className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-4"
                >
                  {/* Device information */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <DeviceIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">
                          {session.browser}
                        </p>

                        {session.isCurrent && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Current device
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {session.operatingSystem}
                        {" · "}
                        {session.device}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {session.ipAddress ||
                          "Unknown IP"}
                        {" · "}
                        {formatLastActive(
                          session.lastActiveAt,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Sign out */}
                  {!session.isCurrent && (
                    <button
                      type="button"
                      disabled={isRevoking || revokingAll}
                      onClick={() =>
                        handleSignOut(
                          session.sessionId,
                        )
                      }
                      className="flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isRevoking && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}

                      {isRevoking
                        ? "Signing out..."
                        : "Sign out"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </section>
  );
}
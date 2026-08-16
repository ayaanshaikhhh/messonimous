import { headers } from "next/headers";
import {UAParser} from "ua-parser-js";

export async function getSessionMetadata() {
  const requestHeaders = await headers();

  const userAgent =
    requestHeaders.get("user-agent") ?? null;

  const parser = new UAParser(userAgent ?? "");

  const deviceResult = parser.getDevice();
  const browserResult = parser.getBrowser();
  const osResult = parser.getOS();

  const device = deviceResult.model
    ? `${deviceResult.vendor ?? ""} ${deviceResult.model}`.trim()
    : deviceResult.type === "mobile"
      ? "Mobile"
      : deviceResult.type === "tablet"
        ? "Tablet"
        : "Desktop";

  const browser =
    browserResult.name ?? "Unknown Browser";

  const operatingSystem =
    osResult.name
      ? `${osResult.name}${osResult.version ? ` ${osResult.version}` : ""}`
      : "Unknown OS";

  // Vercel / proxy-aware IP lookup
  const forwardedFor =
    requestHeaders.get("x-forwarded-for");

  const realIp =
    requestHeaders.get("x-real-ip");

  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() ||
    realIp ||
    null;

  return {
    device,
    browser,
    operatingSystem,
    ipAddress,
    userAgent,
  };
}
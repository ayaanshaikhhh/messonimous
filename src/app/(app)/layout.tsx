import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";

import Navbar from "@/components/Navbar";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Messonimous",
    template: "%s | Messonimous",
  },
  description: "Receive honest anonymous messages from anyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${spaceGrotesk.variable}
        h-full
        antialiased
      `}
    >
      <body className="min-h-screen bg-slate-50 font-(family-name:--font-geist-sans) text-slate-900 overflow-hidden">
        
          <Navbar/>
          {children}

      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import { SetupGuard } from "@/components/SetupGuard";
import { geistSans, geistMono, displayFont } from "./fonts";

export const metadata: Metadata = {
  title: "SwiftAPI - Automate dev tasks from your phone",
  description: "Type a command. We parse, execute, commit, and deploy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} antialiased font-sans`}
      >
        <SetupGuard>{children}</SetupGuard>
      </body>
    </html>
  );
}

import React from "react";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { AppLayout } from "@/components/ui/app-layout";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alpha",
  description: "Alpha",
  appleWebApp: {
    capable: true,
    startupImage: "../assets/images/iconMeta.png",
    title: "AlphaClub",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={[inter.className, "layout"].join(" ")}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

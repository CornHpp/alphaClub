import React from "react";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import { AppLayout } from "@/components/ui/app-layout";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const myFont = localFont({
  src: [
    {
      path: "../lib/font/Poppins/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../lib/font/Poppins/Poppins-Medium.ttf",
      weight: "500",
    },
    {
      path: "../lib/font/Poppins/Poppins-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../lib/font/Poppins/Poppins-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Alpha",
  description: "Alpha",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} ${myFont.className}`}
    >
      <body className="layout">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import React from "react";
import { lang } from "@/lib/action/uploadimage";

export const metadata: Metadata = {
  title: "Tech-Hiem",
  description: "Tech-Hiem",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#F45E0C",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Dynamically load messages based on the locale
  const messages = await getMessages();
  lang();

  // Determine the text direction based on the locale
  const isRtl = ["ar", "ku"].includes(params.locale || ""); // Add languages that use RTL
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <html lang={params.locale} dir={dir}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <style>
          {`
          html {
            color-scheme: light dark;
          }
          `}
        </style>
        <meta name="theme-color" content="#fff2f" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Your App Name" />
        <meta name="description" content="Your app description" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`bg-gray-50 dark:bg-gray-950 border-t border-secondary-200/50 w-full ${
          isRtl ? "rtl" : "ltr"
        }`}
      >
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <ClientProviders>{children}</ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

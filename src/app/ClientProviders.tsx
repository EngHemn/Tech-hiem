"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import store from "@/lib/action/store";
import { Provider as ReduxProvider } from "react-redux";
import ContextProvider from "@/app/dashboard/ConTextData";
import Header from "@/components/header/Header";
import Footer from "@/components/home/Footer";
import { Toaster } from "@/components/ui/toaster";
import FoooterMob from "@/components/home/FoooterMob";
import { useEffect, useState } from "react";
import { kurdishSoraniLocalization, kuSorani } from "@/util/data";
import { arSA, enUS, trTR } from "@clerk/localizations";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const queryClient = new QueryClient();
//
export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const [locale, setLocale] = useState("en"); // Default to English

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get locale from cookies
      const cookies = document.cookie.split(";");
      const localeCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("NEXT_LOCALE=")
      );

      if (localeCookie) {
        const lang = localeCookie.split("=")[1]?.trim();
        if (lang && ["en", "ku", "tr", "ar"].includes(lang)) {
          setLocale(lang);
        } else {
          setLocale("en");
        }
      } else {
        setLocale("en");
      }
    }
  }, []);

  // Select localization object based on detected language
  const localization = locale === "ku" ? kuSorani : undefined; // Kurdish (Sorani)
  let l =
    locale === "en"
      ? enUS
      : locale === "ar"
        ? arSA
        : locale === "tr"
          ? trTR
          : kurdishSoraniLocalization;

  return (
    <ThemeProvider
      defaultTheme="system"
      attribute="class"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <ClerkProvider
            localization={l}
            appearance={{
              elements: {
                // Hide the default footer
                footer: {
                  display: "hidden",
                },
              },
            }}
          >
            <ContextProvider>
              <div
                className={`${
                  pathName?.includes("/dash")
                    ? "bg-gray-50  dark:bg-gray-950 dark:text-gray-100"
                    : "bg-white px-4 md:px-6 lg:px-8 dark:bg-gray-950 dark:text-gray-100"
                }`}
              >
                <Header />
                {children}
              </div>
              <Footer />
              <FoooterMob />
              <Toaster />
            </ContextProvider>
          </ClerkProvider>
        </ReduxProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

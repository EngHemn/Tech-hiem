import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { getLocaleFromCookiesServer } from "@/lib/locale-server";

// Can be imported from a shared config
export const locales = ["en", "ku", "tr", "ar"];

export default getRequestConfig(async () => {
  // Get locale from cookies
  let locale = await getLocaleFromCookiesServer();

  // Validate that the locale is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = "en"; // Default to English
  }

  return {
    locale,
    messages: (await import(`./src/app/messages/${locale}.json`)).default,
  };
});

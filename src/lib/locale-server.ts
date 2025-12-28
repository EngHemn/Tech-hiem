import { cookies } from "next/headers";

const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

/**
 * Get locale from cookies (server-side)
 * This function uses next/headers and should only be used in server components
 */
export async function getLocaleFromCookiesServer(): Promise<string> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) return "en";

  const localeMatch = cookieHeader.match(
    new RegExp(`${LOCALE_COOKIE_NAME}=([^;]+)`)
  );
  return localeMatch ? localeMatch[1] : "en";
}

/**
 * Get locale from cookie string (server-side, for use in middleware)
 * This doesn't require next/headers
 */
export function getLocaleFromCookies(cookieHeader: string | undefined): string {
  if (!cookieHeader) return "en";

  const localeMatch = cookieHeader.match(
    new RegExp(`${LOCALE_COOKIE_NAME}=([^;]+)`)
  );
  return localeMatch ? localeMatch[1] : "en";
}

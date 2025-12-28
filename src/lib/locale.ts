const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

/**
 * Get locale from cookies (client-side)
 */
export function getLocaleCookie(): string {
  if (typeof document === "undefined") return "en";
  
  const cookies = document.cookie.split(";");
  const localeCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${LOCALE_COOKIE_NAME}=`)
  );
  
  if (localeCookie) {
    return localeCookie.split("=")[1]?.trim() || "en";
  }
  
  return "en";
}

/**
 * Set locale in cookies (client-side)
 */
export function setLocaleCookie(locale: string): void {
  if (typeof document === "undefined") return;
  
  // Set cookie with 1 year expiration
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Get locale from cookies (server-side)
 */
export function getLocaleFromCookies(cookies: string | undefined): string {
  if (!cookies) return "en";
  
  const localeMatch = cookies.match(new RegExp(`${LOCALE_COOKIE_NAME}=([^;]+)`));
  return localeMatch ? localeMatch[1] : "en";
}


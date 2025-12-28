import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getLocaleFromCookies } from "@/lib/locale-server";

const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
const locales = ["en", "ku", "tr", "ar"];
const defaultLocale = "en";

export default clerkMiddleware(async (auth, req) => {
  // Get the pathname
  const pathname = req.nextUrl.pathname;

  // Check if it's an API route
  if (pathname.includes("/api/")) {
    // For API routes, just let Clerk handle authentication
    // The API route will check auth itself
    return NextResponse.next();
  }

  // Get locale from cookie
  const cookieHeader = req.headers.get("cookie");
  let locale = getLocaleFromCookies(cookieHeader);

  // Validate locale
  if (!locales.includes(locale)) {
    locale = defaultLocale;
  }

  // Set locale in response headers for server components
  const response = NextResponse.next();
  response.headers.set("x-locale", locale);

  // Ensure cookie is set
  if (!cookieHeader?.includes(`${LOCALE_COOKIE_NAME}=`)) {
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// export default clerkMiddleware((auth, req) => {
// Protect all routes starting with `/admin`
//   if (isAdminRoute(req) && auth().sessionClaims?.metadata?.role !== "admin") {
//     const url = new URL("/", req.url);
//     return NextResponse.redirect(url);
//   }
// });

// export const config = {
//   matcher: [
// Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

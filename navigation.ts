// Since we're using cookies for locale instead of URL prefixes,
// we can use regular Next.js navigation
export { default as Link } from "next/link";
export { redirect, usePathname, useRouter } from "next/navigation";

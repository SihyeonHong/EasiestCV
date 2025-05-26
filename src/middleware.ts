import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname === "/" ||
    (!pathname.startsWith(`/${routing.defaultLocale}`) &&
      !pathname.startsWith("/ko"))
  ) {
    const newUrl = new URL(`/${routing.defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

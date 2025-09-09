import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 사용자가 이미 로케일이 포함된 URL을 방문했다면, 미들웨어가 알아서 처리합니다.
  const isLocaleInUrl = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (isLocaleInUrl) {
    return intlMiddleware(request);
  }

  // 로케일이 없는 URL인 경우, 사용자의 브라우저 언어를 감지합니다.
  const acceptLanguage = request.headers.get("Accept-Language");
  const userLanguage = acceptLanguage
    ? acceptLanguage.split(",")[0].split("-")[0]
    : routing.defaultLocale;

  // 지원하는 언어 목록에 사용자의 언어가 있는지 확인합니다.
  const detectedLocale =
    routing.locales.find((locale) => locale === userLanguage) ||
    routing.defaultLocale;

  // 감지된 언어로 리디렉션합니다.
  const newUrl = new URL(
    `/${detectedLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
    request.url,
  );

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

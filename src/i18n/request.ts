import { getRequestConfig } from "next-intl/server";

import { routing, Locale } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`@/i18n/locales/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});

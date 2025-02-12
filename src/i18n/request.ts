import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LocalesType, defaultLocale } from "@/util/i18n";

export default getRequestConfig(
  async ({ locale: requestLocale }: { locale: string | undefined }) => {
    let locale: LocalesType = defaultLocale;

    if (
      requestLocale &&
      routing.locales.includes(requestLocale as LocalesType)
    ) {
      locale = requestLocale as LocalesType;
    }

    const messages = (await import(`@/locales/${locale}.json`)).default;

    return {
      locale,
      messages,
    };
  },
);

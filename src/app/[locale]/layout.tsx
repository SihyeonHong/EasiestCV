import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(locale);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

async function getMessages(locale: string) {
  try {
    return (await import(`@/i18n/locales/${locale}.json`)).default;
  } catch (error) {
    console.log(error);
    notFound();
  }
}

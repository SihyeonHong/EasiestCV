import "@/app/globals.css";
import TanstackQueryProvider from "@/provider/TanstackQueryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Easiest CV",
  description: "Easiest way to make your CV",
};

interface RootLayoutProps {
  children: ReactNode;
  params?: {
    locale?: string;
  };
}

export default function RootLayout({
  children,
  params: { locale = "en" } = { locale: "en" },
}: RootLayoutProps) {
  return (
    <html lang={locale}>
      <body
        className={inter.className}
        style={{ backgroundColor: "rgb(250, 250, 247)" }}
      >
        <NextIntlClientProvider
          locale={locale}
          messages={require(`@/locales/${locale}.json`)}
        >
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

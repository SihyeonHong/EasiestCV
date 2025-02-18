import "@/app/globals.css";
import TanstackQueryProvider from "@/provider/TanstackQueryProvider";
import { ThemeProvider } from "@/provider/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Easiest CV",
  description: "Easiest way to make your CV",
};

interface RootLayoutProps {
  children: ReactNode;
  params?: { locale: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  return (
    <html lang={params?.locale || "en"} suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

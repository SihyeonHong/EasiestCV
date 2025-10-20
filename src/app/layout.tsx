import "@/app/globals.css";
import "react-quill/dist/quill.snow.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import TanstackQueryProvider from "@/provider/TanstackQueryProvider";
import { ThemeProvider } from "@/provider/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Easiest CV",
  description: "Easiest way to make your CV",
  verification: {
    google: "MrXMvtxqxYirVsEo1s_0kadHZja0G6_3nFjHGw79Dgc",
  },
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

import "@/app/globals.css";
import TanstackQueryProvider from "@/provider/TanstackQueryProvider";
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
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body
        className={inter.className}
        style={{ backgroundColor: "rgb(250, 250, 247)" }}
      >
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </body>
    </html>
  );
}

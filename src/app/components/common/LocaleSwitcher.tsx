"use client";

import { useLocale } from "next-intl";

import { Button } from "@/app/components/common/Button";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLocaleChange = () => {
    const newLocale = currentLocale === "en" ? "ko" : "en";
    router.push(pathname, { locale: newLocale });
  };

  return (
    <Button variant="ghost" onClick={handleLocaleChange}>
      한국어 / English
    </Button>
  );
}

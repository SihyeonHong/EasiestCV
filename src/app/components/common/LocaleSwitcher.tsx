"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

import { Button } from "@/app/components/common/Button";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지 확인
    const storedLocale = localStorage.getItem("ecv_locale");

    // 저장된 언어가 현재 URL의 언어와 다르면 리디렉션
    if (storedLocale && storedLocale !== currentLocale) {
      router.replace(pathname, { locale: storedLocale });
    }
  }, [currentLocale, pathname, router]);

  const handleLocaleChange = () => {
    const newLocale = currentLocale === "en" ? "ko" : "en";
    localStorage.setItem("ecv_locale", newLocale);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Button variant="ghost" onClick={handleLocaleChange}>
      한국어 / English
    </Button>
  );
}

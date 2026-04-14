"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { MdLanguage } from "react-icons/md";

import { Button } from "@/app/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/common/DropdownMenu";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations("header");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 페이지 로드 시 로컬 스토리지 확인
    const storedLocale = localStorage.getItem("ecv_locale");

    // 저장된 언어가 현재 URL의 언어와 다르면 리디렉션
    if (storedLocale && storedLocale !== currentLocale) {
      router.replace(pathname, { locale: storedLocale });
    }
  }, [currentLocale, pathname, router]);

  const handleLocaleChange = (newLocale: string) => {
    localStorage.setItem("ecv_locale", newLocale);
    router.replace(pathname, { locale: newLocale });
  };

  // 마운트되기 전까지는 임시 버튼을 표시하여 hydration 불일치 방지
  if (!mounted) {
    return <Button variant="ghost">...</Button>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <MdLanguage className="h-4 w-4" />
          {t("language")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentLocale}
          onValueChange={handleLocaleChange}
        >
          <DropdownMenuRadioItem value="ko" className="flex items-center gap-2">
            한국어
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en" className="flex items-center gap-2">
            English
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

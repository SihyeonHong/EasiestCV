"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/app/components/common/Button";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/common/DropdownMenu";

export default function DisplayMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations("displayMode");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 마운트되기 전까지는 임시 버튼을 표시하여 hydration 불일치 방지
  if (!mounted) {
    return <Button variant="outline">...</Button>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {theme === "system" ? resolvedTheme : theme}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="dark">
            {t("dark")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            {t("light")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            {t("system")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

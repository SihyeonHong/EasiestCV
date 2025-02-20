"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { LuSun, LuMoon } from "react-icons/lu";
import { MdSettings } from "react-icons/md";
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
        <Button variant="outline" className="flex items-center gap-2">
          {theme === "system" ? (
            resolvedTheme === "dark" ? (
              <LuMoon className="h-4 w-4" />
            ) : (
              <LuSun className="h-4 w-4" />
            )
          ) : theme === "dark" ? (
            <LuMoon className="h-4 w-4" />
          ) : (
            <LuSun className="h-4 w-4" />
          )}
          {theme === "system" ? t(resolvedTheme) : t(theme)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem
            value="dark"
            className="flex items-center gap-2"
          >
            <LuMoon className="h-4 w-4" />
            {t("dark")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="light"
            className="flex items-center gap-2"
          >
            <LuSun className="h-4 w-4" />
            {t("light")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="system"
            className="flex items-center gap-2"
          >
            <MdSettings className="h-4 w-4" />
            {t("system")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useTranslations } from "next-intl";

import LoadingIcon from "@/app/components/common/LoadingIcon";

export default function LoadingPage() {
  const t = useTranslations("message");

  return (
    <div className="flex h-screen items-center justify-center backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 text-center">
        <h1 className="prose animate-pulse text-xl font-semibold text-gray-700">
          {t("loading")}
        </h1>
        <LoadingIcon />
      </div>
    </div>
  );
}

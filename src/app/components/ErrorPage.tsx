"use client";

import { useTranslations } from "next-intl";
import { FaExclamationCircle, FaRedo } from "react-icons/fa";

import { Button } from "@/app/components/common/Button";

interface ErrorPageProps {
  error?: Error;
  msg?: "unknownError" | "serverError";
}

export default function ErrorPage({ error, msg }: ErrorPageProps) {
  const t = useTranslations("error");

  const errorMessage = msg ? t(msg) : error?.message || t("unknownError");

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-screen items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <FaExclamationCircle className="h-12 w-12 text-red-500" />
        <div className="flex flex-col gap-2">
          <h1 className="prose text-xl font-semibold text-gray-700">
            {errorMessage}
          </h1>
          <p className="text-sm text-gray-500">{errorMessage}</p>
        </div>
        <Button onClick={handleRetry} variant="outline" className="mt-2">
          <FaRedo />
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}

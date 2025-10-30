"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { Button } from "@/app/components/common/Button";
import { Card, CardContent } from "@/app/components/common/Card";
import { LoadingIcon } from "@/app/components/common/LoadingIcon";

interface Props {
  pdf?: string;
}

export default function PublicFile({ pdf }: Props) {
  const t = useTranslations("file");

  const [isMobile, setIsMobile] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const openPDF = () => {
    window.open(pdf, "_blank");
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-5">
        {pdf ? (
          <div className="flex flex-col items-center gap-3 md:flex-row">
            <Button onClick={openPDF}>{t("fileOpen")}</Button>

            {isMobile ? (
              <p className="text-sm text-gray-600">{t("mobileNotSupported")}</p>
            ) : (
              <Button variant="secondary" onClick={handlePreview}>
                {showPreview ? t("closePreview") : t("openPreview")}
              </Button>
            )}
          </div>
        ) : (
          <p>{t("noFile")}</p>
        )}

        {!isMobile && showPreview && pdf && (
          <div className="w-full rounded border">
            {isLoading && <LoadingIcon />}
            <iframe
              src={pdf}
              onLoad={() => setIsLoading(false)}
              className="h-[100vh] w-full"
              title={t("preview")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

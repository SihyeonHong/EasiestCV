"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { Button } from "@/app/components/common/Button";
import { Card, CardContent } from "@/app/components/common/Card";

import { LoadingIcon } from "../common/LoadingIcon";

interface Props {
  pdf?: string;
}

export default function PublicFile({ pdf }: Props) {
  const tPdf = useTranslations("file");

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
          <div className="flex items-center gap-3">
            <Button onClick={openPDF}>{tPdf("openBtn")}</Button>

            {!isMobile && (
              <Button variant="secondary" onClick={handlePreview}>
                {showPreview ? tPdf("closePreview") : tPdf("openPreview")}
              </Button>
            )}
          </div>
        ) : (
          <p>{tPdf("noFile")}</p>
        )}

        {!isMobile && showPreview && pdf && (
          <div className="w-full rounded border">
            {isLoading && <LoadingIcon />}
            <iframe
              src={pdf}
              onLoad={() => setIsLoading(false)}
              className="h-[600px] w-full"
              title={tPdf("preview")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

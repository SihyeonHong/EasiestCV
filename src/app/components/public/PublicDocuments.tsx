"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { Button } from "@/app/components/common/Button";
import { Card, CardContent } from "@/app/components/common/Card";
import LoadingPage from "@/app/components/LoadingPage";
import { useDocuments } from "@/hooks/useDocuments";
import extractFileName from "@/utils/extractFileName";

interface Props {
  userid: string;
}

// 우선 파일이 하나인 경우만 반영합니다.
export default function PublicDocuments({ userid }: Props) {
  const { documents, isLoading, isDocumentExists } = useDocuments(userid);
  const t = useTranslations("documents");
  const tError = useTranslations("error");

  const [isMobile, setIsMobile] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const downloadCV = async () => {
    if (!isDocumentExists || !documents) return;

    let objectUrl: string | null = null;
    let link: HTMLAnchorElement | null = null;

    try {
      // 1. API 엔드포인트에서 파일 가져오기 (CORS 문제 없음)
      const response = await fetch(
        `/api/documents?userid=${userid}&download=true`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 2. Blob으로 변환
      const blob = await response.blob();

      // 3. 파일명 추출
      const fileName = extractFileName(documents[0]) || "resume.pdf";

      // 4. 임시 URL 생성
      objectUrl = URL.createObjectURL(blob);

      // 5. 다운로드 트리거
      link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      link.style.display = "none"; // 화면에 보이지 않도록
      document.body.appendChild(link);
      link.click();
    } catch {
      alert(tError("downloadFail"));
    } finally {
      // 6. 정리 (에러가 발생해도 반드시 실행됨)
      if (link) {
        document.body.removeChild(link);
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <Card className="rounded-sm">
      <CardContent className="flex flex-col gap-5">
        {(isLoading || !isDocumentExists) && <LoadingPage />}
        <div className="flex flex-col items-center gap-3 md:flex-row">
          <Button onClick={downloadCV}>{t("downloadCV")}</Button>

          {isMobile ? (
            <p className="text-sm text-gray-600">{t("mobileNotSupported")}</p>
          ) : (
            <Button variant="secondary" onClick={handlePreview}>
              {showPreview ? t("closePreview") : t("openPreview")}
            </Button>
          )}
        </div>

        {!isMobile && showPreview && isDocumentExists && documents && (
          <div className="w-full rounded border">
            <iframe
              src={documents[0]}
              className="h-[100vh] w-full"
              title={t("preview")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

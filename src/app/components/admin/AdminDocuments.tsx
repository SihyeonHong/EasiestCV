"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import LoadingIcon from "@/app/components/common/LoadingIcon";
import { useDocuments } from "@/hooks/useDocuments";
import { cn } from "@/utils/classname";
import extractFileName from "@/utils/extractFileName";

interface Props {
  userid: string;
}

// 우선 파일이 하나인 경우만 반영합니다.
export default function AdminDocuments({ userid }: Props) {
  const t = useTranslations("documents");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { documents, isLoading, uploadDocument, deleteDocument, isDeleting } =
    useDocuments(userid);

  // 문서가 삭제되면 파일 input 초기화
  useEffect(() => {
    if (
      !isLoading &&
      !isDeleting &&
      fileInputRef.current &&
      (!documents || documents.length === 0)
    ) {
      fileInputRef.current.value = "";
    }
  }, [documents, isLoading, isDeleting]);

  // 현재 문서 URL에서 파일명 추출
  const currentDocumentName =
    documents && documents.length > 0 ? extractFileName(documents[0]) : null;

  return (
    <div id="documents-section" className="flex flex-col gap-4">
      <h1 className="mb-2 text-2xl font-bold">{t("documents")}</h1>
      <div
        className={cn(
          "flex flex-col items-end gap-2 sm:flex-row sm:items-start",
        )}
      >
        <div className="flex w-full flex-col gap-1">
          <Input
            ref={fileInputRef}
            id="documents"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              if (!e.target.files || e.target.files.length === 0) return;
              uploadDocument(e.target.files[0] as File);
            }}
          />
          {currentDocumentName && (
            <p className="text-muted-foreground ml-3 text-xs">
              {t("currentDocument")}: {currentDocumentName}
            </p>
          )}
        </div>

        {isLoading || isDeleting ? (
          <Button variant="secondary" disabled>
            {isLoading ? t("documentsPending") : t("documentsPending")}{" "}
            <LoadingIcon />
          </Button>
        ) : documents && documents.length > 0 ? (
          <div className="flex gap-2">
            <Button onClick={() => window.open(documents[0], "_blank")}>
              {t("openMyDocument")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const confirm = window.confirm(t("deleteConfirm"));
                if (!confirm) return;
                deleteDocument();
              }}
            >
              {t("delete")}
            </Button>
          </div>
        ) : (
          <Button variant="secondary" disabled>
            {t("noDocuments")}
          </Button>
        )}
      </div>
    </div>
  );
}

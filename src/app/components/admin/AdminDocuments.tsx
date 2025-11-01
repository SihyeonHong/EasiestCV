"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import { LoadingIcon } from "@/app/components/common/LoadingIcon";
import { useDocuments } from "@/hooks/useDocuments";
import { cn } from "@/utils/classname";

interface Props {
  userid: string;
}

// 우선 파일이 하나인 경우만 반영합니다.
export default function AdminDocuments({ userid }: Props) {
  const t = useTranslations("documents");

  const { documents, isLoading, uploadDocument } = useDocuments(userid);

  return (
    <div id="documents-section" className="flex flex-col gap-4">
      <h1 className="mb-2 text-2xl font-bold">{t("documents")}</h1>
      <div
        className={cn(
          "space-y-2 sm:inline-flex sm:flex-row sm:gap-4 sm:space-y-0",
        )}
      >
        <Input
          id="documents"
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (!e.target.files || e.target.files.length === 0) return;
            uploadDocument(e.target.files[0] as File);
          }}
        />
        {isLoading ? (
          <Button variant="secondary" disabled>
            {t("documentsPending")} <LoadingIcon />
          </Button>
        ) : documents && documents.length > 0 ? (
          <Button onClick={() => window.open(documents[0], "_blank")}>
            {t("documentsOpen")}
          </Button>
        ) : (
          <Button variant="secondary" disabled>
            {t("noDocuments")}
          </Button>
        )}
      </div>
    </div>
  );
}

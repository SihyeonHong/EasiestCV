"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import { LoadingIcon } from "@/app/components/common/LoadingIcon";
import { useHome } from "@/hooks/useHome";
import { cn } from "@/utils/classname";

interface Props {
  userid: string;
}

export default function AdminPDF({ userid }: Props) {
  const t = useTranslations("file");
  const { homeData, mutateUploadPdf, isPdfPending } = useHome(userid);

  return (
    <div id="pdf-section" className="flex flex-col gap-4">
      <h1 className="mb-2 text-2xl font-bold">{t("file")}</h1>
      <div
        className={cn(
          "space-y-2 sm:inline-flex sm:flex-row sm:gap-4 sm:space-y-0",
        )}
      >
        <Input
          id="pdf"
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (!e.target.files || e.target.files.length === 0) return;
            const file = e.target.files[0];
            mutateUploadPdf({ userid, file });
          }}
        />
        {isPdfPending ? (
          <Button variant="secondary" disabled>
            {t("filePending")} <LoadingIcon />
          </Button>
        ) : homeData?.pdf ? (
          <Button onClick={() => window.open(homeData.pdf, "_blank")}>
            {t("fileOpen")}
          </Button>
        ) : (
          <Button variant="secondary" disabled>
            {t("noFile")}
          </Button>
        )}
      </div>
    </div>
  );
}

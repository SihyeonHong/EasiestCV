"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";
import { Switch } from "@/app/components/common/Switch";
import { useHome } from "@/hooks/useHome";
import { cn } from "@/utils/classname";

interface Props {
  userid: string;
}

export default function AdminPDF({ userid }: Props) {
  const t = useTranslations("admin");
  const tMessage = useTranslations("message");
  const { homeData, mutateUploadPdf, isPdfPending } = useHome(userid);
  const [showFileTab, setShowFileTab] = useState(true);

  return (
    <div id="pdf-section" className="flex flex-col gap-4">
      <h1 className="mb-2 text-2xl font-bold">PDF</h1>
      <div className="inline-flex gap-4">
        <Label htmlFor="pdf">파일 탭 사용하기</Label>
        <Switch checked={showFileTab} onCheckedChange={setShowFileTab} />
      </div>
      <div
        className={cn(
          "space-y-2 sm:inline-flex sm:flex-row sm:gap-4 sm:space-y-0",
          !showFileTab && "hidden sm:hidden",
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
          <p>{t("pdfPending")}</p>
        ) : homeData?.pdf ? (
          <Button onClick={() => window.open(homeData.pdf, "_blank")}>
            {t("pdfOpen")}
          </Button>
        ) : (
          <p>{tMessage("noPdf")}</p>
        )}
      </div>
    </div>
  );
}

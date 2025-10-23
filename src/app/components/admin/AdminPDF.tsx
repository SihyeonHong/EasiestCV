import { useTranslations } from "next-intl";

import { CardContent } from "@/app/components/common/Card";
import { Input } from "@/app/components/common/Input";
import { useHome } from "@/hooks/useHome";

interface Props {
  userid: string;
}

export default function AdminPDF({ userid }: Props) {
  const t = useTranslations("admin");
  const tMessage = useTranslations("message");
  const { homeData, mutateUploadPdf, isPdfPending } = useHome(userid);

  return (
    <CardContent className="prose flex flex-col gap-4 dark:prose-invert">
      <h1 className="text-2xl font-bold">PDF</h1>
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
        <a href={homeData.pdf} target="_blank" rel="noreferrer">
          {t("pdfOpen")}
        </a>
      ) : (
        <p>{tMessage("noPdf")}</p>
      )}
    </CardContent>
  );
}

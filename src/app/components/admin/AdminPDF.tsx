import { useTranslations } from "next-intl";
import { useHome } from "@/hooks/useHome";
import { Card, CardContent } from "@/app/components/common/Card";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";

interface Props {
  userid: string;
}

export default function AdminPDF({ userid }: Props) {
  const t = useTranslations("admin");
  const { homeData, mutateUploadPdf, isPdfPending } = useHome(userid);

  return (
    <Card className="mx-2 md:mx-8 lg:w-[1024px]">
      <CardContent className="prose max-w-none dark:prose-invert">
        <Label htmlFor="pdf">{t("pdfAttach")}</Label>
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
          <p>{t("noPdf")}</p>
        )}
      </CardContent>
    </Card>
  );
}

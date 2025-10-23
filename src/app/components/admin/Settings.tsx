import { useTranslations } from "next-intl";

import AdminPDF from "@/app/components/admin/AdminPDF";
import { Card, CardHeader, CardTitle } from "@/app/components/common/Card";

interface Props {
  userid: string;
}

export default function Settings({ userid }: Props) {
  const t = useTranslations("settings");
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("shortcut")}</CardTitle>
          <ul className="flex gap-2">
            <li>탭</li>
            <li>PDF</li>
            <li>메타데이터</li>
            <li>회원정보</li>
          </ul>
        </CardHeader>
        <p>{userid}</p>
        <AdminPDF userid={userid} />
      </Card>
    </div>
  );
}

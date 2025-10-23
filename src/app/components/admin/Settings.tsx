import { useTranslations } from "next-intl";

import AdminPDF from "@/app/components/admin/AdminPDF";
import PasswordChanger from "@/app/components/admin/PasswordChanger";
import TabManager from "@/app/components/admin/TabManager";
import UserInfoEditor from "@/app/components/admin/UserInfoEditor";
import { Card, CardContent } from "@/app/components/common/Card";
import { Separator } from "@/app/components/common/separator";

interface Props {
  userid: string;
}

export default function Settings({ userid }: Props) {
  const t = useTranslations("settings");

  return (
    <div>
      <Card>
        <CardContent>
          <h1 className="mb-2 text-2xl font-bold">{t("shortcut")}</h1>
          <ul className="flex gap-2">
            <li>탭</li>
            <li>PDF</li>
            <li>메타데이터</li>
            <li>회원정보</li>
          </ul>
          <Separator className="my-10" />
          <AdminPDF userid={userid} />
          <Separator className="my-10" />
          <TabManager userid={userid} />
          <Separator className="my-10" />
          <UserInfoEditor userid={userid} />
          <Separator className="my-10" />
          <PasswordChanger userid={userid} />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";

import AdminDocuments from "@/app/components/admin/AdminDocuments";
import MetadataEditor from "@/app/components/admin/MetadataEditor";
import PasswordChanger from "@/app/components/admin/PasswordChanger";
import TabManager from "@/app/components/admin/TabManager";
import UserInfoEditor from "@/app/components/admin/UserInfoEditor";
import { Button } from "@/app/components/common/Button";
import { Card, CardContent } from "@/app/components/common/Card";

interface Props {
  userid: string;
}

export default function Settings({ userid }: Props) {
  const t = useTranslations("settings");

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-12">
        <div>
          <h1 className="mb-2 text-2xl font-bold">{t("shortcut")}</h1>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Button
                variant="secondary"
                onClick={() => handleScrollTo("documents-section")}
              >
                {t("documents")}
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleScrollTo("tab-section")}
                variant="secondary"
              >
                {t("tabs")}
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleScrollTo("userinfo-section")}
                variant="secondary"
              >
                {t("userInfo")}
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleScrollTo("password-section")}
                variant="secondary"
              >
                {t("password")}
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleScrollTo("metadata-section")}
                variant="secondary"
              >
                {t("metadata")}
              </Button>
            </li>
          </ul>
        </div>
        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        <AdminDocuments userid={userid} />
        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        <TabManager userid={userid} />
        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        <UserInfoEditor userid={userid} />
        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        <PasswordChanger userid={userid} />
        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        <MetadataEditor userid={userid} />
      </CardContent>
    </Card>
  );
}

"use client";

import { useTranslations } from "next-intl";

interface Props {
  userid: string;
  tid: number;
}

export default function SettingInTab({ userid, tid }: Props) {
  const t = useTranslations("settingInTab");
  return (
    <div className="bg-background p-3">
      <h1 className="mb-2 whitespace-nowrap text-lg font-semibold">
        {t("title")}
      </h1>
      <p>
        userid: {userid} + tid: {tid}
      </p>
    </div>
  );
}

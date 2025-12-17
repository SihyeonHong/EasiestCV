"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/app/components/common/Button";

interface Props {
  onAddTemplate: () => void;
  isAddingTemplate: boolean;
}

export default function SettingInTab({
  onAddTemplate,
  isAddingTemplate,
}: Props) {
  const t = useTranslations("settingInTab");

  return (
    <div className="bg-background p-3">
      <h1 className="mb-2 whitespace-nowrap text-lg font-semibold">
        {t("title")}
      </h1>
      <div className="">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAddTemplate}
          disabled={isAddingTemplate}
        >
          <PlusIcon className="size-4" />
          {t("template")}
        </Button>
      </div>
    </div>
  );
}

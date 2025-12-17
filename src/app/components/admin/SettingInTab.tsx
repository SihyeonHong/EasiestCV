"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/app/components/common/Button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/app/components/common/hover-card";

interface Props {
  onAddTemplate: () => void;
  isAddingTemplate: boolean;
  getTemplateHtml: () => Promise<string>;
}

export default function SettingInTab({
  onAddTemplate,
  isAddingTemplate,
  getTemplateHtml,
}: Props) {
  const t = useTranslations("settingInTab");

  const [templateHtml, setTemplateHtml] = React.useState<string | null>(null);
  const [isTemplatePreviewLoading, setIsTemplatePreviewLoading] =
    React.useState(false);
  const [isTemplatePreviewError, setIsTemplatePreviewError] =
    React.useState(false);

  const loadTemplateHtml = React.useCallback(async () => {
    if (templateHtml) return;
    if (isTemplatePreviewLoading) return;

    setIsTemplatePreviewLoading(true);
    try {
      const html = await getTemplateHtml();
      setTemplateHtml(html);
      setIsTemplatePreviewError(false);
    } catch {
      setIsTemplatePreviewError(true);
    } finally {
      setIsTemplatePreviewLoading(false);
    }
  }, [getTemplateHtml, isTemplatePreviewLoading, templateHtml]);

  return (
    <div className="bg-background p-3">
      <h1 className="mb-2 whitespace-nowrap text-lg font-semibold">
        {t("title")}
      </h1>
      <div className="">
        <HoverCard
          openDelay={10}
          onOpenChange={(open) => {
            if (!open) return;
            void loadTemplateHtml();
          }}
        >
          <HoverCardTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddTemplate}
              disabled={isAddingTemplate}
            >
              <PlusIcon className="size-4" />
              {t("template")}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            side="bottom"
            className="w-[36rem] max-w-[calc(100vw-2rem)]"
          >
            <p className="text-sm">{t("templateInsertHint")}</p>

            <div className="mt-2 max-h-80 overflow-auto rounded-md border p-2">
              {templateHtml ? (
                <div
                  className="tiptap text-xs [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h4]:text-sm"
                  dangerouslySetInnerHTML={{ __html: templateHtml }}
                />
              ) : isTemplatePreviewLoading ? (
                <div className="h-16 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
              ) : isTemplatePreviewError ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("templatePreviewLoadFailed")}
                </p>
              ) : null}
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}

"use client";

import { CheckCheck } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function InProgress() {
  const t = useTranslations("inProgress");
  return (
    <div id="ingCard" className="flex flex-col gap-4">
      <section className="bg-background p-4 dark:bg-zinc-900">
        <header className="mb-3 flex items-center gap-2">
          <div className="w-fit rounded-full bg-white p-1 dark:bg-zinc-600">
            <CheckCheck className="size-4 text-foreground" />
          </div>
          <h5 className="text-sm font-semibold">{t("guideWriting")}</h5>
        </header>
        <p className="text-sm">{t("guideWritingDescription")}</p>
        <p className="text-sm">{t("guideWritingDescription2")}</p>
        <Link
          href="https://www.easiest-cv.com/ko/guide-kr"
          className="inline-flex items-center text-sm text-blue-600 hover:underline hover:opacity-80 dark:text-blue-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.easiest-cv.com/ko/guide-kr
        </Link>
        <p className="text-sm">{t("guideWritingDescription3")}</p>
      </section>

      <section className="bg-background p-4 dark:bg-zinc-900">
        <header className="mb-3 flex items-center gap-2">
          <div className="w-fit rounded-full bg-white p-1 dark:bg-zinc-600">
            <CheckCheck className="size-4 text-foreground" />
          </div>
          <h5 className="text-sm font-semibold">{t("knownIssues")}</h5>
        </header>
        <ul className="list-disc pl-5 text-sm">
          <li>{t("knownIssuesDescription")}</li>
          <li>{t("knownIssuesDescription2")}</li>
        </ul>
      </section>
    </div>
  );
}

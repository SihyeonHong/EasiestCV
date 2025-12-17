import { useTranslations } from "next-intl";

export default function UsageGuide() {
  const t = useTranslations("usageGuide");

  return (
    <div className="flex flex-col">
      <h5 className="mb-1 text-lg font-bold">{t("title")}</h5>

      <p className="text-sm">{t("demoAccountDescription")}</p>
      <a
        href="https://easiest-cv.com/tutorial"
        target="_blank"
        rel="noopener noreferrer"
        className="text-nowrap text-blue-600 hover:underline"
      >
        {t("link")}
      </a>

      <p className="mt-1 text-sm">{t("demoLoginDescription")}</p>
      <span className="rounded-md border bg-[#f8f9fa] p-1">
        <p className="font-mono text-sm text-gray-700">{t("demoId")}</p>
        <p className="font-mono text-sm text-gray-700">{t("demoPW")}</p>
      </span>
    </div>
  );
}

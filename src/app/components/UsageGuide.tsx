import { useTranslations } from "next-intl";

export default function UsageGuide() {
  const t = useTranslations("usageGuide");

  return (
    <div className="flex flex-col gap-1">
      <h5 className="text-lg font-bold">{t("try")}</h5>
      <span className="inline-flex items-center gap-1">
        <p className="text-nowrap text-sm">{t("checkOut")}</p>
        <a
          href="https://easiest-cv.com/tutorial"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nowrap text-sm text-blue-500 hover:underline"
        >
          {t("professorCV")}
        </a>
      </span>
      <p className="text-sm">{t("or")}</p>
      <p className="text-sm">{t("use")}</p>
      <span className="rounded-md border bg-[#f8f9fa] p-1">
        <p className="font-mono text-sm text-gray-700">{t("demoId")}</p>
        <p className="font-mono text-sm text-gray-700">{t("demoPW")}</p>
      </span>
    </div>
  );
}

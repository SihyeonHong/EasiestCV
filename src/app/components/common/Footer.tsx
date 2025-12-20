import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("support");

  return (
    <div className="my-7 w-full">
      <hr className="mb-3 border-gray-600" />
      <div className="flex flex-col gap-1 pr-3">
        <p className="text-right text-xs text-gray-600">
          © 2023-{currentYear} Easiest CV
        </p>
        <Link
          href="/support"
          className="text-right text-xs text-gray-600 underline"
        >
          {t("footerLink")}
        </Link>
        <p className="text-right text-xs text-gray-600">
          {t("footerDescription")}
        </p>
      </div>
    </div>
  );
}

import Button from "@/app/components/common/Button";
import { getTranslations } from "next-intl/server";

interface HeaderProps {
  params: {
    locale: string;
    userid: string;
  };
}

export default async function Header({ params }: HeaderProps) {
  const t = await getTranslations("button");
  const newLocale = params.locale === "en" ? "ko" : "en";

  return (
    <div className="flex w-full justify-end">
      <Button
        variant="secondary"
        role="link"
        href={`/${newLocale}/${params.userid}`}
      >
        {t("switchLanguage")}
      </Button>
      <Button variant="primary" role="link" href="/">
        {t("loginOrSignup")}
      </Button>
    </div>
  );
}

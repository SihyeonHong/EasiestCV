import { getTranslations } from "next-intl/server";

export default async function NoUserPage() {
  const t = await getTranslations("message");

  return <h2 className="text-center text-2xl font-medium">{t("noUser")}</h2>;
}

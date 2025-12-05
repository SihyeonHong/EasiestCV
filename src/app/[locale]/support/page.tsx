import { getTranslations } from "next-intl/server";

import Title from "@/app/components/common/Title";
import Contact from "@/app/components/support/contact";
import InProgress from "@/app/components/support/in-progress";
import InfoCard from "@/app/components/support/infoCard";
// import NoticeSummary from "@/app/components/support/noticeSummary";
import SupportCard from "@/app/components/support/supportCard";
import SupportContainer from "@/app/components/support/supportContainer";

export default async function Page() {
  const t = await getTranslations("support");

  return (
    <div className="flex flex-col items-center">
      <Title title={t("title")} />

      <SupportContainer>
        <SupportCard title={t("ingTitle")}>
          <InProgress />
        </SupportCard>
        <SupportCard title={t("contactTitle")}>
          <Contact />
        </SupportCard>
        <SupportCard title={t("infoTitle")}>
          <InfoCard />
        </SupportCard>
      </SupportContainer>
    </div>
  );
}

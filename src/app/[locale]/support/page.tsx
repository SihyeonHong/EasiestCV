import { getTranslations } from "next-intl/server";

import Title from "@/app/components/common/Title";
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
        {/* <SupportCard link="notice" title="공지사항">
          <NoticeSummary />
        </SupportCard> */}
        <SupportCard title={t("infoTitle")}>
          <InfoCard />
        </SupportCard>
        {/* <SupportCard link="qna" title="문의게시판">
          <p>추가예정</p>
        </SupportCard> */}
      </SupportContainer>
    </div>
  );
}

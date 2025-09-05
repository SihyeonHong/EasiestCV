import Title from "@/app/components/common/Title";
import InfoSummary from "@/app/components/support/infoSummary";
import NoticeSummary from "@/app/components/support/noticeSummary";
import SupportCard from "@/app/components/support/supportCard";
import SupportContainer from "@/app/components/support/supportContainer";

export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <Title title="지원 센터" />

      <SupportContainer>
        <SupportCard link="notice" title="공지사항">
          <NoticeSummary />
        </SupportCard>
        <SupportCard link="info" title="운영자 정보">
          <InfoSummary />
        </SupportCard>
        <SupportCard link="qna" title="문의게시판">
          <p>추가예정</p>
        </SupportCard>
      </SupportContainer>
    </div>
  );
}

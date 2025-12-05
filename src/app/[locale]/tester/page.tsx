import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import LoadingPage from "@/app/components/LoadingPage";

export default function Tester() {
  return (
    <div>
      <Header />
      <Title title="테스트용 화면입니다" />
      <LoadingPage />
      <Footer />
    </div>
  );
}

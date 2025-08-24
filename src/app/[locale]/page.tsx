import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import InitPage from "@/app/components/InitPage";

export default function page() {
  return (
    <div className="flex flex-col items-center">
      <Header type="root" />
      <Title />
      <InitPage />
      <Footer />
    </div>
  );
}

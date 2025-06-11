import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import PublicContainer from "@/app/components/public/PublicContainer";

interface Props {
  params: {
    locale: string;
    userid: string;
  };
}

export default function Page({ params }: Props) {
  return (
    <div className="flex flex-col items-center">
      <Header params={params} />
      <PublicContainer userid={params.userid} />
      <Footer />
    </div>
  );
}

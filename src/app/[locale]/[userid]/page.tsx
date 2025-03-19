import PublicContainer from "@/app/components/public/PublicContainer";
import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";

interface Props {
  params: {
    locale: string;
    userid: string;
  };
}

export default function Page({ params }: Props) {
  return (
    <div className="flex flex-col items-center p-0">
      <Header params={params} />
      <PublicContainer userid={params.userid} />
      <Footer />
    </div>
  );
}

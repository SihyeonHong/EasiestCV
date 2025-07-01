import { Suspense } from "react";

import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import LoadingPage from "@/app/components/LoadingPage";
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
      <Suspense fallback={<LoadingPage />}>
        <PublicContainer userid={params.userid} />
      </Suspense>
      <Footer />
    </div>
  );
}

import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import InitPage from "@/app/components/InitPage";

interface Props {
  params: {
    locale: string;
    userid: string;
  };
}

export default function page({ params }: Props) {
  return (
    <div className="flex flex-col items-center">
      <Header params={params} />
      <Title />
      <InitPage />
    </div>
  );
}

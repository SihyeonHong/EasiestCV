import Header from "@/app/components/common/Header";
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
      <h1 className="mx-auto my-14 cursor-default text-center text-4xl font-bold">
        Easiest CV
      </h1>
      <InitPage />
    </div>
  );
}

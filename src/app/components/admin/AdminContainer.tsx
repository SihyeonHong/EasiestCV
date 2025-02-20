import Header from "@/app/components/common/Header";

interface Props {
  params: {
    locale: string;
    userid: string;
  };
}

export default function AdminContainer({ params }: Props) {
  return (
    <div>
      <Header params={params} isAdmin={true} />
    </div>
  );
}

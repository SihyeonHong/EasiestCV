import NonAdminLayout from "@/app/components/non-admin/NonAdminLayout";
import Header from "@/app/components/common/Header";

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
      <NonAdminLayout userid={params.userid} />
    </div>
  );
}

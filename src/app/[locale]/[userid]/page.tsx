import NonAdminLayout from "@/app/components/non-admin/NonAdminLayout";
import Header from "@/app/components/common/Header";

interface Props {
  params: {
    userid: string;
  };
}

export default function Page({ params }: Props) {
  return (
    <div className="flex flex-col items-center p-0">
      <Header />
      <NonAdminLayout userid={params.userid} />
    </div>
  );
}

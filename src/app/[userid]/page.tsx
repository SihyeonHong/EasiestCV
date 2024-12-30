import NonAdminLayout from "@/app/components/non-admin/NonAdminLayout";

interface Props {
  params: {
    userid: string;
  };
}

export default function Page({ params }: Props) {
  return <NonAdminLayout userid={params.userid} />;
}

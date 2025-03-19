import AdminContainer from "@/app/components/admin/AdminContainer";
import RequireAuth from "@/app/components/RequireAuthPage";

interface Props {
  params: {
    locale: string;
    userid: string;
  };
}

export default function Page({ params }: Props) {
  return (
    <RequireAuth url={params.userid}>
      <AdminContainer params={params} />
    </RequireAuth>
  );
}

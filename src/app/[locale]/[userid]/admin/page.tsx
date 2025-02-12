import AdminLayout from "@/app/components/admin/AdminLayout";
import RequireAuth from "@/app/components/RequireAuthPage";

interface Props {
  params: {
    userid: string;
  };
}

export default function Page({ params }: Props) {
  return (
    <RequireAuth url={params.userid}>
      <AdminLayout userid={params.userid} />
    </RequireAuth>
  );
}

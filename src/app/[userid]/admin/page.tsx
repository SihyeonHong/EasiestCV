import { GetServerSidePropsContext } from "next";
import AdminLayout from "./AdminLayout";
import RequireAuth from "./RequireAuth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      // params will contain the pid parameter
      params: context.params ? context.params : { userid: "No User" },
    },
  };
}

export default function Page({ params }: { params: { userid: string } }) {
  return (
    <RequireAuth url={params.userid}>
      <AdminLayout userid={params.userid} />
    </RequireAuth>
  );
}

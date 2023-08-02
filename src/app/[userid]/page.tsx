import { GetServerSidePropsContext } from "next";
import NonAdminLayout from "./NonAdminLayout";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      // params will contain the pid parameter
      params: context.params ? context.params : { userid: "No User" },
    },
  };
}

export default function Page({ params }: { params: { userid: string } }) {
  return <NonAdminLayout userid={params.userid} />;
}

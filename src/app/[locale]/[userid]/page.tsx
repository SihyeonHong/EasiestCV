import { redirect } from "next/navigation";

interface Props {
  params: {
    locale: string;
    userid: string;
  };
}

export default async function Page({ params }: Props) {
  redirect(`/${params.locale}/${params.userid}/home`);
}

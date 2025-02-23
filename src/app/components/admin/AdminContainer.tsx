"use client";

import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import { useUser } from "@/hooks/useUser";

interface Props {
  params: {
    locale: string;
    userid: string;
  };
}

export default function AdminContainer({ params }: Props) {
  const { user, isLoading, isError } = useUser(params.userid);

  return (
    <div>
      <Header params={params} isAdmin={true} />
      <Title title={user?.username || params.userid} />
    </div>
  );
}

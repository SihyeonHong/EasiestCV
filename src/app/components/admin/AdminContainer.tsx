"use client";

import AdminTabs from "@/app/components/admin/AdminTabs";
import Footer from "@/app/components/common/Footer";
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
  const { user } = useUser(params.userid);

  return (
    <div>
      <Header params={params} isAdmin={true} />
      <Title title={user?.username || params.userid} />
      <AdminTabs userid={params.userid} />
      <Footer />
    </div>
  );
}

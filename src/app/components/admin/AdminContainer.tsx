"use client";

import { useEffect } from "react";

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

  // 로그인 시간 측정
  useEffect(() => {
    const end = performance.now();
    const start = sessionStorage.getItem("login_start");

    if (start && end) {
      const time = Number(end) - Number(start);
      console.log("Login Time: ", time);
    }
  }, []);

  return (
    <div>
      <Header userid={params.userid || ""} isAdmin={true} />
      <Title title={user?.username || params.userid} />
      <AdminTabs userid={params.userid} />
      <Footer />
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";

import AdminTabs from "@/app/components/admin/AdminTabs";
import CannotAccess from "@/app/components/admin/CannotAccess";
import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import LoadingPage from "@/app/components/LoadingPage";
import useAuth from "@/hooks/useAuth";
import { useUserInfo } from "@/hooks/useUserInfo";

export default function Page() {
  const userid = useParams().userid as string;

  const { me, isLoggingOut } = useAuth();
  const { user } = useUserInfo(userid);

  if (isLoggingOut) return <LoadingPage />;

  if (!me || me.userid !== userid) {
    return <CannotAccess />;
  }

  return (
    <div>
      <Header type="admin" />
      <Title title={user ? user.username : userid} />
      <AdminTabs userid={userid} />
      <Footer />
    </div>
  );
}

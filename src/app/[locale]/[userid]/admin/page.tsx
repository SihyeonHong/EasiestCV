"use client";

import { useParams } from "next/navigation";

import AdminTabs from "@/app/components/admin/AdminTabs";
import CannotAccess from "@/app/components/admin/CannotAccess";
import LoadingPage from "@/app/components/LoadingPage";
import useAuth from "@/hooks/useAuth";

export default function Page() {
  const userid = useParams().userid as string;

  const { me, isLoggingOut } = useAuth();

  if (isLoggingOut) return <LoadingPage />;

  if (!me || me.userid !== userid) {
    return <CannotAccess />;
  }

  return (
    <div>
      <AdminTabs userid={userid} />
    </div>
  );
}

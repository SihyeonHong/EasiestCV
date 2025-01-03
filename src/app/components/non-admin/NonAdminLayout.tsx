"use client";

import NonAdminPage from "@/app/components/non-admin/NonAdminPage";
import NoUserPage from "@/app/components/NoUserPage";
import LoadingPage from "@/app/components/LoadingPage";
import { useUser } from "@/hooks/useUser";

export default function NonAdminLayout({ userid }: { userid: string }) {
  const { user, isLoading, isError } = useUser(userid);

  return (
    <div className="">
      <h1 className="mx-auto my-10 cursor-default text-center font-semibold">
        {user?.username ? user.username.toUpperCase() : userid.toUpperCase()}
      </h1>
      {isLoading ? (
        <LoadingPage />
      ) : isError || !user ? (
        <NoUserPage />
      ) : (
        <NonAdminPage userid={userid} />
      )}
    </div>
  );
}

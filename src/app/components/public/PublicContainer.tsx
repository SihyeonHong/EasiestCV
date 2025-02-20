"use client";

import { useUser } from "@/hooks/useUser";
import NoUserPage from "@/app/components/NoUserPage";
import LoadingPage from "@/app/components/LoadingPage";
import PublicTabs from "@/app/components/public/PublicTabs";

export default function PublicContainer({ userid }: { userid: string }) {
  const { user, isLoading, isError } = useUser(userid);

  return (
    <div className="">
      <h1 className="mx-auto my-10 cursor-default text-center text-4xl font-semibold">
        {user?.username ? user.username.toUpperCase() : userid.toUpperCase()}
      </h1>
      {isLoading ? (
        <LoadingPage />
      ) : isError || !user ? (
        <NoUserPage />
      ) : (
        <PublicTabs userid={userid} />
      )}
    </div>
  );
}

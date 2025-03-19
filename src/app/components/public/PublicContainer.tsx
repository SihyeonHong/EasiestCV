"use client";

import { useUser } from "@/hooks/useUser";
import NoUserPage from "@/app/components/NoUserPage";
import LoadingPage from "@/app/components/LoadingPage";
import PublicTabs from "@/app/components/public/PublicTabs";
import Title from "@/app/components/common/Title";

export default function PublicContainer({ userid }: { userid: string }) {
  const { user, isLoading, isError } = useUser(userid);

  return (
    <div className="">
      <Title title={user?.username || userid} />
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

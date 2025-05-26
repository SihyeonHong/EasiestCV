"use client";

import Title from "@/app/components/common/Title";
import LoadingPage from "@/app/components/LoadingPage";
import NoUserPage from "@/app/components/NoUserPage";
import PublicTabs from "@/app/components/public/PublicTabs";
import { useUser } from "@/hooks/useUser";

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

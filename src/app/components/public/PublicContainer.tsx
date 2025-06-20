"use client";

import Title from "@/app/components/common/Title";
import LoadingPage from "@/app/components/LoadingPage";
import NoUserPage from "@/app/components/NoUserPage";
import PublicTabs from "@/app/components/public/PublicTabs";
import { useUser } from "@/hooks/useUser";

export default function PublicContainer({ userid }: { userid: string }) {
  const { user, isUserLoading, isUserError } = useUser(userid);

  return (
    <div className="flex w-full justify-center px-4">
      <div className="w-full max-w-[1024px]">
        <Title title={user?.username || userid} />
        {isUserLoading ? (
          <LoadingPage />
        ) : isUserError || !user ? (
          <NoUserPage />
        ) : (
          <PublicTabs userid={userid} />
        )}
      </div>
    </div>
  );
}

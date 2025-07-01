import { isAxiosError } from "axios";

import Title from "@/app/components/common/Title";
import NoUserPage from "@/app/components/NoUserPage";
import PublicTabs from "@/app/components/public/PublicTabs";
import { User } from "@/models/user.model";
import { get } from "@/util/http";

export default async function PublicContainer({ userid }: { userid: string }) {
  const user = await getUser(userid);

  return (
    <div className="flex w-full justify-center px-4">
      <div className="w-full max-w-[1024px]">
        <Title title={user?.username || userid} />
        {!user ? <NoUserPage /> : <PublicTabs userid={userid} />}
      </div>
    </div>
  );
}

async function getUser(userid: string): Promise<User | null> {
  try {
    const response = await get<User>(`/users/user?userid=${userid}`);
    if (!response) {
      return null;
    }
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      console.warn("사용자 없음 (404)");
      return null;
    }
    console.error("사용자 정보 가져오기 실패:", error);
    return null;
  }
}

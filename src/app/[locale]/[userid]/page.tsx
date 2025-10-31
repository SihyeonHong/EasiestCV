import { isAxiosError } from "axios";
import { Metadata } from "next";

import LogoutHandler from "@/app/components/admin/LogoutHandler";
import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import NoUserPage from "@/app/components/NoUserPage";
import PublicTabs from "@/app/components/public/PublicTabs";
import { User } from "@/types/user-account";
import { get } from "@/utils/http";

interface Props {
  params: {
    locale: string;
    userid: string;
  };
}

export default async function Page({ params }: Props) {
  const user = await getUser(params.userid);

  return (
    <div className="flex flex-col items-center">
      <LogoutHandler />
      <Header type="public" />
      <div className="flex w-full justify-center">
        <div className="w-full max-w-[1024px]">
          <Title title={user ? user.username : params.userid} />
          {!user ? <NoUserPage /> : <PublicTabs userid={params.userid} />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUser(params.userid);

  // 유저가 없는 경우, 메타데이터를 기본값으로 반환
  if (!user) {
    return {
      title: "Easiest CV - User Not Found",
      description: "The requested user profile does not exist.",
      robots: "noindex, nofollow",
    };
  }

  return {
    title: `${user.username}'s CV - Easiest CV`,
    description: `${user.username}'s CV`,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
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

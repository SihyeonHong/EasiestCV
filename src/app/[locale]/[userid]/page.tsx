import { isAxiosError } from "axios";
import { Metadata } from "next";

import LogoutHandler from "@/app/components/admin/LogoutHandler";
import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import NoUserPage from "@/app/components/NoUserPage";
import PublicTabs from "@/app/components/public/PublicTabs";
import { User } from "@/types/user-account";
import { UserSiteMeta } from "@/types/user-data";
import { get, put } from "@/utils/http";
import makeUserSiteMeta from "@/utils/makeUserSiteMeta";

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

  if (!user) {
    return {
      title: "Easiest CV - User Not Found",
      description: "The requested user profile does not exist.",
      robots: ROBOTS_CONFIG.noIndex,
    };
  }

  const meta = await getUserSiteMeta(params.userid);
  const needsUpdate = !meta || !meta.title || !meta.description;

  if (needsUpdate) {
    const newMeta = makeUserSiteMeta(
      params.userid,
      user.username,
      meta?.title,
      meta?.description,
    );
    await upsertUserSiteMeta(
      newMeta.userid,
      newMeta.title,
      newMeta.description,
    );

    return {
      title: newMeta.title,
      description: newMeta.description,
      robots: ROBOTS_CONFIG.default,
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    robots: ROBOTS_CONFIG.default,
  };
}

async function getUser(userid: string): Promise<User | null> {
  try {
    const response = await get<User>(`/users/user?userid=${userid}`);
    return response || null;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      console.warn("사용자 없음 (404)");
      return null;
    }
    console.error("사용자 정보 가져오기 실패:", error);
    return null;
  }
}

async function getUserSiteMeta(userid: string): Promise<UserSiteMeta | null> {
  try {
    const response = await get<UserSiteMeta>(`/meta?userid=${userid}`);
    return response || null;
  } catch (error) {
    console.error("메타데이터 가져오기 실패:", error);
    return null;
  }
}

async function upsertUserSiteMeta(
  userid: string,
  title: string,
  description: string,
): Promise<void> {
  try {
    await put<void>(`/meta`, { userid, title, description });
  } catch (error) {
    console.error("메타데이터 업데이트 실패:", error);
  }
}

const ROBOTS_CONFIG = {
  noIndex: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  default: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

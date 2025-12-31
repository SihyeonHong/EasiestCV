import { Metadata } from "next";

import LogoutHandler from "@/app/components/admin/LogoutHandler";
import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import NoUserPage from "@/app/components/NoUserPage";
import { UserSiteMeta } from "@/types/user-data";
import { get, put } from "@/utils/http";
import makeUserSiteMeta from "@/utils/makeUserSiteMeta";

import { getUser } from "./_lib/queries";

interface Props {
  children: React.ReactNode;
  params: {
    userid: string;
  };
}

export default async function Layout({ children, params }: Props) {
  const { userid } = params;
  const user = await getUser(userid);

  return (
    <div className="flex flex-col items-center">
      <LogoutHandler />
      <Header />
      <div className="flex w-full justify-center">
        <div className="w-full max-w-body">
          <Title title={user ? user.username : userid} />
          {!user ? <NoUserPage /> : children}
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

async function getUserSiteMeta(userid: string): Promise<UserSiteMeta | null> {
  try {
    const response = await get<UserSiteMeta>(`/meta?userid=${userid}`);
    return response || null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    console.error("메타데이터 가져오기 실패");
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    console.error("메타데이터 업데이트 실패");
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

import { Metadata } from "next";
import dynamic from "next/dynamic";

import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import NoUserPage from "@/app/components/NoUserPage";
import makeUserSiteMeta from "@/utils/makeUserSiteMeta";

import { getUser, getUserSiteMeta, upsertUserSiteMeta } from "./_lib/queries";

interface Props {
  children: React.ReactNode;
  params: {
    userid: string;
  };
}

const LogoutHandler = dynamic(
  () => import("@/app/components/admin/LogoutHandler"),
  { ssr: false },
);

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
  // trim()을 추가해서 공백만 있는 경우도 체크
  const needsUpdate = !meta || !meta.title?.trim() || !meta.description?.trim();

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

  const defaultMeta = makeUserSiteMeta(params.userid, user.username);
  return {
    title: meta.title?.trim() || defaultMeta.title,
    description: meta.description?.trim() || defaultMeta.description,
    robots: ROBOTS_CONFIG.default,
  };
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

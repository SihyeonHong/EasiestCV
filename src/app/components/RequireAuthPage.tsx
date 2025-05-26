"use client";

import Link from "next/link";

import LoadingPage from "@/app/components/LoadingPage";
import useAuth from "@/hooks/useAuth";

interface Props {
  url: string;
  children: React.ReactNode;
}

export default function RequireAuth({ url, children }: Props) {
  const { me, isLoading } = useAuth();

  if (isLoading) return <LoadingPage />;

  // 비로그인 상태이거나 다른 사용자의 admin 페이지 접근 시도
  if (!me || me.userid !== url) {
    return (
      <div>
        You cannot access this page without logging in.
        <Link href="/">Go to Log in Page</Link>
      </div>
    );
  }

  return children;
}

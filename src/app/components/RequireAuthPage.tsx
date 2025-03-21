"use client";

import Link from "next/link";

import useAuth from "@/hooks/useAuth";

import { LoadingIcon } from "./LoadingIcon";

export default function RequireAuth({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  const { me, isLoading } = useAuth();

  if (isLoading) return <LoadingIcon />;

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

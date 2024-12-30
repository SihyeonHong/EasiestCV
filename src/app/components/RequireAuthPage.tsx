"use client";

import useAuth from "@/hooks/useAuth";
import Link from "next/link";

export default function RequireAuth({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  // 로딩 중에는 아무것도 보여주지 않음
  if (isLoading) return null;

  // 비로그인 상태이거나 다른 사용자의 admin 페이지 접근 시도
  if (!user || user.userid !== url) {
    return (
      <div>
        You cannot access this page without logging in.
        <Link href="/">Go to Log in Page</Link>
      </div>
    );
  }

  return children;
}

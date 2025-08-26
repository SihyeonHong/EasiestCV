"use client";

import { useEffect } from "react";

import useAuth from "@/hooks/useAuth";

export default function LogoutHandler() {
  const { logout } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logout") === "true") {
      logout();
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [logout]);

  // 로그인 시간 측정
  useEffect(() => {
    const end = performance.now();
    const start = sessionStorage.getItem("login_start");

    if (start && end) {
      const time = Number(end) - Number(start);
      console.log("Login Time: ", time);
    }
  }, []);

  return null; // UI 렌더링 없음
}

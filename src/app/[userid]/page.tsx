"use client";

import { usePathname } from "next/navigation";
import NonAdminLayout from "../components/non-admin/NonAdminLayout";

export default function Page() {
  const pathname = usePathname();
  let userid = "";
  if (pathname) {
    userid = pathname.split("/")[1];
    // userid로 userinfo 가져와서 redux에 등록
  }

  return <NonAdminLayout userid={userid} />;
}

"use client";

import { usePathname } from "next/navigation";
import NonAdminLayout from "../components/non-admin/NonAdminLayout";

export default function Page() {
  const pathname = usePathname();
  let userid = "";
  if (pathname) {
    userid = pathname.split("/")[1];
  }

  return <NonAdminLayout userid={userid} />;
}

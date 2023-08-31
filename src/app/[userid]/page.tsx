"use client";

import { usePathname } from "next/navigation";
import NonAdminLayout from "./NonAdminLayout";

export default function Page({ params }: { params: { userid: string } }) {
  const pathname = usePathname();
  let userid = "";
  if (pathname) {
    userid = pathname.split("/")[1];
  }
  return <NonAdminLayout userid={userid} />;
}

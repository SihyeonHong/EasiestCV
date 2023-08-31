"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "./AdminLayout";
import RequireAuth from "./RequireAuth";

export default function Page() {
  const pathname = usePathname();
  let userid = "";
  if (pathname) {
    userid = pathname.split("/")[1];
  }
  return (
    <RequireAuth url={userid}>
      <AdminLayout userid={userid} />
    </RequireAuth>
  );
}

"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "../../components/admin/AdminLayout";
import RequireAuth from "../../components/RequireAuthPage";

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

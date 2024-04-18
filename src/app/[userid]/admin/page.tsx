"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "@/pages/components/admin/AdminLayout";
import RequireAuth from "@/pages/components/RequireAuthPage";

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

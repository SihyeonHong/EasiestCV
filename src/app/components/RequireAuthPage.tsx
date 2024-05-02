"use client";

import Link from "next/link";

export default function RequireAuth({
  url,
  children,
}: {
  url: string;
  children: any;
}) {
  const token = sessionStorage.getItem("token");
  const userid = sessionStorage.getItem("userid");

  if (!token || url !== userid) {
    return (
      <div>
        You cannot access this page without logging in.
        <Link href="/">Go to Log in Page</Link>
      </div>
    );
  }

  // if token and userid are valid, render the children
  return children;
}

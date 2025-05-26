"use client";

import { useTabs } from "@/hooks/useTabs";

interface Props {
  userid: string;
  tid: number;
}

export default function NonAdminTab({ userid, tid }: Props) {
  const { tabs } = useTabs(userid);
  const content = tabs.find((tab) => tab.tid === tid)?.contents;

  return (
    <>{content && <div dangerouslySetInnerHTML={{ __html: content }}></div>}</>
  );
}

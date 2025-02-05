"use client";

import { useTabs } from "@/hooks/useTabs";

interface Props {
  userid: string;
  tid: number;
}

export default function NonAdminTab({ userid, tid }: Props) {
  const { tabs } = useTabs(userid);

  return (
    <>
      {tabs.find((tab) => tab.tid === tid)?.contents && (
        <div
          dangerouslySetInnerHTML={{
            __html: tabs.find((tab) => tab.tid === tid)?.contents!,
          }}
        ></div>
      )}
    </>
  );
}

"use client";

import { useTabs } from "@/hooks/useTabs";
import { Card, CardContent } from "@/app/components/common/Card";

interface Props {
  userid: string;
  tid: number;
}

export default function PublicContents({ userid, tid }: Props) {
  const { tabs } = useTabs(userid);

  return (
    <Card className="mx-2 md:mx-8 lg:w-[1024px]">
      <CardContent className="prose max-w-none dark:prose-invert">
        {tabs.find((tab) => tab.tid === tid)?.contents && (
          <div
            dangerouslySetInnerHTML={{
              __html: tabs.find((tab) => tab.tid === tid)?.contents!,
            }}
          ></div>
        )}
      </CardContent>
    </Card>
  );
}

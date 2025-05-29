"use client";

import { Card, CardContent } from "@/app/components/common/Card";
import { useTabs } from "@/hooks/useTabs";

interface Props {
  userid: string;
  tid: number;
}

export default function PublicContents({ userid, tid }: Props) {
  const { tabs } = useTabs(userid);
  const content = tabs.find((tab) => tab.tid === tid)?.contents;

  return (
    <Card className="mx-2 md:mx-8 lg:w-[1024px]">
      <CardContent className="prose max-w-none dark:prose-invert">
        {content && (
          <div
            className="ql-editor prose-headings:!text-inherit prose-p:!text-inherit"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          ></div>
        )}
      </CardContent>
    </Card>
  );
}

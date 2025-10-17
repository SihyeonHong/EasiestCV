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
    <Card className="w-full">
      <CardContent className="w-full">
        {content && (
          <div
            className="tiptap"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

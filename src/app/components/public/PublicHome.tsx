import Image from "next/image";

import { Card, CardContent } from "@/app/components/common/Card";
import LoadingPage from "@/app/components/LoadingPage";
import { HomeData } from "@/models/home.model";

interface Props {
  homeData: HomeData;
}

export default function PublicHome({ homeData }: Props) {
  if (!homeData) return <LoadingPage />;

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-5 md:flex-row md:items-start">
        {homeData.img && (
          <CardContent className="flex-1">
            <Image
              src={homeData.img}
              alt="profile-img"
              width={0}
              height={0}
              sizes="100%"
              className="h-auto w-full rounded-lg object-cover"
              priority
            />
          </CardContent>
        )}
        <CardContent
          className="ql-editor prose max-w-none flex-1 dark:prose-invert prose-headings:!text-inherit prose-p:!text-inherit"
          dangerouslySetInnerHTML={{ __html: homeData.intro ?? "" }}
        />
      </CardContent>
    </Card>
  );
}

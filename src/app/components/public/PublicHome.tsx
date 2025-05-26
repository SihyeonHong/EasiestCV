import Image from "next/image";

import { HomeData } from "@/models/home.model";

import { Card, CardContent } from "../common/Card";
import LoadingPage from "../LoadingPage";

interface Props {
  homeData: HomeData;
}

export default function PublicHome({ homeData }: Props) {
  if (!homeData) return <LoadingPage />;

  return (
    <Card className="mx-2 md:mx-8 lg:w-[1024px]">
      <CardContent className="flex flex-col items-center justify-center gap-5 md:flex-row">
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
          className="prose max-w-none flex-1 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: homeData.intro ?? "" }}
        />
      </CardContent>
    </Card>
  );
}

import { HomeData } from "@/models/home.model";
import LoadingPage from "../LoadingPage";
import Image from "next/image";
import { Card, CardContent } from "../common/Card";

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
          className="prose dark:prose-invert max-w-none flex-1"
          dangerouslySetInnerHTML={{ __html: homeData.intro ?? "" }}
        />
      </CardContent>
    </Card>
  );
}

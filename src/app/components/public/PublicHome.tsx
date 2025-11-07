import Image from "next/image";

import { Card, CardContent } from "@/app/components/common/Card";
import LoadingPage from "@/app/components/LoadingPage";
import { UserHome } from "@/types/user-data";
import { get } from "@/utils/http";

interface Props {
  userid: string;
}

export default async function PublicHome({ userid }: Props) {
  const home = await getHome(userid);
  if (!home) return <LoadingPage />;

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-5 md:flex-row md:items-start">
        <CardContent className="flex-1 p-0">
          <Image
            src={home.img_url ?? "/icon.png"}
            alt="home-img"
            width={0}
            height={0}
            sizes="100%"
            className="h-auto w-full rounded-lg object-cover"
            priority
          />
        </CardContent>

        <CardContent
          className="tiptap max-w-none flex-1 p-0"
          dangerouslySetInnerHTML={{ __html: home.intro_html ?? "" }}
        />
      </CardContent>
    </Card>
  );
}

async function getHome(userid: string): Promise<UserHome | null> {
  try {
    return (await get<UserHome>(`/home?userid=${userid}`)) ?? null;
  } catch (error) {
    console.error("getHome 실패:", error);
    return null;
  }
}

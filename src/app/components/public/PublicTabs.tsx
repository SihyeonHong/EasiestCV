import { getTranslations } from "next-intl/server";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import PublicContents from "@/app/components/public/PublicContents";
import PublicFile from "@/app/components/public/PublicFile";
import PublicHome from "@/app/components/public/PublicHome";
import { HomeData } from "@/models/home.model";
import { Tab } from "@/models/tab.model";
import { get } from "@/utils/http";

interface Props {
  userid: string;
}

export default async function PublicTabs({ userid }: Props) {
  const tFile = await getTranslations("file");

  const homeData = await getHomeData(userid);
  const tabs = await getTabs(userid);

  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        {tabs &&
          tabs.map((tab) => (
            <TabsTrigger key={tab.tid} value={tab.tname}>
              {tab.tname}
            </TabsTrigger>
          ))}
        <TabsTrigger value="file">{tFile("file")}</TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        {homeData && <PublicHome homeData={homeData} />}
      </TabsContent>
      {tabs &&
        tabs.map((tab) => (
          <TabsContent key={tab.tid} value={tab.tname}>
            <PublicContents userid={userid} tid={tab.tid} />
          </TabsContent>
        ))}
      <TabsContent value="file">
        <PublicFile pdf={homeData?.pdf} />
      </TabsContent>
    </Tabs>
  );
}

async function getHomeData(userid: string): Promise<HomeData | null> {
  try {
    const response = await get<HomeData>(`/home?userid=${userid}`);
    if (!response) {
      return null;
    }
    return response;
  } catch (error) {
    console.error("getHomeData 실패:", error);
    return null;
  }
}

async function getTabs(userid: string): Promise<Tab[] | null> {
  try {
    const response = await get<Tab[]>(`/tabs?userid=${userid}`);
    if (!response) {
      return null;
    }
    return response;
  } catch (error) {
    console.error("getTabs 실패:", error);
    return null;
  }
}

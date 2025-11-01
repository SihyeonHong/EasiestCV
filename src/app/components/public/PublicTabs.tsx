import { getTranslations } from "next-intl/server";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import PublicContents from "@/app/components/public/PublicContents";
import PublicDocuments from "@/app/components/public/PublicDocuments";
import PublicHome from "@/app/components/public/PublicHome";
import { Tab } from "@/types/tab";
import { UserHome } from "@/types/user-data";
import { get } from "@/utils/http";

interface Props {
  userid: string;
}

export default async function PublicTabs({ userid }: Props) {
  const t = await getTranslations("documents");

  const home = await getHome(userid);
  const tabs = await getTabs(userid);
  const documents = await getDocuments(userid);

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
        {documents.length && (
          <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="home">
        {home && <PublicHome home={home} />}
      </TabsContent>
      {tabs &&
        tabs.map((tab) => (
          <TabsContent key={tab.tid} value={tab.tname}>
            <PublicContents content={tab.contents ?? ""} />
          </TabsContent>
        ))}
      <TabsContent value="documents">
        {documents.length && <PublicDocuments documents={documents} />}
      </TabsContent>
    </Tabs>
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

async function getDocuments(userid: string): Promise<string[]> {
  try {
    return (await get<string[]>(`/documents?userid=${userid}`)) ?? [];
  } catch (error) {
    console.error("getDocuments 실패:", error);
    return [];
  }
}

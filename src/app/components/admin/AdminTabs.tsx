import { useTranslations } from "next-intl";

import AdminHome from "@/app/components/admin/AdminHome";
import Editor from "@/app/components/admin/Editor";
import Settings from "@/app/components/admin/Settings";
import TabManager from "@/app/components/admin/TabManager";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import { useTabs } from "@/hooks/useTabs";

interface Props {
  userid: string;
}

export default function AdminTabs({ userid }: Props) {
  const { tabs } = useTabs(userid);
  const t = useTranslations("settings");

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
        <TabsTrigger value="settings">{t("title")}</TabsTrigger>
        <TabManager userid={userid} />
      </TabsList>
      <TabsContent value="home">
        <AdminHome userid={userid} />
      </TabsContent>
      {tabs &&
        tabs.map((tab) => (
          <TabsContent key={tab.tid} value={tab.tname}>
            <Editor userid={userid} tid={tab.tid} />
          </TabsContent>
        ))}
      <TabsContent value="settings">
        <Settings userid={userid} />
      </TabsContent>
    </Tabs>
  );
}

import { SettingsIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import AdminHome from "@/app/components/admin/AdminHome";
import EditorContainer from "@/app/components/admin/EditorContainer";
import Settings from "@/app/components/admin/Settings";
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
      <TabsList className="shadow-sm">
        <TabsTrigger value="home">Home</TabsTrigger>
        {tabs &&
          tabs.map((tab) => (
            <TabsTrigger key={tab.tid} value={tab.tname}>
              {tab.tname}
            </TabsTrigger>
          ))}
        <TabsTrigger value="settings">
          <SettingsIcon className="mr-1 size-4" /> {t("title")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <AdminHome userid={userid} />
      </TabsContent>
      {tabs &&
        tabs.map((tab) => (
          <TabsContent key={tab.tid} value={tab.tname}>
            <EditorContainer userid={userid} tid={tab.tid} />
          </TabsContent>
        ))}
      <TabsContent value="settings">
        <Settings userid={userid} />
      </TabsContent>
    </Tabs>
  );
}

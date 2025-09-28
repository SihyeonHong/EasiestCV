import AdminHome from "@/app/components/admin/AdminHome";
import AdminPDF from "@/app/components/admin/AdminPDF";
import EditorContainer from "@/app/components/admin/EditorContainer";
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
        <TabsTrigger value="pdf">PDF</TabsTrigger>
        <TabManager userid={userid} />
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
      <TabsContent value="pdf">
        <AdminPDF userid={userid} />
      </TabsContent>
    </Tabs>
  );
}

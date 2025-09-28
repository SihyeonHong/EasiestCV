import TabManager from "@/app/components/admin/TabManager";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import TesterAdminEditor from "@/app/components/tester/TesterAdminEditor";

interface Props {
  userid: string;
}

export default function TesterAdminTabs({ userid }: Props) {
  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="tab1">tab1</TabsTrigger>
        <TabManager userid={userid} />
      </TabsList>
      <TabsContent value="tab1">
        <TesterAdminEditor userid={userid} tid={1} />
      </TabsContent>
    </Tabs>
  );
}

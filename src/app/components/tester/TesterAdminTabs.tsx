import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import TesterAdminEditor from "@/app/components/tester/TesterAdminEditor";
import TestSimpleEditor from "@/app/components/tester/TestSimpleEditor";

interface Props {
  userid: string;
}

export default function TesterAdminTabs({ userid }: Props) {
  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="tab1">tab1</TabsTrigger>
        <TabsTrigger value="tab2">tab2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <TesterAdminEditor userid={userid} tid={1} />
      </TabsContent>
      <TabsContent value="tab2">
        <TestSimpleEditor />
      </TabsContent>
    </Tabs>
  );
}

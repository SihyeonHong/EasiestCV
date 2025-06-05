import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import PublicContents from "@/app/components/public/PublicContents";
import PublicHome from "@/app/components/public/PublicHome";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";

interface Props {
  userid: string;
}

export default function PublicTabs({ userid }: Props) {
  const { tabs } = useTabs(userid);
  const { homeData } = useHome(userid);

  const openPDF = async () => {
    if (homeData && homeData.pdf) {
      window.open(homeData.pdf, "_blank");
    } else {
      alert("PDF 파일이 없습니다.");
    }
  };

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
        <TabsTrigger value="pdf" onClick={openPDF}>
          PDF
        </TabsTrigger>
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
    </Tabs>
  );
}

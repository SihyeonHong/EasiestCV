import PublicTabs from "@/app/components/public/PublicTabs";
import { Tab, TabListItem } from "@/types/tab";

import { getDocuments, getTabs } from "../_lib/queries";

interface Props {
  children: React.ReactNode;
  params: {
    userid: string;
    slug: string;
  };
}

export default async function Layout({ children, params }: Props) {
  const { userid } = params;
  const documents = await getDocuments(userid);
  const isDocumentsExists = documents.length > 0;

  const tabs = await getTabs(userid);
  const tabList: Record<number, TabListItem> =
    tabs?.reduce(
      (acc, tab) => {
        acc[tab.slug] = tab;
        return acc;
      },
      {} as Record<string, Tab>,
    ) ?? {};

  return (
    <div>
      <PublicTabs
        userid={userid}
        tabList={tabList}
        isDocumentsExists={isDocumentsExists}
      />
      {children}
    </div>
  );
}

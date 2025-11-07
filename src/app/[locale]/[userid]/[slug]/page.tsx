import { getTabs } from "@/app/[locale]/[userid]/_lib/queries";
import PublicContents from "@/app/components/public/PublicContents";
import PublicDocuments from "@/app/components/public/PublicDocuments";
import PublicHome from "@/app/components/public/PublicHome";

interface Props {
  params: {
    userid: string;
    slug: string;
  };
}

export default async function Page({ params }: Props) {
  const { userid, slug } = params;

  if (slug === "home") {
    return <PublicHome userid={userid} />;
  } else if (slug === "documents") {
    return <PublicDocuments userid={userid} />;
  } else {
    const tabs = await getTabs(userid);
    const content: string =
      tabs?.find((tab) => tab.slug === slug)?.contents ?? "";
    return <PublicContents content={content} />;
  }
}

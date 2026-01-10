import Image from "next/image";

import { getHome } from "@/app/[locale]/[userid]/_lib/queries";
import { Card, CardContent } from "@/app/components/common/Card";
import ErrorPage from "@/app/components/ErrorPage";
import LoadingPage from "@/app/components/LoadingPage";
import { sanitizeHtml } from "@/utils/sanitize";

interface Props {
  userid: string;
}

export default async function PublicHome({ userid }: Props) {
  try {
    const home = await getHome(userid);
    if (!home) return <LoadingPage />;

    const sanitizedIntro = sanitizeHtml(home.intro_html ?? "");

    return (
      <Card className="rounded-sm">
        <CardContent className="flex flex-col items-center justify-center gap-5 md:flex-row md:items-start">
          <div className="flex-1 p-2">
            <Image
              src={home.img_url ?? "/icon.png"}
              alt="home-img"
              width={0}
              height={0}
              sizes="100%"
              className="h-auto w-full rounded-lg object-cover"
              priority
            />
          </div>

          <div
            className="tiptap max-w-none flex-1 p-2"
            dangerouslySetInnerHTML={{ __html: sanitizedIntro }}
          />
        </CardContent>
      </Card>
    );
  } catch {
    return <ErrorPage msg="serverError" />;
  }
}

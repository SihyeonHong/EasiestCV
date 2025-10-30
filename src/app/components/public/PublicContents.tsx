import { Card, CardContent } from "@/app/components/common/Card";
import LoadingPage from "@/app/components/LoadingPage";

interface Props {
  content: string | null;
}

export default function PublicContents({ content }: Props) {
  if (!content) {
    return <LoadingPage />;
  }

  return (
    <Card className="w-full">
      <CardContent className="w-full">
        <div
          className="tiptap"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/app/components/common/Card";
import { sanitizeHtml } from "@/utils/sanitize";

interface Props {
  content: string;
}

export default function PublicContents({ content }: Props) {
  const sanitizedContent = sanitizeHtml(content);

  return (
    <Card className="w-full rounded-sm">
      <CardContent className="w-full">
        <div
          className="tiptap"
          dangerouslySetInnerHTML={{
            __html: sanitizedContent,
          }}
        />
      </CardContent>
    </Card>
  );
}

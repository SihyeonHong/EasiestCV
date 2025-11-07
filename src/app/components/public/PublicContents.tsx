import { Card, CardContent } from "@/app/components/common/Card";

interface Props {
  content: string;
}

export default function PublicContents({ content }: Props) {
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

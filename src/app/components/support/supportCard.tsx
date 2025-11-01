import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/common/Card";

interface SupportCardProps {
  link?: string; // 선택적 prop으로 변경
  title: string;
  children: React.ReactNode;
}

export default function SupportCard({
  link,
  title,
  children,
}: SupportCardProps) {
  const titleElement = <CardTitle className="text-nowrap">{title}</CardTitle>;

  return (
    <Card>
      <CardHeader>
        {link ? (
          <Link
            href={`/support/${link}`}
            className="flex items-center justify-between"
          >
            {titleElement}
            <div className="text-muted flex items-center gap-1 text-sm">
              <span className="mr-1 hidden text-nowrap sm:block">상세보기</span>
              <ArrowRight className="h-4 w-5 font-bold" />
            </div>
          </Link>
        ) : (
          titleElement
        )}
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}

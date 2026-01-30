import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/app/components/common/Card";

interface PresentCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: React.ReactNode;
  link?: {
    href: string;
    openInNewTab?: boolean;
  };
}

export default function PresentCard({
  imageSrc,
  imageAlt,
  title,
  description,
  link,
}: PresentCardProps) {
  const imageContent = (
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className={`object-cover ${link ? "transition-transform duration-300 group-hover:scale-105" : ""}`}
      />
      {link && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-lg font-bold text-white drop-shadow-lg">
            바로가기
          </span>
          <ExternalLink className="h-8 w-8 text-white drop-shadow-lg" />
        </div>
      )}
    </div>
  );

  return (
    <Card className="flex w-full flex-col items-center overflow-hidden p-0 shadow-md transition-none">
      <CardContent className="flex w-full flex-col items-center p-0">
        {link ? (
          <Link
            href={link.href}
            target={link.openInNewTab ? "_blank" : undefined}
            className="group relative aspect-[4/3] w-full overflow-hidden"
          >
            {imageContent}
          </Link>
        ) : (
          imageContent
        )}
        <div className="flex flex-col items-center p-6">
          <h3 className="mb-2 text-center text-xl font-bold text-foreground">
            {title}
          </h3>
          <p className="text-center text-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

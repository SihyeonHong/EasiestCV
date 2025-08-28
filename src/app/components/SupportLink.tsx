import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default function SupportLink() {
  return (
    <div className="flex items-center gap-1 p-1 text-sm text-gray-600 dark:text-gray-400">
      <HelpCircle size={14} />
      <span>도움이 필요하신가요?</span>
      <Link href="/support" className="underline dark:text-gray-400">
        고객지원 페이지
      </Link>
    </div>
  );
}

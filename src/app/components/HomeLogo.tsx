import { House } from "lucide-react";
import Link from "next/link";

export default function HomeLogo() {
  return (
    <Link
      href="/"
      className="flex items-center whitespace-nowrap p-2 dark:text-gray-200"
    >
      <House className="mb-1 size-6" />
      <span className="ml-1 hidden text-xl font-bold sm:block">Easiest CV</span>
    </Link>
  );
}

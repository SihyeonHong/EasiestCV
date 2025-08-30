import { House } from "lucide-react";
import Link from "next/link";

export default function HomeLogo() {
  return (
    <Link
      href="/"
      className="flex items-center whitespace-nowrap text-xl dark:text-gray-200"
    >
      <House className="mb-1" />
      <span className="ml-1 font-bold">Easiest CV</span>
    </Link>
  );
}

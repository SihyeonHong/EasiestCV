import Link from "next/link";

export default function Header() {
  return (
    <div className="flex w-full justify-end">
      <Link
        href="/"
        className="text-md m-3 rounded-lg px-3 py-2 font-medium text-white no-underline shadow-md hover:shadow-lg [&]:bg-black [&]:hover:bg-gray-900"
      >
        Log In | Sign Up
      </Link>
    </div>
  );
}

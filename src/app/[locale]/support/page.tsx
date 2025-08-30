import Link from "next/link";

export default function Page() {
  return (
    <div className="p-2">
      <p>준비중입니다.</p>
      <Link
        href="https://github.com/SihyeonHong/EasiestCV"
        className="hover:underline"
      >
        GitHub Repository
      </Link>
    </div>
  );
}

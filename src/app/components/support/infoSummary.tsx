import Link from "next/link";

export default function InfoSummary() {
  return (
    <div>
      <Link
        href="https://github.com/SihyeonHong/EasiestCV"
        className="hover:underline"
      >
        GitHub Repository
      </Link>
      <p>추가 예정</p>
    </div>
  );
}

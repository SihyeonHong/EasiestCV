import Image from "next/image";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/app/components/common/Table";

export default function InfoCard() {
  return (
    <div id="infoCard">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">개발자</TableCell>
            <TableCell>홍시현</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">연락처</TableCell>
            <TableCell>admin@easiest-cv.com</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">GitHub</TableCell>
            <TableCell>
              <Link
                href="https://github.com/SihyeonHong/"
                className="inline-flex items-center gap-1 hover:underline hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>SihyeonHong의 </span>
                <Image
                  src="/GitHub-Logos/GitHub_Logo.png"
                  alt="github logo"
                  width={48}
                  height={20}
                  className="inline-block"
                />
                <span>프로필</span>
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Repository</TableCell>
            <TableCell>
              <Link
                href="https://github.com/SihyeonHong/EasiestCV"
                className="inline-flex items-center gap-1 hover:underline hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/github-mark/github-mark.png"
                  alt="github mark"
                  width={16}
                  height={16}
                />
                <span className="mt-0.5">Easiest CV Repository</span>
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

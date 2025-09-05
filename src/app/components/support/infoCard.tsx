import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/app/components/common/Table";

export default async function InfoCard() {
  const t = await getTranslations("info");

  return (
    <div id="infoCard">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{t("developer")}</TableCell>
            <TableCell>{t("me")}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{t("contact")}</TableCell>
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
                <span>{t("my")}</span>
                <Image
                  src="/GitHub-Logos/GitHub_Logo.png"
                  alt="github logo"
                  width={48}
                  height={20}
                  className="inline-block"
                />
                <span>{t("profile")}</span>
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

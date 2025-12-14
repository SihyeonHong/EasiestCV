import { readFileSync } from "fs";
import { join } from "path";

import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import PublicContents from "@/app/components/public/PublicContents";
import { normalizeHtmlWhitespace } from "@/utils/sanitize";

export default async function Tester() {
  // papers-template.html 파일 읽기
  let testContent = "";
  try {
    const papersTemplatePath = join(
      process.cwd(),
      "public",
      "papers-template.html",
    );
    testContent = normalizeHtmlWhitespace(
      readFileSync(papersTemplatePath, "utf-8"),
    );
  } catch (error) {
    console.error("papers-template.html 파일 읽기 실패:", error);
    testContent = "<p>papers-template.html을 불러올 수 없습니다.</p>";
  }

  return (
    <div>
      <Header />
      <Title title="테스트용 화면입니다" />
      <h3 className="mb-2 text-lg font-semibold">papers-template.html 내용:</h3>
      <PublicContents content={testContent} />
      <Footer />
    </div>
  );
}

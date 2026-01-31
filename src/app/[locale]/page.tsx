import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/app/components/common/Button";
import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import PresentCard from "@/app/components/PresentCard";

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations("header");

  return (
    <div className="flex flex-col items-center">
      <Header />
      <Title />
      <main className="flex w-full flex-col">
        <section className="flex w-full flex-col items-center justify-center gap-12 px-4 py-12 md:px-8">
          {/* Feature Cards */}
          <div className="grid w-full max-w-7xl grid-cols-1 justify-items-center gap-6 md:grid-cols-3 md:gap-8">
            {/* Card 1 - Login Page Screenshot */}
            <PresentCard
              imageSrc="https://picsum.photos/800/600"
              imageAlt="로그인 페이지"
              title="회원가입/로그인하세요"
              description={
                <>
                  가입할지 말지 고민이라면
                  <br />
                  테스트 계정에 로그인해서 직접 체험해보세요.
                </>
              }
            />

            {/* Card 2 - Editor Page Screenshot */}
            <PresentCard
              imageSrc="/screenshot-admin-paper-light.png"
              imageAlt="screenshot-admin-paper-light"
              title="내용을 채우세요"
              description={
                <>
                  자유롭게 작성하거나
                  <br />
                  템플릿에 내용을 채워보세요.
                </>
              }
            />

            {/* Card 3 - Public Page Screenshot */}
            <PresentCard
              imageSrc="/screenshot-public-home-light.png"
              imageAlt="screenshot-public-home-light"
              title="웹사이트 완성!"
              description="이미지를 클릭해 결과물을 확인해보세요."
              link={{
                href: `/${params.locale}/john-doe/home`,
                openInNewTab: true,
              }}
            />
          </div>

          {/* Call to Action */}
          <div className="flex items-center justify-center gap-6">
            <span className="text-base text-foreground md:text-lg">
              준비되셨나요?
            </span>
            <Button asChild size="lg">
              <Link href={`/${params.locale}/auth`}>
                {t("loginOrSignup")} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

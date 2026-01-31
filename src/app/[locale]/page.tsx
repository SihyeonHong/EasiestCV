import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/app/components/common/Button";
import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Title from "@/app/components/common/Title";
import PresentCard from "@/app/components/PresentCard";

interface PageProps {
  params: {
    locale: string;
  };
}

export default async function Page({ params }: PageProps) {
  const tHeader = await getTranslations("header");
  const t = await getTranslations("startPage");

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
              imageSrc="/screenshot-login-light.png"
              imageAlt="screenshot-login-light"
              title={t("card1.title")}
              description={
                <>
                  {t("card1.description1")}
                  <br />
                  {t("card1.description2")}
                </>
              }
            />

            {/* Card 2 - Editor Page Screenshot */}
            <PresentCard
              imageSrc="/screenshot-admin-paper-light.png"
              imageAlt="screenshot-admin-paper-light"
              title={t("card2.title")}
              description={
                <>
                  {t("card2.description1")}
                  <br />
                  {t("card2.description2")}
                </>
              }
            />

            {/* Card 3 - Public Page Screenshot */}
            <PresentCard
              imageSrc="/screenshot-public-home-light.png"
              imageAlt="screenshot-public-home-light"
              title={t("card3.title")}
              description={t("card3.description")}
              link={{
                href: `/${params.locale}/john-doe/home`,
                openInNewTab: true,
              }}
            />
          </div>

          {/* Call to Action */}
          <div className="flex items-center justify-center gap-6">
            <span className="text-base text-foreground md:text-lg">
              {t("ready")}
            </span>
            <Button asChild size="lg">
              <Link href={`/${params.locale}/auth`}>
                {tHeader("loginOrSignup")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

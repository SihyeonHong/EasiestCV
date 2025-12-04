"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import LoadingIcon from "@/app/components/common/LoadingIcon";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/common/Tabs";
import { usePathname, useRouter } from "@/i18n/routing";
import type { Tab } from "@/types/tab";
import { cn } from "@/utils/classname";

interface Props {
  userid: string;
  tabList: Record<string, Tab>;
  isDocumentsExists: boolean;
}

export default function PublicTabs({
  userid,
  tabList,
  isDocumentsExists,
}: Props) {
  const t = useTranslations("documents");

  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop() ?? "home";

  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  useEffect(() => {
    setLoadingTab(null);
  }, [pathname]);

  const handleTabClick = (slug: string) => {
    setLoadingTab(slug);
    router.push(`/${userid}/${slug}`);
  };

  return (
    <div className="mx-2 md:mx-8 lg:mx-auto lg:max-w-[1024px]">
      <Tabs>
        <TabsList>
          <TabsTrigger
            value="home"
            data-state={currentTab === "home" ? "active" : "inactive"}
            onClick={() => handleTabClick("home")}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {loadingTab === "home" && <LoadingIcon />}
              Home
            </span>
          </TabsTrigger>
          {tabList &&
            Object.values(tabList)
              .sort((a, b) => a.torder - b.torder)
              .map((tabItem) => {
                const active = currentTab === tabItem.slug;
                return (
                  <TabsTrigger
                    key={tabItem.tid}
                    value={tabItem.tname}
                    data-state={
                      currentTab === tabItem.slug ? "active" : "inactive"
                    }
                    onClick={() => handleTabClick(tabItem.slug)}
                    className={cn(
                      "cursor-pointer",
                      active &&
                        "bg-white text-zinc-950 shadow dark:bg-zinc-950 dark:text-zinc-50",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {loadingTab === tabItem.slug && <LoadingIcon />}
                      {tabItem.tname}
                    </span>
                  </TabsTrigger>
                );
              })}
          {isDocumentsExists && (
            <TabsTrigger
              value="documents"
              data-state={currentTab === "documents" ? "active" : "inactive"}
              onClick={() => handleTabClick("documents")}
              className="cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {loadingTab === "documents" && <LoadingIcon />}
                {t("documents")}
              </span>
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
}

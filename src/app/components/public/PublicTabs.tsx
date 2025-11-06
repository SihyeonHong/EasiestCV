"use client";

import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@/app/components/common/Tabs";
import { usePathname, useRouter } from "@/i18n/routing";
import type { TabListItem } from "@/types/tab";
import { cn } from "@/utils/classname";

interface Props {
  userid: string;
  tabList: Record<number, TabListItem>;
  isDocumentsExists: boolean;
}

export default function PublicTabs({
  userid,
  tabList,
  isDocumentsExists,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop() ?? "home";

  const t = useTranslations("documents");

  return (
    <div className="mx-2 md:mx-8 lg:mx-auto lg:max-w-[1024px]">
      <Tabs>
        <TabsList>
          <TabsTrigger
            value="home"
            data-state={currentTab === "home" ? "active" : "inactive"}
            onClick={() => router.push(`/${userid}/home`)}
            className="cursor-pointer"
          >
            Home
          </TabsTrigger>
          {tabList &&
            Object.values(tabList).map((tabItem) => {
              const active = currentTab === tabItem.slug;
              return (
                <TabsTrigger
                  key={tabItem.tid}
                  value={tabItem.tname}
                  data-state={
                    currentTab === tabItem.slug ? "active" : "inactive"
                  }
                  onClick={() => router.push(`/${userid}/${tabItem.slug}`)}
                  className={cn(
                    "cursor-pointer",
                    active &&
                      "bg-white text-zinc-950 shadow dark:bg-zinc-950 dark:text-zinc-50",
                  )}
                >
                  {tabItem.tname}
                </TabsTrigger>
              );
            })}
          {isDocumentsExists && (
            <TabsTrigger
              value="documents"
              data-state={currentTab === "documents" ? "active" : "inactive"}
              onClick={() => router.push(`/${userid}/documents`)}
              className="cursor-pointer"
            >
              {t("documents")}
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
}

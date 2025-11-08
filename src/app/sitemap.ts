import { MetadataRoute } from "next";

import { query } from "@/utils/database";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://easiest-cv.com";
  const locales = ["ko", "en"];

  const fetchUsersFromDB = async () => {
    const sql = "SELECT userid FROM users;";
    const users = await query<{ userid: string }>(sql);
    return users;
  };

  const fetchTabsFromDB = async (userid: string) => {
    const sql = "SELECT slug FROM tabs WHERE userid = $1;";
    const tabs = await query<{ slug: string }>(sql, [userid]);
    return tabs;
  };

  const fetchedUsers = await fetchUsersFromDB();

  // 사용자별 slug URL 생성 (home + 각 탭의 slug)
  const userSlugUrls = await Promise.all(
    fetchedUsers.flatMap(async (user) => {
      const tabs = await fetchTabsFromDB(user.userid);

      // 기본 slug: home은 항상 존재
      const slugs = ["home"];

      // 각 탭의 slug 추가
      tabs.forEach((tab) => {
        if (tab.slug && !slugs.includes(tab.slug)) {
          slugs.push(tab.slug);
        }
      });

      // 각 locale과 slug 조합으로 URL 생성
      return locales.flatMap((locale) =>
        slugs.map((slug) => ({
          url: `${baseUrl}/${locale}/${user.userid}/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: slug === "home" ? 1.0 : 0.8,
        })),
      );
    }),
  );

  // 정적 페이지와 동적 페이지를 합쳐서 반환
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    ...userSlugUrls.flat(),
  ];
}

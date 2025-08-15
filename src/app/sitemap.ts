import { MetadataRoute } from "next";

import { query } from "@/util/database";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://easiest-cv.vercel.app";
  const locales = ["ko", "en"];

  const fetchUsersFromDB = async () => {
    const sql = "SELECT userid FROM users;";
    const users = await query<{ userid: string }>(sql);
    return users;
  };

  const fetchedUsers = await fetchUsersFromDB();

  // 사용자 ID를 기반으로 동적 URL 생성
  const userUrls = locales.flatMap((locale) =>
    fetchedUsers.map((user) => ({
      url: `${baseUrl}/${locale}/${user.userid}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    })),
  );

  // notice 페이지를 위한 URL
  const noticeUrls = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/notice`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  // 정적 페이지와 동적 페이지를 합쳐서 반환
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    ...userUrls,
    ...noticeUrls,
  ];
}

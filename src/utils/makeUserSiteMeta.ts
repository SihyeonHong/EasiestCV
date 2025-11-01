import { UserSiteMeta } from "@/types/user-data";

export default function makeUserSiteMeta(
  userid: string,
  username: string,
  title?: string,
  description?: string,
): UserSiteMeta {
  // 빈 문자열도 falsy 처리되어 기본값 들어감
  return {
    userid,
    title: title || `${username}'s CV - Easiest CV`,
    description: description || `${username}'s CV`,
  };
}

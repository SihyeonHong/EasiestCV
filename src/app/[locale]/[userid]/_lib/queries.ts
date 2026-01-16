import { isAxiosError } from "axios";

import { Tab } from "@/types/tab";
import { User } from "@/types/user-account";
import { UserHome, UserSiteMeta } from "@/types/user-data";
import { get, put } from "@/utils/http";
import { logServerError, serverFetch } from "@/utils/server-error-handler";

export async function getUser(userid: string): Promise<User | null> {
  try {
    const response = await get<User>(`/users/user?userid=${userid}`);
    return response || null;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      // 정상적인 경우 (사용자 없음)
      return null;
    }
    logServerError(error, "getUser", { userid });
    return null;
  }
}

export async function getTabs(userid: string): Promise<Tab[] | null> {
  return serverFetch(
    () => get<Tab[]>(`/tabs?userid=${userid}`),
    null,
    "getTabs",
    { userid },
    true,
  );
}

export async function getHome(userid: string): Promise<UserHome | null> {
  return serverFetch(
    () => get<UserHome>(`/home?userid=${userid}`),
    null,
    "getHome",
    { userid },
    true,
  );
}

export async function getDocuments(userid: string): Promise<string[]> {
  return serverFetch(
    () => get<string[]>(`/documents?userid=${userid}`),
    [],
    "getDocuments",
    { userid },
  );
}

export async function getUserSiteMeta(
  userid: string,
): Promise<UserSiteMeta | null> {
  return serverFetch(
    () => get<UserSiteMeta>(`/meta?userid=${userid}`),
    null,
    "getUserSiteMeta",
    { userid },
  );
}

export async function upsertUserSiteMeta(
  userid: string,
  title: string,
  description: string,
): Promise<void> {
  try {
    await put(`/meta`, { userid, title, description });
  } catch (error: unknown) {
    logServerError(error, "upsertUserSiteMeta", { userid, title, description });
    // 메타데이터 업데이트 실패는 페이지 렌더링을 막지 않음
  }
}

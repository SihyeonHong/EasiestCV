import { isAxiosError } from "axios";

import { Tab } from "@/types/tab";
import { User } from "@/types/user-account";
import { get } from "@/utils/http";

export async function getUser(userid: string): Promise<User | null> {
  try {
    const response = await get<User>(`/users/user?userid=${userid}`);
    return response || null;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      console.warn("사용자 없음 (404)");
      return null;
    }
    console.error("사용자 정보 가져오기 실패");
    return null;
  }
}

export async function getTabs(userid: string): Promise<Tab[] | null> {
  try {
    const response = await get<Tab[]>(`/tabs?userid=${userid}`);
    if (!response) {
      return null;
    }
    return response;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    console.error("탭 정보 가져오기 실패");
    return null;
  }
}

export async function getDocuments(userid: string): Promise<string[]> {
  try {
    return (await get<string[]>(`/documents?userid=${userid}`)) ?? [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    console.error("문서 목록 가져오기 실패");
    return [];
  }
}

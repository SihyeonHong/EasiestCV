export interface Tab {
  userid: string;
  tid: number;
  tname: string;
  torder: number;
  contents: string | null;
  slug: string;
}

export interface GCSRefreshRequest {
  userid: string;
  tid: number;
  newList: string[];
}

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

// RETURNING tid 쿼리 날려보니까 이렇게 오더라 [{ "tid": 51 }]
export type ReturnedTid = { tid: number }[];

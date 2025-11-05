export interface Tab {
  userid: string;
  tid: number;
  tname: string;
  torder: number;
  contents: string | null;
}

export interface GCSRefreshRequest {
  userid: string;
  tid: number;
  newList: string[];
}

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

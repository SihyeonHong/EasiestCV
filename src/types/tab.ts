export interface Tab {
  userid: string;
  tid: number;
  tname: string;
  torder: number;
  contents: string | null;
  slug: string;
}

export interface TabListItem {
  userid: string;
  tid: number;
  tname: string;
  slug: string;
}

export interface GCSRefreshRequest {
  userid: string;
  tid: number;
  newList: string[];
}

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

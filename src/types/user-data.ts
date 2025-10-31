export interface UserHome {
  userid: string;
  intro_html: string | null;
  img_url: string | null;
}

export interface UserSiteMeta {
  userid: string;
  title: string; // 사이트 이름 (ex. "홍시현의 포트폴리오")
  description: string; // 사이트 설명 (검색엔진 메타디스크립션 등)
}

// legacy

export interface HomeData {
  userid: string;
  intro: string | null;
  img: string | null;
  pdf: string | null;
}

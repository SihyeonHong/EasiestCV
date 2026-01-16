export interface UserHome {
  userid: string;
  intro_html: string | null;
  img_url: string | null;
}

export interface HomeImgDeleteRequest {
  userid: string;
  imgUrl: string | null;
  oldFileName?: string;
}

export interface UserSiteMeta {
  userid: string;
  title: string; // 사이트 이름
  description: string; // 검색엔진 meta-description
}

// legacy

export interface HomeData {
  userid: string;
  intro: string | null;
  img: string | null;
  pdf: string | null;
}

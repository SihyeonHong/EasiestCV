import { useEffect, useState } from "react";
import { HomeData } from "../models/home.model";
import { fetchHomeData } from "../api/home.api";

export const useHome = (userid: string) => {
  const [homeData, setHomeData] = useState<HomeData>({
    userid: userid,
  });

  useEffect(() => {
    if (!userid) return;

    fetchHomeData(userid).then((data) => setHomeData(data));
  }, [userid]);

  return { homeData, setHomeData };
};

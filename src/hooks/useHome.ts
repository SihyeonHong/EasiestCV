import { useEffect, useState } from "react";
import { HomeData } from "../models/home.model";
import { fetchHomeData, fetchHomeImg } from "../api/home.api";

export const useHome = (userid: string) => {
  const [homeData, setHomeData] = useState<HomeData>({
    userid: userid,
  });

  useEffect(() => {
    if (!userid) return;

    fetchHomeData(userid).then((data) => setHomeData(data));
  }, [userid]);

  const uploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("userid", userid);

    // Check FormData contents
    // const entries = Array.from(formData.entries());
    // entries.forEach(([key, value]) => {
    //   console.log(key, value);
    // });

    fetchHomeImg(formData).then((res) => {
      setHomeData({ ...homeData, img: res?.data.imageUrl });
    });
  };

  return { homeData, setHomeData, uploadImg };
};

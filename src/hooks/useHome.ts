import { useEffect, useState } from "react";
import { HomeData } from "@/models/home.model";
import { fetchHomeData, fetchHomeImg } from "../api/home.api";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { queryKeys } from "@/constants/queryKeys";
// import { get, put } from "@/api/http";

export const useHome = (userid: string) => {
  //   const queryClient = useQueryClient();

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

    try {
      const res = await fetchHomeImg(formData);
      if (res?.data.imageUrl) {
        const updatedData = await fetchHomeData(userid);
        setHomeData(updatedData);
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
    }
  };

  return { homeData, setHomeData, uploadImg };
};

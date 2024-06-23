import { HomeData } from "../models/home.model";
import { httpClient } from "./http";

export const fetchHomeData = async (userid: string) => {
  try {
    const response = await httpClient.get(`/get/userinfo?userid=${userid}`);
    return response.data[0];
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

export const fetchHomeImg = async (formData: FormData) => {
  try {
    const response = await httpClient.post(`/post/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    alert("이미지 업로드에 실패했습니다.");
    console.error(error);
  }
};

export const fetchHomeIntro = async (homeData: HomeData) => {
  try {
    const response = await httpClient.put(`/put/home`);
    return response;
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

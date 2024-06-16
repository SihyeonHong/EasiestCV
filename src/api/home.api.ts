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

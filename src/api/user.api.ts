import { httpClient } from "./http";

export const fetchUser = async (userid: string) => {
  try {
    const response = await httpClient.get(`/get/user?userid=${userid}`);
    return response.data[0];
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

import { Tab } from "../models/tab.model";
import { httpClient } from "./http";

export const fetchTabs = async (userid: string) => {
  try {
    const response = await httpClient.get(`/get/tabs?userid=${userid}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updateTabs = async (tabs: Tab[]) => {
  try {
    const response = await httpClient.put(`/put/tabs`, tabs);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

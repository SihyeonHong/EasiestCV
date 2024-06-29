import axios from "axios";
import { User } from "../models/user.model";
import { httpClient } from "./http";

export const fetchLogin = async (user: User) => {
  try {
    const response = await httpClient.post(`/post/login`, user);
    if (response.status === 200) {
      return response;
    } else {
      throw new Error("login failed");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      alert(errorMessage);
    } else if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("An unknown error occurred during login.");
    }
    console.error(error);
  }
};

export const fetchResetPW = async (user: User) => {
  try {
    const response = await httpClient.put(`/put/resetPW`, user);
    return response;
  } catch (error) {
    console.error(error);
  }
};

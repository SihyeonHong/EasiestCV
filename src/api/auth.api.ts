import axios from "axios";
import { LoginForm } from "../models/user.model";
import { httpClient } from "./http";

export const fetchLogin = async (data: LoginForm) => {
  try {
    const response = await httpClient.post(`/post/login`, data);
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

export const fetchResetPW = async (data: LoginForm) => {
  try {
    const response = await httpClient.put(`/put/resetPW`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

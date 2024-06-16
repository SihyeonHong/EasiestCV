import axios, { AxiosRequestConfig } from "axios";

const DEFAULT_TIMEOUT = 30000;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL + "/api",
    timeout: DEFAULT_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    ...config,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.request.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        removeToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();

const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};
const removeToken = () => {
  localStorage.removeItem("token");
};

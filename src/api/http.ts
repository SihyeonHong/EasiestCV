import axios, { AxiosRequestConfig } from "axios";

const DEFAULT_TIMEOUT = 30000;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const createClient = (config?: AxiosRequestConfig) => {
  const httpClient = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    ...config,
  });
};

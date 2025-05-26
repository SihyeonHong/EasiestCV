import axios, { AxiosRequestConfig } from "axios";

const DEFAULT_TIMEOUT = 30000;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL + "/api",
    timeout: DEFAULT_TIMEOUT,
    withCredentials: true,
    ...config,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export const httpClient = createClient();

export const get = async <T>(...args: Parameters<typeof httpClient.get>) => {
  const response = await httpClient.get<T>(...args);
  return response.data;
};

export const post = async <T>(...args: Parameters<typeof httpClient.post>) => {
  const response = await httpClient.post<T>(...args);
  return response.data;
};

export const put = async <T>(...args: Parameters<typeof httpClient.put>) => {
  const response = await httpClient.put<T>(...args);
  return response.data;
};

export const del = async <T>(...args: Parameters<typeof httpClient.delete>) => {
  const response = await httpClient.delete<T>(...args);
  return response.data;
};

export const patch = async <T>(
  ...args: Parameters<typeof httpClient.patch>
) => {
  const response = await httpClient.patch<T>(...args);
  return response.data;
};

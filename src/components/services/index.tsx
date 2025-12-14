import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { Roles } from "../../enums.ts";

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withXSRFToken = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;
export const DOMAIN_NAME = "lms.academy.uft.uz";
export const APIURL: string = `https://${DOMAIN_NAME}/api/`;

export const client: AxiosInstance = axios.create({
    baseURL: APIURL,
    headers: {
        "Content-Type": 'application/json',
    }
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

client.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = window.localStorage.getItem("refresh");

        if (!refreshToken) {
          window.localStorage.removeItem("id");
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("refresh");
          window.localStorage.removeItem("roles");
          window.localStorage.removeItem("role");
          window.location.pathname = "/login";
          return Promise.reject(error);
        }

        try {
          const response = await fetch(`${APIURL}token/refresh/`, {
            method: "POST",
            body: JSON.stringify({ refresh: refreshToken }),
            headers: { "Content-Type": "application/json" },
          });

          if (response.status === 401 || response.status === 400) {
            console.log("Refresh token invalid");
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("refresh");
            window.localStorage.removeItem("roles");
            window.localStorage.removeItem("id");
            window.localStorage.removeItem("role");
            window.location.pathname = "/login";
            return Promise.reject(error);
          }

          const data = await response.json();
          const newToken = data.access;
          const newRefresh = data.refresh;
          const roles = data.role as Roles[];

          window.localStorage.setItem("roles", JSON.stringify(roles));
          window.localStorage.setItem("token", newToken);
          window.localStorage.setItem("refresh", newRefresh);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return client(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh error:", refreshError);
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("refresh");
          window.localStorage.removeItem("roles");
          window.localStorage.removeItem("id");
          window.localStorage.removeItem("role");
          window.location.pathname = "/login";
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
);

export default client;

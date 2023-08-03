import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import { notificationError } from "@ui/notifications";

let config: any = {
  baseURL: import.meta.env.VITE_BASE_URL || "https://dev.robosell.uz",
};

const api = axios.create(config);

// global axios config
api.interceptors.request.use((config: any) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error) => {
    if(error.response?.status && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      location.replace('/auth');
      return
    }

    if (error.name === "AxiosError" && typeof error.response?.data !== 'string') {
      if (Array.isArray(error.response.data.errors) && error.response.data.errors.length) {
        error.response.data.errors.forEach((item: any) => {
          notificationError(item.message);
        });
      } else {
        notificationError(error.response.data.message);
      }

      // for (let value of Object.values(error.response?.data)) {
      //   let array: any = value;
      //
      //   array?.forEach((element: any) => {
      //     toast.error(element, {
      //       autoClose: 3000,
      //       theme: "colored",
      //       hideProgressBar: true,
      //     });
      //   });
      // }
    } else {
      notificationError(`${error.response.statusText} ${error.response.status}`);
      // toast.error(`${error.response.statusText} ${error.response.status}`, {
      //   autoClose: 3000,
      //   theme: "colored",
      //   hideProgressBar: true,
      // });
    }

    return Promise.reject(error);
  }
);

type HttpRequestType = <R>(params: AxiosRequestConfig & { url: string }) => AxiosPromise<R>;

export const httpGet: HttpRequestType = ({ url, ...config }) => {
  return api.get(url, config);
}

export const httpPost: HttpRequestType = ({ url, data, ...config }) => {
  return api.post(url, data, config);
}

export const httpPut: HttpRequestType = ({ url, data, ...config }) => {
  return api.put(url, data, config);
}

export const httpPatch: HttpRequestType = ({ url, data, ...config }) => {
  return api.patch(url, data, config);
}

export const httpDelete: HttpRequestType = ({ url, ...config }) => {
  return api.delete(url, config);
}
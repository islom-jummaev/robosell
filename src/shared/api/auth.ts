import { httpPost } from "@core/httpClient";

export const onLogin = (reqData: any) => {
  return httpPost({
    url: `/auth/login`,
    data: reqData
  });
};

export const onRegister = (reqData: any) => {
  return httpPost({
    url: `/auth/register`,
    data: reqData
  });
};

export const onVerify = (reqData: any) => {
  return httpPost({
    url: `/auth/verify`,
    data: reqData
  });
};

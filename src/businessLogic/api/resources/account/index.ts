import { HandlerType } from "@core/zustand/types/handler";
import { httpGet, httpPost } from "@core/httpClient";
import * as accountModels from "@/businessLogic/models/account";


export const getCurrentUser: HandlerType<string, accountModels.ICurrentUserModel> = (id) => {
  return httpGet({
    url: `/auth/user/detail/${id}`,
  });
};

export const forgotPasswordStep1: HandlerType<accountModels.IForgotPasswordStep1Model, accountModels.IForgotPasswordStep1Model> = (data) => {
  return httpPost({
    url: "/auth/forgot/password",
    data
  });
};

export const forgotPasswordStep2: HandlerType<accountModels.IForgotPasswordStep2Model, accountModels.IForgotPasswordStep2ResponseModel> = (data) => {
  return httpPost({
    url: "/auth/verify/forgot/password",
    data
  });
};

export const forgotPasswordStep3: HandlerType<accountModels.IForgotPasswordStep3Model, number> = ({ id, ...data }) => {
  return httpPost({
    url: `/auth/recover/forgot/password/${id}`,
    data
  });
};

export const changeLanguage: HandlerType<accountModels.IChangeLanguageModel, null> = (data) => {
  return httpPost({
    url: "/auth/user/change/language",
    data
  });
};
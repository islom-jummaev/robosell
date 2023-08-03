import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPost, httpPut } from "@core/httpClient";

import * as botsModels from "@/businessLogic/models/bots";

export const updateMainBot: HandlerType<string, null> = (id) => {
  return httpPost({
    url: `/bot/main/update/${id}`
  });
};

export const getBotsList: HandlerType<void, Array<botsModels.IBotsListItemModel>> = () => {
  return httpGet({
    url: "/bot/list",
  });
};

export const getCurrentBotToken: HandlerType<string, { token: string }> = (id) => {
  return httpGet({
    url: `bot/get/token/${id}`,
  });
};

export const createBot: HandlerType<botsModels.IBotCreateModel, botsModels.IBotCreateResponseModel> = (data) => {
  return httpPost({
    url: "/bot/create-bot",
    data
  });
};

export const getBotGeneralDetails: HandlerType<string, botsModels.IBotGeneralDetailsModel> = (id) => {
  return httpGet({
    url: `/bot/detail/general/${id}`,
  });
};

export const botGeneralDetailsUpdate: HandlerType<botsModels.IBotGeneralDetailsUpdateModel, botsModels.IBotGeneralDetailsUpdateResponseModel> = ({ id, ...data }) => {
  return httpPut({
    url: `/bot/detail/general/${id}`,
    data
  });
};

export const getBotLanguageDetails: HandlerType<string, botsModels.IBotLanguageDetailsModel> = (id) => {
  return httpGet({
    url: `/bot/detail/language/${id}`,
  });
};

export const botLanguageDetailsUpdate: HandlerType<botsModels.IBotLanguageDetailsUpdateModel, botsModels.IBotLanguageDetailsUpdateResponseModel> = ({ id, ...data }) => {
  return httpPut({
    url: `/bot/detail/language/${id}`,
    data
  });
};

export const getBotDeliveryDetails: HandlerType<string, botsModels.IBotDeliveryDetailsModel> = (id) => {
  return httpGet({
    url: `/bot/detail/delivery/${id}`,
  });
};

export const botDeliveryDetailsUpdate: HandlerType<botsModels.IBotDeliveryDetailsUpdateModel, botsModels.IBotDeliveryDetailsUpdateResponseModel> = ({ id, ...data }) => {
  return httpPut({
    url: `/bot/detail/delivery/${id}`,
    data
  });
};

export const getBotAddressDetails: HandlerType<string, botsModels.IBotAddressDetailsModel> = (id) => {
  return httpGet({
    url: `/bot/current/address/${id}`,
  });
};

export const botAddressUpdate: HandlerType<botsModels.IBotAddressUpdateModel, botsModels.IBotAddressUpdateResponseModel> = ({ id, ...data }) => {
  return httpPost({
    url: `/bot/current/address/${id}`,
    data
  });
};

export const getBotPaymentDetails: HandlerType<string, botsModels.IBotPaymentDetailsModel> = (id) => {
  return httpGet({
    url: `/bot/detail/payment/${id}`,
  });
};

export const botPaymentDetailsUpdate: HandlerType<botsModels.IBotPaymentDetailsUpdateModel, botsModels.IBotPaymentDetailsUpdateResponseModel> = ({ id, ...data }) => {
  return httpPut({
    url: `/bot/detail/payment/${id}`,
    data
  });
};

export const botChangeToken: HandlerType<botsModels.IBotChangeTokenModel, botsModels.IBotChangeTokenResponseModel> = ({ id, ...data }) => {
  return httpPost({
    url: `/bot/change/token/${id}`,
    data
  });
};

export const botRestart: HandlerType<string, botsModels.IBotRestartResponseModel> = (id) => {
  return httpPost({
    url: `/bot/restart/${id}`
  });
};

export const botStop: HandlerType<string, botsModels.IBotStopResponseModel> = (id) => {
  return httpPost({
    url: `/bot/stop/${id}`
  });
};

export const botDelete: HandlerType<string, botsModels.IBotDeleteResponseModel> = (id) => {
  return httpDelete({
    url: `/bot/delete/${id}`
  });
};

export const getCountries: HandlerType<void, Array<botsModels.IBotCountryModel>> = () => {
  return httpGet({
    url: "/bot/country/delivery"
  });
};

export const getCities: HandlerType<string, Array<botsModels.IBotCitiesModel>> = (country_id) => {
  return httpGet({
    url: `/bot/city/delivery/${country_id}`
  });
};
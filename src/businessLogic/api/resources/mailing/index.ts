import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from "@core/httpClient";

import * as mailingModels from "@/businessLogic/models/mailing";
import { PaginationListModel } from "@customTypes/apiResponseModels";


export const getMailingList: HandlerType<mailingModels.IMailingListParams, PaginationListModel<mailingModels.IMailingListItemModel>> = ({ bot_id, ...params }) => {
  return httpGet({
    url: `/mailing/list/${bot_id}`,
    params
  });
};

export const getMailingDetails: HandlerType<number, mailingModels.IMailingDetailsModel> = (id) => {
  return httpGet({
    url: `/mailing/detail/${id}`
  });
};

export const mailingCreate: HandlerType<any, mailingModels.IMailingCreateResponse> = (data) => {
  return httpPost({
    url: `/mailing/create`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const mailingUpdate: HandlerType<any, mailingModels.IMailingUpdateResponse> = ({ id, data, isPatch }) => {
  if (isPatch) {
    return httpPatch({
      url: `/mailing/update/${id}`,
      data,
    });
  }

  return httpPut({
    url: `/mailing/update/${id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const mailingDelete: HandlerType<number, mailingModels.IMailingDeleteResponse> = (id) => {
  return httpDelete({
    url: `/mailing/delete/${id}`,
  });
};

export const mailingSend: HandlerType<number, mailingModels.IMailingSendResponse> = (id) => {
  return httpPost({
    url: `/mailing/send/${id}`,
  });
};

export const mailingCopy: HandlerType<number, null> = (id) => {
  return httpPost({
    url: `/mailing/duplicate/${id}`,
  });
};

export const mailingAddTime: HandlerType<mailingModels.IMailingAddTimeModel, null> = ({ id, ...data }) => {
  return httpPost({
    url: `/mailing/set/${id}`,
    data
  });
};
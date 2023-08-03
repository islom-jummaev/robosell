import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from "@core/httpClient";

import * as newsModels from "@/businessLogic/models/news";
import { PaginationListModel } from "@customTypes/apiResponseModels";


export const getNewsList: HandlerType<newsModels.INewsListParams, PaginationListModel<newsModels.INewsListItemModel>> = ({ bot_id, ...params }) => {
  return httpGet({
    url: `/news/list/${bot_id}`,
    params
  });
};

export const getNewsDetails: HandlerType<number, newsModels.INewsDetailsModel> = (id) => {
  return httpGet({
    url: `/news/detail/${id}`
  });
};

export const newsCreate: HandlerType<any, newsModels.INewsCreateResponse> = (data) => {
  return httpPost({
    url: "/news/create",
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const newsUpdate: HandlerType<any, newsModels.INewsUpdateResponse> = ({ id, data, isPatch }) => {
  if (isPatch) {
    return httpPatch({
      url: `/news/update/${id}`,
      data,
    });
  }

  return httpPut({
    url: `/news/update/${id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const newsDelete: HandlerType<number, newsModels.INewsDeleteResponse> = (id) => {
  return httpDelete({
    url: `/news/delete/${id}`,
  });
};
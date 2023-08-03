import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPost, httpPut } from "@core/httpClient";

import * as sourceModels from "@/businessLogic/models/source";
import { PaginationListModel } from "@customTypes/apiResponseModels";


export const getSourceList: HandlerType<sourceModels.ISourceListParams, PaginationListModel<sourceModels.ISourceListItemModel>> = ({ bot_id, ...params }) => {
  return httpGet({
    url: `/source/list/${bot_id}`,
    params
  });
};

export const sourceCreate: HandlerType<sourceModels.ISourceCreateModel, sourceModels.ISourceCreateResponse> = (data) => {
  return httpPost({
    url: "/source/create",
    data
  });
};

export const sourceDelete: HandlerType<number, sourceModels.ISourceDeleteResponse> = (id) => {
  return httpDelete({
    url: `/source/delete/${id}`,
  });
};
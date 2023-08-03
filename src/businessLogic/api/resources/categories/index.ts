import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from "@core/httpClient";

import * as categoriesModels from "@/businessLogic/models/categories";
import { PaginationListModel } from "@customTypes/apiResponseModels";
import * as ProductsModels from "@/businessLogic/models/products";


export const getCategoriesList: HandlerType<categoriesModels.ICategoriesListParams, PaginationListModel<categoriesModels.ICategoriesListItemModel>> = ({ bot_id, ...params }) => {
  return httpGet({
    url: `/category/list/${bot_id}`,
    params
  });
};

export const getCategoryDetails: HandlerType<number, categoriesModels.ICategoryDetailsModel> = (id) => {
  return httpGet({
    url: `/category/detail/${id}`,
  });
};

export const categoryCreate: HandlerType<any, categoriesModels.ICategoryCreateResponse> = (data) => {
  return httpPost({
    url: `/category/create`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const categoryUpdate: HandlerType<any, categoriesModels.ICategoryUpdateResponse> = ({ id, data, isPatch }) => {
  if (isPatch) {
    return httpPatch({
      url: `/category/update/${id}`,
      data,
    });
  }

  return httpPut({
    url: `/category/update/${id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const categoryDelete: HandlerType<number, categoriesModels.ICategoryDeleteResponse> = (id) => {
  return httpDelete({
    url: `/category/delete/${id}`,
  });
};

export const categoryChangePosition: HandlerType<categoriesModels.ICategoryChangePositionModel, null> = ({ id, ...data }) => {
  return httpPost({
    url: `/category/change/position/${id}`,
    data,
  });
};
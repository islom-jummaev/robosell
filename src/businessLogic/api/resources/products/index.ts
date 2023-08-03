import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from "@core/httpClient";

import * as ProductsModels from "@/businessLogic/models/products";
import { PaginationListModel } from "@customTypes/apiResponseModels";


export const getProductsList: HandlerType<ProductsModels.IProductsListParams, PaginationListModel<ProductsModels.IProductsListItemModel>> = ({ bot_id, ...params }) => {
  return httpGet({
    url: `/product/list/${bot_id}`,
    params
  });
};

export const getProductDetails: HandlerType<number, ProductsModels.IProductDetailsModel> = (id) => {
  return httpGet({
    url: `/product/detail/${id}`,
  });
};

export const productCreate: HandlerType<any, ProductsModels.IProductCreateResponse> = (data) => {
  return httpPost({
    url: `/product/create`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const productUpdate: HandlerType<any, ProductsModels.IProductUpdateResponse> = ({ id, data, isPatch }) => {
  if (isPatch) {
    return httpPatch({
      url: `/product/update/${id}`,
      data,
    });
  }

  return httpPut({
    url: `/product/update/${id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const productDelete: HandlerType<number, ProductsModels.IProductDeleteResponse> = (id) => {
  return httpDelete({
    url: `/product/delete/${id}`,
  });
};

export const productChangePosition: HandlerType<ProductsModels.IProductChangePositionModel, null> = ({ id, ...data }) => {
  return httpPost({
    url: `/product/change/position/${id}`,
    data,
  });
};
import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from "@core/httpClient";

import * as webAppModels from "@/businessLogic/models/web-app";
import { PaginationListModel } from "@customTypes/apiResponseModels";
import { IWebAppPaymentsItemModel } from "@/businessLogic/models/web-app";


export const getWebAppList: HandlerType<webAppModels.IWebAppListParams, webAppModels.IWebAppListItemModel> = ({ bot_id, ...params }) => {
  return httpGet({
    url: `/web-app/list/${bot_id}`,
    params
  });
};

export const getWebAppCategories: HandlerType<string, Array<webAppModels.IWebAppCategoriesItemModel>> = (bot_id) => {
  return httpGet({
    url: `/webapp/category/list/${bot_id}`,
  });
};

export const getWebAppUserDetails: HandlerType<string, webAppModels.IWebAppUserDetailsModel> = (user_id) => {
  return httpGet({
    url: `/webapp/botuser/detail/${user_id}`,
  });
};

export const getWebAppProducts: HandlerType<webAppModels.IWebAppProductsParams, PaginationListModel<webAppModels.IWebAppProductsItemModel>> =
  ({ category_id, search, bot_id, ...params }) => {

  if (search) {
    return httpGet({
      url: `/webapp/product/search/${bot_id}?search=${search}`
    })
  }

  return httpGet({
    url: `/webapp/product/list/${category_id}`,
    params
  });
};

export const getWebAppProductDetails: HandlerType<number, webAppModels.IWebAppProductDetailsModel> = (id) => {
  return httpGet({
    url: `/webapp/product/detail/${id}`
  });
};

export const addWebAppProductToBasket: HandlerType<webAppModels.IAddWebAppProductToBasketModel, null> = ({ botuser_id, sku_id, count }) => {
  return httpPost({
    url: `/webapp/basket/add/${botuser_id}/${sku_id}/${count}`,
  });
};

export const getWebAppBasketProducts: HandlerType<string, Array<webAppModels.IWebAppBasketProductsItemModel>> = (botuser_id) => {
  return httpGet({
    url: `/webapp/basket/list/${botuser_id}`
  });
};

export const clearBasket: HandlerType<string, null> = (botuser_id) => {
  return httpPost({
    url: `/webapp/basket/remove/all/${botuser_id}`
  });
};

export const removeBasketItem: HandlerType<webAppModels.IAddWebAppRemoveBasketItemModel, null> = ({ botuser_id, sku_id }) => {
  return httpPost({
    url: `/webapp/basket/remove/${botuser_id}/${sku_id}`
  });
};

export const getWebAppPayments: HandlerType<string, Array<webAppModels.IWebAppPaymentsItemModel>> = (bot_id) => {
  return httpGet({
    url: `/webapp/payments/list/${bot_id}`
  });
};

export const getWebAppSales: HandlerType<string, Array<webAppModels.IWebAppSalesItemModel>> = (bot_id) => {
  return httpGet({
    url: `/webapp/sales/list/${bot_id}`
  });
};

export const getWebAppNews: HandlerType<string, Array<webAppModels.IWebAppNewsItemModel>> = (bot_id) => {
  return httpGet({
    url: `/webapp/news/list/${bot_id}`
  });
};
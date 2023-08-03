import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as newsModels from "@/businessLogic/models/news";
import { PaginationListModel } from "@customTypes/apiResponseModels";

export const $newsList = storeCreator<newsModels.INewsListParams, PaginationListModel<newsModels.INewsListItemModel>, null>(
  api.news.getNewsList,
  initialStateConstructor(null)
);

export const $newsDetails = storeCreator<number, newsModels.INewsDetailsModel, null>(
  api.news.getNewsDetails,
  initialStateConstructor(null)
);

export const $newsCreate = storeCreator<any, newsModels.INewsCreateResponse, null>(
  api.news.newsCreate,
  initialStateConstructor(null)
);

export const $newsUpdate = storeCreator<any, newsModels.INewsUpdateResponse, null>(
  api.news.newsUpdate,
  initialStateConstructor(null)
);

export const $newsDelete = storeCreator<number, newsModels.INewsDeleteResponse, null>(
  api.news.newsDelete,
  initialStateConstructor(null)
);
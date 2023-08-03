import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as categoriesModels from "@/businessLogic/models/categories";
import { PaginationListModel } from "@customTypes/apiResponseModels";

export const $categoriesList = storeCreator<categoriesModels.ICategoriesListParams, PaginationListModel<categoriesModels.ICategoriesListItemModel>, null>(
  api.categories.getCategoriesList,
  initialStateConstructor(null)
);

export const $categoryDetails = storeCreator<number, categoriesModels.ICategoryDetailsModel, null>(
  api.categories.getCategoryDetails,
  initialStateConstructor(null)
);

export const $categoryCreate = storeCreator<any, categoriesModels.ICategoryCreateResponse, null>(
  api.categories.categoryCreate,
  initialStateConstructor(null)
);

export const $categoryUpdate = storeCreator<any, categoriesModels.ICategoryUpdateResponse, null>(
  api.categories.categoryUpdate,
  initialStateConstructor(null)
);

export const $categoryDelete = storeCreator<number, categoriesModels.ICategoryDeleteResponse, null>(
  api.categories.categoryDelete,
  initialStateConstructor(null)
);

export const $categoryChangePosition = storeCreator<categoriesModels.ICategoryChangePositionModel, null, null>(
  api.categories.categoryChangePosition,
  initialStateConstructor(null)
);
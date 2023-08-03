import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as productsModels from "@/businessLogic/models/products";
import { PaginationListModel } from "@customTypes/apiResponseModels";

export const $productsList = storeCreator<productsModels.IProductsListParams, PaginationListModel<productsModels.IProductsListItemModel>, null>(
  api.products.getProductsList,
  initialStateConstructor(null)
);

export const $productDetails = storeCreator<number, productsModels.IProductDetailsModel, null>(
  api.products.getProductDetails,
  initialStateConstructor(null)
);

export const $productCreate = storeCreator<any, productsModels.IProductCreateResponse, null>(
  api.products.productCreate,
  initialStateConstructor(null)
);

export const $productUpdate = storeCreator<any, productsModels.IProductUpdateResponse, null>(
  api.products.productUpdate,
  initialStateConstructor(null)
);

export const $productDelete = storeCreator<number, productsModels.IProductDeleteResponse, null>(
  api.products.productDelete,
  initialStateConstructor(null)
);

export const $productChangePosition = storeCreator<productsModels.IProductChangePositionModel, null, null>(
  api.products.productChangePosition,
  initialStateConstructor(null)
);
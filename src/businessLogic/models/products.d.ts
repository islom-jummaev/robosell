import { ILocalizeModel } from "@customTypes/apiResponseModels";

export interface IProductsListFilterParams {
  offset?: number | undefined;
  search?: string | undefined;
}

export interface IProductsListParams extends IProductsListFilterParams {
  bot_id: string;
}

export interface ISkusItem {
  id: number;
  name: ILocalizeModel;
  price: string;
  stock_count: null | number;
  stock_status: number;
  stock_status_display: string;
}

export interface IProductsListItemModel {
  id: number;
  bot: number;
  name: ILocalizeModel;
  is_active: boolean;
  photo: string;
  category: ILocalizeModel;
  created_at: string;
  skus: Array<ISkusItem>
}

export interface IProductCreateModel {
  bot: number;
  name: ILocalizeModel;
  is_active: boolean;
  photo: any;
}

interface IProductSkusItemModel {
  id: number;
  name: ILocalizeModel;
  price: string;
  stock_count: number;
  stock_status: string;
  stock_status_display: string;
}

export interface IProductDetailsModel {
  id: number;
  bot: number;
  name: ILocalizeModel;
  desc: null | ILocalizeModel;
  skus: Array<IProductSkusItemModel>;
  is_active: boolean;
  photo: string;
  category: {
    id: number;
    name: ILocalizeModel;
  };
}

export interface IProductCreateResponse {
  id: number;
}

export interface IProductUpdateModel extends IProductCreateModel {
  id: number;
}

export interface IProductUpdateResponse {
  id: number;
}

export interface IProductDeleteResponse {
  id: number;
}

export interface IProductChangePositionModel {
  id: number | string;
  index: number;
}
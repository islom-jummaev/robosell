import { ILocalizeModel } from "@customTypes/apiResponseModels";
import { currentLangType } from "@utils/getters";

export interface IWebAppListParams {
  bot_id: string;
}

export interface IWebAppListItemModel {
  id: number;
  name: ILocalizeModel;
  photo: string;
}

export interface IWebAppCategoriesItemModel {
  id: number;
  name: ILocalizeModel;
  photo: string;
}

export interface IWebAppUserDetailsModel {
  id: number
  firstname: string;
  lang: currentLangType;
  phone: string;
  address: string;
  last_active: string | null;
  service_type: string;
  bot_token: string;
  open: string | null;
  close: string | null;
  delivery: number;
}

export interface IWebAppProductsFilterParams {
  offset?: number | undefined;
  search?: string | undefined;
  category_id?: string | undefined;
}

export interface IWebAppProductsParams extends IWebAppProductsFilterParams {
  bot_id: string;
}

export interface IWebAppProductsItemModel {
  id: number;
  name: ILocalizeModel;
  desc: ILocalizeModel;
  price: string;
  photo: string;
}

export interface IWebAppProductDetailsModel extends IWebAppProductsItemModel {
  skus: Array<{
    id: number;
    name: ILocalizeModel;
    price: string;
  }>;
}

export interface IAddWebAppProductToBasketModel {
  botuser_id: string;
  sku_id: number;
  count: number;
}

export interface IWebAppBasketProductsItemModel {
  id: number;
  quantity: number;
  total_price: string;
  photo: string;
  product: ILocalizeModel;
  sku: {
    id: number;
    price: string;
    name: ILocalizeModel;
    stock_status: string;
    stock_count: number;
  }
}

export interface IAddWebAppRemoveBasketItemModel {
  botuser_id: string;
  sku_id: number;
}

export interface IWebAppPaymentsItemModel {
  id: number;
  payment: {
    name: string;
    icon: string;
  };
  token: null | string;
}

export interface IWebAppSalesItemModel {
  id: number;
}

export interface IWebAppNewsItemModel {
  id: number;
  title: ILocalizeModel;
  desc: ILocalizeModel;
  photo: string;
  is_active: boolean;
  created_at: string;
  bot: number;
}
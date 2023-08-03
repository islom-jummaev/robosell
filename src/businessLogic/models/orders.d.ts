import { ILocalizeModel } from "@customTypes/apiResponseModels";

export interface IOrdersListFilterParams {
  offset?: number | undefined;
  is_paid?: boolean;
  status?: string;
  service_type?: string;
  payment_type?: string;
  date?: string;
  id?: string;
}

export interface IOrdersListParams extends IOrdersListFilterParams {
  bot_id: string;
}

export interface IOrdersListItemModel {
  id: number;
  bot: number;
  botuser: string;
  phone: string;
  status: {
    key: string;
    value: string;
  };
  total_price: number;
  payment_type: number;
  service_type: {
    key: string;
    value: string;
  };
  is_paid: boolean;
  created_at: string;
}

interface IOrderProductModel {
  count: number;
  product: ILocalizeModel;
  skus: {
    id: number;
    name: ILocalizeModel;
    price: string;
  }
}

export interface IOrderDetailsModel {
  id: number;
  bot: number;
  botuser: string;
  phone: string;
  branch: null;
  address: string;
  payment_type: number;
  service_type: {
    key: string;
    value: string;
  };
  status: {
    key: string;
    value: string;
  };
  comment: string;
  is_paid: boolean;
  created_at: string;
  items: Array<IOrderProductModel>;
  total_amount: number;
  delivery: number;
  total_price: number;
}

export interface IOrdersStatusUpdateModel {
  id: number;
  status: string;
}

export interface IOrdersStatusUpdateResponseModel {
  id: string;
  status: string;
}

export interface IOrdersPaymentUpdateModel {
  id: number;
  is_paid: boolean;
}

export interface IOrdersPaymentUpdateResponseModel {
  id: string;
  is_paid: boolean;
}

export interface IOrderAllStatusesModel {
  value: string;
  key: string;
}

export interface IOrderUpdateModel {
  id: number;
  phone: string;
  service_type: string;
  address: string;
  items: Array<{
    count: number;
    skus: number;
  }>;
  comment?: string;
}

export interface IOrderUpdateResponseModel {

}
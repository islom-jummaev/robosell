import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPost, httpPut } from "@core/httpClient";

import * as ordersModels from "@/businessLogic/models/orders";
import { PaginationListModel } from "@customTypes/apiResponseModels";


export const getOrdersList: HandlerType<ordersModels.IOrdersListParams, PaginationListModel<ordersModels.IOrdersListItemModel>> = ({ bot_id, ...params }) => {
  return httpGet({
    url: `/order/list/${bot_id}`,
    params
  });
};

export const getOrderStatuses: HandlerType<string, Array<{ key: string, value: string; }>> = (status) => {
  return httpGet({
    url: `/order/status/${status}`,
  });
};

export const getOrderDetails: HandlerType<string, ordersModels.IOrderDetailsModel> = (id) => {
  return httpGet({
    url: `/order/detail/${id}`,
  });
};

export const orderStatusUpdate: HandlerType<ordersModels.IOrdersStatusUpdateModel, ordersModels.IOrdersStatusUpdateResponseModel> = ({ id, ...data }) => {
  return httpPut({
    url: `/order/update/status/${id}`,
    data
  });
};

export const orderPaymentUpdate: HandlerType<ordersModels.IOrdersPaymentUpdateModel, ordersModels.IOrdersPaymentUpdateResponseModel> = ({ id, ...data }) => {
  return httpPut({
    url: `/order/update/payment/${id}`,
    data
  });
};

export const getOrderAllStatuses: HandlerType<void, Array<ordersModels.IOrderAllStatusesModel>> = () => {
  return httpGet({
    url: `/order/status/all`,
  });
};

export const orderUpdate: HandlerType<ordersModels.IOrderUpdateModel, ordersModels.IOrderUpdateResponseModel> = ({ id, ...data }) => {
  return httpPut({
    url: `/order/update/${id}`,
    data
  });
};
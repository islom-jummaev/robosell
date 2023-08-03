import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as ordersModels from "@/businessLogic/models/orders";
import { PaginationListModel } from "@customTypes/apiResponseModels";
import { create } from "zustand";

export const $ordersList = storeCreator<ordersModels.IOrdersListParams, PaginationListModel<ordersModels.IOrdersListItemModel>, null>(
  api.orders.getOrdersList,
  initialStateConstructor(null)
);

type OrderStatusesStoreCreateType = { data: {}, loading: boolean, error: any, request: (status: string) => void; };

export const $orderStatuses = {
  useStore: create<OrderStatusesStoreCreateType>()((set) => ({
    data: {},
    loading: false,
    error: null,
    request: (status) => {
      set((state) => ({
        ...state,
        loading: true
      }));

      api.orders.getOrderStatuses(status)
        .then((response: any) => {
          set((state) => ({
            loading: false,
            error: null,
            data: {
              ...state.data,
              [status]: response.data
            }
          }));
        })
        .catch((error: any) => {
          if (error.response) {
            set({ loading: false, data: {}, error: error.response });
          }
        })
    }
  }))
};

export const $orderDetails = storeCreator<string, ordersModels.IOrderDetailsModel, null>(
  api.orders.getOrderDetails,
  initialStateConstructor(null)
);

export const $orderStatusUpdate = storeCreator<ordersModels.IOrdersStatusUpdateModel, ordersModels.IOrdersStatusUpdateResponseModel, null>(
  api.orders.orderStatusUpdate,
  initialStateConstructor(null)
);

export const $orderPaymentUpdate = storeCreator<ordersModels.IOrdersPaymentUpdateModel, ordersModels.IOrdersPaymentUpdateResponseModel, null>(
  api.orders.orderPaymentUpdate,
  initialStateConstructor(null)
);

export const $orderAllStatuses = storeCreator<void, Array<ordersModels.IOrderAllStatusesModel>, []>(
  api.orders.getOrderAllStatuses,
  initialStateConstructor([])
);

export const $orderUpdate = storeCreator<ordersModels.IOrderUpdateModel, ordersModels.IOrderUpdateResponseModel, null>(
  api.orders.orderUpdate,
  initialStateConstructor(null)
);
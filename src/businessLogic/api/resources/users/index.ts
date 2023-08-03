import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPost, httpPut } from "@core/httpClient";

import * as usersModels from "@/businessLogic/models/users";
import { PaginationListModel } from "@customTypes/apiResponseModels";


export const getUsersList: HandlerType<usersModels.IUsersListParams, PaginationListModel<usersModels.IUsersListItemModel>> = ({ bot_id, ...params }) => {
  return httpGet({
    url: `/botuser/list/${bot_id}`,
    params
  });
};

export const getUserDetails: HandlerType<string, usersModels.IUserDetailsModel> = (id) => {
  return httpGet({
    url: `/botuser/detail/${id}`
  });
};

export const getUserOrders : HandlerType<usersModels.IUserOrdersListParams, PaginationListModel<usersModels.IUserOrdersListItemModel>> = ({ userId, ...params }) => {
  return httpGet({
    url: `/botuser/orders/${userId}`,
    params
  });
};
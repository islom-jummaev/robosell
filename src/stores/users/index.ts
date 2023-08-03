import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as usersModels from "@/businessLogic/models/users";
import { PaginationListModel } from "@customTypes/apiResponseModels";

export const $usersList = storeCreator<usersModels.IUsersListParams, PaginationListModel<usersModels.IUsersListItemModel>, null>(
  api.users.getUsersList,
  initialStateConstructor(null)
);

export const $userDetails = storeCreator<string, usersModels.IUserDetailsModel, null>(
  api.users.getUserDetails,
  initialStateConstructor(null)
);

export const $userOrdersList = storeCreator<usersModels.IUserOrdersListParams, PaginationListModel<usersModels.IUserOrdersListItemModel>, null>(
  api.users.getUserOrders,
  initialStateConstructor(null)
);
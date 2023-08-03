import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPost, httpPut } from "@core/httpClient";

import * as branchesModels from "@/businessLogic/models/branches";
import { PaginationListModel } from "@customTypes/apiResponseModels";


export const getBranchesList: HandlerType<branchesModels.IBranchesListParams, PaginationListModel<branchesModels.IBranchesListItemModel>> = ({ bot_id, ...params }) => {
  return httpGet({
    url: `/branch/list/${bot_id}`,
    params
  });
};

export const getBranchDetails: HandlerType<number, branchesModels.IBranchDetailsModel> = (id) => {
  return httpGet({
    url: `/branch/detail/${id}`
  });
};

export const createBranch: HandlerType<branchesModels.IBranchCreateModel, branchesModels.IBranchCreateResponseModel> = (data) => {
  return httpPost({
    url: `/branch/create`,
    data
  });
};

export const updateBranch: HandlerType<branchesModels.IBranchUpdateModel, branchesModels.IBranchUpdateResponseModel> = ({ id, ...data }) => {
  return httpPut({
    url: `/branch/update/${id}`,
    data
  });
};

export const branchDelete: HandlerType<number, branchesModels.IBranchDeleteResponse> = (id) => {
  return httpDelete({
    url: `/branch/delete/${id}`,
  });
};
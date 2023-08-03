import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as branchesModels from "@/businessLogic/models/branches";
import { PaginationListModel } from "@customTypes/apiResponseModels";

export const $branchesList = storeCreator<branchesModels.IBranchesListParams, PaginationListModel<branchesModels.IBranchesListItemModel>, null>(
  api.branches.getBranchesList,
  initialStateConstructor(null)
);

export const $branchDetails = storeCreator<number, branchesModels.IBranchDetailsModel, null>(
  api.branches.getBranchDetails,
  initialStateConstructor(null)
);

export const $createBranch = storeCreator<branchesModels.IBranchCreateModel, branchesModels.IBranchCreateResponseModel, null>(
  api.branches.createBranch,
  initialStateConstructor(null)
);

export const $updateBranch = storeCreator<branchesModels.IBranchUpdateModel, branchesModels.IBranchUpdateResponseModel, null>(
  api.branches.updateBranch,
  initialStateConstructor(null)
);

export const $branchDelete = storeCreator<number, branchesModels.IBranchDeleteResponse, null>(
  api.branches.branchDelete,
  initialStateConstructor(null)
);
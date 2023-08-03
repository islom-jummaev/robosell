import { ILocalizeModel } from "@customTypes/apiResponseModels";

export interface IBranchesListFilterParams {
  offset?: number | undefined;
  search?: string | undefined;
}
export interface IBranchesListParams extends IBranchesListFilterParams {
  bot_id: string;
}

export interface IBranchesListItemModel {
  id: number;
  bot: number;
  name: ILocalizeModel;
  is_active: boolean;
  address: string;
  created_at: string;
  latitude: number;
  longitude: number;
}

export interface IBranchDetailsModel {
  id: number;
  bot: number;
  name: ILocalizeModel;
  is_active: boolean;
  latitude: number;
  longitude: number;
}

export interface IBranchCreateModel {
  bot: string;
  name: ILocalizeModel;
  latitude: number;
  longitude: number;
}

export interface IBranchCreateResponseModel {

}

export interface IBranchUpdateModel extends IBranchCreateModel {
  id: number;
}

export interface IBranchUpdateResponseModel {

}

export interface IBranchDeleteResponse {
  id: number;
}
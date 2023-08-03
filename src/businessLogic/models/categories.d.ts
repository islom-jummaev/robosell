import { ILocalizeModel } from "@customTypes/apiResponseModels";

export interface ICategoriesListFilterParams {
  offset?: number | undefined;
  search?: string;
}

export interface ICategoriesListParams extends ICategoriesListFilterParams {
  bot_id: string;
}

export interface ICategoriesListItemModel {
  id: number;
  bot: number;
  name: ILocalizeModel;
  is_active: boolean;
  photo: string;
}

export interface ICategoryCreateModel {
  bot: number;
  name: ILocalizeModel;
  is_active: boolean;
  photo: any;
}

export interface ICategoryDetailsModel {
  id: number;
  bot: number;
  name: ILocalizeModel;
  is_active: boolean;
  medium_photo: string;
}

export interface ICategoryCreateResponse {
  id: number;
}

export interface ICategoryUpdateModel extends ICategoryCreateModel {
  id: number;
}

export interface ICategoryUpdateResponse {
  id: number;
}

export interface ICategoryDeleteResponse {
  id: number;
}

export interface ICategoryChangePositionModel {
  id: number | string;
  above_category: number | string | undefined;
}
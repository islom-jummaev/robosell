import { ILocalizeModel } from "@customTypes/apiResponseModels";

export interface INewsListFilterParams {
  offset?: number | undefined;
}

export interface INewsListParams extends INewsListFilterParams {
  bot_id: string;
}

export interface INewsListItemModel {
  id: number;
  title: ILocalizeModel;
  desc: ILocalizeModel;
  photo: string;
  is_active: boolean;
  created_at: string;
  bot: number;
}

export interface INewsDetailsModel {
  id: number;
  title: ILocalizeModel;
  desc: ILocalizeModel;
  photo: string;
  is_active: boolean;
  created_at: string;
  bot: number;
}

export interface INewsCreateModel {
  name: string;
  bot: number;
}

export interface INewsCreateResponse {
  id: number;
}

export interface INewsUpdateModel extends INewsCreateModel {
  id: number;
}

export interface INewsUpdateResponse {
  id: number;
}

export interface INewsDeleteResponse {
  id: number;
}
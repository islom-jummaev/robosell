export interface IMailingListFilterParams {
  offset?: number | undefined;
}

export interface IMailingListParams extends IMailingListFilterParams {
  bot_id: string;
}

export interface IMailingListItemModel {
  id: number;
  bot: number;
  photo: string;
  text: string;
  is_send: boolean;
  schedule_date: string;
  schedule_time: string;
  schedule_id: string;
  success: number;
  error: number;
  created_at: string;
  buttons: Array<{
    id: number;
    name: string;
    url: string;
    clicked: number;
  }>
}

export interface IMailingDetailsModel {
  id: number;
  bot: number;
  photo: string;
  text: string;
  is_send: boolean;
  schedule_date: string;
  schedule_time: string;
  schedule_id: string;
  success: number;
  error: number;
  total_clicked: number;
  created_at: string;
  buttons: Array<{
    id: number;
    name: string;
    url: string;
    clicked: number;
  }>
}

export interface IMailingCreateModel {
  bot: number;
  text: string;
  is_send: boolean;
  schedule_date: string;
  schedule_time: string;
  buttons: Array<{
    name: string;
    url: string;
  }>
}

export interface IMailingCreateResponse {
  id: number;
}

export interface IMailingUpdateModel extends IMailingCreateModel {
  id: number;
}

export interface IMailingUpdateResponse {
  id: number;
}

export interface IMailingDeleteResponse {
  id: number;
}

export interface IMailingSendResponse {
  id: number;
}

export interface IMailingAddTimeModel {
  id: number;
  date: string;
  time: string;
}
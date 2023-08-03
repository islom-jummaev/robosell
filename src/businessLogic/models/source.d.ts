export interface ISourceListFilterParams {
  offset?: number | undefined;
}

export interface ISourceListParams extends ISourceListFilterParams {
  bot_id: string;
}

export interface ISourceListItemModel {
  id: number;
  old_visits: number;
  name: string;
  code: string;
  url: string;
  total_visits: number;
  new_visits: number;
  last_visit_time: string;
  order_sum: number;
  order_count: number;
  created_at: string;
  bot: number;
}

export interface ISourceCreateModel {
  name: string;
  bot: number;
}

export interface ISourceCreateResponse {
  id: number;
}


export interface ISourceDeleteResponse {
  id: number;
}
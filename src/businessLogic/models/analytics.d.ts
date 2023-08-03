export interface IAnalyticsAllModel {
  avarage: number;
  orders: number;
  total: number;
  users: number;
}

export interface IAnalyticsGraphModel {
  month: string;
  count: number;
}

export interface IAnalyticsSourcesModel {
  name: string;
  new_visits: number;
  old_visits: number;
}

export interface IAnalyticsTopUsersModel {
  id: number;
  firstname: string;
  username: string;
  photo: string;
  lang: string;
  phone: string;
  orders_count: number;
  created_at: string;
  last_active: string;
}
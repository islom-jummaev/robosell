export interface IUsersListFilterParams {
  offset?: number | undefined;
  search?: string | undefined;
}

export interface IUsersListParams extends IUsersListFilterParams{
  bot_id: string;
}

export interface IUsersListItemModel {
  id: number;
  username: string;
  firstname: string;
  photo: string;
  lang: string;
  phone: string;
  orders_count: number;
  created_at: string;
  last_active: string;
}

export interface IUserDetailsModel {
  id: number;
  username: string;
  firstname: string;
  photo: string;
  lang: string;
  phone: string;
  orders_count: number;
  created_at: string;
  last_active: string;
  address: string;
  amount_paid: number;
  successful_orders: number;
}

export interface IUserOrdersListFilterParams {
  offset?: number | undefined;
}

export interface IUserOrdersListParams extends IUserOrdersListFilterParams {
  userId: string;
}

export interface IUserOrdersListItemModel {
  id: number;
  bot: number;
  botuser: string;
  phone: string;
  status: {
    key: string;
    value: string;
  };
  total_price: number;
  payment_type: number;
  service_type: {
    key: string;
    value: string;
  };
  is_paid: boolean;
  created_at: string;
}
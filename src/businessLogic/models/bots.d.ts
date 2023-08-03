import { ILocalizeModel } from "@customTypes/apiResponseModels";

export interface IBotsListItemModel {
  is_current: boolean;
  chat_id: number;
  created_at: string;
  firstname: string;
  id: number
  is_active: boolean;
  is_deleted: boolean;
  languages: Array<number>;
  token: string;
  updated_at: string;
  users: number;
  username: string;
}

export interface IBotGeneralDetailsModel {
  bot: string;
  open: null;
  close: null;
  group_token: string;
  auto_answer: ILocalizeModel;
  extra_info: ILocalizeModel;
  start_text: ILocalizeModel;
}

interface IBotLanguageItem {
  checked: boolean;
  code: string;
  id: number;
  name: string;
}

export interface IBotLanguageDetailsModel {
  languages: Array<IBotLanguageItem>;
}

interface IDeliveryTypeItemModel {
  checked: boolean;
  code: string;
  name: string;
}

interface IDeliveryServiceTypeItemModel {
  checked: boolean;
  code: string;
  name: string;
}

export interface IBotDeliveryDetailsModel {
  bot: number;
  delivery_price: number;
  delivery_custom_text: string;
  km_for_free: number;
  max_km: number;
  service_type: Array<IDeliveryServiceTypeItemModel>;
  delivery_type: Array<IDeliveryTypeItemModel>;
  country: number;
  city: Array<number>;
}

export interface IBotAddressDetailsModel {
  id: number;
  latitude: number;
  longitude: number;
  address: string,
  created_at: string;
  bot: number;
}

export interface IBotPaymentDetailsItem {
  detail: {
    token: string;
    is_active: boolean;
  };
  have_token: boolean;
  icon: string;
  payment: {
    id: number;
    name: string;
  };
}

export interface IBotPaymentDetailsModel {
  bot: number;
  payments: Array<IBotPaymentDetailsItem>
}

export interface IBotCreateModel {
  token: string;
}

export interface IBotCreateResponseModel {
  firstname: string;
  token: string;
  user: number;
  username: string;
  bot: number;
}

export interface IBotGeneralDetailsUpdateModel {
  id: string;
  open: string | undefined;
  close: string | undefined;
  start_text: {
    en?: string;
    ru?: string;
    uz?: string;
  };
  extra_info: {
    en?: string;
    ru?: string;
    uz?: string;
  };
  auto_answer: {
    en?: string;
    ru?: string;
    uz?: string;
  };
}

export interface IBotGeneralDetailsUpdateResponseModel {
  bot: number;
  open: string;
  close: string;
  group_token: string;
  auto_answer: ILocalizeModel;
  extra_info: ILocalizeModel;
  start_text: ILocalizeModel;
}

export interface IBotLanguageDetailsUpdateModel {
  id: string;
  languages: Array<number>;
}

export interface IBotLanguageDetailsUpdateResponseModel {
  languages: Array<number>;
}

export interface IBotDeliveryDetailsUpdateModel {
  id: string;
  delivery_price: number;
  delivery_custom_text: string;
  km_for_free: number;
  max_km: number;
  service_type: Array<string>;
  delivery_type: string;
  country: number;
  city: Array<number>;
}

export interface IBotDeliveryDetailsUpdateResponseModel {
  bot: number;
  delivery_price: number;
  delivery_custom_text: string;
  km_for_free: number;
  max_km: number;
  service_type: Array<string>;
  delivery_type: string;
}

export interface IBotAddressUpdateModel {
  id: string;
  latitude: number;
  longitude: number;
}

export interface IBotAddressUpdateResponseModel {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
  created_at: string;
  bot: number;
}

export interface IBotPaymentDetailsUpdateModel {
  id: string;
  token: string;
  is_active: boolean;
  payment: number;
}

export interface IBotPaymentDetailsUpdateResponseModel {

}

export interface IBotChangeTokenModel {
  id: string;
  token: string;
}

export interface IBotChangeTokenResponseModel {

}

export interface IBotRestartResponseModel {
  errors: Array<string>;
  message: string;
}

export interface IBotStopResponseModel {

}

export interface IBotDeleteResponseModel {

}

export interface IBotCountryModel {
  id: number;
  code: string;
  name: ILocalizeModel;
}

export interface IBotCitiesModel {
  id: number;
  position: number;
  name: ILocalizeModel;
  country: number;
}
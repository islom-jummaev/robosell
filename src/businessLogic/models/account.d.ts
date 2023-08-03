export interface ICurrentUserModel {
  id: number;
  password: string;
  last_login: null | string;
  phone: string;
  firstname: string;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  groups: Array<string>;
  user_permissions: Array<string>;
  language: string;
}

export interface IForgotPasswordStep1Model {
  phone: string;
}

export interface IForgotPasswordStep2Model {
  phone: string;
  code: string;
}

export interface IForgotPasswordStep2ResponseModel {
  id: number;
}

export interface IForgotPasswordStep3Model {
  id: number;
  password: string;
  confirm_password: string;
}

export interface IChangeLanguageModel {
  language: string;
}
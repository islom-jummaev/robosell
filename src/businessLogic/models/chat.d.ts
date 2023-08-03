

export interface IChatListFilterParams {
  offset?: number | undefined;
  search?: string;
  is_new?: boolean | undefined;
}

export interface IChatListParams extends IChatListFilterParams {
  bot_id: string;
}

export interface IChatListItemModel {
  id: number | string;
  firstname: string;
  photo: string;
  chat: {
    last_chat: string;
    new_chats_count: number;
  };
  last_chat_time: string;
}

export interface IChatWithUserFilterParams {
  offset?: number | undefined;
  limit?: number
}

export interface IChatWithUserParams extends IChatWithUserFilterParams {
  botuser: string;
}

export interface IChatFileModel {
  name: string;
  type: string;
  url: string;
}

export interface IChatWithUserItemModel {
  id: number | string;
  text: string;
  file: null | IChatFileModel;
  is_bot: boolean;
  is_new?: boolean;
  message_id?: string;
  created_at: string;
  bot: number | string;
  botuser: number | string;
}

export interface IChatWithUserDetailsModel {
  id: number;
  firstname: string;
  username: string;
  phone: string;
  photo: string;
}

export interface IChatSendFileMessageModel {
  file: IChatFileModel;
  created_at: string;
  bot: number;
  botuser: number;
  id: number;
  is_bot: boolean;
  is_new: boolean;
  message_id: number;
  text: null | string;
}
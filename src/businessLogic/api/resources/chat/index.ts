import { HandlerType } from "@core/zustand/types/handler";
import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from "@core/httpClient";

import * as chatModels from "@/businessLogic/models/chat";
import { PaginationListModel } from "@customTypes/apiResponseModels";


export const getChatList: HandlerType<chatModels.IChatListParams, PaginationListModel<chatModels.IChatListItemModel>> = ({ bot_id, ...params }) => {
  return httpGet({
    url: `/chat/botuser/list/${bot_id}`,
    params
  });
};

export const getChatWithUser: HandlerType<chatModels.IChatWithUserParams, PaginationListModel<chatModels.IChatWithUserItemModel>> = ({ botuser, ...params }) => {
  return httpGet({
    url: `/chat/list/${botuser}`,
    params
  });
};

export const getChatWithUserDetails: HandlerType<string, chatModels.IChatWithUserDetailsModel> = (botuser) => {
  return httpGet({
    url: `/chat/botuser/detail/${botuser}`,
  });
};

export const chatSendFileMessage: HandlerType<any, chatModels.IChatSendFileMessageModel> = ({ botuser_id, data }) => {
  return httpPost({
    url: `/chat/upload/file/${botuser_id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as chatModels from "@/businessLogic/models/chat";
import { PaginationListModel } from "@customTypes/apiResponseModels";
import { create } from "zustand";

type ChatListNewestStoreType = {
  list: Array<chatModels.IChatListItemModel>,
  ids: { [key: string]: boolean };
  update: (p: chatModels.IChatListItemModel) => void;
  reset: () => void;
}

export const $chatListNewest = {
  useStore: create<ChatListNewestStoreType>()((set) => ({
    list: [],
    ids: {},
    update: (item) => {
      set((prev) => {
        let newItems = [ ...prev.list ];

        if (prev.ids[item.id]) {
          newItems = newItems.filter((curItem) => String(curItem.id) !== String(item.id));
        }

        newItems.unshift(item);

        return {
          list: newItems,
          ids: {
            ...prev.ids,
            [item.id]: true
          }
        };
      });
    },
    reset: () => {
      set({ list: [], ids: {} });
    },
  }))
};

export const $chatList = storeCreator<chatModels.IChatListParams, PaginationListModel<chatModels.IChatListItemModel>, null>(
  api.chat.getChatList,
  initialStateConstructor(null)
);

export const $chatWithUser = storeCreator<chatModels.IChatWithUserParams, PaginationListModel<chatModels.IChatWithUserItemModel>, null>(
  api.chat.getChatWithUser,
  initialStateConstructor(null)
);

export const $chatWithUserDetails = storeCreator<string, chatModels.IChatWithUserDetailsModel, null>(
  api.chat.getChatWithUserDetails,
  initialStateConstructor(null)
);

export const $chatSendFileMessage = storeCreator<any, chatModels.IChatSendFileMessageModel, null>(
  api.chat.chatSendFileMessage,
  initialStateConstructor(null)
);
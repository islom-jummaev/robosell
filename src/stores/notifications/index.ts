import { create } from "zustand";


export interface ChatNotificationModel {
  type: "CHAT";
  data: {
    botuser: number;
    created_at: string;
    message: string;
    message_id: number;
    file: any;
    chat: number;
    photo: string;
    firstname: string;
    new_chats_count: number;
  };
}

type ChatNotificationStoreType = {
  notification: ChatNotificationModel | null,
  update: (p: ChatNotificationModel) => void;
  reset: () => void;
}

export const $chatNotification = {
  useStore: create<ChatNotificationStoreType>()((set) => ({
    notification: null,
    update: (notification) => {
      set({ notification });
    },
    reset: () => {
      set({ notification: null });
    },
  }))
};

export interface OrdersNotificationModel {
  type: "ORDER";
  data: {
    id: number;
    botuser: string;
    phone: string;
    total_price: number;
    payment_type: string;
    is_paid: boolean;
    created_at: string;
    service_type: {
      key: string;
      value: string;
    };
    status: {
      key: string;
      value: string;
    };
  };
}

type OrdersNotificationStoreType = {
  notification: OrdersNotificationModel | null,
  update: (p: OrdersNotificationModel) => void;
  reset: () => void;
}

export const $ordersNotification = {
  useStore: create<OrdersNotificationStoreType>()((set) => ({
    notification: null,
    update: (notification) => {
      set({ notification });
    },
    reset: () => {
      set({ notification: null });
    },
  }))
};

type SendChatNotificationStoreType = {
  data: string | null;
  update: (data: string) => void;
  reset: () => void;
}

export const $sendChatNotification = {
  useStore: create<SendChatNotificationStoreType>()((set) => ({
    data: null,
    update: (data) => {
      set({ data });
    },
    reset: () => {
      set({ data: null });
    },
  }))
};

type ShowChatNotificationsStoreType = {
  value: boolean;
  update: (value: boolean) => void;
}

export const $showNotifications = {
  useStore: create<ShowChatNotificationsStoreType>()((set) => ({
    value: true,
    update: (value) => {
      set({ value });
    },
  }))
};
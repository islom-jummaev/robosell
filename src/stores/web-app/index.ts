import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as webAppModels from "@/businessLogic/models/web-app";
import { PaginationListModel } from "@customTypes/apiResponseModels";
import { create } from "zustand";
import { currentLangType } from "@utils/getters";
import { IWebAppNewsItemModel } from "@/businessLogic/models/web-app";

export const $webAppList = storeCreator<webAppModels.IWebAppListParams, webAppModels.IWebAppListItemModel, null>(
  api.webApp.getWebAppList,
  initialStateConstructor(null)
);

export const $webAppCategories = storeCreator<string, Array<webAppModels.IWebAppCategoriesItemModel>, []>(
  api.webApp.getWebAppCategories,
  initialStateConstructor([])
);

export const $webAppProducts = storeCreator<webAppModels.IWebAppProductsParams, PaginationListModel<webAppModels.IWebAppProductsItemModel>, null>(
  api.webApp.getWebAppProducts,
  initialStateConstructor(null)
);

export const $webAppProductDetails = storeCreator<number, webAppModels.IWebAppProductDetailsModel, null>(
  api.webApp.getWebAppProductDetails,
  initialStateConstructor(null)
);

export const $addWebAppProductToBasket = storeCreator<webAppModels.IAddWebAppProductToBasketModel, null, null>(
  api.webApp.addWebAppProductToBasket,
  initialStateConstructor(null)
); // todo cancel token

type WebAppEntryStateType = {
  bot_id: string;
  user_id: string;
  user_lang: currentLangType;
  category_id?: string;
  open: string | null;
  close: string | null;
}

type WebAppEntryType = {
  update: (p: WebAppEntryStateType) => void;
  reset: () => void;
} & WebAppEntryStateType;

const initialWebAppState: WebAppEntryStateType = {
  bot_id: "",
  user_id: "",
  user_lang: "ru",
  category_id: "",
  open: null,
  close: null
};

export const $webAppEntry = {
  useStore: create<WebAppEntryType>()((set) => ({
    ...initialWebAppState,
    update: (data) => {
      set({ ...data });
    },
    reset: () => {
      set(initialWebAppState)
    }
  }))
};

export type shopAppStackType  = "HOME" | "SALE" | "NEWS";

export const $webAppStack = {
  useStore: create<{ stack: shopAppStackType; update: (p: { stack: shopAppStackType }) => void; }>()((set) => ({
    stack: "HOME",
    update: (data) => {
      console.log("asd", data);

      set({ stack: data.stack });
    },
  }))
};

type WebAppBasketControlStateType = {
  open?: boolean;
  length?: number;
}

type WebAppBasketControlType = {
  update: (p: WebAppBasketControlStateType) => void;
} & WebAppBasketControlStateType;

export const $webAppBasketControl = {
  useStore: create<WebAppBasketControlType>()((set) => ({
    open: false,
    length: 0,
    update: (data) => {
      set((prevState) => ({ ...prevState, ...data }));
    },
  }))
};

export const $webAppUserDetails = storeCreator<string, webAppModels.IWebAppUserDetailsModel, null>(
  api.webApp.getWebAppUserDetails,
  initialStateConstructor(null)
);

export const $webAppBasketProducts = storeCreator<string, Array<webAppModels.IWebAppBasketProductsItemModel>, null>(
  api.webApp.getWebAppBasketProducts,
  initialStateConstructor(null)
);

export const $clearBasket = storeCreator<string, null, null>(
  api.webApp.clearBasket,
  initialStateConstructor(null)
);

export const $removeBasketItem = storeCreator<webAppModels.IAddWebAppRemoveBasketItemModel, null, null>(
  api.webApp.removeBasketItem,
  initialStateConstructor(null)
);

export const $webAppPayments = storeCreator<string, Array<webAppModels.IWebAppPaymentsItemModel>, null>(
  api.webApp.getWebAppPayments,
  initialStateConstructor(null)
);

export const $webAppSales = storeCreator<string, Array<webAppModels.IWebAppSalesItemModel>, null>(
  api.webApp.getWebAppSales,
  initialStateConstructor(null)
);

export const $webAppNews = storeCreator<string, Array<webAppModels.IWebAppNewsItemModel>, null>(
  api.webApp.getWebAppNews,
  initialStateConstructor(null)
);

type WebAppCurrentNewsStateType = {
  currentNews: IWebAppNewsItemModel | null;
}

type WebAppCurrentNewsType = {
  update: (p: WebAppCurrentNewsStateType) => void;
} & WebAppCurrentNewsStateType;

export const $webAppCurrentNews = {
  useStore: create<WebAppCurrentNewsType>()((set) => ({
    currentNews: null,
    update: (data) => {
      set(data);
    },
  }))
};
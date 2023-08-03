import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as accountModels from "@/businessLogic/models/account";

export const $currentUser = storeCreator<string, accountModels.ICurrentUserModel, null>(
  api.account.getCurrentUser,
  initialStateConstructor(null)
);

export const $forgotPasswordStep1 = storeCreator<accountModels.IForgotPasswordStep1Model, accountModels.IForgotPasswordStep1Model, null>(
  api.account.forgotPasswordStep1,
  initialStateConstructor(null)
);

export const $forgotPasswordStep2 = storeCreator<accountModels.IForgotPasswordStep2Model, accountModels.IForgotPasswordStep2ResponseModel, null>(
  api.account.forgotPasswordStep2,
  initialStateConstructor(null)
);

export const $forgotPasswordStep3 = storeCreator<accountModels.IForgotPasswordStep3Model, number, null>(
  api.account.forgotPasswordStep3,
  initialStateConstructor(null)
);

export const $changeLanguage = storeCreator<accountModels.IChangeLanguageModel, null, null>(
  api.account.changeLanguage,
  initialStateConstructor(null)
);
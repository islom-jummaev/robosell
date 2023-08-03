import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as mailingModels from "@/businessLogic/models/mailing";
import { PaginationListModel } from "@customTypes/apiResponseModels";

export const $mailingList = storeCreator<mailingModels.IMailingListParams, PaginationListModel<mailingModels.IMailingListItemModel>, null>(
  api.mailing.getMailingList,
  initialStateConstructor(null)
);

export const $mailingDetails = storeCreator<number, mailingModels.IMailingDetailsModel, null>(
  api.mailing.getMailingDetails,
  initialStateConstructor(null)
);

export const $mailingCreate = storeCreator<any, mailingModels.IMailingCreateResponse, null>(
  api.mailing.mailingCreate,
  initialStateConstructor(null)
);

export const $mailingUpdate = storeCreator<any, mailingModels.IMailingUpdateResponse, null>(
  api.mailing.mailingUpdate,
  initialStateConstructor(null)
);

export const $mailingDelete = storeCreator<number, mailingModels.IMailingDeleteResponse, null>(
  api.mailing.mailingDelete,
  initialStateConstructor(null)
);

export const $mailingSend = storeCreator<number, mailingModels.IMailingSendResponse, null>(
  api.mailing.mailingSend,
  initialStateConstructor(null)
);

export const $mailingCopy = storeCreator<number, null, null>(
  api.mailing.mailingCopy,
  initialStateConstructor(null)
);

export const $mailingAddTime = storeCreator<mailingModels.IMailingAddTimeModel, null, null>(
  api.mailing.mailingAddTime,
  initialStateConstructor(null)
);
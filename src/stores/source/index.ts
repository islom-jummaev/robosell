import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as sourceModels from "@/businessLogic/models/source";
import { PaginationListModel } from "@customTypes/apiResponseModels";

export const $sourceList = storeCreator<sourceModels.ISourceListParams, PaginationListModel<sourceModels.ISourceListItemModel>, null>(
  api.source.getSourceList,
  initialStateConstructor(null)
);

export const $sourceCreate = storeCreator<sourceModels.ISourceCreateModel, sourceModels.ISourceCreateResponse, null>(
  api.source.sourceCreate,
  initialStateConstructor(null)
);

export const $sourceDelete = storeCreator<number, sourceModels.ISourceDeleteResponse, null>(
  api.source.sourceDelete,
  initialStateConstructor(null)
);
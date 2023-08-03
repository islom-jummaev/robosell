import { storeCreator } from "@core/zustand";
import * as analyticsModels from "@/businessLogic/models/analytics";
import { api } from "@/businessLogic/api";
import { initialStateConstructor } from "@utils/constructors/store";

export const $analyticsAll = storeCreator<string, analyticsModels.IAnalyticsAllModel, null>(
  api.analytics.getAnalyticsAll,
  initialStateConstructor(null)
);

export const $analyticsGraph = storeCreator<string, Array<analyticsModels.IAnalyticsGraphModel>, []>(
  api.analytics.getAnalyticsGraph,
  initialStateConstructor([])
);

export const $analyticsSources = storeCreator<string, Array<analyticsModels.IAnalyticsSourcesModel>, []>(
  api.analytics.getAnalyticsSources,
  initialStateConstructor([])
);

export const $analyticsTopUsers = storeCreator<string, Array<analyticsModels.IAnalyticsTopUsersModel>, []>(
  api.analytics.getAnalyticsTopUsers,
  initialStateConstructor([])
);
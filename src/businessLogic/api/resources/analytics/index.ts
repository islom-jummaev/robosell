import { HandlerType } from "@core/zustand/types/handler";
import { httpGet, httpPost } from "@core/httpClient";
import * as analyticsModels from "@/businessLogic/models/analytics";


export const getAnalyticsAll: HandlerType<string, analyticsModels.IAnalyticsAllModel> = (id) => {
  return httpGet({
    url: `/analytics/all/${id}`,
  });
};

export const getAnalyticsGraph: HandlerType<string, Array<analyticsModels.IAnalyticsGraphModel>> = (id) => {
  return httpGet({
    url: `/analytics/graph/${id}`,
  });
};

export const getAnalyticsSources: HandlerType<string, Array<analyticsModels.IAnalyticsSourcesModel>> = (id) => {
  return httpGet({
    url: `/analytics/sources/${id}`,
  });
};

export const getAnalyticsTopUsers: HandlerType<string, Array<analyticsModels.IAnalyticsTopUsersModel>> = (id) => {
  return httpGet({
    url: `/analytics/top/users/${id}`,
  });
};
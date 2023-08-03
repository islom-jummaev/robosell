import i18next, { i18n as i18nInstance } from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { getCurrentLang } from "@utils/getters";

import { namespaces } from "./i18n.constants";

import ruCommon from "./locales/ru/common.json";
import ruAuth from "./locales/ru/auth.json";
import ruDashboard from "./locales/ru/dashboard.json";
import ruOrders from "./locales/ru/orders.json";
import ruUsers from "./locales/ru/users.json";
import ruMarketing from "./locales/ru/marketing.json";
import ruBots from "./locales/ru/bots.json";
import ruWepApp from "./locales/ru/web-app.json";
import ruCategories from "./locales/ru/categories.json";
import ruProducts from "./locales/ru/products.json";
import ruBranches from "./locales/ru/branches.json";
import ruDocumentation from "./locales/ru/documentation.json";

import uzCommon from "./locales/uz/common.json";
import uzAuth from "./locales/uz/auth.json";
import uzDashboard from "./locales/uz/dashboard.json";
import uzOrders from "./locales/uz/orders.json";
import uzUsers from "./locales/uz/users.json";
import uzMarketing from "./locales/uz/marketing.json";
import uzBots from "./locales/uz/bots.json";
import uzWepApp from "./locales/uz/web-app.json";
import uzCategories from "./locales/uz/categories.json";
import uzProducts from "./locales/uz/products.json";
import uzBranches from "./locales/uz/branches.json";
import uzDocumentation from "./locales/uz/documentation.json";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enDashboard from "./locales/en/dashboard.json";
import enOrders from "./locales/en/orders.json";
import enUsers from "./locales/en/users.json";
import enMarketing from "./locales/en/marketing.json";
import enBots from "./locales/en/bots.json";
import enWepApp from "./locales/en/web-app.json";
import enCategories from "./locales/en/categories.json";
import enProducts from "./locales/en/products.json";
import enBranches from "./locales/en/branches.json";
import enDocumentation from "./locales/en/documentation.json";

export const defaultNS = namespaces.common;

type TResources = {
  ru: {
    [namespaces.common]: typeof ruCommon;
    [namespaces.auth]: typeof ruAuth;
    [namespaces.dashboard]: typeof ruDashboard;
    [namespaces.orders]: typeof ruOrders;
    [namespaces.users]: typeof ruUsers;
    [namespaces.marketing]: typeof ruMarketing;
    [namespaces.bots]: typeof ruBots;
    [namespaces.webApp]: typeof ruWepApp;
    [namespaces.categories]: typeof ruCategories;
    [namespaces.products]: typeof ruProducts;
    [namespaces.branches]: typeof ruBranches;
    [namespaces.documentation]: typeof ruDocumentation;
  };
  uz: {
    [namespaces.common]: typeof uzCommon;
    [namespaces.auth]: typeof uzAuth;
    [namespaces.dashboard]: typeof uzDashboard;
    [namespaces.orders]: typeof uzOrders;
    [namespaces.users]: typeof uzUsers;
    [namespaces.marketing]: typeof uzMarketing;
    [namespaces.bots]: typeof uzBots;
    [namespaces.webApp]: typeof uzWepApp;
    [namespaces.categories]: typeof uzCategories;
    [namespaces.products]: typeof uzProducts;
    [namespaces.branches]: typeof uzBranches;
    [namespaces.documentation]: typeof uzDocumentation;
  },
  en: {
    [namespaces.common]: typeof enCommon;
    [namespaces.auth]: typeof enAuth;
    [namespaces.dashboard]: typeof enDashboard;
    [namespaces.orders]: typeof enOrders;
    [namespaces.users]: typeof enUsers;
    [namespaces.marketing]: typeof enMarketing;
    [namespaces.bots]: typeof enBots;
    [namespaces.webApp]: typeof enWepApp;
    [namespaces.categories]: typeof enCategories;
    [namespaces.products]: typeof enProducts;
    [namespaces.branches]: typeof enBranches;
    [namespaces.documentation]: typeof enDocumentation;
  }
};

export const resources: TResources = {
  ru: {
    [namespaces.common]: ruCommon,
    [namespaces.auth]: ruAuth,
    [namespaces.dashboard]: ruDashboard,
    [namespaces.orders]: ruOrders,
    [namespaces.users]: ruUsers,
    [namespaces.marketing]: ruMarketing,
    [namespaces.bots]: ruBots,
    [namespaces.webApp]: ruWepApp,
    [namespaces.categories]: ruCategories,
    [namespaces.products]: ruProducts,
    [namespaces.branches]: ruBranches,
    [namespaces.documentation]: ruDocumentation,
  },
  uz: {
    [namespaces.common]: uzCommon,
    [namespaces.auth]: uzAuth,
    [namespaces.dashboard]: uzDashboard,
    [namespaces.orders]: uzOrders,
    [namespaces.users]: uzUsers,
    [namespaces.marketing]: uzMarketing,
    [namespaces.bots]: uzBots,
    [namespaces.webApp]: uzWepApp,
    [namespaces.categories]: uzCategories,
    [namespaces.products]: uzProducts,
    [namespaces.branches]: uzBranches,
    [namespaces.documentation]: uzDocumentation,
  },
  en: {
    [namespaces.common]: enCommon,
    [namespaces.auth]: enAuth,
    [namespaces.dashboard]: enDashboard,
    [namespaces.orders]: enOrders,
    [namespaces.users]: enUsers,
    [namespaces.marketing]: enMarketing,
    [namespaces.bots]: enBots,
    [namespaces.webApp]: enWepApp,
    [namespaces.categories]: enCategories,
    [namespaces.products]: enProducts,
    [namespaces.branches]: enBranches,
    [namespaces.documentation]: enDocumentation,
  }
};

const createI18n = (language: string): i18nInstance => {
  const i18n = i18next.createInstance().use(initReactI18next);

  i18n.use(detector).init({
    lng: language,
    fallbackLng: language,
    ns: namespaces.common,
    defaultNS,
    resources,
  });

  return i18n;
};

export const i18n = createI18n(getCurrentLang());

import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import locale from "antd/es/locale/ru_RU";
import { i18n } from "@core/localization/i18n";
import { ToastContainer } from "react-toastify";
import { I18nextProvider } from "react-i18next";
import Router from "./router";

// Plugins
import "./shared/plugins/react-toastify";
// styles
import "./assets/styles/main.scss";
import { antdTheme } from "@/assets/styles/antd-theme";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ConfigProvider
    locale={locale}
    theme={antdTheme}
  >
    <I18nextProvider i18n={i18n}>
      <ToastContainer limit={6} />
      <Router />
    </I18nextProvider>
  </ConfigProvider>
);
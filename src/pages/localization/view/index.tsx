import React, { useState } from "react";

import { MainLocale } from "@/pages/localization/view/mainLocale";
import { LocalToChange } from "@/pages/localization/view/localToChange";

import commonRU from "@core/localization/locales/ru/common.json";
import authRU from "@core/localization/locales/ru/auth.json";
import ordersRU from "@core/localization/locales/ru/orders.json";
import botRU from "@core/localization/locales/ru/bots.json";
import branchesRU from "@core/localization/locales/ru/branches.json";
import categoriesRU from "@core/localization/locales/ru/categories.json";
import dashboardRU from "@core/localization/locales/ru/dashboard.json";
import documentationRU from "@core/localization/locales/ru/documentation.json";
import marketingRU from "@core/localization/locales/ru/marketing.json";
import productsRU from "@core/localization/locales/ru/products.json";
import usersRU from "@core/localization/locales/ru/users.json";
import webAppRU from "@core/localization/locales/ru/web-app.json";

import commonUz from "@core/localization/locales/uz/common.json";
import authUz from "@core/localization/locales/uz/auth.json";
import ordersUz from "@core/localization/locales/uz/orders.json";
import botUz from "@core/localization/locales/uz/bots.json";
import branchesUz from "@core/localization/locales/uz/branches.json";
import categoriesUz from "@core/localization/locales/uz/categories.json";
import dashboardUz from "@core/localization/locales/uz/dashboard.json";
import documentationUz from "@core/localization/locales/uz/documentation.json";
import marketingUz from "@core/localization/locales/uz/marketing.json";
import productsUz from "@core/localization/locales/uz/products.json";
import usersUz from "@core/localization/locales/uz/users.json";
import webAppUz from "@core/localization/locales/uz/web-app.json";

import commonEng from "@core/localization/locales/en/common.json";
import authEng from "@core/localization/locales/en/auth.json";
import ordersEng from "@core/localization/locales/en/orders.json";
import botEng from "@core/localization/locales/en/bots.json";
import branchesEng from "@core/localization/locales/en/branches.json";
import categoriesEng from "@core/localization/locales/en/categories.json";
import dashboardEng from "@core/localization/locales/en/dashboard.json";
import documentationEng from "@core/localization/locales/en/documentation.json";
import marketingEng from "@core/localization/locales/en/marketing.json";
import productsEng from "@core/localization/locales/en/products.json";
import usersEng from "@core/localization/locales/en/users.json";
import webAppEng from "@core/localization/locales/en/web-app.json";

import styles from "./styles.module.scss";
import { ContentLayout } from "@/components/content-layout";

const Localization = () => {
  const [selectedBaseFile, setSelectedBaseFile] = useState(null);

  const ruFiles = [
    { name: "common.json", file: commonRU },
    { name: "auth.json", file: authRU },
    { name: "orders.json", file: ordersRU },
    { name: "bot.json", file: botRU },
    { name: "branches.json", file: branchesRU },
    { name: "categories.json", file: categoriesRU },
    { name: "dashboard.json", file: dashboardRU },
    { name: "documentation.json", file: documentationRU },
    { name: "marketing.json", file: marketingRU },
    { name: "products.json", file: productsRU },
    { name: "users.json", file: usersRU },
    { name: "webApp.json", file: webAppRU },
  ];

  const [ uzFiles, setUzFiles ] = useState([
    { name: "common.json", file: commonUz },
    { name: "auth.json", file: authUz },
    { name: "orders.json", file: ordersUz },
    { name: "bot.json", file: botUz },
    { name: "branches.json", file: branchesUz },
    { name: "categories.json", file: categoriesUz },
    { name: "dashboard.json", file: dashboardUz },
    { name: "documentation.json", file: documentationUz },
    { name: "marketing.json", file: marketingUz },
    { name: "products.json", file: productsUz },
    { name: "users.json", file: usersUz },
    { name: "webApp.json", file: webAppUz },
  ]);

  const [ engFiles, setEngFiles ] = useState([
    { name: "common.json", file: commonEng },
    { name: "auth.json", file: authEng },
    { name: "orders.json", file: ordersEng },
    { name: "bot.json", file: botEng },
    { name: "branches.json", file: branchesEng },
    { name: "categories.json", file: categoriesEng },
    { name: "dashboard.json", file: dashboardEng },
    { name: "documentation.json", file: documentationEng },
    { name: "marketing.json", file: marketingEng },
    { name: "products.json", file: productsEng },
    { name: "users.json", file: usersEng },
    { name: "webApp.json", file: webAppEng },
  ]);

  return (
    <ContentLayout
      title={(
        <h1>Локализация</h1>
      )}
    >
      <div className={styles.wrap}>
        <div className={styles.col}>
          <MainLocale
            files={ruFiles}
            selectedBaseFile={selectedBaseFile}
            setSelectedBaseFile={setSelectedBaseFile}
          />
        </div>
        <div className={styles.col}>
          <LocalToChange
            languages={
              [
                { name: "O`zb", value: "uz", files: uzFiles, updateFiles: setUzFiles },
                { name: "Eng", value: "eng", files: engFiles, updateFiles: setEngFiles },
              ]
            }
            defaultFileName={"uz"}
            defaultUpdateFiles={setUzFiles}
            defaultSelectedFiles={uzFiles}
            selectedBaseFile={selectedBaseFile}
          />
        </div>
      </div>
    </ContentLayout>
  )
};

export default Localization;
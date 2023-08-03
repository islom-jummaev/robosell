import React, { useEffect, useState } from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { $webAppList } from "@stores/web-app";
import { Spinner } from "@ui/spinner";

import { $currentBot } from "@stores/bots";

import { getCurrentLang } from "@utils/getters";

const WebAppList = () => {
  const { t } = useTranslation();
  const currentLang = getCurrentLang();

  const { currentBot } = $currentBot.useStore();
  const { request: getWebAppList, reset: resetWebAppList, ...webAppListState } = $webAppList.useStore();


  const [filterParams, setFilterParams] = useState({});

  const getList = () => {
    if (currentBot) {
      getWebAppList({
        ...filterParams,
        bot_id: currentBot.id,
      });
    }
  }

  useEffect(() => {
    return () => {
      resetWebAppList();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getList();
    }
  }, [currentBot, filterParams]);



  return (
    <ContentLayout
      title={(
        <h1>{t("title", { ns: namespaces.webApp })}</h1>
      )}
    >
      {!webAppListState.data ? (
        <div className="bg-loader">
          <Spinner />
        </div>
      ) : (
        <>
          123
        </>
      )}
    </ContentLayout>
  )
};

export default WebAppList;
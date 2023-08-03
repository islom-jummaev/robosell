import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "antd";
import type { TabsProps } from 'antd';

import { ContentLayout } from "@/components/content-layout";

import { ButtonUI } from "@ui/button";
import { BackIcon } from "@assets/icons";

import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";

import { BotGeneralDetails } from "@/pages/bots/details/general";
import { BotLanguageDetails } from "@/pages/bots/details/language";
import { BotDeliveryDetails } from "@/pages/bots/details/delivery";
import { BotPaymentDetails } from "@/pages/bots/details/payment";
import { BotSettingsDetails } from "@/pages/bots/details/settings";

import styles from "./styles.module.scss";

const BotDetails: FC = () => {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("general.title", { ns: namespaces.bots }),
      children: <BotGeneralDetails botId={params.id ? params.id : ""} />,
    },
    {
      key: "2",
      label: t("lang.title", { ns: namespaces.bots }),
      children: <BotLanguageDetails botId={params.id ? params.id : ""} />,
    },
    {
      key: "3",
      label: t("delivery.title", { ns: namespaces.bots }),
      children: <BotDeliveryDetails botId={params.id ? params.id : ""} />,
    },
    {
      key: "4",
      label: t("payment.title", { ns: namespaces.bots }),
      children: <BotPaymentDetails botId={params.id ? params.id : ""} />,
    },
    {
      key: "5",
      label: t("settings.title", { ns: namespaces.bots }),
      children: <BotSettingsDetails botId={params.id ? params.id : ""}  />,
    },
  ];

  return (
    <ContentLayout
      title={(
        <h1>{t("bots", { ns: namespaces.bots })}</h1>
      )}
    >
      <div className={styles.subTitle}>
        <ButtonUI
          withIcon
          link="/bots-list"
        >
          <BackIcon /> <span>{t("botSettings", { ns: namespaces.bots })}</span>
        </ButtonUI>
      </div>
      <div className={styles.detailsContent}>
        <Tabs
          className={styles.tabs}
          defaultActiveKey="1"
          items={items}
          destroyInactiveTabPane={true}
          tabBarGutter={16}
        />
      </div>
    </ContentLayout>
  );
};

export default BotDetails;
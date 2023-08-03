import React, { useEffect } from "react";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { $currentBot } from "@stores/bots";
import { $analyticsAll } from "@stores/analytics";
import { namespaces } from "@core/localization/i18n.constants";
import { numberWithStringFormatter } from "@utils/formatters";

export const DashboardStats = () => {
  const { t } = useTranslation();

  const { currentBot } = $currentBot.useStore();
  const { request: getAnalyticsAll, reset: resetAnalyticsAll, ...analyticsAllState } = $analyticsAll.useStore();

  useEffect(() => {
    return () => {
      resetAnalyticsAll();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getAnalyticsAll(currentBot.id);
    }
  }, [currentBot]);

  return (
    <div className={styles.stats}>
      <div className={styles.item}>
        <div className={styles.title}>{t("clients", { ns: namespaces.dashboard })}</div>
        <div className={styles.value}>{analyticsAllState.data ? numberWithStringFormatter(analyticsAllState.data.users, 1) : ""}</div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>{t("totalOrders", { ns: namespaces.dashboard })}</div>
        <div className={styles.value}>{analyticsAllState.data ? numberWithStringFormatter(analyticsAllState.data.orders, 1) : ""}</div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>{t("total", { ns: namespaces.dashboard })}</div>
        <div className={styles.value}>{analyticsAllState.data ? numberWithStringFormatter(analyticsAllState.data.total, 1) : ""}</div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>{t("avarage", { ns: namespaces.dashboard })}</div>
        <div className={styles.value}>{analyticsAllState.data ? numberWithStringFormatter(analyticsAllState.data.avarage, 1) : ""}</div>
      </div>
    </div>
  );
};
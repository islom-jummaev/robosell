import React, { useEffect } from "react";
import { Area, Column } from "@ant-design/plots";

import styles from "./styles.module.scss";
import { formatCount } from "@utils/formatters";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "@utils/getters";
import { $currentBot } from "@stores/bots";
import { $analyticsGraph, $analyticsSources } from "@stores/analytics";
import { namespaces } from "@core/localization/i18n.constants";
import { IAnalyticsSourcesModel } from "@/businessLogic/models/analytics";
import { i18n } from "@core/localization/i18n";

type GroupedDataType = Array<{ num: string; name: string; value: number; itemName: string; }>;

const groupedData = (data: Array<IAnalyticsSourcesModel>) : GroupedDataType => {
  return data.reduce((prevState: GroupedDataType, currentItem, index) => {
    const res: GroupedDataType = [
      { num: String(index + 1), name: currentItem.name, value: currentItem.old_visits, itemName: i18n.t("current_clients") },
      { num: String(index + 1), name: currentItem.name, value: currentItem.new_visits, itemName: i18n.t("unique_clients") }
    ];

    return [ ...prevState, ...res ];
  }, []);
};

export const DashboardCharts = () => {
  const { t } = useTranslation();
  const currentLang = getCurrentLang();

  const { currentBot } = $currentBot.useStore();
  const { request: getAnalyticsGraph, reset: resetAnalyticsGraph, ...analyticsGraphState } = $analyticsGraph.useStore();
  const { request: getAnalyticsSources, reset: resetAnalyticsSources, ...analyticsSourcesState } = $analyticsSources.useStore();

  useEffect(() => {
    return () => {
      resetAnalyticsGraph();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getAnalyticsGraph(currentBot.id);
      getAnalyticsSources(currentBot.id);
    }
  }, [currentBot]);


  const config = {
    data: analyticsGraphState.data,
    xField: "month",
    yField: "count",
    height: 240,
    color: "#6662f4",
    areaStyle: {
      fill: "#c0c0f7",
    },
    yAxis: {
      grid: {
        line: { style: { stroke: "#EEEEFF" } }
      },
      line: { style: { stroke: "#6662F4", lineWidth: 2 } },
      label: {
        offsetX: -20,
        style: {
          fill: "#000"
        }
      }
    },
    xAxis: {
      line: { style: { stroke: "#6662F4", lineWidth: 2 } },
      range: [0, 1],
    },
    tooltip: {
      formatter: (v: any) => ({
        name: t("clients", { ns: namespaces.dashboard }),
        value: `${formatCount(Number(v.count))}`,
      }),
    },
  };

  const columnConfig = {
    data: groupedData(analyticsSourcesState.data),
    isGroup: true,
    xField: "name",
    yField: "value",
    seriesField: "itemName",
    height: 240,
    dodgePadding: 2,
    areaStyle: {
      fill: "#c0c0f7",
    },
    legend: {
      display: true,
      position: "top" as const,
      labels: {
        fontColor: "#000080"
      }
    },
    yAxis: {
      grid: {
        line: { style: { stroke: "#EEEEFF" } }
      },
    },
    xAxis: {
      label: {
        formatter: function formatter(value: string, data: any, m: any) {
          return value.length > 7 ? `${value.substring(0, 7)}...` : value;
        },
      },
      tickLine: { style: { stroke: "transparent" } },
      line: { style: { stroke: "transparent", } },
    }
  };

  return (
    <>
      <div className={styles.charts}>
        <div className={styles.col}>
          <div className={styles.title}>{t("allClients", { ns: namespaces.dashboard })}</div>
          <div className={styles.item}>
            <Area {...config} />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.title}>{t("source", { ns: namespaces.dashboard })}</div>
          <div className={styles.item}>
            <Column {...columnConfig} />
          </div>
        </div>
      </div>
    </>
  );
};
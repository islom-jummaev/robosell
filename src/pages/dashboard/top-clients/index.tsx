import React, { useEffect, useMemo } from "react";

import { TableUI } from "@ui/table";
import { ColumnsType } from "antd/lib/table/interface";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "@utils/getters";
import { $currentBot } from "@stores/bots";
import { $analyticsTopUsers } from "@stores/analytics";
import { IAnalyticsTopUsersModel } from "@/businessLogic/models/analytics";
import { namespaces } from "@core/localization/i18n.constants";
import userIcon from "@assets/images/user-icon.svg";
import { ExternalLinkIcon } from "@assets/icons";
import { formatCount, formatDate } from "@utils/formatters";
import { Image } from "antd";

export const DashboardTopClients = () => {
  const { t } = useTranslation();
  const currentLang = getCurrentLang();

  const { currentBot } = $currentBot.useStore();
  const { request: getAnalyticsTopUsers, reset: resetAnalyticsTopUsers, ...analyticsTopUsersState } = $analyticsTopUsers.useStore();

  useEffect(() => {
    return () => {
      resetAnalyticsTopUsers();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getAnalyticsTopUsers(currentBot.id);
    }
  }, [currentBot]);


  const tableColumns = useMemo(() => {
    const columns: ColumnsType<IAnalyticsTopUsersModel> = [
      {
        title: "№",
        dataIndex: "num",
        width: 50,
        render: (_, row, index) => <div>{index + 1}</div>,
      },
      {
        title: "Изображение",
        dataIndex: "photo",
        render: (_, row) => (
          <div className="table-photo">
            {row.photo ? (
              <Image
                src={row.photo}
                alt=""
                height={40}
              />
            ): (
              <img className="table-photo__user" src={userIcon} alt=""/>
            )}
          </div>
        ),
      },
      {
        title: t("fields.firstname"),
        dataIndex: "firstname",
        render: (_, row) => row.firstname,
      },
      {
        title: t("fields.username"),
        dataIndex: "username",
        render: (_, row) => (
          <>
            {row.username ? (
              <a className="link-with-icon" href={`https://t.me/${row.username}`} target="_blank">
                {row.username}
                <ExternalLinkIcon />
              </a>
            ) : "-"
            }
          </>
        ),
      },
      {
        title: t("fields.phone"),
        dataIndex: "phone",
        render: (_, row) => <a href={`tel:${row.phone}`}>{row.phone}</a>,
      },
      {
        title: t("order_count"),
        dataIndex: "order_count",
        render: (_, row) => formatCount(row.orders_count),
      },
      {
        title: t("dateAdded"),
        dataIndex: "created_at",
        render: (_, row) => <div className="w-n-r">{formatDate(row.created_at)}</div>,
      },
      {
        title: t("lastVisit"),
        dataIndex: "last_active",
        render: (_, row) => <div className="w-n-r">{formatDate(row.last_active)}</div>,
      },
    ];

    return columns;
  }, []);

  return (
    <div className={styles["top-clients"]}>
      <h2>{t("topClients", { ns: namespaces.dashboard })}</h2>

      <TableUI
        loading={analyticsTopUsersState.loading}
        dataSource={analyticsTopUsersState.data}
        columns={tableColumns}
        pagination={false}
        bordered={true}
      />
    </div>
  )
};
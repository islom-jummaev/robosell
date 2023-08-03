import React, { FC, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ColumnsType } from "antd/lib/table/interface";

import { $userDetails, $userOrdersList } from "@stores/users";

import { namespaces } from "@core/localization/i18n.constants";
import { ContentLayout } from "@/components/content-layout";
import { useTranslation } from "react-i18next";

import { Spinner } from "@ui/spinner";
import { ButtonUI } from "@ui/button";
import { TableUI } from "@ui/table";
import { StatusUI } from "@ui/status";

import { BackIcon, ExternalLinkIcon } from "@assets/icons";
import { formatCount, formatDate } from "@utils/formatters";

import { IOrdersListFilterParams, IOrdersListItemModel } from "@/businessLogic/models/orders";

import styles from "./styles.module.scss";

const UserDetails: FC = () => {
  const params = useParams<{ id: string }>();

  const { t } = useTranslation();

  const { request: getUserDetails, reset: resetUserDetails, ...userDetailsState } = $userDetails.useStore();
  const { request: getUserOrdersList, reset: resetUserOrdersList, ...userOrdersListState } = $userOrdersList.useStore();

  const { data: details, loading } = userDetailsState;

  const [filterParams, setFilterParams] = useState<IOrdersListFilterParams>({});

  useEffect(() => {
    if (params.id) {
      getUserDetails(params.id);
    }

    return () => {
      resetUserOrdersList();
      resetUserDetails();
    }
  }, []);

  useEffect(() => {
    if (params.id) {
      getUserOrdersList({
        userId: params.id,
        ...filterParams
      });
    }
  }, [filterParams]);

  const onFilterChange = (params: IOrdersListFilterParams) => {
    setFilterParams({ ...filterParams, offset: undefined, ...params });
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: (page - 1) * 10 });
  };

  const tableColumns = useMemo(() => {
    const columns: ColumnsType<IOrdersListItemModel> = [
      {
        title: "ID",
        dataIndex: "id",
        render: (_, row) => <div>#{row.id}</div>,
      },
      {
        title: t("payed"),
        dataIndex: "isPaid",
        render: (_, row) => (
          <StatusUI status={row.is_paid ? "1" : "-1"}>
            {row.is_paid ? t("isPaid") : t("notPaid")}
          </StatusUI>
        ),
      },
      {
        title: t("amount"),
        dataIndex: "price",
        render: (_, row) => <div>{formatCount(row.total_price || 0)} {t("uzs")}</div>,
      },
      {
        title: t("created_at"),
        dataIndex: "created_at",
        render: (_, row) => <div className="w-n-r">{formatDate(row.created_at)}</div>,
      },
    ];

    return columns;
  }, [userOrdersListState.data]);

  return (
    <ContentLayout
      title={(
        <h1>{t("aboutUser", { ns: namespaces.users })}</h1>
      )}
    >
      <>
        {!details ? (
          <div>
            <div className="bg-loader">
              <Spinner />
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.cards}>
              <div className={styles.col}>
                <div>
                  <ButtonUI
                    withIcon
                    link="/users"
                  >
                    <BackIcon /> <span>{t("clientInfo", { ns: namespaces.users })}</span>
                  </ButtonUI>
                </div>
                <div className={styles.cardItem}>
                  <div className={styles.cardItemRow}>
                    <strong>{t("fields.firstname")}:</strong>
                    <span>{details.firstname}</span>
                  </div>
                  <div className={styles.cardItemRow}>
                    <strong>{t("fields.username")}:</strong>
                    {details.username ? (
                      <span>
                        <a className="link-with-icon" href={`https://t.me/${details.username}`} target="_blank">
                          {details.username}
                          <ExternalLinkIcon />
                        </a>
                      </span>
                    ) : "-"}
                  </div>
                  <div className={styles.cardItemRow}>
                    <strong>{t("fields.phone")}:</strong>
                    <span><a href={`tel:${details.phone}`}>{details.phone}</a></span>
                  </div>
                  <div className={styles.cardItemRow}>
                    <strong>{t("dateAdded")}:</strong>
                    <span>{formatDate(details.created_at)}</span>
                  </div>
                  <div className={styles.cardItemRow}>
                    <strong>{t("lastVisit")}:</strong>
                    <span>{formatDate(details.last_active)}</span>
                  </div>
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.title}>
                  {t("clientAddress", { ns: namespaces.users })}
                </div>
                <div className={styles.cardItem}>
                  <div className={styles.cardItemRow}>
                    <strong>{t("address")}:</strong>
                    <span>{details.address}</span>
                  </div>
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.title}>
                  {t("aboutOrders", { ns: namespaces.users })}
                </div>
                <div className={styles.cardItem}>
                  <div className={styles.cardItemRow}>
                    <strong>Кол-во заказов:</strong>
                    <span>{details.orders_count}</span>
                  </div>
                  <div className={styles.cardItemRow}>
                    <strong>Успешный заказ:</strong>
                    <span>{details.successful_orders}</span>
                  </div>
                  <div className={styles.cardItemRow}>
                    <strong>Оплаченная сумма:</strong>
                    <span>{details.amount_paid}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {userOrdersListState.data && (
                <TableUI
                  loading={userOrdersListState.loading}
                  dataSource={userOrdersListState.data.results}
                  columns={tableColumns}
                  pagination={{
                    total: userOrdersListState.data.count,
                    pageSize: 10,
                    current: filterParams.offset ? filterParams.offset / 10 + 1 : 1,
                    hideOnSinglePage: true,
                    onChange: onChangePagination,
                  }}
                  bordered={true}
                />
              )}
            </div>
          </div>
        )}
      </>
    </ContentLayout>
  )
};

export default UserDetails;
import React, { useEffect, useState, useMemo } from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { $ordersList } from "@stores/orders";
import { TableUI } from "@ui/table";
import { Spinner } from "@ui/spinner";
import { ColumnsType } from "antd/lib/table/interface";
import { IOrdersListFilterParams, IOrdersListItemModel } from "@/businessLogic/models/orders";
import { ModalUI } from "@ui/modal";
import { useModalControl } from "@/hooks/useModalControl";
import { OrderDetails, OrderDetailsModalPropTypes } from "./details";
import { $currentBot } from "@stores/bots";
import { formatCount, formatDate } from "@utils/formatters";
import { ButtonUI } from "@ui/button";
import { EyeIcon } from "@assets/icons";
import { OrdersFilter } from "./filter";
import { OrderStatusChange } from "@/pages/orders/orders-list/status-change";
import { OrderPaymentChange } from "@/pages/orders/orders-list/payment-change";
import { PaidSelect } from "@/pickers/paid-select";
import { PaymentTypeSelect } from "@/pickers/payment-type-select";
import { DeliveryTypeSelect } from "@/pickers/delivery-type-select";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { RANGE_DATE_FORMAT } from "@ui/rangePicker";
import { OrderStatusSelect } from "@/pickers/order-status-select";
import { InputUI } from "@ui/input";
import { $ordersNotification } from "@stores/notifications";

const OrdersList = () => {
  const { t } = useTranslation();

  const { currentBot } = $currentBot.useStore();
  const { request: getOrdersList, reset: resetOrdersList, ...ordersListState } = $ordersList.useStore();
  const ordersNotificationState = $ordersNotification.useStore();

  const orderDetailsModalControl = useModalControl<OrderDetailsModalPropTypes>();

  const [filterParams, setFilterParams] = useState<IOrdersListFilterParams>({});

  useEffect(() => {
    return () => {
      resetOrdersList();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getOrdersList({
        ...filterParams,
        bot_id: currentBot.id
      });
    }
  }, [currentBot, filterParams]);

  useEffect(() => {
    if (ordersNotificationState.notification && currentBot) {
      getOrdersList({
        ...filterParams,
        bot_id: currentBot.id
      });
    }
  }, [ordersNotificationState.notification]);

  const onFilterChange = (params: IOrdersListFilterParams) => {
    setFilterParams({ ...filterParams, offset: undefined, ...params });
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: (page - 1) * 10 });
  };

  const tableColumns = useMemo(() => {
    const columns: ColumnsType<IOrdersListItemModel> = [
      {
        title: (
          <>
            <div>ID</div>
            <InputUI.Search
              placeholder="-------"
              onChange={(e: any, search: string) => onFilterChange({ id: search })}
            />
          </>
        ),
        dataIndex: "id",
        width: 100,
        render: (_, row) => <div>#{row.id}</div>,
      },
      {
        title: (
          <>
            <div>{t("client")}</div>
            <div className="empty-height"></div>
          </>
        ),
        dataIndex: "botuser",
        render: (_, row) => <a href={`tel:${row.phone}`}>{row.botuser}</a>,
      },
      {
        title: (
          <>
            <div>{t("status")}</div>
            <OrderStatusSelect onChange={(val: string | undefined) => onFilterChange({ status: val })} />
          </>
        ),
        width: 150,
        dataIndex: "status",
        render: (_, row) => (
          <OrderStatusChange id={row.id} status={row.status} />
        ),
      },
      {
        title: (
          <>
            <div className="w-n-r">{t("amount")}</div>
            <div className="empty-height"></div>
          </>
        ),
        dataIndex: "price",
        render: (_, row) => <div className="w-n-r">{formatCount(row.total_price || 0)} {t("uzs")}</div>,
      },
      {
        title: (
          <>
            <div>{t("payed")}</div>
            <PaidSelect onChange={(val: boolean) => onFilterChange({ is_paid: val })} />
          </>
        ),
        width: 150,
        dataIndex: "isPaid",
        render: (_, row) => (
          <OrderPaymentChange
            id={row.id}
            payment={{ value: row.is_paid ? t("isPaid") : t("notPaid"), key: row.is_paid ? "1" : "-1" }}
          />
        ),
      },
      {
        title: (
          <>
            <div className="w-n-r">{t("paymentType")}</div>
            <PaymentTypeSelect onChange={(val: string | undefined) => onFilterChange({ payment_type: val })} />
          </>
        ),
        width: 150,
        dataIndex: "paymentType",
        render: (_, row) => <div>{row.payment_type}</div>,
      },
      {
        title: (
          <>
            <div className="w-n-r">{t("deliveryType")}</div>
            <DeliveryTypeSelect onChange={(val: string | undefined) => onFilterChange({ service_type: val })} />
          </>
        ),
        width: 150,
        dataIndex: "deliveryType",
        render: (_, row) => <div>{row.service_type.value}</div>,
      },
      {
        title: (
          <>
            <div className="w-n-r">{t("created_at")}</div>
            <DatePicker
              placeholder="yyyy/mm/dd"
              onChange={(val) => onFilterChange({ date: val ? dayjs(val).format(RANGE_DATE_FORMAT) : undefined })}
            />
          </>
        ),
        width: 150,
        dataIndex: "created_at",
        render: (_, row) => <div className="w-n-r">{formatDate(row.created_at)}</div>,
      },
      {
        title: "",
        dataIndex: "actions",
        width: 40,
        render: (_, row) => {
          return (
            <div>
              <ButtonUI
                type="secondary"
                withIcon
                circle
                onClick={() => orderDetailsModalControl.open({ id: row.id })}
              >
                <EyeIcon />
              </ButtonUI>
            </div>
          )
        }
      }
    ];

    return columns;
  }, [ordersListState.data]);



  return (
    <ContentLayout
      title={(
        <h1>{t("ordersList", { ns: namespaces.orders })}</h1>
      )}
    >
      {!ordersListState.data ? (
        <div className="bg-loader">
          <Spinner />
        </div>
      ) : (
        <>
          <OrdersFilter
            filterParams={filterParams}
            onFilterChange={onFilterChange}
          />
          <TableUI
            loading={ordersListState.loading}
            dataSource={ordersListState.data.results}
            columns={tableColumns}
            pagination={{
              total: ordersListState.data.count,
              pageSize: 10,
              current: filterParams.offset ? filterParams.offset / 10 + 1 : 1,
              hideOnSinglePage: true,
              onChange: onChangePagination,
            }}
            bordered={true}
          />
        </>
      )}
      <ModalUI
        open={orderDetailsModalControl.modalProps.open}
        closable={false}
        maskClosable={false}
        width={930}
      >
        <OrderDetails modalControl={orderDetailsModalControl} />
      </ModalUI>
    </ContentLayout>
  )
};

export default OrdersList;
import React, { FC, useEffect, useState } from "react";
import { StatusUpdate } from "@ui/status";
import { $orderStatuses, $orderStatusUpdate } from "@stores/orders";
import { notificationSuccess } from "@ui/notifications";
import { useTranslation } from "react-i18next";

type StatusType = { value: string; key: string; };

type PropsTypes = {
  id: number;
  status: StatusType;
}

export const OrderStatusChange: FC<PropsTypes> = (props) => {
  const { id, status } = props;

  const { t } = useTranslation();

  const { request: getOrderStatuses, ...orderStatusesState } = $orderStatuses.useStore();
  const { request: orderStatusUpdate, reset: resetOrderStatusUpdate, ...orderStatusUpdateState } = $orderStatusUpdate.useStore();

  const [currentStatus, setCurrentStatus] = useState<StatusType>(status);
  const [newStatus, setNewStatus] = useState<StatusType & { id: number; } | null>(null);

  useEffect(() => {
    if (orderStatusUpdateState.data && newStatus && newStatus.id === id) {
      notificationSuccess(t("notifications.statusUpdated"));
      setCurrentStatus({
        value: newStatus.value,
        key: newStatus.key
      });
      setNewStatus(null);
      resetOrderStatusUpdate();
    }
  }, [orderStatusUpdateState.data, newStatus])

  const updateStatus = (val: { value: string; key: string; }) => {
    setNewStatus({
      id,
      value: val.value,
      key: val.key
    });
    orderStatusUpdate({
      id,
      status: val.key
    });
  }

  return (
    <StatusUpdate
      status={currentStatus}
      request={getOrderStatuses}
      store={orderStatusesState.data}
      loading={orderStatusesState.loading}
      disabledStatus={{ "DELIVERY": true, "READY": true }}
      update={updateStatus}
      updateLoading={(newStatus?.id === id) && orderStatusUpdateState.loading}
    />
  )
};
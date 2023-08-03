import React, { FC, useEffect, useMemo, useState } from "react";
import { StatusUpdate } from "@ui/status";
import { $orderPaymentUpdate } from "@stores/orders";
import { notificationSuccess } from "@ui/notifications";
import { useTranslation } from "react-i18next";

type PaymentType = { value: string; key: string; };

type PropsTypes = {
  id: number;
  payment: PaymentType;
}

export const OrderPaymentChange: FC<PropsTypes> = (props) => {
  const { id, payment } = props;

  const { t } = useTranslation();


  const { request: orderPaymentUpdate, reset: resetOrderPaymentUpdate, ...orderPaymentUpdateState } = $orderPaymentUpdate.useStore();

  const [currentStatus, setCurrentStatus] = useState<PaymentType>(payment);
  const [newStatus, setNewStatus] = useState<PaymentType & { id: number; } | null>(null);

  useEffect(() => {
    if (orderPaymentUpdateState.data && newStatus && newStatus.id === id) {
      notificationSuccess(t("notifications.statusUpdated"));
      setCurrentStatus({
        value: newStatus.value,
        key: newStatus.key
      });
      setNewStatus(null);
      resetOrderPaymentUpdate();
    }
  }, [orderPaymentUpdateState.data, newStatus])

  const payments = useMemo(() => {
    return {
      "1": [
        {
          value: t("notPaid"),
          key: "-1"
        }
      ],
      "-1": [
        {
          value: t("isPaid"),
          key: "1"
        },
      ]
    }
  }, []);

  const updatePaymentType = (val: { value: string; key: string; }) => {
    setNewStatus({
      id,
      value: val.value,
      key: val.key
    });
    orderPaymentUpdate({
      id,
      is_paid: val.key === "1"
    });
  }

  return (
    <StatusUpdate
      status={currentStatus}
      store={payments}
      loading={false}
      disabledStatus={{ "1": true }}
      update={updatePaymentType}
      updateLoading={(newStatus?.id === id) && orderPaymentUpdateState.loading}
    />
  )
};
import React, { FC, useEffect, useState } from "react";
import { ModalUI } from "@ui/modal";
import { ModalControlType } from "@/hooks/useModalControl";
import { $orderDetails } from "@stores/orders";
import { formatCount, formatDate } from "@utils/formatters";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "@utils/getters";
import { CloseIcon, EditIcon } from "@assets/icons";
import { ButtonUI } from "@ui/button";
import { OrderEditForm } from "./edit-form";

export type OrderDetailsModalPropTypes = {
  id: number;
};

type PropsTypes = {
  modalControl: ModalControlType<OrderDetailsModalPropTypes>;
};

export const OrderDetails: FC<PropsTypes> = (props) => {
  const { modalControl } = props;
  const { id: orderId } = modalControl.modalProps;

  const { t } = useTranslation();
  const currentLang = getCurrentLang();

  const { request: getOrderDetails, reset: resetOrderDetails, ...orderDetailsState } = $orderDetails.useStore();

  const [editMode, setEditMode] = useState<boolean>(false);

  const getDetails = () => {
    getOrderDetails(String(orderId));
  }

  useEffect(() => {
    getDetails();

    return () => {
      resetOrderDetails();
    }
  }, []);

  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
        <div className="cancelBtnWr">
          <ButtonUI
            withIcon
            circle
            onClick={() => {
              if (editMode) {
                setEditMode(false);
              } else {
                modalControl.close();
              }
            }}
          >
            <CloseIcon />
          </ButtonUI>
        </div>
      </ModalUI.Header>
      <ModalUI.Loading show={orderDetailsState.loading} />
      <ModalUI.Middle>
        {orderDetailsState.data && (
          <>
            {editMode ? (
              <OrderEditForm
                setEditMode={setEditMode}
                details={orderDetailsState.data}
                callback={getDetails}
              />
            ) : (
              <div className={styles.orderDetails}>
                <div className={styles.orderDetailsItem}>
                  <strong>ID:</strong> {orderDetailsState.data.id}
                </div>
                <div className={styles.orderDetailsItem}>
                  <strong>{t("client")}:</strong> {orderDetailsState.data.botuser}
                </div>
                <div className={styles.orderDetailsItem}>
                  <strong>{t("fields.phone")}:</strong> {orderDetailsState.data.phone}
                </div>
                <div className={styles.orderDetailsItem}>
                  <strong>{t("fields.paymentType")}:</strong> {orderDetailsState.data.payment_type}
                </div>

                <div className={styles.orderDetailsProducts}>
                  <div className={styles.orderDetailsItem}>
                    <strong>{t("order")}:</strong>
                  </div>
                  {orderDetailsState.data.items.map((item) => (
                    <div className={styles.orderProductItem} key={item.skus.id}>
                      {item.product[currentLang]} {item.skus.name[currentLang]} <span>x{item.count}</span> {item.skus.price} {t("uzs")}
                    </div>
                  ))}
                  <div className={styles.orderDetailsItem}>
                    <strong>{t("total")}:</strong> {formatCount(orderDetailsState.data.total_amount)} {t("uzs")}
                  </div>
                </div>

                <div className={styles.orderDetailsItem}>
                  <strong>{t("fields.orderType")}:</strong> {orderDetailsState.data.service_type.value}
                </div>
                <div className={styles.orderDetailsItem}>
                  <strong>{t("address")}:</strong> {orderDetailsState.data.address}
                </div>
                <div className={styles.orderDetailsItem}>
                  <strong>{t("fields.deliveryPrice")}:</strong> {formatCount(orderDetailsState.data.delivery)}
                </div>
                <div className={styles.orderDetailsItem}>
                  <strong>{t("fields.totalPrice")}:</strong> {formatCount(orderDetailsState.data.total_price)}
                </div>
                <div className={styles.orderDetailsItem}>
                  <strong>{t("created_at")}:</strong> {formatDate(orderDetailsState.data.created_at)}
                </div>
                <div className={styles.orderDetailsItem}>
                  <strong>{t("status")}:</strong> {orderDetailsState.data.status.value}
                </div>
                <div>
                  <ButtonUI
                    type="secondary"
                    withIcon
                    circle
                    onClick={() => setEditMode(true)}
                  >
                    <EditIcon />
                  </ButtonUI>
                </div>
              </div>
            )}
          </>
        )}
      </ModalUI.Middle>
    </>
  );
};
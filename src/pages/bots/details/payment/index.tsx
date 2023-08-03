import React, { useEffect, FC } from "react";

import { $botPaymentDetails, $botPaymentDetailsUpdate } from "@stores/bots";

import styles from "../styles.module.scss";
import { notificationSuccess } from "@ui/notifications";
import { Spinner } from "@ui/spinner";

import cashIcon from "@assets/images/cash-icon.svg";
import { useTranslation } from "react-i18next";
import { BotPaymentItem } from "@/pages/bots/details/payment/item";


type PropsTypes = {
  botId: string;
}

export const BotPaymentDetails: FC<PropsTypes> = (props) => {
  const { botId } = props;

  const { t } = useTranslation();

  const {
    request: getBotPaymentDetails,
    reset: resetBotPaymentDetails,
    ...botPaymentDetailsState
  } = $botPaymentDetails.useStore();
  const {
    reset: resetUpdateBotPaymentDetails,
    ...botPaymentDetailsUpdateState
  } = $botPaymentDetailsUpdate.useStore();


  useEffect(() => {
    getBotPaymentDetails(botId);

    return () => {
      resetBotPaymentDetails();
    }
  }, []);

  useEffect(() => {
    if (botPaymentDetailsUpdateState.data) {
      notificationSuccess(t("notifications.updated"));
      resetUpdateBotPaymentDetails();
    }
  }, [botPaymentDetailsUpdateState.data]);


  return (
    <div className={styles.payment}>
      {botPaymentDetailsState.loading && (
        <div className="bg-loader">
          <Spinner />
        </div>
      )}
      <div className={styles.paymentList}>
        {botPaymentDetailsState.data?.payments.map((item) => (
          <BotPaymentItem item={item} botId={botId} key={item.payment.id} />
        ))}
      </div>
    </div>
  )
};
import React, { FC, useEffect, useState } from "react";
import styles from "@/pages/bots/details/styles.module.scss";
import { InputUI } from "@ui/input";
import { Form, Switch } from "antd";
import { ButtonUI } from "@ui/button";
import { useTranslation } from "react-i18next";
import { FormUI } from "@ui/form";
import { requiredFormRules } from "@utils/constants/common";
import { IBotPaymentDetailsItem } from "@/businessLogic/models/bots";
import { $botPaymentDetailsUpdate } from "@stores/bots";

type PropsTypes = {
  botId: string;
  item: IBotPaymentDetailsItem
}

export const BotPaymentItem:FC<PropsTypes> = (props) => {
  const { item, botId } = props;

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const {
    request: updateBotPaymentDetails,
    reset: resetUpdateBotPaymentDetails,
    ...botPaymentDetailsUpdateState
  } = $botPaymentDetailsUpdate.useStore();

  const [isActive, setIsActive] = useState<boolean>(item.detail.is_active);

  useEffect(() => {
    if (item.have_token && item.detail.token) {
      form.setFieldValue("token", item.detail.token);
    }
    if (item.detail.is_active) {
      setIsActive(item.detail.is_active);
    }
  }, []);

  const onFinish = (formData: any) => {
    updateBotPaymentDetails({
      id: botId,
      is_active: isActive,
      token: formData.token ? formData.token : undefined,
      payment: item.payment.id
    });
  };

  return (
    <div className={styles.paymentOuter}>
      <div className={styles.paymentItem}>
        <FormUI
          phantomSubmit
          form={form}
          onFinish={onFinish}
        >
          <div className={styles.paymentHead}>
            <div className={styles.paymentLogo}>
              <img src={item.icon} alt="" />
            </div>
            <div className={styles.paymentTitle}>
              {item.payment.name}
            </div>
          </div>

            <div className={styles.paymentForm}>
              {item.have_token ? (
                <div className={styles.paymentFormItem}>
                  <FormUI.Item
                    name="token"
                    rules={requiredFormRules}
                  >
                    <InputUI placeholder={t("placeholders.token")}/>
                  </FormUI.Item>
                </div>
              ) : (
                <div style={{ height: "42px" }}></div>
              )}
              <div className={styles.paymentFormItem}>
                <Switch
                  defaultChecked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
              </div>
              <div className={styles.paymentFormButton}>
                <ButtonUI
                  type="primary"
                  onClick={() => form.submit()}
                  loading={botPaymentDetailsUpdateState.loading}
                >
                  {t("buttons.save")}
                </ButtonUI>
              </div>
            </div>

        </FormUI>
      </div>
    </div>
  )
};
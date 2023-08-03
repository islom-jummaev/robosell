import React, { useEffect, FC } from "react";

import { InputUI } from "@ui/input";
import { ButtonUI } from "@ui/button";
import { useTranslation } from "react-i18next";

import styles from "../../styles.module.scss";
import { Form } from "antd";
import { FormUI } from "@ui/form";
import { $botChangeToken, $currentBotToken } from "@stores/bots";
import { notificationSuccess } from "@ui/notifications";
import { requiredFormRules } from "@utils/constants/common";

type PropsTypes = {
  botId: string;
}

export const BotSettingsDetailsToken: FC<PropsTypes> = (props) => {
  const { botId } = props;

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { request: getCurrentBotToken, reset: resetCurrentBotToken, ...currentBotTokenState } = $currentBotToken.useStore();
  const {
    request: botChangeTokenRequest,
    reset: resetBotChangeToken,
    ...botChangeTokenState
  } = $botChangeToken.useStore();

  useEffect(() => {
    getCurrentBotToken(botId);

    return () => {
      resetCurrentBotToken();
    }
  }, []);

  useEffect(() => {
    if (currentBotTokenState.data) {
      form.setFieldValue("token", currentBotTokenState.data.token);
    }
  }, [currentBotTokenState.data]);

  useEffect(() => {
    if (botChangeTokenState.data) {
      notificationSuccess(t("notifications.botTokenChanged"));
      resetBotChangeToken();
    }
  }, [botChangeTokenState.data])

  const onFinish = (formData: any) => {
    botChangeTokenRequest({
      id: botId,
      token: formData.token
    });
  };

  return (
    <div className={styles.settingsToken}>
      <FormUI
        phantomSubmit={false}
        form={form}
        onFinish={onFinish}
      >
        <FormUI.Item
          name="token"
          rules={requiredFormRules}
        >
          <InputUI disabled={currentBotTokenState.loading} />
        </FormUI.Item>
        <ButtonUI
          type="primary"
          loading={botChangeTokenState.loading}
          onClick={() => form.submit()}
        >
          {t("buttons.save")}
        </ButtonUI>
      </FormUI>
    </div>
  )
};
import React, { useEffect, FC } from "react";
import { Form } from "antd";

import { $botLanguageDetails, $botLanguageDetailsUpdate } from "@stores/bots";

import styles from "../styles.module.scss";
import { FormUI } from "@ui/form";
import { ButtonUI } from "@ui/button";
import { notificationSuccess } from "@ui/notifications";
import { Spinner } from "@ui/spinner";
import { SelectUI } from "@ui/select";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";


type PropsTypes = {
  botId: string;
}

export const BotLanguageDetails: FC<PropsTypes> = (props) => {
  const { botId } = props;
  const { t } = useTranslation();

  const [form] = Form.useForm();

  const {
    request: getBotLanguageDetails,
    reset: resetBotLanguageDetails,
    ...botLanguageDetailsState
  } = $botLanguageDetails.useStore();
  const {
    request: updateBotLanguageDetails,
    reset: resetUpdateBotLanguageDetails,
    ...botLanguageDetailsUpdateState
  } = $botLanguageDetailsUpdate.useStore();


  useEffect(() => {
    getBotLanguageDetails(botId);

    return () => {
      resetBotLanguageDetails();
    }
  }, []);

  useEffect(() => {
    if (botLanguageDetailsState.data) {
      const languages: Array<number> = [];

      botLanguageDetailsState.data.languages.forEach((item) => {
        if (item.checked) {
          languages.push(item.id);
        }
      });

      form.setFieldsValue({
        languages
      })
    }
  }, [botLanguageDetailsState.data]);

  useEffect(() => {
    if (botLanguageDetailsUpdateState.data) {
      notificationSuccess(t("notifications.updated"));
      resetUpdateBotLanguageDetails();
    }
  }, [botLanguageDetailsUpdateState.data]);


  const onFinish = (formData: any) => {
    updateBotLanguageDetails({
      id: botId,
      languages: formData.languages
    });
  };

  return (
    <div className={styles.language}>
      {botLanguageDetailsState.loading && (
        <div className="bg-loader">
          <Spinner />
        </div>
      )}
      <FormUI
        phantomSubmit
        form={form}
        onFinish={onFinish}
      >
        <FormUI.Item
          name="languages"
          label={t("lang.title", { ns: namespaces.bots })}
          extra={t("lang.langText", { ns: namespaces.bots })}
        >
          <SelectUI
            mode="multiple"
            showSearch={false}
          >
            {botLanguageDetailsState.data?.languages.map((item) => (
              <SelectUI.Option value={item.id} key={item.id}>{item.name}</SelectUI.Option>
            ))}
          </SelectUI>
        </FormUI.Item>
        <ButtonUI
          type="primary"
          loading={botLanguageDetailsUpdateState.loading}
          onClick={() => form.submit()}
        >
          {t("buttons.save")}
        </ButtonUI>
      </FormUI>
    </div>
  )
};
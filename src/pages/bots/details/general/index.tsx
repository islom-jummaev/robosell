import React, { useEffect, FC } from "react";
import { message, Form, TimePicker } from "antd";
import dayjs from "dayjs";

import { $botGeneralDetails, $botGeneralDetailsUpdate } from "@stores/bots";

type PropsTypes = {
  botId: string;
}

import styles from "../styles.module.scss";
import { FormUI } from "@ui/form";
import { ButtonUI } from "@ui/button";
import { notificationSuccess } from "@ui/notifications";
import { InputUI } from "@ui/input";
import { Spinner } from "@ui/spinner";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";
import { TaggedText } from "@core/localization/component";
import { FormLanguage } from "@/components/form-language";
import { requiredFormRules } from "@utils/constants/common";

const timeFormat = "HH:mm";

export const BotGeneralDetails: FC<PropsTypes> = (props) => {
  const { botId } = props;

  const { t } = useTranslation();

  const { formLangValue, setFormLangValue } = FormLanguage.useFormLang();

  const [form] = Form.useForm();

  const {
    request: getBotGeneralDetails,
    reset: resetBotGeneralDetails,
    ...botGeneralDetailsState
  } = $botGeneralDetails.useStore();
  const {
    request: updateBotGeneralDetails,
    reset: resetUpdateBotGeneralDetails,
    ...botGeneralDetailsUpdateState
  } = $botGeneralDetailsUpdate.useStore();

  const [messageApi, contextHolder] = message.useMessage();
  const tokenForRights = botGeneralDetailsState.data?.group_token;

  useEffect(() => {
    getBotGeneralDetails(botId);

    return () => {
      resetBotGeneralDetails();
    }
  }, []);

  useEffect(() => {
    if (botGeneralDetailsState.data) {
      form.setFieldsValue({
        fromTime: botGeneralDetailsState.data.open ? dayjs(botGeneralDetailsState.data.open, timeFormat) : undefined,
        toTime: botGeneralDetailsState.data.close ? dayjs(botGeneralDetailsState.data.close, timeFormat) : undefined,
        start_textRu: botGeneralDetailsState.data.start_text.ru,
        start_textUz: botGeneralDetailsState.data.start_text.uz,
        start_textEn: botGeneralDetailsState.data.start_text.en,
        extra_infoRu: botGeneralDetailsState.data.extra_info.ru,
        extra_infoUz: botGeneralDetailsState.data.extra_info.uz,
        extra_infoEn: botGeneralDetailsState.data.extra_info.en,
        auto_answerRu: botGeneralDetailsState.data.auto_answer.ru,
        auto_answerUz: botGeneralDetailsState.data.auto_answer.uz,
        auto_answerEn: botGeneralDetailsState.data.auto_answer.en
      })
    }
  }, [botGeneralDetailsState.data]);

  useEffect(() => {
    if (botGeneralDetailsUpdateState.data) {
      notificationSuccess(t("notifications.updated"));
      resetUpdateBotGeneralDetails();
    }
  }, [botGeneralDetailsUpdateState.data]);

  const onCopyToken = () => {
    navigator.clipboard.writeText(tokenForRights as string);
    messageApi.success({
      content: t("notifications.copy"),
    });
  };

  const onFinish = () => {
    const formData = form.getFieldsValue(true);

    updateBotGeneralDetails({
      id: botId,
      open: formData["fromTime"] ? formData["fromTime"].format(timeFormat) : undefined,
      close: formData["toTime"] ? formData["toTime"].format(timeFormat) : undefined,
      start_text: {
        ru: formData.start_textRu || formData.start_textUz || formData.start_textEn,
        uz: formData.start_textUz || formData.start_textRu || formData.start_textEn,
        en: formData.start_textEn || formData.start_textRu || formData.start_textUz
      },
      extra_info: {
        ru: formData.extra_infoRu || formData.extra_infoUz || formData.extra_infoEn,
        uz: formData.extra_infoUz || formData.extra_infoRu || formData.extra_infoEn,
        en: formData.extra_infoEn || formData.extra_infoRu || formData.extra_infoUz
      },
      auto_answer: {
        ru: formData.auto_answerRu || formData.auto_answerUz || formData.auto_answerEn,
        uz: formData.auto_answerUz || formData.auto_answerRu || formData.auto_answerEn,
        en: formData.auto_answerEn || formData.auto_answerRu || formData.auto_answerUz
      }
    });
  };

  return (
    <div className={styles.general}>
      {botGeneralDetailsState.loading && (
        <div className="bg-loader">
          <Spinner />
        </div>
      )}
      {contextHolder}
      <div className={styles.generalDescription}>
        <h6>
          {t("general.description.title", { ns: namespaces.bots })}
        </h6>
        <p>
          1. {t("general.description.step1", { ns: namespaces.bots })}<br />
          2. <TaggedText
                text={t("general.description.step2", { ns: namespaces.bots })}
                tags={{
                  1: () => (
                    <code onClick={onCopyToken}>
                      {tokenForRights}
                    </code>
                  )
                }}
              /><br />
          3. {t("general.description.step3", { ns: namespaces.bots })}
        </p>
      </div>
      <h4>{t("addonSetting", { ns: namespaces.bots })}</h4>
      <FormUI
        phantomSubmit
        form={form}
        onFinish={onFinish}
      >
        <FormLanguage
          value={formLangValue}
          setValue={setFormLangValue}
        />
        <FormUI.Row>
          <FormUI.Col>
            <FormUI.Item
              name="fromTime"
              label={t("fields.fromTime")}
              extra={`${t("forExample", { ns: namespaces.bots })}: 09:00`}
            >
              <TimePicker
                format={timeFormat}
                placeholder={t("placeholders.time")}
              />
            </FormUI.Item>
          </FormUI.Col>
          <FormUI.Col>
            <FormUI.Item
              name="toTime"
              label={t("fields.toTime")}
              extra={`${t("forExample", { ns: namespaces.bots })}: 09:00`}
            >
              <TimePicker
                format={timeFormat}
                placeholder={t("placeholders.time")}
              />
            </FormUI.Item>
          </FormUI.Col>
        </FormUI.Row>

        {formLangValue === "ru" && (
          <FormUI.Item
            name="start_textRu"
            label={`${t("startText", { ns: namespaces.bots })} RU`}
            extra={t("startInfo", { ns: namespaces.bots })}
          >
            <InputUI.TextArea rows={4} />
          </FormUI.Item>
        )}
        {formLangValue === "uz" && (
          <FormUI.Item
            name="start_textUz"
            label={`${t("startText", { ns: namespaces.bots })} UZ`}
            extra={t("startInfo", { ns: namespaces.bots })}
          >
            <InputUI.TextArea rows={4} />
          </FormUI.Item>
        )}
        {formLangValue === "en" && (
          <FormUI.Item
            name="start_textEn"
            label={`${t("startText", { ns: namespaces.bots })} EN`}
            extra={t("startInfo", { ns: namespaces.bots })}
          >
            <InputUI.TextArea rows={4} />
          </FormUI.Item>
        )}

        {formLangValue === "ru" && (
          <FormUI.Item
            name="extra_infoRu"
            label={`${t("addonInfo", { ns: namespaces.bots })} RU`}
            extra={t("addonInfoText", { ns: namespaces.bots })}
          >
            <InputUI.TextArea rows={4} />
          </FormUI.Item>
        )}
        {formLangValue === "uz" && (
          <FormUI.Item
            name="extra_infoUz"
            label={`${t("addonInfo", { ns: namespaces.bots })} UZ`}
            extra={t("addonInfoText", { ns: namespaces.bots })}
          >
            <InputUI.TextArea rows={4} />
          </FormUI.Item>
        )}
        {formLangValue === "en" && (
          <FormUI.Item
            name="extra_infoEn"
            label={`${t("addonInfo", { ns: namespaces.bots })} EN`}
            extra={t("addonInfoText", { ns: namespaces.bots })}
          >
            <InputUI.TextArea rows={4} />
          </FormUI.Item>
        )}

        {formLangValue === "ru" && (
          <FormUI.Item
            name="auto_answerRu"
            label={`${t("autoSend", { ns: namespaces.bots })} RU`}
            extra={t("autoSendText", { ns: namespaces.bots })}
          >
            <InputUI.TextArea rows={4} />
          </FormUI.Item>
        )}
        {formLangValue === "uz" && (
          <FormUI.Item
            name="auto_answerUz"
            label={`${t("autoSend", { ns: namespaces.bots })} UZ`}
            extra={t("autoSendText", { ns: namespaces.bots })}
          >
            <InputUI.TextArea rows={4} />
          </FormUI.Item>
        )}
        {formLangValue === "en" && (
          <FormUI.Item
            name="auto_answerEn"
            label={`${t("autoSend", { ns: namespaces.bots })} EN`}
            extra={t("autoSendText", { ns: namespaces.bots })}
          >
            <InputUI.TextArea rows={4} />
          </FormUI.Item>
        )}
        <ButtonUI
          type="primary"
          loading={botGeneralDetailsUpdateState.loading}
          onClick={() => form.submit()}
        >
          {t("buttons.save")}
        </ButtonUI>
      </FormUI>
    </div>
  )
};
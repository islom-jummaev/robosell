import React, { FC, useEffect } from "react";
import { Form } from "antd";
import { ModalUI } from "@/shared/ui/modal";
import { FormUI } from "@ui/form";
import { requiredFormRules } from "@utils/constants/common";
import { ButtonUI } from "@ui/button";
import { InputUI } from "@ui/input";
import { ModalControlType } from "@/hooks/useModalControl";
import { $botsList, $createBot, $currentBot } from "@stores/bots";
import { notificationSuccess } from "@ui/notifications";
import { useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";
import { TaggedText } from "@core/localization/component";

type PropsTypes = {
  modalControl: ModalControlType;
};

export const BotCreate: FC<PropsTypes> = (props) => {
  const { modalControl } = props;
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { currentBot, update: updateCurrentBot } = $currentBot.useStore();
  const { request: createBotRequest, reset: resetCreateBot, ...createBotState } = $createBot.useStore();
  const { request: getBotsList } = $botsList.useStore();

  const { data: createBotData, loading } = createBotState;

  useEffect(() => {
    return () => {
      resetCreateBot();
    }
  }, []);

  useEffect(() => {
    if (createBotData) {
      notificationSuccess(t("botCreated", { ns: namespaces.bots }));
      getBotsList();
      modalControl.close();

      updateCurrentBot({
        id: String(createBotData.bot),
        name: createBotData.firstname
      });

      navigate(`/bots-list/${createBotData.bot}`);
    }
  }, [createBotData]);

  const onFinish = (formData: any) => {
    createBotRequest({
      token: formData.token
    });
  };

  return (
    <>
      <ModalUI.Loading show={loading} />
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Middle>
        <div className={styles.botCreateForm}>
          <FormUI
            phantomSubmit
            form={form}
            onFinish={onFinish}
          >
            <FormUI.Item
              name="token"
              rules={requiredFormRules}
            >
              <InputUI placeholder={t("placeholders.token")} />
            </FormUI.Item>
          </FormUI>
          <ModalUI.Buttons>
            <ButtonUI type="primary" onClick={() => form.submit()}>
              {t("buttons.connect")}
            </ButtonUI>
          </ModalUI.Buttons>
        </div>
        <div className={styles.description}>
          <div>
            <div>{t("instruction.title", { ns: namespaces.bots })}</div>
            <ol className={styles.descriptionList}>
              <li>
                <TaggedText
                  text={t("instruction.botFatherLink", { ns: namespaces.bots })}
                  tags={{
                    1: (text) => (
                      <a target="_blank" href="https://t.me/BotFather">
                        {text}
                      </a>
                    )
                  }}
                />
              </li>
              <li>
                <TaggedText
                  text={t("instruction.command", { ns: namespaces.bots })}
                  tags={{
                    1: (text) => (
                      <code>
                        {text}
                      </code>
                    )
                  }}
                />
              </li>
              <li>{t("instruction.userName", { ns: namespaces.bots })}</li>
              <li>
                <TaggedText
                  text={t("instruction.message", { ns: namespaces.bots })}
                  tags={{
                    1: (text) => (
                      <code>
                        {text}
                      </code>
                    )
                  }}
                />
              </li>
              <li>{t("instruction.name", { ns: namespaces.bots })}</li>
            </ol>
          </div>
        </div>
      </ModalUI.Middle>
    </>
  )
}
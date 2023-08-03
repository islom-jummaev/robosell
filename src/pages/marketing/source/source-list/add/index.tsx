import React, { FC, useEffect } from "react";
import { ModalUI } from "@ui/modal";
import { ModalControlType } from "@/hooks/useModalControl";
import { FormUI } from "@ui/form";
import { requiredFormRules } from "@utils/constants/common";
import { InputUI } from "@ui/input";
import { ButtonUI } from "@ui/button";
import { Form } from "antd";
import { $sourceCreate } from "@stores/source";
import { useTranslation } from "react-i18next";
import { notificationSuccess } from "@ui/notifications";
import { namespaces } from "@core/localization/i18n.constants";
import { $currentBot } from "@stores/bots";


type PropsTypes = {
  modalControl: ModalControlType;
  callback: () => void;
};

export const SourceAdd: FC<PropsTypes> = (props) => {
  const { modalControl, callback } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { currentBot } = $currentBot.useStore();
  const { request: sourceCreateRequest, reset: resetSourceCreate, ...sourceCreateState } = $sourceCreate.useStore();


  useEffect(() => {

    return () => {
      resetSourceCreate();
    }
  }, []);

  useEffect(() => {
    if (sourceCreateState.data) {
      notificationSuccess(t("source.created", { ns: namespaces.marketing }));
      modalControl.close();
      callback && callback();
    }
  }, [sourceCreateState.data]);

  const onFinish = (formData: any) => {
    sourceCreateRequest({
      bot: Number(currentBot?.id),
      name: formData.name,
    });
  };


  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Loading show={sourceCreateState.loading} />
      <ModalUI.Middle>
        <FormUI
          phantomSubmit
          form={form}
          onFinish={onFinish}
        >
          <FormUI.Item
            name="name"
            label={t("fields.name")}
            rules={requiredFormRules}
          >
            <InputUI />
          </FormUI.Item>
        </FormUI>
        <ModalUI.Buttons>
          <ButtonUI type="primary" onClick={() => form.submit()}>
            {t("buttons.save")}
          </ButtonUI>
        </ModalUI.Buttons>
      </ModalUI.Middle>
    </>
  );
};
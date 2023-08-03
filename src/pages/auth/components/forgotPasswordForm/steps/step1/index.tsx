import React, { FC, Dispatch, SetStateAction, useEffect } from "react";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { FormUI } from "@ui/form";
import { requiredFormRules } from "@utils/constants/common";
import { InputUI } from "@ui/input";
import { namespaces } from "@core/localization/i18n.constants";
import styles from "@/pages/auth/auth.module.scss";
import InputMask from "react-input-mask";

import { ButtonUI } from "@ui/button";
import { $forgotPasswordStep1 } from "@stores/account";

type PropsTypes = {
  setStep: Dispatch<SetStateAction<number>>;
  openLoginForm: () => void;
}

export const ForgotPasswordFormStep1: FC<PropsTypes> = (props) => {
  const { setStep, openLoginForm } = props;

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { request: forgotPasswordStep1, reset: resetForgotPasswordStep1, ...forgotPasswordStep1State } = $forgotPasswordStep1.useStore();

  useEffect(() => {
    if (forgotPasswordStep1State.data) {
      setStep(2);
    }
  }, [forgotPasswordStep1State.data]);

  const onLoginChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/[^0-9+]/g, '');

    form.setFieldValue("phone", value);
  };

  const onFinish = (formData: any) => {
    forgotPasswordStep1({
      phone: formData.phone,
    });
  };

  return (
    <FormUI
      phantomSubmit
      form={form}
      onFinish={onFinish}
    >
      <Form.Item name="phone" rules={requiredFormRules}>
      <InputMask   
            mask="+\9\98 99 999-99-99"
            className="formcontrol"
            placeholder={t("fields.phone")}
            type="text"
            onChange={onLoginChange}
            
          />
        {/* <InputUI onChange={onLoginChange} placeholder={t("fields.phone")} /> */}
      </Form.Item>

      <p>
        {t("haveAccount", { ns: namespaces.auth })}{" "}
        <span className={styles.span} onClick={() => openLoginForm()}>{t("signInNow", { ns: namespaces.auth })}</span>
      </p>

      <ButtonUI
        type="primary"
        loading={forgotPasswordStep1State.loading}
        onClick={() => form.submit()}
      >
        {t("continue")}
      </ButtonUI>
    </FormUI>
  )
};
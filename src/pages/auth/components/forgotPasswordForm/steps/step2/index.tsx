import React, { FC, Dispatch, SetStateAction, useEffect } from "react";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { FormUI } from "@ui/form";
import { requiredFormRules } from "@utils/constants/common";
import { InputUI } from "@ui/input";
import { namespaces } from "@core/localization/i18n.constants";
import InputMask from "react-input-mask";

import styles from "@/pages/auth/auth.module.scss";
import { ButtonUI } from "@ui/button";
import { $forgotPasswordStep1, $forgotPasswordStep2 } from "@stores/account";

type PropsTypes = {
  setStep: Dispatch<SetStateAction<number>>;
  openLoginForm: () => void;
}

export const ForgotPasswordFormStep2: FC<PropsTypes> = (props) => {
  const { setStep, openLoginForm } = props;

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const forgotPasswordStep1State = $forgotPasswordStep1.useStore();
  const { request: forgotPasswordStep2, reset: resetForgotPasswordStep2, ...forgotPasswordStep2State } = $forgotPasswordStep2.useStore();

  useEffect(() => {
    if (forgotPasswordStep2State.data) {
      setStep(3);
    }
  }, [forgotPasswordStep2State.data]);


  const onFinish = (formData: any) => {
    if (forgotPasswordStep1State.data) {
      forgotPasswordStep2({
        phone: forgotPasswordStep1State.data.phone,
        code: formData.code
      });
    }
  };

  return (
    <FormUI
      phantomSubmit
      form={form}
      onFinish={onFinish}
    >
      <Form.Item name="code" rules={requiredFormRules}>
      <InputMask   
            mask="+\9\98 99 999-99-99"
            className="formcontrol"
            placeholder={t("fields.smsCode")}
            type="text"
          
            
          />
        {/* <InputUI placeholder={t("fields.smsCode")} /> */}
      </Form.Item>

      <p>
        {t("haveAccount", { ns: namespaces.auth })}{" "}
        <span className={styles.span} onClick={() => openLoginForm()}>{t("signInNow", { ns: namespaces.auth })}</span>
      </p>

      <ButtonUI
        type="primary"
        loading={forgotPasswordStep2State.loading}
        onClick={() => form.submit()}
      >
        {t("continue")}
      </ButtonUI>
    </FormUI>
  )
};
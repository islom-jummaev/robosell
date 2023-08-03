import React, { FC, useEffect } from "react";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { FormUI } from "@ui/form";

import { namespaces } from "@core/localization/i18n.constants";
import styles from "@/pages/auth/auth.module.scss";
import { ButtonUI } from "@ui/button";
import { $forgotPasswordStep2, $forgotPasswordStep3 } from "@stores/account";
import { requiredFormRules } from "@utils/constants/common";
import { InputUI } from "@ui/input";
import { notificationSuccess } from "@ui/notifications";

type PropsTypes = {
  openLoginForm: () => void;
}

export const ForgotPasswordFormStep3: FC<PropsTypes> = (props) => {
  const { openLoginForm } = props;

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const forgotPasswordStep2State = $forgotPasswordStep2.useStore();
  const { request: forgotPasswordStep3, reset: resetForgotPasswordStep3, ...forgotPasswordStep3State } = $forgotPasswordStep3.useStore();

  useEffect(() => {
    if (forgotPasswordStep3State.data) {
      notificationSuccess(t("notifications.passwordChanged"));
      openLoginForm();
    }
  }, [forgotPasswordStep3State.data]);


  const checkPasswords = (formData: any, passwordField: string, confirmPasswordField: string) => {
    if (formData[passwordField] !== formData[confirmPasswordField]) {
      form.setFields([
        {
          name: passwordField,
          errors: [t("errors.passwordDoesNotMatch")],
        },
        {
          name: confirmPasswordField,
          errors: [t("errors.passwordDoesNotMatch")],
        },
      ]);

      return false;
    }

    return true;
  };

  const onFinish = (formData: any) => {
    if (forgotPasswordStep2State.data) {
      const checkPasswordsError = checkPasswords(formData, "password", "passwordConfirm");

      if (!checkPasswordsError) {
        return;
      }

      forgotPasswordStep3({
        id: forgotPasswordStep2State.data.id,
        password: formData.password,
        confirm_password: formData.passwordConfirm
      });
    }
  };

  return (
    <FormUI
      phantomSubmit
      form={form}
      onFinish={onFinish}
    >

      <FormUI.Item name="password" rules={requiredFormRules}>
        <InputUI.Password placeholder={t("fields.password")} variant="auth" />
      </FormUI.Item>
      <FormUI.Item name="passwordConfirm" rules={requiredFormRules}>
        <InputUI.Password autoComplete="new-password" placeholder={t("fields.confirmPassword")} variant="auth" />
      </FormUI.Item>

      <p>
        {t("haveAccount", { ns: namespaces.auth })}{" "}
        <span className={styles.span} onClick={() => openLoginForm()}>{t("signInNow", { ns: namespaces.auth })}</span>
      </p>

      <ButtonUI
        type="primary"
        loading={forgotPasswordStep3State.loading}
        onClick={() => form.submit()}
      >
        {t("buttons.send")}
      </ButtonUI>
    </FormUI>
  )
};
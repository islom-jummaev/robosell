import { Form } from "antd";
import { requiredFormRules } from "@utils/constants/common";
import { InputUI } from "@ui/input";
import { ButtonUI } from "@ui/button";
import { FormUI } from "@ui/form";
import InputMask from "react-input-mask";

import styles from "../auth.module.scss";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";
import React from "react";

export default function RegisterForm(props: any) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

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
    const checkPasswordsError = checkPasswords(formData, "password", "passwordConfirm");

    if (!checkPasswordsError) {
      return;
    }

    props.onRegister({
      firstname: formData.firstname,
      phone: formData.phone,
      password: formData.password,
      password2: formData.passwordConfirm
    });
  };

  return (
    <div className={styles["register-form"]}>
      <h4>{t("register", { ns: namespaces.auth })}</h4>

      <FormUI
        phantomSubmit
        form={form}
        onFinish={onFinish}
      >

        <Form.Item name="firstname" rules={requiredFormRules}>
          <InputUI placeholder={t("fields.userName")} />
        </Form.Item>

        <Form.Item name="phone" rules={requiredFormRules}>
         
          <InputMask   
            mask="+\9\98 99 999-99-99"
            className="formcontrol"
            placeholder={t("fields.phone")}
            type="text"
          
            
          />
        </Form.Item>

        <FormUI.Item name="password" rules={requiredFormRules}>
          <InputUI.Password placeholder={t("fields.password")} variant="auth" />
        </FormUI.Item>
        <FormUI.Item name="passwordConfirm" rules={requiredFormRules}>
          <InputUI.Password autoComplete="new-password" placeholder={t("fields.confirmPassword")} variant="auth" />
        </FormUI.Item>

        <p>
          {t("haveAccount", { ns: namespaces.auth })}{" "}
          <span className={styles.span} onClick={() => props.setRegisterForm(false)}>{t("signInNow", { ns: namespaces.auth })}</span>
        </p>

        <ButtonUI
          type="primary"
          loading={props.isLoading}
          onClick={() => form.submit()}
        >
          {t("register", { ns: namespaces.auth })}
        </ButtonUI>
      </FormUI>
      <a href="https://t.me/Robosell_bot" target="_blank">{t("buttons.support")}</a>
    </div>
  );
}

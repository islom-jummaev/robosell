import React from "react";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { FormUI } from "@ui/form";
import { InputUI } from "@ui/input";
import { ButtonUI } from "@ui/button";
import InputMask from "react-input-mask";
import { requiredFormRules } from "@utils/constants/common";
// import styled from 'styled-components';
// import "../auth.module.scss";
import styles from "../auth.module.scss";
import { namespaces } from "@core/localization/i18n.constants";


export default function LoginForm(props: any) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  // const [phone, onChange] = useState();
  const onLoginChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;

    form.setFieldValue("login", value.replace(/[^0-9+]/g, ''));
  };

  const onFinish = (formData: any) => {
    props.onLogin({
      phone: formData.login,
      password: formData.password,
    });
  };

  return (
    <div className={styles["login-form"]}>
      <h4>{t("authorization", { ns: namespaces.auth })}</h4>
      <FormUI
        phantomSubmit
        form={form}
        onFinish={onFinish}
      >

        <Form.Item name="login" rules={requiredFormRules}>
          {/* <InputUI onChange={onLoginChange} placeholder={t("fields.phone")}
           /> */}
                     {/* <InputUI className="InputMask" placeholder={t("fields.phone")} type="text" onChange={onLoginChange} value="+\9\98 99 999-99-99" /> */}

          <InputMask   
            mask="+\9\98 99 999-99-99"
            className="formcontrol"
            placeholder={t("fields.phone")}
            type="text"
            onChange={onLoginChange}
            
          />
          
        </Form.Item>
        <Form.Item name="password" rules={requiredFormRules}>
          <InputUI.Password placeholder={t("fields.password")} variant="auth" />
        </Form.Item>

        <p>
          <span className={styles.span} onClick={() => props.setIsShowForgotPasswordForm(true)}>
            {t("forgotPassword", { ns: namespaces.auth })} ?
          </span>
        </p>

        <p>
          {t("notHaveAccount", { ns: namespaces.auth })}{" "}
          <span className={styles.span} onClick={() => props.setRegisterForm(true)}>{t("createNow", { ns: namespaces.auth })}</span>
        </p>

        <ButtonUI
          type="primary"
          loading={props.isLoading}
          onClick={() => form.submit()}
        >
          {t("enter", { ns: namespaces.auth })}
        </ButtonUI>
      </FormUI>

      <a href="https://t.me/Robosell_bot" target="_blank">{t("buttons.support")}</a>
    </div>
  );
}

import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import styles from "../../auth.module.scss";
import { namespaces } from "@core/localization/i18n.constants";
import { ForgotPasswordFormStep1 } from "./steps/step1";
import { ForgotPasswordFormStep2 } from "./steps/step2";
import { ForgotPasswordFormStep3 } from "./steps/step3";
import { $forgotPasswordStep1, $forgotPasswordStep2, $forgotPasswordStep3 } from "@stores/account";


export default function ForgotPasswordForm(props: any) {
  const { t } = useTranslation();

  const [step, setStep] = useState<number>(1);

  const { reset: resetStep1 } = $forgotPasswordStep1.useStore();
  const { reset: resetStep2 } = $forgotPasswordStep2.useStore();
  const { reset: resetStep3 } = $forgotPasswordStep3.useStore();

  useEffect(() => {
    return () => {
      resetStep1();
      resetStep2();
      resetStep3();
    }
  }, []);

  const openLoginForm = () => {
    props.setIsShowForgotPasswordForm(false);
  };

  return (
    <div className={styles["login-form"]}>
      <h4>{t("recover", { ns: namespaces.auth })}</h4>

      {step === 1 ? (
        <ForgotPasswordFormStep1 setStep={setStep} openLoginForm={openLoginForm} />
      ) : step === 2 ? (
        <ForgotPasswordFormStep2 setStep={setStep} openLoginForm={openLoginForm} />
      ) : (
        <ForgotPasswordFormStep3 openLoginForm={openLoginForm} />
      )}

      <a href="https://t.me/Robosell_bot" target="_blank">{t("buttons.support")}</a>
    </div>
  );
}

import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import VerifyCode from "./components/VerifyCode";
import ForgotPasswordForm from "./components/forgotPasswordForm";
import useAuth from "./useAuth";
import styles from "./auth.module.scss";
import { LanguageIcon } from "@assets/icons";
import { LanguagePopup } from "@/components/language-popup";
import { currentLangType, getCurrentLang } from "@utils/getters";
import logoAuth from "@assets/images/auth-logo.png";
import logoFull from "@assets/images/logo-full.png";


export default function Auth() {
  const {
    isLoading,
    isShowRegisterForm,
    isShowVerifyForm,
    setRegisterForm,
    isShowForgotPasswordForm,
    setIsShowForgotPasswordForm,
    onLogin,
    onRegister,
    onVerify,
  } = useAuth();
  const [curLang, setCurLang] = useState<currentLangType>(getCurrentLang());

  return (
    <div className={styles.login}>
      <div className={styles.login__block}>
        <LanguagePopup callback={(lang) => setCurLang(lang)}>
          <div className="language-select">
            <LanguageIcon /> {curLang}
          </div>
        </LanguagePopup>
        {isShowRegisterForm ? (
          isShowVerifyForm ? (
            <VerifyCode
              isLoading={isLoading}
              onVerify={onVerify}
              setRegisterForm={setRegisterForm}
            />
          ) : (
            <RegisterForm
              isLoading={isLoading}
              onRegister={onRegister}
              setRegisterForm={setRegisterForm}
            />
          )
        ) : isShowForgotPasswordForm ? (
          <ForgotPasswordForm
            setIsShowForgotPasswordForm={setIsShowForgotPasswordForm}
          />
        ) : (
          <LoginForm
            isLoading={isLoading}
            onLogin={onLogin}
            setIsShowForgotPasswordForm={setIsShowForgotPasswordForm}
            setRegisterForm={setRegisterForm}
          />
        )}

        <div className={styles.logoMain} data-user="desktop">
          <img src={logoAuth} alt="robo" />
        </div>
        {!isShowRegisterForm && (
          <div className={styles.logoMob} data-user="mobile">
            <img src={logoFull} height={92} alt="robo" />
          </div>
        )}
      </div>
    </div>
  );
}

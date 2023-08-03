import { useState } from "react";
import { useNavigate } from "react-router";
import { ApiAuth } from "@/shared/api";
import { LoginPayload, RegisterPayload } from "./types";

export default function useAuth() {
  const navigate = useNavigate();
  const [isShowRegisterForm, setRegisterForm] = useState(false);
  const [isShowVerifyForm, setVerifyForm] = useState(false);
  const [isShowForgotPasswordForm, setIsShowForgotPasswordForm] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (data: LoginPayload) => {
    try {
      setLoading(true);
      const { data: response }: any = await ApiAuth.onLogin(data);

      if (response) {
        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("currentUserId", response.id);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: RegisterPayload) => {
    try {
      setLoading(true);
      setPhoneNumber(data.phone);
      setPassword(data.password);
      const { data: response } = await ApiAuth.onRegister(data);

      if (response) {
        setVerifyForm(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async ({ code }: { code: string }) => {
    const reqData = {
      phone: phoneNumber,
      code: code,
    };

    try {
      setLoading(true);
      const { data: response } = await ApiAuth.onVerify(reqData);

      if (response) {
        //setRegisterForm(false);
        onLogin({
          phone: phoneNumber,
          password: password
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    isShowRegisterForm,
    isShowVerifyForm,
    setRegisterForm,
    isShowForgotPasswordForm,
    setIsShowForgotPasswordForm,
    onLogin,
    onRegister,
    onVerify
  };
}

import React, { FC, ReactNode } from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { ModalProps } from "antd/es/modal/Modal";

const { confirm } = Modal;

export const ModalConfirm: FC<ModalProps & { children: any }> = (props) => {
  const { t } = useTranslation();

  const handleClick = () => {
    confirm({
      okText: t("yes"),
      cancelText: t("no"),
      ...props,
    });
  };

  return (
    <>
      {React.cloneElement(props.children, { onClick: handleClick })}
    </>
  );
};
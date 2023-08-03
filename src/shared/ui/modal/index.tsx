import React, { FC } from "react";

import { Alert, Modal } from "antd";
import type { ModalProps } from "antd/lib/modal";
import { Spinner } from "@ui/spinner";
import styles from "./styles.module.scss";

type UiModalPropsType = {

} & ModalProps;

type ModalPropsType = {
  Header: typeof Header;
  Title: typeof Title;
  Footer: typeof Footer;
  Middle: typeof Middle;
  Buttons: typeof Buttons;
  Loading: typeof Loading;
  Error: typeof Error;
} & FC<UiModalPropsType>;

const ModalUI: ModalPropsType = (props) => {
  const { className = "", width = 500, footer = false, ...restProps } = props;

  let classesCompose = styles["custom-modal"];

  if (className) {
    classesCompose = `${classesCompose} ${className}`;
  }

  return (
    <Modal
      {...restProps}
      className={classesCompose}
      wrapClassName={styles["custom-modal-wrap"]}
      width={width}
      footer={footer}
      destroyOnClose={true}
    />
  );
};

const Header = (props: any) => {
  const { children } = props;

  return (
    <div className={styles["custom-modal__header"]}>
      {children}
    </div>
  );
};

const Title = (props: any) => {
  return <div className={styles["custom-modal__title"]}>{props.children}</div>;
};

const Footer = (props: any) => {
  return <div className={styles["custom-modal__footer"]}>{props.children}</div>;
};

const Middle = (props: any) => {
  return <div className={`${styles["custom-modal__middle"]} fancy-scrollbar`}>{props.children}</div>;
};

const Buttons = (props: any) => {
  return <div className={styles["custom-modal__buttons"]}>{props.children}</div>;
};

const ButtonCol = (props: any) => {
  return <div className={styles["custom-modal__buttons__col"]}>{props.children}</div>;
};

type LoadingPropsType = {
  show: boolean;
};

const Loading: React.FC<LoadingPropsType> = ({ show }) => {
  if (show) {
    return (
      <div className="bg-loader">
        <Spinner />
      </div>
    );
  }

  return null;
};

type ErrorPropsType = {
  error?: any;
};

const Error: React.FC<ErrorPropsType> = ({ error }) => {
  if (!error) return null;

  return <Alert className={styles["custom-modal__error"]} message={error.title} type="error" />;
};

ModalUI.Header = Header;
ModalUI.Title = Title;
ModalUI.Footer = Footer;
ModalUI.Middle = Middle;
ModalUI.Buttons = Buttons;
Buttons.Col = ButtonCol;

ModalUI.Loading = Loading;
ModalUI.Error = Error;

export { ModalUI };

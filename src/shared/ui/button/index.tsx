import React, { FC } from "react";

import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";
import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

const getLinkSizeClass = (size?: string) => {
  if (size === "large") {
    return "ant-btn-lg";
  } else if (size === "small") {
    return "ant-btn-sm";
  }

  return "";
};

interface ButtonPropsType extends Omit<ButtonProps, "type"> {
  type?: "primary" | "primary-light" | "secondary" | "auth" | "bordered" | "light-blue" | "danger" | "success";
  fullWidth?: boolean;
  withIcon?: boolean;
  link?: string;
  noBorder?: boolean;
  circle?: boolean;
}

export const ButtonUI: FC<ButtonPropsType> = (props) => {
  const { className = "", withIcon, circle, fullWidth, link, noBorder, type, ...restProps } = props;

  let classesCompose = `${styles.btn} custom-btn`;

  if (className) {
    classesCompose = `${classesCompose} ${className}`;
  }

  if (type) {
    classesCompose = `${classesCompose} ${
      type === "primary" ? `${styles.primary} ant-btn-primary` : styles[type]
    }`;
  }

  if (withIcon) {
    classesCompose = `${classesCompose} ${styles.btnWithIcon}`;
  }

  if (circle) {
    classesCompose = `${classesCompose} ${styles.btnCircle}`;
  }

  if (fullWidth) {
    classesCompose = `${classesCompose} ${styles.fullWidth}`;
  }

  if (noBorder) {
    classesCompose = `${classesCompose} ${styles.noBorder}`;
  }

  if (link) {
    classesCompose = `${styles.linkBtn} ant-btn ${classesCompose} ${getLinkSizeClass(props.size)}`;

    return <Link {...restProps} to={link} className={classesCompose} />;
  }

  return <Button {...restProps} className={classesCompose} />;
};

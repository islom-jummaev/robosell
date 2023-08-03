import React, { FC, ReactNode } from "react";
import { Modal } from "antd";
import { ArrowNextIcon } from "@assets/icons";

import { $webAppBasketControl, $webAppEntry } from "@stores/web-app";
import { useTranslation } from "react-i18next";
import { isShopOpen } from "@/pages/shop";

const { confirm } = Modal;

type PropsTypes = {
  name: string;
  subTitle?: string;
  icon: ReactNode;
  onClick?: () => void;
}

export const ShopMainButton: FC<PropsTypes> = (props) => {
  const { name, subTitle, icon, onClick } = props;

  return (
    <div className="shop-app__main-buttons__item" {...(onClick ? { onClick } : {})}>
      <div className="shop-app__main-buttons__item__name">
        <div className="shop-app__main-buttons__item__name-s1">{name}</div>
        <div className="shop-app__main-buttons__item__name-s2">{subTitle}</div>
      </div>
      <div className="shop-app__main-buttons__item__icon">{icon}</div>
      <div className="shop-app__main-buttons__item__arr">
        <ArrowNextIcon />
      </div>
    </div>
  )
};

type BasketBtnPropsTypes = {
  children: ReactNode;
  className?: string;
}

export const ShopBasketButton: FC<BasketBtnPropsTypes> = (props) => {
  const { className, children } = props;

  const { t } = useTranslation();

  const { length, update } = $webAppBasketControl.useStore();
  const { open: openTime, close: closeTime } = $webAppEntry.useStore();

  const onOpen = () => {
    let isOpen = true;

    if (openTime && closeTime) {
      isOpen = isShopOpen(openTime, closeTime);
    }

    if (!isOpen) {
      showTimeConfirm();
      return;
    }

    if (length) {
      document.body.classList.add("disable-scroll");
      update({ open: true });
    } else {
      confirm({
        okText: t("close"),
        title: t("basketNull"),
        icon: null,
        centered: true,
        width: 320,
        className: "shop-app__confirm basket-null",
        okType: "primary",
      });
    }
  };

  const showTimeConfirm = () => {
    confirm({
      okText: t("close"),
      icon: null,
      title: t("notifications.shopTimeEnd", { from: openTime ? openTime.substring(0,5) : "", to: closeTime ? closeTime.substring(0,5) : "" }),
      centered: true,
      width: 380,
      className: "shop-app__confirm basket-null",
      okType: "primary",
    });
  };

  return (
    <div className={className} onClick={onOpen}>
      {children}
    </div>
  )
};
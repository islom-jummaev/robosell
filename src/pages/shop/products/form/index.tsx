import React, { useEffect, useState, FC } from "react";
import { formatCount } from "@utils/formatters";
import { IWebAppProductsItemModel } from "@/businessLogic/models/web-app";
import { $addWebAppProductToBasket, $webAppBasketControl, $webAppEntry, $webAppProductDetails } from "@stores/web-app";
import { useTranslation } from "react-i18next";

import "./styles.scss";
import { notificationSuccess, notificationWarning } from "@ui/notifications";
import { useTelegram } from "@/pages/shop/telegram/useTelegram";
import { isShopOpen } from "@/pages/shop";
import { Modal } from "antd";

const { confirm } = Modal;


type PropsTypes = {
  data: IWebAppProductsItemModel;
  closeModal: () => void;
}

export const ShopAppProductForm: FC<PropsTypes> = (props) => {
  const { data, closeModal } = props;

  const { t } = useTranslation();
  const { telegram } = useTelegram();

  const { user_lang, user_id, open: openTime, close: closeTime } = $webAppEntry.useStore();
  const { request: getProductDetails, reset: resetProductDetails, ...webAppProductDetailsState } = $webAppProductDetails.useStore();
  const { request: addWebAppProductToBasket, reset: resetAddWebAppProductToBasket, ...addWebAppProductToBasketState } = $addWebAppProductToBasket.useStore();
  const { update: updateBasketControl, length: basketLength } = $webAppBasketControl.useStore();

  const [formFields, setFormFields] = useState<{ skus: null | { id: number; price: string; }, count: number }>({
    skus: null,
    count: 1
  });

  useEffect(() => {
    getProductDetails(data.id);

    return () => {
      resetProductDetails();
      resetAddWebAppProductToBasket();
    }
  }, []);

  useEffect(() => {
    if (addWebAppProductToBasketState.success) {
      if (!telegram.isClosingConfirmationEnabled) {
        telegram.enableClosingConfirmation();
      }

      updateBasketControl({
        length: (basketLength || 0) + 1
      });
      notificationSuccess(t("notifications.productAdded"));
      closeModal();
    }
  }, [addWebAppProductToBasketState.success]);

  useEffect(() => {
    if (webAppProductDetailsState.data) {
      if (webAppProductDetailsState.data.skus.length) {
        onSelectSkus(webAppProductDetailsState.data.skus[0]);
      }
    }
  }, [webAppProductDetailsState.data]);

  const onSelectSkus = (skusItem: { id: number; price: string; }) => {
    setFormFields({
      ...formFields,
      skus: skusItem
    });
  };

  const onCountChange = (count: number) => {
    setFormFields({
      ...formFields,
      count: count > 1 ? count : 1
    });
  };

  const onAddProduct = () => {
    let isOpen = true;

    if (openTime && closeTime) {
      isOpen = isShopOpen(openTime, closeTime);
    }

    if (!isOpen) {
      showTimeConfirm();
      return;
    }

    if (formFields.skus) {
      addWebAppProductToBasket({
        botuser_id: user_id,
        sku_id: formFields.skus?.id,
        count: formFields.count
      });
    }
  }

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
    <div className="shop-app__product-form">
      <div className="shop-app__product-form__info">
        <div className="shop-app__product-form__info__photo">
          <img src={data.photo} alt={`${data.name[user_lang]}`}/>
        </div>
        <div className="shop-app__product-form__info__mid">
          <div className={`shop-app__product-form__info__mid__name`}>
            {data.name[user_lang]}
          </div>
          <div className="shop-app__product-form__info__mid__text">
            {data.desc[user_lang]}
          </div>
        </div>
      </div>
      <div className="shop-app__product-form__skus">
        {webAppProductDetailsState.data?.skus.map((item) => (
          <div className={`shop-app__product-form__skus__item ${formFields.skus?.id === item.id ? "active" : ""}`} key={item.id} onClick={() => onSelectSkus(item)}>
            {item.name[user_lang]}
          </div>
        ))}
      </div>
      <div className="shop-app__product-form__price">
        <div className="shop-app__product-form__price__left">
          {formFields.skus ? formatCount(Number(formFields.skus.price || data.price) * formFields.count) : ""} {t("uzs")}
        </div>
        <div className="shop-app__product-form__price__right">
          <div className="shop-app__amount">
            <div
              className="amount-btn"
              onClick={() => onCountChange(formFields.count - 1)}
            >
              -
            </div>
            <div className="amount-input">
              {formFields.count}
            </div>
            <div
              className="amount-btn"
              onClick={() => onCountChange(formFields.count + 1)}
            >
              +
            </div>
          </div>
        </div>
      </div>
      <div
        className="shop-app__product-form__button"
        onClick={onAddProduct}
      >
        {t("addToCart")}
      </div>
    </div>
  )
};
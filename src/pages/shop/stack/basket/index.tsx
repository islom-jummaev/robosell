import React, { useEffect, useRef, useState } from "react";
import {
  $clearBasket,
  $removeBasketItem,
  $webAppBasketControl,
  $webAppBasketProducts,
  $webAppEntry,
  $webAppPayments,
  $webAppUserDetails
} from "@stores/web-app";
import { BasketBackIcon, BasketDeleteIcon } from "@assets/icons";
import { useTranslation } from "react-i18next";
import { WebAppBasketProductItem } from "@/pages/shop/stack/basket/product-item";
import { InputUI } from "@ui/input";
import { namespaces } from "@core/localization/i18n.constants";
import { formatCount } from "@utils/formatters";
import { Spinner } from "@ui/spinner";
import { ModalConfirm } from "@ui/modalConfirm";
import { notificationWarning } from "@ui/notifications";
import { getDigitsNums } from "@utils/common";
import { useTelegram } from "@/pages/shop/telegram/useTelegram";
import { IWebAppPaymentsItemModel } from "@/businessLogic/models/web-app";
import { isShopOpen } from "@/pages/shop";
import { Modal, Input } from "antd";
import InputMask from "react-input-mask";

const { confirm } = Modal;

export const ShopBasketStack = () => {
  const { t } = useTranslation();

  const { telegram } = useTelegram();

  const { request: getBasketProducts, reset: resetBasketProducts, ...webAppBasketProductsState } = $webAppBasketProducts.useStore();
  const { request: getPayments, reset: resetPayments, ...webAppPaymentsState } = $webAppPayments.useStore();
  const { request: clearBasket, reset: resetClearBasket, ...clearBasketState } = $clearBasket.useStore();
  const { reset: resetRemoveBasketItem, ...removeBasketItemState } = $removeBasketItem.useStore();
  const webAppUserDetailsState = $webAppUserDetails.useStore();
  const { open, update: updateBasketControl, length: productsLength } = $webAppBasketControl.useStore();
  const { bot_id, user_id, user_lang, open: openTime, close: closeTime } = $webAppEntry.useStore();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [phone, setPhone] = useState<string>(webAppUserDetailsState.data?.phone || "");
  const [paymentMode, setPaymentMode] = useState<boolean>(false);
  const [fieldsError, setFieldsError] = useState<{ [key: string]: string }>({});
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const phoneRef = useRef<any>(null);
  const footerRef = useRef<any>(null);

  const getList = () => {
    getBasketProducts(user_id);
  };

  useEffect(() => {
    getList();
    getPayments(bot_id);

    if (webAppUserDetailsState.data && webAppUserDetailsState.data.service_type === "DELIVERY") {
      if (!isNaN(webAppUserDetailsState.data.delivery)) {
        setDeliveryPrice(webAppUserDetailsState.data.delivery);
      }
    }
  }, []);

  useEffect(() => {
    if (open) {
      getList();
    }
  }, [open]);

  useEffect(() => {
    if (webAppBasketProductsState.data) {
      if (!telegram.isClosingConfirmationEnabled && webAppBasketProductsState.data.length) {
        telegram.enableClosingConfirmation();
      }

      updateBasketControl({
        length: webAppBasketProductsState.data.length
      });

      const totalSum = webAppBasketProductsState.data.reduce((prevState, item) => {
        return prevState + (item.quantity * Number(item.sku.price));
      }, 0);

      setTotalPrice(totalSum);
    }
  }, [webAppBasketProductsState.data]);

  useEffect(() => {
    if (clearBasketState.success) {
      telegram.disableClosingConfirmation();

      resetBasketProducts();
      resetClearBasket();
      updateBasketControl({
        open: false,
        length: 0
      });
      afterClose();
    }
  }, [clearBasketState.success]);

  useEffect(() => {
    if (removeBasketItemState.success) {
      resetRemoveBasketItem();
      if (productsLength === 1) {
        telegram.disableClosingConfirmation();
        updateBasketControl({
          open: false,
          length: 0
        });
        afterClose();
      } else {
        getList();
      }
    }
  }, [removeBasketItemState.success])

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (fieldsError.phone) {
      setFieldsError({
        ...fieldsError,
        phone: ""
      })
    }

    const value = e.target.value.replace(/[^0-9+]/g, '');
    setPhone(value);
  };

  const afterClose = () => {
    document.body.classList.remove("disable-scroll");
  }

  const onClose = () => {
    if (paymentMode) {
      setPaymentMode(false);
    } else {
      updateBasketControl({
        open: false,
      });
      afterClose();
    }
  }

  const onClear = () => {
    clearBasket(user_id);
  };

  const validateForm = () => {
    const hasErrors: { [key: string]: string } = {};

    const phoneVal = getDigitsNums(phone);

    if (!phoneVal) {
      hasErrors["phone"] = t("errors.required");
    } else if (phoneVal.length !== 12) {
      hasErrors["phone"] = t("notifications.wrongFormat");
    }

    const isExistErrors = !!Object.keys(hasErrors).length;

    if (isExistErrors) {
      setFieldsError(hasErrors);
    }

    return isExistErrors;
  };

  const onContinueOrder = () => {
    if (productsLength === 0) {
      notificationWarning(t("add_products", { ns: namespaces.orders }));
    } else {
      const hasErrors = validateForm();

      if (hasErrors) {
        return;
      }
      getList(); // todo fix on state
      setPaymentMode(true);
    }
  };

  const onPaymentSelect = async (paymentItem: IWebAppPaymentsItemModel) => {
    let isOpen = true;

    if (openTime && closeTime) {
      isOpen = isShopOpen(openTime, closeTime);
    }

    if (!isOpen) {
      showTimeConfirm();
      return;
    }

    const bot_token = webAppUserDetailsState.data?.bot_token;
    const payment_token = paymentItem.token;

    if (webAppBasketProductsState.data) {
      setPaymentLoading(true);

      const products = webAppBasketProductsState.data;

      const prices: Array<{ label: string; amount: number; }> = [];
      const orders: Array<{ sku: number; count: number; }> = [];

      products.forEach((item) => {
        prices.push({
          "label": `${item.product[user_lang]} x ${item.quantity}`,
          "amount": Number(item.sku.price) * item.quantity * 100
        });
        orders.push({
          "sku": item.sku.id,
          "count": item.quantity
        });
      });

      if (payment_token) {
        const invoiceUrl = `https://api.telegram.org/bot${bot_token}/createInvoiceLink`;
        let resultUrl = "";

        telegram.onEvent("invoiceClosed", closeWebapp);
        function closeWebapp(event: any) {
          const { url, status } = event;

          if (url == resultUrl && status == "paid") {
            const res = {
              "type": "ORDER",
              "orders": orders,
              "phone" : `+${getDigitsNums(phone)}`,
              "payment": paymentItem.id,
              "is_paid": true,
              "comment": comment
            }

            telegram.sendData(JSON.stringify(res));
            telegram.close();
          }
        }

        const data = {
          "title": "Zakaz",
          "description": "Test description",
          "payload": "custom_payload",
          "provider_token": payment_token,
          "currency": "UZS",
          "prices": prices,
          "data": {
            "phone": `+${getDigitsNums(phone)}`,
            "orders": orders
          }
        }
        const res = await fetch(invoiceUrl,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          })
        const json = await res.json()
//         alert(JSON.stringify(json))
        if (json.ok) {
          resultUrl = json.result;
          telegram.openInvoice(json.result)
        }
        setPaymentLoading(false);
      } else {
        const res = {
          "type": "ORDER",
          "orders": orders,
          "phone" : `+${getDigitsNums(phone)}`,
          "payment": paymentItem.id,
          "is_paid": false,
          "comment": comment
        }

        telegram.sendData(JSON.stringify(res));
        setPaymentLoading(false);
      }
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

  const onPhoneFocus = () => {
    if (footerRef.current) {
      footerRef.current.style.paddingBottom = "200px";
    }

    phoneRef.current.focus({
      preventScroll: true
    });
  };

  const onPhoneBlur = () => {
    if (footerRef.current) {
      footerRef.current.style.paddingBottom = "0px";
    }
  };

  return (
    <div className={`shop-app__basket ${open ? "active" : ""}`}>
      {(clearBasketState.loading || removeBasketItemState.loading || webAppBasketProductsState.loading || paymentLoading) && (
        <div className="bg-loader">
          <Spinner />
        </div>
      )}
      <div className="shop-app__basket__in">
        <div className="shop-app__basket__header">
          <div className="shop-app__basket__header__back" onClick={onClose}>
            <BasketBackIcon />
          </div>
          <div className="shop-app__basket__header__title">
            {paymentMode ? t("fields.paymentType") : t("basket")}
          </div>
          <div className="shop-app__basket__header__empty">
            {!paymentMode && (
              <ModalConfirm
                className="shop-app__confirm"
                centered={true}
                width={320}
                title={t("notifications.confirmClearBasket")}
                onOk={onClear}
                okType={"danger"}
              >
                <div className="shop-app__basket__header__delete">
                  <BasketDeleteIcon />
                </div>
              </ModalConfirm>
            )}
          </div>
        </div>
        {paymentMode ? (
          <div className="shop-app__payments">
            {webAppPaymentsState.data?.map((item) => (
              <div className="shop-app__payments__item" key={item.id} onClick={() => onPaymentSelect(item)}>
                <div className="shop-app__payments__item__icon">
                  <img src={item.payment.icon} alt={item.payment.name} />
                </div>
                <div className="shop-app__payments__item__name">
                  {item.payment.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="shop-app__basket__products">
              {webAppBasketProductsState.data?.map((item) => (
                <WebAppBasketProductItem key={item.id} item={item} setTotalPrice={setTotalPrice} />
              ))}
              <div className="shop-app__basket__products__comment">
                <InputUI.TextArea
                  value={comment}
                  placeholder={t("placeholders.comment")}
                  autoSize={true}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    const val = e.target.value;

                    setComment(val);
                  }}
                />
              </div>
            </div>
            <div className="shop-app__basket__footer" ref={footerRef}>
              <div className="shop-app__basket__footer__row">
                <div className="shop-app__basket__footer__row__label">{t("fields.phone")}:</div>
                <div className={`shop-app-phone ${fieldsError.phone ? "error-field" : ""}`}>
                  <div className="shop-app-phone__outer" onClick={onPhoneFocus}></div>
                  <Input
                    className="custom-input"
                    placeholder="Введите номер"
                    onChange={onPhoneChange}
                    onBlur={onPhoneBlur}
                    value={phone}
                    ref={phoneRef}
                  />
                </div>
              </div>
              {webAppUserDetailsState.data && webAppUserDetailsState.data.service_type === "DELIVERY" ? (
                <div className="shop-app__basket__footer__row">
                  <div>{t("delivery.title", { ns: namespaces.bots })}:</div>
                  <div className="shop-app-delivery">
                    {isNaN(webAppUserDetailsState.data.delivery) ? webAppUserDetailsState.data.delivery : (
                      <>{formatCount(webAppUserDetailsState.data.delivery)} {t("uzs")}</>
                    )}
                  </div>
                </div>
              ) : null}
              <div className="shop-app__basket__footer__button" onClick={onContinueOrder}>
                <div>{t("buttons.createOrder")}</div>
                <div className="shop-app__basket__button__price">
                  {formatCount(totalPrice + deliveryPrice)} {t("uzs")}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
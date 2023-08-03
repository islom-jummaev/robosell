import React, { FC, useEffect, useState } from "react";
import { IWebAppBasketProductsItemModel } from "@/businessLogic/models/web-app";
import { $addWebAppProductToBasket, $removeBasketItem, $webAppEntry } from "@stores/web-app";
import { formatCount } from "@utils/formatters";
import { useTranslation } from "react-i18next";
import { notificationWarning } from "@ui/notifications";
import { withDebounce } from "@ui/input";
import { BasketDeleteIcon } from "@assets/icons";
import { ModalConfirm } from "@ui/modalConfirm";

type PropsTypes = {
  item: IWebAppBasketProductsItemModel;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
}

export const WebAppBasketProductItem: FC<PropsTypes> = (props) => {
  const { item, setTotalPrice } = props;

  const { t } = useTranslation();

  const { user_lang, user_id } = $webAppEntry.useStore();
  const { request: addWebAppProductToBasket, reset: resetAddWebAppProductToBasket, ...addWebAppProductToBasketState } = $addWebAppProductToBasket.useStore();
  const { request: removeBasketItem } = $removeBasketItem.useStore();

  const [count, setCount] = useState<number>(item.quantity);

  useEffect(() => {
    if (item.quantity !== count) {
      setCount(item.quantity);
    }
  }, [item.quantity]);

  useEffect(() => {
    if (addWebAppProductToBasketState.data) {
      resetAddWebAppProductToBasket();
    }
  }, [addWebAppProductToBasketState.data]);

  const onRemoveItem = () => {
    removeBasketItem({
      botuser_id: user_id,
      sku_id: item.sku.id
    });
  };

  const onCountChange = (val: number, type: string) => {
    if (item.sku.stock_status === "LIMITED" && val > item.sku.stock_count) {
      notificationWarning(`${t("notifications.notAvailable")}: ${formatCount(item.sku.stock_count)}`);
      return;
    } else {
      if (type === "MINUS") {
        if (val > 0) {
          setTotalPrice((prevTotal) => prevTotal - Number(item.sku.price));
        }
      } else {
        if (val > 0) {
          setTotalPrice((prevTotal) => prevTotal + Number(item.sku.price));
        }
      }

      const countVal = val > 1 ? val : 1;

      setCount(countVal);

      withDebounce(() => {
        addWebAppProductToBasket({
          sku_id: item.sku.id,
          botuser_id: user_id,
          count: countVal
        })
      });
    }
  };

  return (
    <div className="shop-app__basket__products__item">
      <div className="shop-app__basket__products__item__photo">
        <img
          src={item.photo}
          alt={item.product[user_lang]}
        />
      </div>
      <div className="shop-app__basket__products__item__mid">
        <div className="shop-app__basket__products__item__name">
          {item.product[user_lang]}
          <div>{item.sku.name[user_lang]}</div>
        </div>
        <div className="shop-app__basket__products__item__price">
          {t("price")}: {item.sku ? formatCount(Number(item.sku.price)) : ""} {t("uzs")}
        </div>
      </div>
      <div className="shop-app__basket__products__item__actions">
        <div className="shop-app__product-form__price">
          <div className="shop-app__amount">
            {count === 1 ? (
              <ModalConfirm
                className="shop-app__confirm"
                centered={true}
                title={t("notifications.confirmDelete")}
                onOk={onRemoveItem}
                okType={"danger"}
              >
                <div className="amount-btn">
                  <BasketDeleteIcon />
                </div>
              </ModalConfirm>
            ) : (
              <div
                className="amount-btn"
                onClick={() => onCountChange(count - 1, "MINUS")}
              >
                -
              </div>
            )}
            <div className="amount-input">
              {count}
            </div>
            <div
              className="amount-btn"
              onClick={() => onCountChange(count + 1, "PLUS")}
            >
              +
            </div>
          </div>
          <div className="shop-app__product-form__total-price">
            {t("total")}: {item.sku ? formatCount(Number(item.sku.price) * count) : ""} {t("uzs")}
          </div>
        </div>
      </div>
    </div>
  )
};
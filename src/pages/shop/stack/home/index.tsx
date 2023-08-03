import React from "react";
import { ShopCategories } from "@/pages/shop/categories";
import { ShopBasketButton, ShopMainButton } from "@/pages/shop/shared-ui/buttons/main-button";
import { ShopProductsList } from "@/pages/shop/products";
import { useTranslation } from "react-i18next";
import { $webAppBasketControl, $webAppStack } from "@stores/web-app";
import { BasketIcon, FireworkIcon } from "@assets/icons";

export const ShopHomeStack = () => {
  const { t } = useTranslation();

  const { update: updateStack } = $webAppStack.useStore();
  const { length } = $webAppBasketControl.useStore();

  return (
    <div className="shop-app__container main-container">
      <ShopCategories />
      <div className="shop-app__main-buttons">
        <ShopMainButton
          name={t("sale")}
          subTitle={t("new")}
          icon={(
            <FireworkIcon />
          )}
          onClick={() => updateStack({ stack: "SALE" })}
        />
        <ShopBasketButton>
          <ShopMainButton
            name={t("basket")}
            subTitle={`${length} ${t("unitQty")}`}
            icon={(
              <BasketIcon />
            )}
          />
        </ShopBasketButton>
      </div>
      <ShopProductsList />
    </div>
  );
};
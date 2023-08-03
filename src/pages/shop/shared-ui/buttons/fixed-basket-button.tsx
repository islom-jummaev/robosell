import React from "react";
import { ShopBasketButton } from "@/pages/shop/shared-ui/buttons/main-button";
import { $webAppBasketControl } from "@stores/web-app";
import { BasketIcon } from "@assets/icons";

export const ShopAppFixedBasketButton = () => {
  const { length } = $webAppBasketControl.useStore();

  return (
    <ShopBasketButton
      className={`shop-app__fixed-basket-btn ${(length || 0) > 0 ? "active" : ""}`}
    >
      <div className="basket-animate"></div>
      {!!length && (
        <div className="shop-app__fixed-basket-btn__mark">
          {length}
        </div>
      )}
      <BasketIcon />
    </ShopBasketButton>
  )
};
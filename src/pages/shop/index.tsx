import React, { useEffect } from "react";

import { ShopHomeStack } from "@/pages/shop/stack/home";
import { $webAppEntry, $webAppStack, $webAppUserDetails, shopAppStackType } from "@stores/web-app";
import { ShopAppSkeleton } from "@/pages/shop/shared-ui/skeleton";
import { ShopBasketStack } from "@/pages/shop/stack/basket";
import { ShopAppFixedBasketButton } from "@/pages/shop/shared-ui/buttons/fixed-basket-button";
import { ShopAppSaleStack } from "@/pages/shop/stack/sale";
import { ShopAppNewsStack } from "@/pages/shop/stack/news";
import { dateDifference, timeDifference } from "@utils/common";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Modal } from "antd";

import "./styles.scss";
import { useTelegram } from "@/pages/shop/telegram/useTelegram";

const { confirm } = Modal;

export const isShopOpen = (open: string, close: string) => {
  const curTime = dayjs().format("HH:mm");

  const fewTime = timeDifference(open, close);

  const fewMins = fewTime.hours ? fewTime.hours * 60 + fewTime.minutes : fewTime.minutes;

  const afterOpen = timeDifference(open, curTime);

  const afterOpenMins = afterOpen.hours ? afterOpen.hours * 60 + afterOpen.minutes : afterOpen.minutes;

  return fewMins > afterOpenMins;
}

const Shop = () => {
  const search = window.location.search;
  const params = new URLSearchParams(search);

  const { t, i18n } = useTranslation();
  const { telegram } = useTelegram();

  const { bot_id, user_id, update, reset } = $webAppEntry.useStore();
  const { request: getWebAppUserDetails, reset: resetWebAppUserDetails, ...webAppUserDetailsState } = $webAppUserDetails.useStore();
  const { stack, update: updateStack } = $webAppStack.useStore();

  useEffect(() => {

    telegram.expand();

    // telegram.onEvent('viewportChanged', () => {
    //   if (telegram.isExpanded){
    //     telegram.expand();
    //   }
    // });

    const queryUser_id = params.get("botuser_id") || "";

    getWebAppUserDetails(queryUser_id);

    return () => {
      reset();
      resetWebAppUserDetails();
    }
  }, []);

  useEffect(() => {
    if (webAppUserDetailsState.data) {
      const queryBot_id = params.get("bot_id") || "";
      const queryUser_id = params.get("botuser_id") || "";

      update({
        bot_id: queryBot_id,
        user_id: queryUser_id,
        user_lang: webAppUserDetailsState.data.lang,
        open: webAppUserDetailsState.data.open,
        close: webAppUserDetailsState.data.close,
      });


      const localLang = localStorage.getItem("i18nextLng");

      if (localLang !== webAppUserDetailsState.data.lang) {
        i18n.changeLanguage(webAppUserDetailsState.data.lang).then(() => {
        });
      }

      const fromDate = webAppUserDetailsState.data.last_active;

      if (fromDate) {
        const toDate = dayjs().format("YYYY-MM-DDTHH:mm");
        const daysCount = dateDifference(fromDate, toDate);

        // console.log("fromDate", fromDate);
        // console.log("toDate", toDate);
        // console.log("daysCount", daysCount);
        // console.log("fromDateHours", dayjs(fromDate).format("HH:mm"));

        if (daysCount > 0) {
          showAddressConfirm();
        } else if (daysCount === 0) {
          const leaveTimeRange = timeDifference(dayjs(fromDate).format("HH:mm"), dayjs(toDate).format("HH:mm"));

          if (leaveTimeRange.hours > 0) {
            showAddressConfirm();
          } else if (leaveTimeRange.minutes > 29) {
            showAddressConfirm();
          }
        }
      }
    }
  }, [webAppUserDetailsState.data]);

  const showAddressConfirm = () => {
    confirm({
      okText: t("yes"),
      cancelText: t("buttons.change"),
      icon: null,
      title: (
        <>
          <span className="shop-app__confirm__title">{t("currentAddress")}</span>
          <span>
            {webAppUserDetailsState.data?.address}
          </span>
        </>
      ),
      centered: true,
      width: 320,
      className: "shop-app__confirm",
      okType: "primary",
      onCancel: () => {
        const res = {
          "type": "CHANGE_ADDRESS"
        }
        telegram.sendData(JSON.stringify(res))
      }
    });
  };

  const onUpdateStack = (value: shopAppStackType): void => {
    if (value === "HOME") {
      document.body.classList.remove("disable-scroll");
    } else {
      document.body.classList.add("disable-scroll");
    }

    updateStack({
      stack: value
    });
  };

  if (!bot_id || !user_id || !webAppUserDetailsState.data) {
    return null;
  }

  return (
    <div className="shop-app">
      <ShopHomeStack />
      {stack === "SALE" && (
        <ShopAppSaleStack onUpdateStack={onUpdateStack} />
      )}
      {stack === "NEWS" && (
        <ShopAppNewsStack onUpdateStack={onUpdateStack} />
      )}
      <ShopBasketStack />
      <ShopAppSkeleton />
      <ShopAppFixedBasketButton />
    </div>
  )
};

export default Shop;
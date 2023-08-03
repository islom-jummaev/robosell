import React, { useEffect, FC } from "react";
import { Empty } from "antd";
import { ShopMainButton } from "@/pages/shop/shared-ui/buttons/main-button";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";
import { $webAppCurrentNews, $webAppEntry, $webAppNews, $webAppSales, shopAppStackType } from "@stores/web-app";
import { ShopAppSaleSlider } from "@/pages/shop/stack/sale/slider";
import { HomeIcon, NewsIcon } from "@assets/icons";
import { ShopAppNewsSlider } from "@/pages/shop/stack/news/slider";
import { renderProductsSkeleton } from "@/pages/shop/shared-ui/skeleton";

type PropsTypes = {
  onUpdateStack: (p: shopAppStackType) => void;
};

export const ShopAppSaleStack: FC<PropsTypes> = (props) => {
  const { onUpdateStack } = props;

  const { t } = useTranslation();

  const { bot_id } = $webAppEntry.useStore();
  const { request: getSales, reset: resetSales, ...webAppSalesState } = $webAppSales.useStore();
  const { request: getNews, reset: resetNews, ...webAppNewsState } = $webAppNews.useStore();
  const { currentNews } = $webAppCurrentNews.useStore();

  useEffect(() => {
    getNews(bot_id);
  }, []);

  useEffect(() => {
    if (currentNews) {
      onUpdateStack("NEWS");
    }
  }, [currentNews]);

  if (!webAppNewsState.success) {
    return (
      <div className={`shop-app__skeleton active`}>
        <div className="shop-app__news__slider">
          <div className="shop-app__news__slider__skeleton">
            {renderProductsSkeleton(1)}
          </div>
        </div>
        <div className="shop-app__main-buttons">
          {renderProductsSkeleton(2)}
        </div>
        <div className="shop-app__search">
          {renderProductsSkeleton(1)}
        </div>
        <div className="shop-app__sale__cards">
          {renderProductsSkeleton(1)}
        </div>
      </div>
    );
  }

  return (
    <div className="shop-app__news">
      <div className="shop-app__container">
        <ShopAppNewsSlider
          items={webAppNewsState.data ? webAppNewsState.data : []}
        />
        <div className="shop-app__main-buttons">
          <ShopMainButton
            name={t("news.title", { ns: namespaces.marketing })}
            icon={(
              <NewsIcon />
            )}
            onClick={() => onUpdateStack("NEWS")}
          />
          <ShopMainButton
            name={t("main")}
            icon={(
              <HomeIcon />
            )}
            onClick={() => onUpdateStack("HOME")}
          />
        </div>
        <div style={{ paddingTop: "50px" }}>
          <Empty description={false} />
        </div>
      </div>
    </div>
  )
};
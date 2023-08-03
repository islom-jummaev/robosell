import React, { useEffect, FC } from "react";
import { ShopMainButton } from "@/pages/shop/shared-ui/buttons/main-button";
import { useTranslation } from "react-i18next";
import { $webAppCurrentNews, $webAppEntry, $webAppNews, shopAppStackType } from "@stores/web-app";
import { ShopAppNewsSlider } from "./slider";
import { renderProductsSkeleton } from "@/pages/shop/shared-ui/skeleton";
import { ShopAppNewsList } from "@/pages/shop/stack/news/list";
import { FireworkIcon, HomeIcon } from "@assets/icons";
import { formatDate } from "@utils/formatters";

type PropsTypes = {
  onUpdateStack: (p: shopAppStackType) => void;
}

export const ShopAppNewsStack: FC<PropsTypes> = (props) => {
  const { onUpdateStack } = props;

  const { t } = useTranslation();

  const { bot_id, user_lang } = $webAppEntry.useStore();
  const { request: getNews, reset: resetNews, ...webAppNewsState } = $webAppNews.useStore();

  const { currentNews, update: updateCurrentNews } = $webAppCurrentNews.useStore();

  useEffect(() => {
    getNews(bot_id);

    return () => {
      updateCurrentNews({ currentNews: null });
    }
  }, []);

  useEffect(() => {
    if (webAppNewsState.data) {

    }
  }, [webAppNewsState.data]);

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
            name={t("sale")}
            icon={(
              <div className="reverse-icon">
                <FireworkIcon />
              </div>
            )}
            onClick={() => onUpdateStack("SALE")}
          />
          <ShopMainButton
            name={t("main")}
            icon={(
              <HomeIcon />
            )}
            onClick={() => onUpdateStack("HOME")}
          />
        </div>
        {currentNews ? (
          <div className="shop-app__news__current">
            <div className="shop-app__news__current__title">
              {currentNews.title[user_lang]}
            </div>
            <div className="shop-app__news__current__photo">
              <img src={currentNews.photo} alt="" />
            </div>
            <div className="shop-app__news__current__date">
              {formatDate(currentNews.created_at)}
            </div>
            <div className="shop-app__news__current__desc">
              {currentNews.desc[user_lang]}
            </div>
          </div>
        ) : (
          <ShopAppNewsList
            items={webAppNewsState.data ? webAppNewsState.data : []}
          />
        )}
      </div>
    </div>
  )
};
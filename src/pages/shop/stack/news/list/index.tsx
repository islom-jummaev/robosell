import React, { FC } from "react";
import { IWebAppNewsItemModel } from "@/businessLogic/models/web-app";
import { $webAppCurrentNews, $webAppEntry } from "@stores/web-app";
import { formatDate } from "@utils/formatters";

type PropsTypes = {
  items: Array<IWebAppNewsItemModel>;
}

export const ShopAppNewsList: FC<PropsTypes> = (props) => {
  const { items } = props;

  const { user_lang } = $webAppEntry.useStore();
  const { update: updateCurrentNews } = $webAppCurrentNews.useStore();

  return (
    <div className="shop-app__news__list">
      {items.map((item) => (
        <div key={item.id} onClick={() => updateCurrentNews({ currentNews: item })}>
          <div className="shop-app__news__list__item">
            <div className="shop-app__news__list__item__photo">
              <img src={item.photo} alt={item.title[user_lang]} />
            </div>
            <div className="shop-app__news__list__item__title">
              {item.title[user_lang]}
            </div>
            <div className="shop-app__news__list__item__date">
              {formatDate(item.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
};
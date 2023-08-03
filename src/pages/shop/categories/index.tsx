import React, { useEffect, useState, useMemo, useRef, ReactNode } from "react";
import Slider, { Settings } from "@ant-design/react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { $webAppCategories, $webAppEntry } from "@stores/web-app";
import { IWebAppCategoriesItemModel } from "@/businessLogic/models/web-app";
import { currentLangType } from "@utils/getters";


const settings: Settings = {
  dots: false,
  infinite: false,
  speed: 150,
  slidesToShow: 6,
  initialSlide: 0,
  focusOnSelect: true,
  swipeToSlide: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 5,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 4,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 370,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 0,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
};

const renderSlides = (items: Array<IWebAppCategoriesItemModel>, sliderIndex: number, lang: currentLangType, onSelectCategory: (id: number) => void, current_category_id: string): Array<ReactNode> => {
  const separateIndex = Math.ceil(items.length / 2);

  const res: Array<ReactNode> = [];

  items.forEach((item, index) => {
    if (sliderIndex === 2 || (sliderIndex === 0 && index < separateIndex) || (sliderIndex === 1 && index >= separateIndex)) {
      res.push(
        <div key={item.id}>
          <div className="shop-app__categories__item-wr">
            <div
              className={`shop-app__categories__item ${String(item.id) === current_category_id ? "active" : ""}`}
              onClick={() => onSelectCategory(item.id)}
            >
              <img src={item.photo} alt={item.name[lang]} />
              <div className="shop-app__categories__item__text">
                {item.name[lang]}
              </div>
            </div>
          </div>
        </div>
      )
    }
  });

  return res;
};

let firstClientX: number, clientX: number;

const preventTouch = (e: any) => {
  const minValue = 5; // threshold

  clientX = e.touches[0].clientX - firstClientX;

  // Vertical scrolling does not work when you start swiping horizontally.
  // if (Math.abs(clientX) > minValue) {
  //   e.preventDefault();
  //   e.returnValue = false;
  //
  //   return false;
  // }

  e.preventDefault();
  e.returnValue = false;

  return false;
};

const touchStart = (e: any) => {
  firstClientX = e.touches[0].clientX;
};

export const ShopCategories = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { request: getCategories, reset: resetCategories, ...webAppCategoriesState } = $webAppCategories.useStore();
  const { bot_id, user_lang, user_id, category_id: current_category_id, open: openTime, close: closeTime, update: updateWebAppEntry } = $webAppEntry.useStore();

  useEffect(() => {
    getCategories(bot_id);
  }, []);

  useEffect(() => {
    if (webAppCategoriesState.data?.length) {
      updateWebAppEntry({
        bot_id,
        user_lang,
        user_id,
        open: openTime,
        close: closeTime,
        category_id: String(webAppCategoriesState.data[0].id)
      });
    }
  }, [webAppCategoriesState.data])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("touchstart", touchStart);
      containerRef.current.addEventListener("touchmove", preventTouch, {
        passive: false
      });
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("touchstart", touchStart);
        containerRef.current.removeEventListener("touchmove", preventTouch, {
          // @ts-ignore
          passive: false
        });
      }
    };
  });

  const onSelectCategory = (id: number) => {
    updateWebAppEntry({
      bot_id,
      user_lang,
      user_id,
      open: openTime,
      close: closeTime,
      category_id: String(id)
    });
  };

  return (
    <div ref={containerRef} className="shop-app__categories">
      {webAppCategoriesState.data.length > 0 && (
        <>
          {webAppCategoriesState.data.length > 4 && (
            <>
              <Slider {...settings}>
                {renderSlides(webAppCategoriesState.data, 0, user_lang, onSelectCategory, current_category_id ? current_category_id : "")}
              </Slider>
              <Slider {...settings}>
                {renderSlides(webAppCategoriesState.data, 1, user_lang, onSelectCategory, current_category_id ? current_category_id : "")}
              </Slider>
            </>
          )}
          {webAppCategoriesState.data.length < 5 && (
            <Slider {...settings}>
              {renderSlides(webAppCategoriesState.data, 2, user_lang, onSelectCategory, current_category_id ? current_category_id : "")}
            </Slider>
          )}
        </>
      )}
    </div>
  )
};
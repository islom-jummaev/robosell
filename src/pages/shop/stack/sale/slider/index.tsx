import React, { FC, useEffect, useRef } from "react";
import { IWebAppSalesItemModel } from "@/businessLogic/models/web-app";
import Slider, { Settings } from "@ant-design/react-slick";

const settings: Settings = {
  dots: false,
  infinite: false,
  speed: 150,
  slidesToShow: 1,
  initialSlide: 0,
};

let firstClientX: number, clientX: number;

const preventTouch = (e: any) => {
  const minValue = 5; // threshold

  clientX = e.touches[0].clientX - firstClientX;

  // Vertical scrolling does not work when you start swiping horizontally.
  if (Math.abs(clientX) > minValue) {
    e.preventDefault();
    e.returnValue = false;

    return false;
  }
};

const touchStart = (e: any) => {
  firstClientX = e.touches[0].clientX;
};

type PropsTypes = {
  items: Array<IWebAppSalesItemModel>
}

export const ShopAppSaleSlider: FC<PropsTypes> = (props) => {
  const { items } = props;

  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="shop-app__sale__slider">
      {items.length > 0 && (
        <Slider {...settings}>
          {items.map((item) => (
            <div key={item.id}>
              <img src="" alt=""/>
            </div>
          ))}
        </Slider>
      )}
    </div>
  )
};
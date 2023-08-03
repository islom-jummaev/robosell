import React, { useEffect, useRef } from "react";

let x1: number | null;
let y1: number | null;
let curMar: number | null;

let timeout: any;
let timeout2: any;

export const ShopAppModal = (props: any) => {
  const { open, onCloseModal, children } = props;

  const swipeContainerWrapRefWrap = useRef<HTMLDivElement>(null);
  const swipeContainerRef = useRef<HTMLDivElement>(null);

  const touchStart = (e: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (timeout2) {
      clearTimeout(timeout2);
    }

    const firstTouch = e.touches[0];

    if (e.target.className && e.target.className.includes("skus")) {

    } else {
      x1 = firstTouch.clientX;
      y1 = firstTouch.clientY;

      if (swipeContainerRef.current) {
        swipeContainerRef.current.style.transition = "none";
      }
    }
  };

  const touchMove = (e: any) => {
    if (!x1 || !y1) {
      return false;
    }

    let y2: number = e.touches[0].clientY;

    let yDiff: number = y2 - y1;

    if (swipeContainerRef.current) {
      const val = yDiff < 0 ? 0 : yDiff;

      if (!(curMar === 0 && val === 0)) {
        swipeContainerRef.current.style.marginTop = `${val}px`;
      }

      curMar = val;
    }

    //e.preventDefault();
    //e.returnValue = false;

    return false;
  };

  const touchEnd = (e: any) => {
    if (swipeContainerRef.current) {
      if (curMar && (curMar > 120)) {
        if (swipeContainerRef.current) {
          swipeContainerRef.current.style.transition = "all 0.3s ease";
          swipeContainerRef.current.style.marginTop = `${swipeContainerRef.current.clientHeight}px`;
        }

        timeout = setTimeout(() => {
          onCloseModal();
        }, 200);

        timeout2 = setTimeout(() => {
          if (swipeContainerRef.current) {
            swipeContainerRef.current.style.marginTop = "0px";
          }
        }, 700);
      } else {
        swipeContainerRef.current.style.transition = "all 0.3s ease";
        swipeContainerRef.current.style.marginTop = "0px";
      }

      curMar = null;
      x1 = null;
      y1 = null;
    }
  };


  useEffect(() => {
    if (swipeContainerWrapRefWrap.current) {
      swipeContainerWrapRefWrap.current.addEventListener("touchstart", touchStart, false);
      swipeContainerWrapRefWrap.current.addEventListener("touchmove", touchMove, false);
      swipeContainerWrapRefWrap.current.addEventListener("touchend", touchEnd, false);
    }

    return () => {
      if (swipeContainerWrapRefWrap.current) {
        swipeContainerWrapRefWrap.current.removeEventListener("touchstart", touchStart, false);
        swipeContainerWrapRefWrap.current.removeEventListener("touchmove", touchMove, false);
        swipeContainerWrapRefWrap.current.removeEventListener("touchend", touchEnd, false);
      }
    }
  }, []);

  return (
    <div ref={swipeContainerWrapRefWrap} className={`shop-app__modal ${open ? "active" : ""}`}>
      <div className="shop-app__modal__outline" onClick={onCloseModal} />
      <div ref={swipeContainerRef} className="shop-app__modal__body">
        {children}
      </div>
    </div>
  )
};
import React from "react";
import { Skeleton } from "antd";
import { $webAppProducts } from "@stores/web-app";

export const renderProductsSkeleton = (count: number) => {
  const res = [];

  for (let i = 0; i < count; i++) {
    res.push(<Skeleton.Button active block key={i} />);
  }

  return res;
};

export const ShopAppSkeleton = () => {
  const { success } = $webAppProducts.useStore();

  if (success) {
    return null;
  }

  return (
    <div className={`shop-app__skeleton active`}>
      <div className="shop-app__categories">
        <div className="shop-app__categories__skeleton">
          {renderProductsSkeleton(4)}
        </div>
        <div className="shop-app__categories__skeleton">
          {renderProductsSkeleton(4)}
        </div>
      </div>
      <div className="shop-app__main-buttons">
        {renderProductsSkeleton(2)}
      </div>
      <div className="shop-app__search">
        {renderProductsSkeleton(1)}
      </div>
      <div className="shop-app__products">
        <div className="shop-app__products__skeleton">
          {renderProductsSkeleton(4)}
        </div>
      </div>
    </div>
  );
}
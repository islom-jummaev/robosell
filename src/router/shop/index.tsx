import React from "react";
import { Spinner } from "@ui/spinner";

const Shop = React.lazy(() => import("../../pages/shop"));

export const ShopRoute = [
  {
    path: "/shop",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <Shop />
      </React.Suspense>
    ),
  },
];
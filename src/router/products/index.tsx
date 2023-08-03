import React from "react";
import { Spinner } from "@ui/spinner";

const ProductsList = React.lazy(() => import("../../pages/products/products-list"));

export const ProductsRoute = [
  {
    path: "/product",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <ProductsList />
      </React.Suspense>
    ),
  },
];
import React from "react";
import { Spinner } from "@ui/spinner";

const OrdersList = React.lazy(() => import("../../pages/orders/orders-list"));

export const OrdersRoute = [
  {
    path: "/orders",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <OrdersList />
      </React.Suspense>
    ),
  },
];
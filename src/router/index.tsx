import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DefaultLayout } from "@/shared/layouts/DefaultLayout";
import { AuthLayout } from "@/shared/layouts/AuthLayout";
import { WebappLayout } from "@/shared/layouts/WebappLayout";
import { BotsRoute } from "@/router/bots";
import { LocalizationRoute } from "@/router/localization";
import { Spinner } from "@ui/spinner";
import { OrdersRoute } from "@/router/orders";
import { UsersRoute } from "@/router/users";
import { BranchesRoute } from "@/router/branches";
import { ChatRoute } from "@/router/chat";
import { DocumentationRoute } from "@/router/documentation";
import { MailingRoute } from "@/router/marketing";
import { CategoriesRoute } from "@/router/categories";
import { ProductsRoute } from "@/router/products";
import { WebAppRoute } from "@/router/web-app";
import { ShopRoute } from "@/router/shop";

const Auth = React.lazy(() => import("../pages/auth/Auth"));
const Dashboard = React.lazy(() => import("../pages/dashboard"));


const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/auth",
        element: (
          <React.Suspense fallback={<Spinner fallback />}>
            <Auth />
          </React.Suspense>
        ),
      },
    ],
  },
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: (
          <React.Suspense fallback={<Spinner fallback />}>
            <Dashboard />
          </React.Suspense>
        ),
      },
      ...OrdersRoute,
      ...UsersRoute,
      ...MailingRoute,
      ...BotsRoute,
      ...LocalizationRoute,
      ...BranchesRoute,
      ...ChatRoute,
      //...WebAppRoute,
      ...CategoriesRoute,
      ...ProductsRoute,
      ...DocumentationRoute,
    ],
  },
  {
    element: <WebappLayout />,
    children: [
      ...ShopRoute
    ]
  },
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/*",
        element: (
          <React.Suspense fallback={<Spinner fallback />}>
            Not found
          </React.Suspense>
        ),
      }
    ]
  }
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

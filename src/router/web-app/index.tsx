import React from "react";
import { Spinner } from "@ui/spinner";

const WebAppList = React.lazy(() => import("../../pages/web-app/web-app-list"));

export const WebAppRoute = [
  {
    path: "/webapp",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <WebAppList />
      </React.Suspense>
    ),
  },
];
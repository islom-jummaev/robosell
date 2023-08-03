import React from "react";
import { Spinner } from "@ui/spinner";

const Localization = React.lazy(() => import("../../pages/localization/view"));

export const LocalizationRoute = [
  {
    path: "/localization",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <Localization />
      </React.Suspense>
    ),
  },
];
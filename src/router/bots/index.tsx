import React from "react";
import { Spinner } from "@ui/spinner";

const BotsList = React.lazy(() => import("../../pages/bots/bots-list"));
const BotDetails = React.lazy(() => import("../../pages/bots/details"));

export const BotsRoute = [
  {
    path: "/bots-list",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <BotsList />
      </React.Suspense>
    ),
  },
  {
    path: "/bots-list/:id",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <BotDetails />
      </React.Suspense>
    ),
  },
];
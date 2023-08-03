import React from "react";
import { Spinner } from "@ui/spinner";

const Documentation = React.lazy(() => import("../../pages/documentation"));

export const DocumentationRoute = [
  {
    path: "/documentation",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <Documentation />
      </React.Suspense>
    ),
  },
];
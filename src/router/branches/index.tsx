import React from "react";
import { Spinner } from "@ui/spinner";

const BranchesList = React.lazy(() => import("../../pages/branches/branches-list"));

export const BranchesRoute = [
  {
    path: "/branches",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <BranchesList />
      </React.Suspense>
    ),
  },
];
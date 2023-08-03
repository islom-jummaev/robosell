import React from "react";
import { Spinner } from "@ui/spinner";

const CategoriesList = React.lazy(() => import("../../pages/categories/categories-list"));

export const CategoriesRoute = [
  {
    path: "/category",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <CategoriesList />
      </React.Suspense>
    ),
  },
];
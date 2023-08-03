import React from "react";
import { Spinner } from "@ui/spinner";

const MailingList = React.lazy(() => import("../../pages/marketing/mailing/mailing-list"));
const SourceList = React.lazy(() => import("../../pages/marketing/source/source-list"));
const NewsList = React.lazy(() => import("../../pages/marketing/news/news-list"));

export const MailingRoute = [
  {
    path: "/marketing/mailing",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <MailingList />
      </React.Suspense>
    ),
  },
  {
    path: "/marketing/source",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <SourceList />
      </React.Suspense>
    ),
  },
  {
    path: "/marketing/news",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <NewsList />
      </React.Suspense>
    ),
  },
];
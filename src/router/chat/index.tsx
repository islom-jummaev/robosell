import React from "react";
import { Spinner } from "@ui/spinner";

const Chat = React.lazy(() => import("../../pages/chat"));

export const ChatRoute = [
  {
    path: "/chat/:id",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <Chat />
      </React.Suspense>
    ),
  },
];
import React from "react";
import { Spinner } from "@ui/spinner";

const UsersList = React.lazy(() => import("../../pages/users/users-list"));
const UserDetails = React.lazy(() => import("../../pages/users/user-details"));

export const UsersRoute = [
  {
    path: "/users",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <UsersList />
      </React.Suspense>
    ),
  },
  {
    path: "/users/:id",
    element: (
      <React.Suspense fallback={<Spinner fallback />}>
        <UserDetails />
      </React.Suspense>
    ),
  },
];
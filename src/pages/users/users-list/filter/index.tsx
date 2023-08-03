import React, { FC } from "react";
import { FilterBlockUI } from "@ui/filterBlock";
import { InputUI } from "@/shared/ui/input";
import { IUsersListFilterParams } from "@/businessLogic/models/users";

type PropsTypes = {
  filterParams: IUsersListFilterParams;
  onFilterChange: (params: IUsersListFilterParams) => void;
};

export const UsersListFilter: FC<PropsTypes> = (props) => {
  const { filterParams, onFilterChange } = props;

  return (
    <FilterBlockUI>
      <FilterBlockUI.SearchItem>
        <InputUI.Search
          value={filterParams?.search}
          onChange={(e, search) => {
            onFilterChange({ search });
          }}
        />
      </FilterBlockUI.SearchItem>
    </FilterBlockUI>
  )
};
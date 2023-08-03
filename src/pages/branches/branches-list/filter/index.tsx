import React, { FC } from "react";
import { FilterBlockUI } from "@ui/filterBlock";
import { InputUI } from "@/shared/ui/input";
import { IBranchesListFilterParams } from "@/businessLogic/models/branches";

type PropsTypes = {
  filterParams: IBranchesListFilterParams;
  onFilterChange: (params: IBranchesListFilterParams) => void;
};

export const BranchesListFilter: FC<PropsTypes> = (props) => {
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
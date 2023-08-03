import React, { FC } from "react";
import { FilterBlockUI } from "@ui/filterBlock";
import { InputUI } from "@/shared/ui/input";
import { ICategoriesListFilterParams } from "@/businessLogic/models/categories";

type PropsTypes = {
  filterParams: ICategoriesListFilterParams;
  onFilterChange: (params: ICategoriesListFilterParams) => void;
};

export const CategoriesListFilter: FC<PropsTypes> = (props) => {
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
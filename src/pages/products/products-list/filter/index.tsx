import React, { FC } from "react";
import { FilterBlockUI } from "@ui/filterBlock";
import { InputUI } from "@/shared/ui/input";
import { IProductsListFilterParams } from "@/businessLogic/models/products";

type PropsTypes = {
  filterParams: IProductsListFilterParams;
  onFilterChange: (params: IProductsListFilterParams) => void;
};

export const ProductsListFilter: FC<PropsTypes> = (props) => {
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
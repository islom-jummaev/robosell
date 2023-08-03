import React, { FC } from "react";
import { FilterBlockUI } from "@ui/filterBlock";
import { IOrdersListFilterParams } from "@/businessLogic/models/orders";

type PropsTypes = {
  filterParams: IOrdersListFilterParams;
  onFilterChange: (params: IOrdersListFilterParams) => void;
}

export const OrdersFilter: FC<PropsTypes> = (props) => {
  const { filterParams, onFilterChange } = props;

  return (
    <FilterBlockUI>
      <FilterBlockUI.Item>

      </FilterBlockUI.Item>
    </FilterBlockUI>
  )
};
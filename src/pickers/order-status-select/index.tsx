import React, { FC, useEffect } from "react";

import { SelectUI } from "@ui/select";
import { $orderAllStatuses } from "@stores/orders";

export const OrderStatusSelect: FC<any> = (props) => {
  const { request, ...orderAllStatusesState } = $orderAllStatuses.useStore();

  useEffect(() => {
    if (!orderAllStatusesState.data.length) {
      request();
    }
  }, []);

  return (
    <SelectUI
      placeholder="-------"
      allowClear={true}
      dropdownMatchSelectWidth={false}
      loading={orderAllStatusesState.loading}
      {...props}
    >
      {orderAllStatusesState.data.map((item) => (
        <SelectUI.Option value={item.key} key={item.key}>
          {item.value}
        </SelectUI.Option>
      ))}
    </SelectUI>
  );
};

import React, { FC } from "react";


import { SelectUI } from "@ui/select";
import { useTranslation } from "react-i18next";

export const PaymentTypeSelect: FC<any> = (props) => {
  const { t } = useTranslation();

  return (
    <SelectUI
      placeholder="-------"
      allowClear={true}
      dropdownMatchSelectWidth={false}
      {...props}
    >
      <SelectUI.Option value={1}>
        {t("cash")}
      </SelectUI.Option>
      <SelectUI.Option value={3}>
        Click
      </SelectUI.Option>
      <SelectUI.Option value={2}>
        Payme
      </SelectUI.Option>
    </SelectUI>
  );
};

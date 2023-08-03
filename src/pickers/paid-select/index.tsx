import React, { FC } from "react";


import { SelectUI } from "@ui/select";
import { useTranslation } from "react-i18next";

export const PaidSelect: FC<any> = (props) => {
  const { t } = useTranslation();

  return (
    <SelectUI
      placeholder="-------"
      allowClear={true}
      dropdownMatchSelectWidth={false}
      {...props}
    >
      <SelectUI.Option value={true}>
        {t("isPaid")}
      </SelectUI.Option>
      <SelectUI.Option value={false}>
        {t("notPaid")}
      </SelectUI.Option>
    </SelectUI>
  );
};

import React, { FC } from "react";


import { SelectUI } from "@ui/select";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";

export const ProductStatusSelect: FC<any> = (props) => {
  const { t } = useTranslation();

  console.log("props", props);

  return (
    <SelectUI
      placeholder="-------"
      allowClear={true}
      dropdownMatchSelectWidth={false}
      {...props}
    >
      <SelectUI.Option value="UNLIMITED">
        {t("status.unlimited", { ns: namespaces.products })}
      </SelectUI.Option>
      <SelectUI.Option value="LIMITED">
        {t("status.limited", { ns: namespaces.products })}
      </SelectUI.Option>
      <SelectUI.Option value="NOT_AVAILABLE">
        {t("status.not_available", { ns: namespaces.products })}
      </SelectUI.Option>
    </SelectUI>
  );
};

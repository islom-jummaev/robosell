import React, { FC } from "react";

import { SelectUI } from "@ui/select";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";

export const DeliveryTypeSelect: FC<any> = (props) => {
  const { t } = useTranslation();

  return (
    <SelectUI
      placeholder="-------"
      allowClear={true}
      dropdownMatchSelectWidth={false}
      {...props}
    >
      <SelectUI.Option value={"DELIVERY"}>
        {t("delivery.title", { ns: namespaces.bots })}
      </SelectUI.Option>
      <SelectUI.Option value={"PICKUP"}>
        {t("pickup", { ns: namespaces.bots })}
      </SelectUI.Option>
    </SelectUI>
  );
};

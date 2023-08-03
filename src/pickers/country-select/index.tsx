import React, { FC, useEffect } from "react";

import { SelectUI } from "@ui/select";
import { $countries } from "@stores/bots";
import { getCurrentLang } from "@utils/getters";
import { useTranslation } from "react-i18next";

export const CountrySelect: FC<any> = (props) => {
  const { t } = useTranslation();
  const currentLang = getCurrentLang();

  const { request, ...countriesState } = $countries.useStore();

  useEffect(() => {
    if (!countriesState.data.length) {
      request();
    }
  }, []);

  return (
    <SelectUI
      placeholder={t("placeholders.country")}
      allowClear={true}
      dropdownMatchSelectWidth={false}
      loading={countriesState.loading}
      {...props}
    >
      {countriesState.data.map((item) => (
        <SelectUI.Option value={item.id} key={item.id}>
          {item.name[currentLang]}
        </SelectUI.Option>
      ))}
    </SelectUI>
  );
};

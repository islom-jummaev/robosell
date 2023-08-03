import React, { FC, useEffect } from "react";

import { SelectUI } from "@ui/select";
import { $cities } from "@stores/bots";
import { getCurrentLang } from "@utils/getters";
import { useTranslation } from "react-i18next";

export const CitySelect: FC<any> = (props) => {
  const { country, ...restProps } = props;
  const { t } = useTranslation();
  const currentLang = getCurrentLang();

  const { request, ...countriesState } = $cities.useStore();

  useEffect(() => {
    if (country) {
      request(country);
    }
  }, [country]);

  return (
    <SelectUI
      placeholder={t("placeholders.city")}
      allowClear={true}
      dropdownMatchSelectWidth={false}
      loading={countriesState.loading}
      disabled={!country}
      {...restProps}
    >
      {countriesState.data.map((item) => (
        <SelectUI.Option value={item.id} key={item.id}>
          {item.name[currentLang]}
        </SelectUI.Option>
      ))}
    </SelectUI>
  );
};

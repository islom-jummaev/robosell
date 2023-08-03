import React, { useState } from "react";

import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { FilterBlockUI } from "@ui/filterBlock";
import { RangePickerUI } from "@ui/rangePicker";

type DashboardFilterFieldsType = {
  from?: undefined | string;
  to?: undefined | string;
}

let yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);

export const DashboardFilter = () => {
  const [filterFields, setFilterFields] = useState<DashboardFilterFieldsType>({

  });

  const onFilterChange = (values: any) => {
    setFilterFields({
      ...filterFields,
      ...values
    });
  };

  const rangePresets: {
    label: string;
    value: [Dayjs, Dayjs];
  }[] = [
    { label: "Сегодня", value: [dayjs().add(0, "d"), dayjs()] },
    { label: "Вчера", value: [dayjs(yesterdayDate), dayjs(yesterdayDate)] },
    { label: "Последние 7 дней", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Последние 30 дней", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Этот месяц", value: [dayjs().startOf("month"), dayjs()] },
    { label: "Этот год", value: [dayjs().startOf("year"), dayjs()] },
  ];

  return (
    <FilterBlockUI>
      <FilterBlockUI.Item>
        <RangePickerUI
          onFilterChange={onFilterChange}
          from={filterFields.from}
          to={filterFields.to}
          presets={rangePresets}
        />
      </FilterBlockUI.Item>
    </FilterBlockUI>
  );
}
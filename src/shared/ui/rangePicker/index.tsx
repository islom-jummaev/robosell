import React, { FC } from "react";

import { DatePicker } from "antd";
import { RangePickerProps } from "antd/es/date-picker";

import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import "dayjs/locale/ru";

dayjs.locale('ru');

type PropTypes = {
  onFilterChange: (p: { from: string | undefined; to: string | undefined }) => void;
  from: string | undefined;
  to: string | undefined;
  format?: string;
} & RangePickerProps;

export const RANGE_DATE_FORMAT = "YYYY-MM-DD";

export const RangePickerUI: FC<PropTypes> = (props) => {
  const { onFilterChange, from, to, format, ...restProps } = props;

  const onDateRange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      onFilterChange({
        from: dateStrings[0],
        to: dateStrings[1],
      });

    } else {
      onFilterChange({
        from: undefined,
        to: undefined,
      });
    }
  };

  return (
    <DatePicker.RangePicker
      value={from && to ? [dayjs(from), dayjs(to)] : undefined}
      onChange={onDateRange}
      format={RANGE_DATE_FORMAT}

      {...restProps}
    />
  );
};

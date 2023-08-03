import React, { useEffect, useState } from "react";

import { Select } from "antd";

import { SelectUIPropTypes } from "@customTypes/components";

import styles from "./styles.module.scss";
import { isFilledDependencies, isObjectType } from "@utils/common";
import { debounce } from "@utils/debounceLodash";

const withDebounce = debounce(
  (action: any) => {
    action();
  },
  300,
  false,
);

const SelectUI = (props: SelectUIPropTypes) => {
  const { className, ...restProps } = props;


  let classesCompose = styles.select;

  if (className) {
    classesCompose = `${classesCompose} ${className}`;
  }

  return <Select className={classesCompose} {...restProps} />;
};

const getOptions = (items: Array<any>, defaultOption: any, optionValue: any) => {
  const newArr: Array<any> = [];
  let isExist = false;

  items.forEach((item) => {
    newArr.push(item);

    if (String(item[optionValue]) === String(defaultOption[optionValue])) {
      isExist = true;
    }
  });

  if (!isExist) {
    newArr.push(defaultOption);
  }

  return newArr;
};

const SelectLookup = (props: any) => {
  const {
    defaultOption,
    onChange,
    itemsZustand,
    disabledOptionsIds = {},
    optionValue = "id",
    optionName = "name",
    optionDetails,
    dependencies = [],
    requestParams = {},
    value,
    ...restProps
  } = props;

  const params = requestParams ? requestParams : null;

  const [isSearched, setIsSearched] = useState(false);

  const { request: getItems, reset: resetItems, ...itemsState } = itemsZustand.useStore();

  useEffect(() => {
    if (!dependencies.length) {
      getItems(params);
    }
  }, []);

  useEffect(() => {
    if (dependencies.length) {
      const filled = isFilledDependencies(dependencies);

      if (filled) {
        getItems(params);
      } else if (itemsState.data.length) {
        resetItems();
      }
    }
  }, dependencies);

  const onSearch = (search: string) => {
    withDebounce(() => {
      setIsSearched(!!search);

      getItems({ search, ...params });
    });
  };

  const onValueChange = (val: any, option: any) => {
    if (isSearched) {
      setIsSearched(false);
    }
    getItems(params);
    onChange && onChange(val, option);
  };

  return (
    <SelectUI
      loading={itemsState.loading}
      onSearch={onSearch}
      onChange={onValueChange}
      disabled={!isFilledDependencies(dependencies)}
      value={isObjectType(value) ? String(value[optionValue]) : value ? String(value) : undefined}
      {...restProps}
    >
      {(!defaultOption || isSearched ? itemsState.data : getOptions(itemsState.data, defaultOption, optionValue)).map(
        (item: any) => (
          <Select.Option
            value={String(item[optionValue])}
            key={String(item[optionValue])}
            data-option={optionDetails ? item : null}
            disabled={itemsState.loading || !!disabledOptionsIds[item[optionValue]]}
          >
            {item[optionName]}
          </Select.Option>
        ),
      )}
    </SelectUI>
  );
};

SelectUI.Option = Select.Option;
SelectUI.Lookup = SelectLookup;

export { SelectUI };

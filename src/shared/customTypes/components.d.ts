import { InputProps, SelectProps } from "antd";

interface Variants {
  variant?: "auth";
}

export interface InputUIPropTypes extends InputProps, Variants {}

export interface SelectUIPropTypes extends SelectProps, Variants {
  readOnly?: string | boolean;
}

export interface SelectLookupUIPropTypes extends SelectUIPropTypes {
  defaultOption?: null | { id: string; name: string };
  disabledOptionsIds?: { [key: string]: boolean };
  optionValue?: string;
  optionName?: string;
  optionDetails?: boolean;
  dependencies?: Array<string | number | undefined>;
  requestParams?: { [key: string]: string | number | undefined };
  value: any;
  title?: string;
}

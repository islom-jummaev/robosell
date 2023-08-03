import dayjs from "dayjs";
import { i18n } from "@core/localization/i18n";

export const formatCount = (count: number | string) => {
  const n = String(count),
    p = n.indexOf('.');

  return n.replace(
    /\d(?=(?:\d{3})+(?:\.|$))/g,
    (m, i) => p < 0 || i < p ? `${m} ` : m
  );
};

export const inputPriceFormatter = (value: string | number) => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatDate = (date: string, format?: string): string => {
  if (!date) {
    return "-"
  }

  return dayjs(date).format(format ? format : "DD-MM-YYYY HH:MM");
};

export const UPLOAD_FILE_TYPES = {
  DOC: "DOC",
  PIC: "PIC",
};

const isPic = (file: any) : boolean => {
  return file.type === "image/jpeg" || file.type === "image/png";
};

export const isFileCorrespondType = (file: any, type: string) => {
  if (type === UPLOAD_FILE_TYPES.DOC) {
    return isPic || file.type === "application/pdf";
  } else if (type === UPLOAD_FILE_TYPES.PIC) {
    return isPic;
  }

  return true;
};

export const isFileCorrespondSize = (file: any, size = 0.5) => {
  return file.size / 1024 / 1024 <= size;
};

export const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
};

export const numberWithStringFormatter = (num: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: i18n.t("numbersRange.thousand") },
    { value: 1e6, symbol: i18n.t("numbersRange.million") },
    { value: 1e9, symbol: i18n.t("numbersRange.billion") },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + ` ${item.symbol}` : "0";
};

export const truncate = (str: string, length = str.length) : string => {
  let etc = "...";
  if (length >= str.length) {
    etc = "";
  }

  return str.substring(0, length) + etc;
};


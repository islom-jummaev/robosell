export interface PaginationListModel<T> {
  results: Array<T>;
  count: number;
  next: string;
  previous: string;
}

export interface ILocalizeModel {
  ru: string;
  uz: string;
  en: string;
}
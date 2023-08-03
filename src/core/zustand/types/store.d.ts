export type StoreTypeWithData<R, IS> = {
  //fulfilled?: boolean;
  loading: boolean;
  data: IS | R;
  success: boolean;
  error: any;
};
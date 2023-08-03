type InitialStateConstructorType = <T>(data: T) => {
  loading: boolean;
  data: T;
  success: boolean;
  error: null;
}

export const initialStateConstructor: InitialStateConstructorType = (data) => {
  return {
    loading: false,
    data,
    success: false,
    error: null
  }
}
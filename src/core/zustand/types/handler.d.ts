import { AxiosPromise } from "axios";

export type HandlerType<P, R> = (params: P) => AxiosPromise<R>;
import type { AxiosResponse } from "axios";

export type ApiResponse<T> = AxiosResponse<{
  data: T;
  message: string;
}>;

export type Nullable<T> = T | null;

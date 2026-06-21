import type { AxiosResponse } from "axios";

export type ApiResponse<T> = AxiosResponse<{
  data: T;
  status: string;
}>;

export type Nullable<T> = T | null;

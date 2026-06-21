import { http } from "@/plugins/axios.plugin";
import type { ApiResponse } from "@/shared/types/api.type";
import type { User } from "../interfaces/user.interface";
import { APP_CONFIG } from "@/configs/app.config";

export async function userService_create(payload: any): Promise<User> {
  const response: ApiResponse<User> = await http.post(
    `${APP_CONFIG.apiUrl}/user`,
    payload,
  );

  return response.data.data;
}

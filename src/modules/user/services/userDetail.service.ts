import { http } from "@/plugins/axios.plugin";
import type { ApiResponse } from "@/shared/types/api.type";
import type { User } from "../interfaces/user.interface";
import { APP_CONFIG } from "@/configs/app.config";

export async function userService_detail(): Promise<User | null> {
  const response: ApiResponse<User[]> = await http.get(
    `${APP_CONFIG.apiUrl}/user`,
  );

  if (response.data.data.length === 0) return null;

  return response.data.data[0];
}

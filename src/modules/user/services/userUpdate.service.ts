import { http } from "@/plugins/axios.plugin";
import type { ApiResponse } from "@/shared/types/api.type";
import type { User } from "../interfaces/user.interface";
import type { UserPayload } from "../interfaces/userPayload.inteface";
import { APP_CONFIG } from "@/configs/app.config";

export async function userService_update(
  id: string,
  payload: UserPayload,
): Promise<User> {
  const response: ApiResponse<User> = await http.put(
    `${APP_CONFIG.apiUrl}/user/${id}`,
    payload,
  );

  return response.data.data;
}

import { http } from "@/plugins/axios.plugin";
import type { ApiResponse } from "@/shared/types/api.type";
import type { Skill } from "../interfaces/skill.interface";
import { APP_CONFIG } from "@/configs/app.config";

export async function skillService_list(): Promise<Skill[]> {
  const response: ApiResponse<Skill[]> = await http.get(
    `${APP_CONFIG.apiUrl}/skill`,
  );

  return response.data.data;
}

import { http } from "@/plugins/axios.plugin";
import type { ApiResponse } from "@/shared/types/api.type";
import { APP_CONFIG } from "@/configs/app.config";

export async function profileService_upload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("photo", file);

  const response: ApiResponse<string> = await http.post(
    `${APP_CONFIG.apiUrl}/profile/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
}

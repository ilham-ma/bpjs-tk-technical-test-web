import { http } from "@/plugins/axios.plugin";
import { APP_CONFIG } from "@/configs/app.config";

export async function profileService_download(filename: string): Promise<Blob> {
  const response = await http.get<Blob>(
    `${APP_CONFIG.apiUrl}/profile/${filename}`,
    {
      responseType: "blob",
    },
  );

  return response.data;
}

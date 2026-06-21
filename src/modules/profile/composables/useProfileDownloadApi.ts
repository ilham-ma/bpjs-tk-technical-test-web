import { useSwitch } from "@/shared/composables/useSwitch";
import { useToast } from "primevue/usetoast";
import { profileService_download } from "../services/profileDownload.service";

export function useProfileDownloadApi(callback: (blob: Blob) => void) {
  const { state: loading, open: showLoading, close: hideLoading } = useSwitch();
  const toast = useToast();

  async function download(filename: string): Promise<Blob | null> {
    try {
      showLoading();

      const blob = await profileService_download(filename);
      callback(blob);

      return blob;
    } catch (error: any) {
      toast.add({
        severity: "error",
        summary: "Failed to Download Photo",
        detail:
          error?.response?.data?.message ??
          error?.message ??
          "Something went wrong.",
        life: 4000,
      });

      return null;
    } finally {
      hideLoading();
    }
  }

  return { loading, download };
}

import { useSwitch } from "@/shared/composables/useSwitch";
import { useToast } from "primevue/usetoast";
import { profileService_upload } from "../services/profileUpload.service";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

export function useProfileUploadApi() {
  const { state: loading, open: showLoading, close: hideLoading } = useSwitch();
  const toast = useToast();

  async function upload(file: File): Promise<string | null> {
    if (!file.type.startsWith("image/")) {
      toast.add({
        severity: "error",
        summary: "Invalid File Type",
        detail: "Only image files are allowed.",
        life: 4000,
      });
      return null;
    }

    if (file.size > MAX_SIZE_BYTES) {
      toast.add({
        severity: "error",
        summary: "File Too Large",
        detail: "Photo must not exceed 2MB.",
        life: 4000,
      });
      return null;
    }

    try {
      showLoading();

      const photoUrl = await profileService_upload(file);

      toast.add({
        severity: "success",
        summary: "Photo Uploaded",
        detail: "Photo has been uploaded successfully.",
        life: 3000,
      });

      return photoUrl;
    } catch (error: any) {
      toast.add({
        severity: "error",
        summary: "Failed to Upload Photo",
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

  return { loading, upload };
}

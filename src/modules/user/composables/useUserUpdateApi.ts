import { useSwitch } from "@/shared/composables/useSwitch";
import { useToast } from "primevue/usetoast";
import { userService_update } from "../services/userUpdate.service";
import type { User } from "../interfaces/user.interface";
import type { UserPayload } from "../interfaces/userPayload.inteface";

export function useUserUpdateApi(callback: (data: User) => void) {
  const { state: loading, open: showLoading, close: hideLoading } = useSwitch();
  const toast = useToast();

  async function update(
    id: string,
    payload: UserPayload,
  ): Promise<User | null> {
    try {
      showLoading();

      const data = await userService_update(id, payload);
      callback(data);

      toast.add({
        severity: "success",
        summary: "User Updated",
        detail: "User has been updated successfully.",
        life: 3000,
      });

      return data;
    } catch (error: any) {
      toast.add({
        severity: "error",
        summary: "Failed to Update User",
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

  return { loading, update };
}

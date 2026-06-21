import { useSwitch } from "@/shared/composables/useSwitch";
import { useToast } from "primevue/usetoast";
import { userService_create } from "../services/userCreate.service";
import type { User } from "../interfaces/user.interface";
import type { UserPayload } from "../interfaces/userPayload.inteface";

export function useUserCreateApi(callback: (data: User) => void) {
  const { state: loading, open: showLoading, close: hideLoading } = useSwitch();
  const toast = useToast();

  async function create(payload: UserPayload): Promise<User | null> {
    try {
      showLoading();

      const data = await userService_create(payload);
      callback(data);

      toast.add({
        severity: "success",
        summary: "User Created",
        detail: "User has been created successfully.",
        life: 3000,
      });

      return data;
    } catch (error: any) {
      toast.add({
        severity: "error",
        summary: "Failed to Create User",
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

  return { loading, create };
}

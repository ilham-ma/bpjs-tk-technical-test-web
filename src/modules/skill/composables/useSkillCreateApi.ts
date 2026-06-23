import { useToast } from "primevue/usetoast";
import { useSwitch } from "@/shared/composables/useSwitch";
import { skillService_create } from "../services/skillCreate.service";
import type { Skill } from "../interfaces/skill.interface";
import type { SkillPayload } from "../interfaces/skillPayload.interface";

export function useSkillCreateApi() {
  const { state: loading, open: showLoading, close: hideLoading } = useSwitch();
  const toast = useToast();

  async function create(payloads: SkillPayload[]): Promise<Skill[]> {
    try {
      showLoading();

      const data = await skillService_create(payloads);

      return data;
    } catch (error: any) {
      toast.add({
        severity: "error",
        summary: "Failed to Create Skill",
        detail:
          error?.response?.data?.message ??
          error?.message ??
          "Something went wrong.",
        life: 4000,
      });

      return [];
    } finally {
      hideLoading();
    }
  }

  return { loading, create };
}

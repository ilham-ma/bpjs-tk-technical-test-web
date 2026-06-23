import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useSwitch } from "@/shared/composables/useSwitch";
import { skillService_list } from "../services/skillList.service";
import type { Skill } from "../interfaces/skill.interface";

export function useSkillListApi() {
  const { state: loading, open: showLoading, close: hideLoading } = useSwitch();
  const toast = useToast();
  const skills = ref<Skill[]>([]);

  async function fetchList(): Promise<Skill[]> {
    try {
      showLoading();

      const data = await skillService_list();
      skills.value = data;

      return data;
    } catch (error: any) {
      toast.add({
        severity: "error",
        summary: "Failed to Load Skills",
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

  return { skills, loading, fetchList };
}

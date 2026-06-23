import type { SkillLevelEnum } from "@/shared/enums/skillLevel.enum";

export interface SkillPayload {
  name: string;
  level: SkillLevelEnum;
}

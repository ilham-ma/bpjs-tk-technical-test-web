import type { SkillLevelEnum } from "@/shared/enums/skillLevel.enum";

export interface Skill {
  id: string;
  name: string;
  level: SkillLevelEnum;
}

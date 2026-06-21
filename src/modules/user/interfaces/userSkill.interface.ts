import type { SkillLevelEnum } from "../enums/skil.enum";

export interface UserSkill {
  id: string;
  name: string;
  level: SkillLevelEnum;
}

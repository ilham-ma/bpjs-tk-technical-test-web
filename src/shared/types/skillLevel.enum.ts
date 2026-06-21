export enum SkillLevelEnum {
  Basic = "Basic",
  Intermediate = "Intermediate",
  Expert = "Expert",
}

export interface Skill {
  skill: string;
  level: SkillLevelEnum;
}

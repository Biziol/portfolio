import type { SKILL_FIELD } from "./enums/SkillField";

export interface Skill {
  id: number;
  name: string;
  skillField: SKILL_FIELD;
}

export const SkillPayload: Skill = {
  id: 0,
  name: "",
  skillField: "FRONTEND",
};

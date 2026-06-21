import type { Skill } from "@/shared/types/skillLevel.enum";
import type { Education } from "@/shared/types/education.type";
import type { EmploymentHistory } from "@/shared/types/employmentHistory.type";

export interface UserPayloadSkill {
  name: string;
  level: Skill["level"];
}

export interface UserPayload {
  wantedJobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  drivingLicense: string;
  nationality: string;
  placeOfBirth: string;
  dateOfBirth: Date | string;
  professionalSummary: string;
  photoUrl: string;
  skills: UserPayloadSkill[];
  educations: Education[];
  employmentHistories: EmploymentHistory[];
}

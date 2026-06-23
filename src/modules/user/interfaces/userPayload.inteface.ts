import type { UserEducation } from "./userEducation.interface";
import type { UserEmploymentHistory } from "./userEmploymentHistory.interface";
import type { UserSkill } from "./userSkill.interface";

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
  dateOfBirth: string;
  professionalSummary: string;
  photoUrl: string;
  skills: UserSkill[];
  educations: UserEducation[];
  employmentHistories: UserEmploymentHistory[];
}

import type { UserEducation } from "./userEducation.interface";
import type { UserEmploymentHistory } from "./userEmploymentHistory.interface";
import type { UserSkill } from "./userSkill.interface";

export interface User {
  id: string;
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
  dateOfBirth: Date;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  professionalSummary: string;
  skills: UserSkill[];
  educations: UserEducation[];
  employmentHistories: UserEmploymentHistory[];
}

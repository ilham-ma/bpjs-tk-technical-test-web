export interface UserEmploymentHistory {
  id: string;
  jobTitle: string;
  employer: string;
  startDate: string;
  endDate: string | null;
  city: string;
  description: string;
}

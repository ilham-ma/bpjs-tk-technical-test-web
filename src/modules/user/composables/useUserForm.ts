import { reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import type { EmploymentHistory } from "@/shared/types/employmentHistory.type";
import type { Education } from "@/shared/types/education.type";
import type { Skill } from "@/shared/types/skillLevel.enum";
import type { User } from "../interfaces/user.interface";
import type { UserPayload } from "../interfaces/userPayload.inteface";

export function useUserForm() {
  const form = reactive({
    title: "",
    file: undefined as File | undefined,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
    drivingLicense: "",
    nationality: "",
    placeOfBirth: "",
    dateOfBirth: null as Date | null,
    professionalSummary: "",
    employmentHistories: [] as EmploymentHistory[],
    educations: [] as Education[],
    skills: [] as Skill[],
  });

  const isDateOfBirth = (v: unknown): boolean => v instanceof Date;

  const isProfessionalSummaryValid = (v: string): boolean => {
    if (!v) return false;
    const plainText = v.replace(/<[^>]*>/g, "").trim();
    return plainText.length > 0;
  };

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage("This field is required", required),
    },
    firstName: {
      required: helpers.withMessage("This field is required", required),
    },
    lastName: {
      required: helpers.withMessage("This field is required", required),
    },
    email: {
      required: helpers.withMessage("This field is required", required),
      email: helpers.withMessage("Invalid email format", email),
    },
    phone: {
      required: helpers.withMessage("This field is required", required),
      minLength: helpers.withMessage(
        "Phone must be at least 8 digits",
        minLength(8),
      ),
    },
    country: {
      required: helpers.withMessage("This field is required", required),
    },
    city: {
      required: helpers.withMessage("This field is required", required),
    },
    address: {
      required: helpers.withMessage("This field is required", required),
    },
    postalCode: {
      required: helpers.withMessage("This field is required", required),
      minLength: helpers.withMessage(
        "Postal code must be 5 digits",
        minLength(5),
      ),
    },
    drivingLicense: {
      required: helpers.withMessage("This field is required", required),
    },
    nationality: {
      required: helpers.withMessage("This field is required", required),
    },
    placeOfBirth: {
      required: helpers.withMessage("This field is required", required),
    },
    dateOfBirth: {
      required: helpers.withMessage("Date of birth is required", (v: unknown) =>
        isDateOfBirth(v),
      ),
    },
    professionalSummary: {
      required: helpers.withMessage(
        "Professional summary is required",
        (v: string) => isProfessionalSummaryValid(v),
      ),
    },
    employmentHistories: {
      minLength: helpers.withMessage(
        "Add at least one employment history",
        minLength(1),
      ),
    },
    educations: {
      minLength: helpers.withMessage(
        "Add at least one education",
        minLength(1),
      ),
    },
    skills: {
      minLength: helpers.withMessage("Add at least one skill", minLength(1)),
    },
  }));

  const v$ = useVuelidate(rules, form, { $scope: false });

  function errorOf(path: string): string {
    const keys = path.split(".");
    let node: any = v$.value;
    for (const key of keys) {
      node = node?.[key];
    }
    if (!node || !node.$error) return "";
    return (node.$errors[0]?.$message as string) ?? "";
  }

  function setForm(data: User | null) {
    if (!data) return;
    form.title = data.wantedJobTitle;
    form.firstName = data.firstName;
    form.lastName = data.lastName;
    form.email = data.email;
    form.phone = data.phone;
    form.country = data.country;
    form.city = data.city;
    form.address = data.address;
    form.postalCode = data.postalCode;
    form.drivingLicense = data.drivingLicense;
    form.nationality = data.nationality;
    form.placeOfBirth = data.placeOfBirth;
    form.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    form.skills = data.skills.map((skill) => ({
      skill: skill.name,
      level: skill.level,
    }));
    form.employmentHistories = data.employmentHistories.map(
      (employmentHistory) => ({
        jobTitle: employmentHistory.jobTitle,
        city: employmentHistory.city,
        description: employmentHistory.description,
        employer: employmentHistory.employer,
        endDate: employmentHistory.endDate,
        startDate: employmentHistory.startDate,
      }),
    );
    form.educations = data.educations.map((education) => ({
      school: education.school,
      degree: education.degree,
      city: education.city,
      description: education.description,
      startDate: education.startDate,
      endDate: education.endDate,
    }));
  }

  function setPhoto(blob: Blob) {
    form.file = new File([blob], "photo", { type: blob.type });
  }

  function getFormWithPayloadFormat(): UserPayload {
    return {
      wantedJobTitle: form.title,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      country: form.country,
      city: form.city,
      address: form.address,
      postalCode: form.postalCode,
      drivingLicense: form.drivingLicense,
      nationality: form.nationality,
      placeOfBirth: form.placeOfBirth,
      dateOfBirth: form.dateOfBirth as Date,
      photoUrl: "",
      professionalSummary: form.professionalSummary,
      skills: form.skills.map((skill) => ({
        name: skill.skill,
        level: skill.level,
      })),
      educations: form.educations.map((education) => ({ ...education })),
      employmentHistories: form.employmentHistories.map(
        (employmentHistory) => ({ ...employmentHistory }),
      ),
    };
  }

  return {
    form,
    v$,
    setForm,
    errorOf,
    getFormWithPayloadFormat,
    setPhoto,
  };
}

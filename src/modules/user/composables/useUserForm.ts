import { reactive, computed, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import type { User } from "../interfaces/user.interface";
import type { UserPayload } from "../interfaces/userPayload.inteface";
import dayjs from "dayjs";
import type { UserEmploymentHistory } from "../interfaces/userEmploymentHistory.interface";
import type { UserEducation } from "../interfaces/userEducation.interface";
import type { UserSkill } from "../interfaces/userSkill.interface";
import type { Skill } from "@/modules/skill/interfaces/skill.interface";

export function useUserForm() {
  const isNotUsingLevel = ref(false);
  const selectedSkills = ref<Skill[]>([]);
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
    dateOfBirth: null as string | null,
    professionalSummary: "",
    employmentHistories: [] as UserEmploymentHistory[],
    educations: [] as UserEducation[],
    skills: [] as UserSkill[],
  });

  const isDateString = (v: unknown): boolean =>
    typeof v === "string" && v.trim().length > 0 && dayjs(v).isValid();

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
        isDateString(v),
      ),
    },
    professionalSummary: {
      required: helpers.withMessage(
        "Professional summary is required",
        (v: string) => isProfessionalSummaryValid(v),
      ),
    },
    employmentHistories: {
      $each: helpers.forEach({
        jobTitle: {
          required: helpers.withMessage("This field is required", required),
        },
        employer: {
          required: helpers.withMessage("This field is required", required),
        },
        startDate: {
          required: helpers.withMessage(
            "This field is required",
            (v: unknown) => isDateString(v),
          ),
        },
        city: {
          required: helpers.withMessage("This field is required", required),
        },
        description: {
          required: helpers.withMessage("This field is required", (v: string) =>
            isProfessionalSummaryValid(v),
          ),
        },
      }),
    },
    educations: {
      $each: helpers.forEach({
        school: {
          required: helpers.withMessage("This field is required", required),
        },
        degree: {
          required: helpers.withMessage("This field is required", required),
        },
        startDate: {
          required: helpers.withMessage(
            "This field is required",
            (v: unknown) => isDateString(v),
          ),
        },
        city: {
          required: helpers.withMessage("This field is required", required),
        },
        description: {
          required: helpers.withMessage("This field is required", (v: string) =>
            isProfessionalSummaryValid(v),
          ),
        },
      }),
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

  function errorOfEmploymentHistory(index: number, field: string): string {
    const node: any = v$.value.employmentHistories;
    if (!node || !node.$dirty) return "";
    const itemErrors = node.$each?.$response?.$errors?.[index];
    if (!itemErrors) return "";
    const fieldErrors = itemErrors[field];
    if (!fieldErrors || fieldErrors.length === 0) return "";
    return (fieldErrors[0]?.$message as string) ?? "";
  }

  function errorOfEducation(index: number, field: string): string {
    const node: any = v$.value.educations;
    if (!node || !node.$dirty) return "";
    const itemErrors = node.$each?.$response?.$errors?.[index];
    if (!itemErrors) return "";
    const fieldErrors = itemErrors[field];
    if (!fieldErrors || fieldErrors.length === 0) return "";
    return (fieldErrors[0]?.$message as string) ?? "";
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
    form.professionalSummary = data.professionalSummary;
    form.dateOfBirth = data.dateOfBirth ?? null;
    form.skills = [];
    form.employmentHistories = data.employmentHistories.map(
      (employmentHistory) => ({
        id: employmentHistory.id,
        jobTitle: employmentHistory.jobTitle,
        city: employmentHistory.city,
        description: employmentHistory.description,
        employer: employmentHistory.employer,
        startDate: employmentHistory.startDate,
        endDate: employmentHistory.endDate,
      }),
    );
    form.educations = data.educations.map((education) => ({
      id: education.id,
      school: education.school,
      degree: education.degree,
      city: education.city,
      description: education.description,
      startDate: education.startDate,
      endDate: education.endDate,
    }));

    selectedSkills.value = data.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      level: skill.level,
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
      dateOfBirth: form.dateOfBirth as string,
      photoUrl: "",
      professionalSummary: form.professionalSummary,
      skills: form.skills,
      educations: form.educations,
      employmentHistories: form.employmentHistories,
    };
  }

  return {
    form,
    v$,
    setForm,
    errorOf,
    errorOfEmploymentHistory,
    errorOfEducation,
    getFormWithPayloadFormat,
    setPhoto,
    isNotUsingLevel,
    selectedSkills,
  };
}

<script setup lang="ts">
import AppBaseEditor from "@/components/base/AppBaseEditor.vue";
import AppBaseInputDate from "@/components/base/AppBaseInputDate.vue";
import AppBaseInputPhoto from "@/components/base/AppBaseInputPhoto.vue";
import AppBaseInputText from "@/components/base/AppBaseInputText.vue";
import AppCommonFormGroup from "@/components/common/AppCommonFormGroup.vue";
import UserEducationForm from "@/modules/user/components/UserEducationForm.vue";
import AppBaseButton from "@/components/base/AppBaseButton.vue";
import UserSkeleton from "@/modules/user/components/UserSkeleton.vue";
import { useUserForm } from "@/modules/user/composables/useUserForm";
import { useUserListApi } from "../composables/useUserListApi";
import { useUserCreateApi } from "../composables/useUserCreateApi";
import { useUserUpdateApi } from "../composables/useUserUpdateApi";
import { useSwitch } from "@/shared/composables/useSwitch";
import { useToast } from "primevue/usetoast";
import { onBeforeMount } from "vue";
import { useProfileDownloadApi } from "@/modules/profile/composables/useProfileDownloadApi";
import { useProfileUploadApi } from "@/modules/profile/composables/useProfileUploadApi";
import UserEmploymentHistoryForm from "../components/UserEmploymentHistoryForm.vue";
import dayjs from "dayjs";
import UserSkillForm from "../components/UserSkillForm.vue";
import AppBaseSwitch from "@/components/base/AppBaseSwitch.vue";
import { useSkillListApi } from "@/modules/skill/composables/useSkillListApi.ts";
import UserSkillBadge from "../components/UserSkillBadge.vue";
import type { Skill } from "@/modules/skill/interfaces/skill.interface.ts";
import { useSkillCreateApi } from "@/modules/skill/composables/useSkillCreateApi.ts";

const { state: loading, open: showLoading, close: hideLoading } = useSwitch();
const toast = useToast();
const {
  form,
  setForm,
  errorOf,
  errorOfEmploymentHistory,
  errorOfEducation,
  v$,
  getFormWithPayloadFormat,
  setPhoto,
  isNotUsingLevel,
  selectedSkills,
} = useUserForm();
const { currentUserId, fetchList, photoUrl } = useUserListApi(setForm);
const { create, loading: createLoading } = useUserCreateApi(setForm);
const { update, loading: updateLoading } = useUserUpdateApi(setForm);
const { download, loading: downloadLoading } = useProfileDownloadApi(setPhoto);
const { upload, loading: uploadLoading } = useProfileUploadApi();
const { create: createSkill, loading: loadingCreateSkill } =
  useSkillCreateApi();
const {
  loading: skillLoading,
  fetchList: fetchListSkill,
  skills,
} = useSkillListApi();

async function fetchInitData() {
  try {
    showLoading();

    await Promise.all([fetchList(), fetchListSkill()]);

    if (photoUrl.value) {
      await download(photoUrl.value);
    }
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Failed to Update User",
      detail:
        error?.response?.data?.message ??
        error?.message ??
        "Something went wrong.",
      life: 4000,
    });

    return null;
  } finally {
    hideLoading();
  }
}

async function submitForm() {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  let photoUrl: string | null = null;
  if (form.file) {
    photoUrl = await upload(form.file);
  }

  const formatedForm = getFormWithPayloadFormat();

  if (formatedForm.skills.length) {
    const newSkills = await createSkill([
      ...formatedForm.skills.filter(({ id }) => id.length === 0),
    ]);

    formatedForm.skills = newSkills.length ? newSkills : formatedForm.skills;
  }

  const payload = {
    ...formatedForm,
    ...(photoUrl ? { photoUrl } : {}),
    skills: [...formatedForm.skills, ...selectedSkills.value],
  };
  if (currentUserId.value) {
    await update(currentUserId.value, payload);
  } else {
    await create(payload);
  }

  fetchInitData();
}

function checkExistSkill(skillId: string): boolean {
  return !!selectedSkills.value.find((selected) => selected.id === skillId);
}
function selectSkill(skill: Skill) {
  const isExist = checkExistSkill(skill.id);

  if (!isExist) {
    selectedSkills.value.push(skill);
  } else {
    selectedSkills.value = selectedSkills.value.filter(
      ({ id }) => id !== skill.id,
    );
  }
}

onBeforeMount(fetchInitData);
</script>

<template>
  <UserSkeleton v-if="loading || downloadLoading || skillLoading" />
  <div v-else class="px-10 py-12 space-y-5">
    <h4 class="font-bold text-app-black text-2xl">Personal Details</h4>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
      <AppCommonFormGroup
        id="title"
        v-slot="attrs"
        label="Wanted Job Title"
        tooltip="The job title you are seeking, e.g. 'Frontend Developer' or 'Product Manager'"
        :error-message="errorOf('title')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.title"
          placeholder="e.g. Frontend Developer"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="photo" v-slot="attrs">
        <AppBaseInputPhoto id="photo" v-bind="attrs" v-model="form.file" />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="first-name"
        v-slot="attrs"
        label="First Name"
        :error-message="errorOf('firstName')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.firstName"
          placeholder="e.g. John"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="last-name"
        v-slot="attrs"
        label="Last Name"
        :error-message="errorOf('lastName')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.lastName"
          placeholder="e.g. Doe"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="email"
        v-slot="attrs"
        label="Email"
        :error-message="errorOf('email')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.email"
          placeholder="e.g. john@example.com"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="phone"
        v-slot="attrs"
        label="Phone"
        :error-message="errorOf('phone')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.phone"
          type="NUMBER"
          placeholder="e.g. 08123456789"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="country"
        v-slot="attrs"
        label="Country"
        :error-message="errorOf('country')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.country"
          placeholder="e.g. Indonesia"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="city"
        v-slot="attrs"
        label="City"
        :error-message="errorOf('city')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.city"
          placeholder="e.g. Jakarta"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="address"
        v-slot="attrs"
        label="Address"
        :error-message="errorOf('address')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.address"
          placeholder="e.g. Jl. Merdeka No. 123"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="postal-code"
        v-slot="attrs"
        label="Postal Code"
        :error-message="errorOf('postalCode')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.postalCode"
          type="NUMBER"
          :max-length="5"
          placeholder="e.g. 12345"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="driving-license"
        v-slot="attrs"
        label="Driver License"
        tooltip="Enter your driving license category, e.g. 'A' for motorcycle or 'B' for car"
        :error-message="errorOf('drivingLicense')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.drivingLicense"
          placeholder="e.g. A1"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="nationality"
        v-slot="attrs"
        label="Nationality"
        tooltip="Enter your nationality as it appears on your passport or national ID"
        :error-message="errorOf('nationality')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.nationality"
          placeholder="e.g. Indonesian"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="place-of-birth"
        v-slot="attrs"
        label="Place Of Birth"
        tooltip="Enter the city or region where you were born, e.g. 'Jakarta, Indonesia'"
        :error-message="errorOf('placeOfBirth')"
      >
        <AppBaseInputText
          v-bind="attrs"
          v-model="form.placeOfBirth"
          placeholder="e.g. Jakarta, Indonesia"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="date-of-birth"
        v-slot="attrs"
        label="Date Of Birth"
        tooltip="Enter your date of birth as it appears on your official ID document"
        :error-message="errorOf('dateOfBirth')"
      >
        <AppBaseInputDate
          v-model="form.dateOfBirth"
          v-bind="attrs"
          placeholder="DD/MM/YYYY"
          :max-date="dayjs().format('YYYY-MM-DD')"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="professional-summary"
        v-slot="attrs"
        class="col-span-2"
        :error-message="errorOf('professionalSummary')"
      >
        <header class="flex flex-col space-y-1">
          <h5 class="font-bold text-xl text-app-black">Professional Summary</h5>
          <p class="text-app-label">
            Write 2-4 short & energetic sentences to interest the reader!
            Mention your role, experience & most importantly - your biggest
            achievements, best qualities and skills.
          </p>
        </header>

        <AppBaseEditor
          v-bind="attrs"
          v-model="form.professionalSummary"
          placeholder="e.g. Passionate science teacher with 8+ years of experience and a track record of ..."
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="employment-history"
        v-slot="attrs"
        class="col-span-2"
      >
        <header class="flex flex-col space-y-1">
          <h5 class="font-bold text-xl text-app-black">Employment History</h5>
          <p class="text-app-label">
            Show your relevant experience (last 10 years). Use bullet points to
            note your achievements, if possible - use numbers/facts (Achieved X,
            measured by Y, by doing Z).
          </p>
        </header>

        <UserEmploymentHistoryForm
          v-bind="attrs"
          v-model="form.employmentHistories"
          :error-for="errorOfEmploymentHistory"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="education" v-slot="attrs" class="col-span-2">
        <header class="flex flex-col space-y-1">
          <h5 class="font-bold text-xl text-app-black">Education</h5>
          <p class="text-app-label">
            A varied education on your resume sums up the value that your
            learnings and background will bring to job.
          </p>
        </header>

        <UserEducationForm
          v-bind="attrs"
          v-model="form.educations"
          :error-for="errorOfEducation"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="skill"
        v-slot="attrs"
        class="col-span-2"
        :error-message="errorOf('skills')"
      >
        <header class="flex flex-col space-y-1">
          <h5 class="font-bold text-xl text-app-black">Skills</h5>
          <p class="text-app-label">
            Choose 5 of the most important skills to show your talents! Make
            sure they match the keywords of the job listing if applying via an
            online system.
          </p>

          <span class="flex items-center gap-4 mt-2">
            <AppBaseSwitch v-model="isNotUsingLevel" />
            <label class="text-app-black">Don't show experience level</label>
          </span>
        </header>

        <section
          v-if="skills.length"
          class="flex items-center gap-4 flex-wrap mt-6"
        >
          <UserSkillBadge
            v-for="skill in skills"
            :key="skill.id"
            :label="
              isNotUsingLevel ? skill.name : `${skill.name} - ${skill.level}`
            "
            :is-active="checkExistSkill(skill.id)"
            @click="selectSkill(skill)"
          />
        </section>

        <UserSkillForm
          v-bind="attrs"
          v-model="form.skills"
          :isNotUsingLevel="isNotUsingLevel"
        />
      </AppCommonFormGroup>
    </section>

    <AppBaseButton
      :label="currentUserId ? 'Save Change' : 'Submit'"
      class="w-full mt-10"
      :loading="
        updateLoading || createLoading || uploadLoading || loadingCreateSkill
      "
      @click="submitForm"
    />
  </div>
</template>

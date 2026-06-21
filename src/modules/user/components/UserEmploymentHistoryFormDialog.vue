<script lang="ts" setup>
import { ref, computed } from "vue";
import IconAdd from "@/components/icon/IconAdd.vue";
import AppBaseDialog from "@/components/base/AppBaseDialog.vue";
import AppBaseInputText from "@/components/base/AppBaseInputText.vue";
import AppBaseInputDate from "@/components/base/AppBaseInputDate.vue";
import AppBaseButton from "@/components/base/AppBaseButton.vue";
import AppBaseLabel from "@/components/base/AppBaseLabel.vue";
import type { EmploymentHistory } from "@/shared/types/employmentHistory.type";

export interface UserEmploymentHistoryFormDialogProps {
  isError?: boolean;
  label: string;
}

const props = defineProps<UserEmploymentHistoryFormDialogProps>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const model = defineModel<EmploymentHistory[]>({ default: () => [] });

const isOpen = ref(false);
const jobTitleInput = ref<string | undefined>("");
const employerInput = ref<string | undefined>("");
const startDateInput = ref<Date | null>(null);
const endDateInput = ref<Date | null>(null);
const cityInput = ref<string | undefined>("");
const descriptionInput = ref<string | undefined>("");

const isSubmitDisabled = computed(
  () =>
    !jobTitleInput.value?.trim() ||
    !employerInput.value?.trim() ||
    !startDateInput.value ||
    !cityInput.value?.trim() ||
    !descriptionInput.value?.trim()
);

function resetForm() {
  jobTitleInput.value = "";
  employerInput.value = "";
  startDateInput.value = null;
  endDateInput.value = null;
  cityInput.value = "";
  descriptionInput.value = "";
}

function onButtonClick() {
  emit("click");
  isOpen.value = true;
}

function onCancel() {
  isOpen.value = false;
  resetForm();
}

function onSubmit() {
  if (isSubmitDisabled.value) return;

  model.value = [
    ...model.value,
    {
      jobTitle: jobTitleInput.value!.trim(),
      employer: employerInput.value!.trim(),
      startDate: startDateInput.value!,
      endDate: endDateInput.value,
      city: cityInput.value!.trim(),
      description: descriptionInput.value!.trim(),
    },
  ];
  isOpen.value = false;
  resetForm();
}

function removeItem(index: number) {
  model.value = model.value.filter((_, i) => i !== index);
}
</script>

<template>
  <div>
    <div v-if="model.length" class="flex flex-wrap gap-2 mb-3">
      <span
        v-for="(item, idx) in model"
        :key="`${item.jobTitle}-${idx}`"
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 text-app-black text-sm"
      >
        <span>{{ item.jobTitle }}</span>
        <button
          type="button"
          class="cursor-pointer hover:text-red-500 transition-colors"
          @click="removeItem(idx)"
        >
          <IconAdd color="currentColor" />
        </button>
      </span>
    </div>

    <button
      type="button"
      class="flex items-center space-x-1 cursor-pointer"
      :class="props.isError ? 'text-red-500' : 'text-app-blue'"
      @click="onButtonClick"
    >
      <IconAdd color="currentColor" />
      <span>{{ props.label }}</span>
    </button>

    <AppBaseDialog
      v-model:visible="isOpen"
      :header="props.label"
      @hide="resetForm"
    >
      <div class="py-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="emp-job-title" label="Job Title" />
          <AppBaseInputText
            id="emp-job-title"
            v-model="jobTitleInput"
            placeholder="Job title"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="emp-employer" label="Employer" />
          <AppBaseInputText
            id="emp-employer"
            v-model="employerInput"
            placeholder="Employer name"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="emp-start" label="Start Date" />
          <AppBaseInputDate
            id="emp-start"
            v-model="startDateInput"
            placeholder="DD/MM/YYYY"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="emp-end" label="End Date (optional)" />
          <AppBaseInputDate
            id="emp-end"
            v-model="endDateInput"
            placeholder="DD/MM/YYYY"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="emp-city" label="City" />
          <AppBaseInputText
            id="emp-city"
            v-model="cityInput"
            placeholder="City"
          />
        </div>

        <div class="flex flex-col space-y-1 md:col-span-2">
          <AppBaseLabel for="emp-desc" label="Description" />
          <AppBaseInputText
            id="emp-desc"
            v-model="descriptionInput"
            placeholder="Description"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <AppBaseButton label="Cancel" variant="outlined" @click="onCancel" />
          <AppBaseButton
            label="Submit"
            :disabled="isSubmitDisabled"
            @click="onSubmit"
          />
        </div>
      </template>
    </AppBaseDialog>
  </div>
</template>

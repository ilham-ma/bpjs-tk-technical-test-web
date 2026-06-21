<script lang="ts" setup>
import { ref, computed } from "vue";
import IconAdd from "@/components/icon/IconAdd.vue";
import AppBaseDialog from "@/components/base/AppBaseDialog.vue";
import AppBaseInputText from "@/components/base/AppBaseInputText.vue";
import AppBaseInputDate from "@/components/base/AppBaseInputDate.vue";
import AppBaseButton from "@/components/base/AppBaseButton.vue";
import AppBaseLabel from "@/components/base/AppBaseLabel.vue";
import type { Education } from "@/shared/types/education.type";

export interface UserEducationFormDialogProps {
  isError?: boolean;
  label: string;
}

const props = defineProps<UserEducationFormDialogProps>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const model = defineModel<Education[]>({ default: () => [] });

const isOpen = ref(false);
const schoolInput = ref<string | undefined>("");
const degreeInput = ref<string | undefined>("");
const startDateInput = ref<Date | null>(null);
const endDateInput = ref<Date | null>(null);
const cityInput = ref<string | undefined>("");
const descriptionInput = ref<string | undefined>("");

const isSubmitDisabled = computed(
  () =>
    !schoolInput.value?.trim() ||
    !degreeInput.value?.trim() ||
    !startDateInput.value ||
    !cityInput.value?.trim() ||
    !descriptionInput.value?.trim()
);

function resetForm() {
  schoolInput.value = "";
  degreeInput.value = "";
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
      school: schoolInput.value!.trim(),
      degree: degreeInput.value!.trim(),
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
        :key="`${item.school}-${idx}`"
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 text-app-black text-sm"
      >
        <span>{{ item.school }}</span>
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
          <AppBaseLabel for="edu-school" label="School" />
          <AppBaseInputText
            id="edu-school"
            v-model="schoolInput"
            placeholder="School name"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="edu-degree" label="Degree" />
          <AppBaseInputText
            id="edu-degree"
            v-model="degreeInput"
            placeholder="Degree"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="edu-start" label="Start Date" />
          <AppBaseInputDate
            id="edu-start"
            v-model="startDateInput"
            placeholder="DD/MM/YYYY"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="edu-end" label="End Date (optional)" />
          <AppBaseInputDate
            id="edu-end"
            v-model="endDateInput"
            placeholder="DD/MM/YYYY"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="edu-city" label="City" />
          <AppBaseInputText
            id="edu-city"
            v-model="cityInput"
            placeholder="City"
          />
        </div>

        <div class="flex flex-col space-y-1 md:col-span-2">
          <AppBaseLabel for="edu-desc" label="Description" />
          <AppBaseInputText
            id="edu-desc"
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

<script lang="ts" setup>
import { ref, computed } from "vue";
import IconAdd from "@/components/icon/IconAdd.vue";
import AppBaseDialog from "@/components/base/AppBaseDialog.vue";
import AppBaseInputText from "@/components/base/AppBaseInputText.vue";
import AppBaseInputOption from "@/components/base/AppBaseInputOption.vue";
import AppBaseButton from "@/components/base/AppBaseButton.vue";
import AppBaseLabel from "@/components/base/AppBaseLabel.vue";
import { SkillLevelEnum, type Skill } from "@/shared/types/skillLevel.enum";
import type { Option } from "@/shared/types/option.type";

export interface UserSkillFormDialogProps {
  isError?: boolean;
  label: string;
}

const props = defineProps<UserSkillFormDialogProps>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const model = defineModel<Skill[]>({ default: () => [] });

const isOpen = ref(false);
const skillInput = ref<string | undefined>("");
const levelInput = ref<string | null>(null);
const errorMessage = ref("");

const levelOptions: Option[] = [
  { label: "Basic", value: SkillLevelEnum.Basic },
  { label: "Intermediate", value: SkillLevelEnum.Intermediate },
  { label: "Expert", value: SkillLevelEnum.Expert },
];

const isSubmitDisabled = computed(
  () => !skillInput.value?.trim() || !levelInput.value
);

function resetForm() {
  skillInput.value = "";
  levelInput.value = null;
  errorMessage.value = "";
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
  const trimmed = skillInput.value?.trim() ?? "";
  if (!trimmed || !levelInput.value) return;

  const isDuplicate = model.value.some(
    (item) => item.skill.toLowerCase() === trimmed.toLowerCase()
  );
  if (isDuplicate) {
    errorMessage.value = "Skill already exists";
    return;
  }

  model.value = [
    ...model.value,
    { skill: trimmed, level: levelInput.value as SkillLevelEnum },
  ];
  isOpen.value = false;
  resetForm();
}

function removeSkill(index: number) {
  model.value = model.value.filter((_, i) => i !== index);
}
</script>

<template>
  <div>
    <div v-if="model.length" class="flex flex-wrap gap-2 mb-3">
      <span
        v-for="(item, idx) in model"
        :key="`${item.skill}-${idx}`"
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 text-app-black text-sm"
      >
        <span>{{ item.skill }}</span>
        <button
          type="button"
          class="cursor-pointer hover:text-red-500 transition-colors"
          @click="removeSkill(idx)"
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
      <div class="py-2 space-y-3">
        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="skill-input" label="Skill" />
          <AppBaseInputText
            id="skill-input"
            v-model="skillInput"
            placeholder="e.g. Vue.js"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <AppBaseLabel for="skill-level" label="Level" />
          <AppBaseInputOption
            id="skill-level"
            v-model="levelInput"
            :options="levelOptions"
            placeholder="Select level"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-500">
          {{ errorMessage }}
        </p>
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

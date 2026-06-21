<script lang="ts" setup>
import { ref } from "vue";
import debounce from "lodash/debounce";
import IconAdd from "@/components/icon/IconAdd.vue";
import type { Option } from "@/shared/types/option.type";
import AppBaseDialog from "../base/AppBaseDialog.vue";
import AppBaseInputOption from "../base/AppBaseInputOption.vue";
import AppBaseButton from "../base/AppBaseButton.vue";

export interface AppCommonChipInputDialogProps {
  isError?: boolean;
  label: string;
  options: Option[];
}

const props = defineProps<AppCommonChipInputDialogProps>();
const emit = defineEmits<{
  (e: "click"): void;
  (e: "search", query: string): void;
}>();

const model = defineModel<string[]>({ default: () => [] });

const isOpen = ref(false);
const selectedValue = ref<string | null>(null);

function onButtonClick() {
  emit("click");
  isOpen.value = true;
}

function resetSelection() {
  selectedValue.value = null;
}

function onCancel() {
  isOpen.value = false;
  resetSelection();
}

function onSubmit() {
  if (!selectedValue.value) return;
  if (!model.value.includes(selectedValue.value)) {
    model.value = [...model.value, selectedValue.value];
  }
  isOpen.value = false;
  resetSelection();
}

const debouncedEmitSearch = debounce((query: string) => {
  emit("search", query);
}, 300);

function onFilter(event: { value: string }) {
  debouncedEmitSearch(event.value ?? "");
}
</script>

<template>
  <div>
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
      @hide="resetSelection"
    >
      <div class="py-2">
        <AppBaseInputOption
          v-model="selectedValue"
          :options="props.options"
          option-label="label"
          option-value="value"
          :filter="true"
          placeholder="Select an option"
          @filter="onFilter"
        />
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <AppBaseButton label="Cancel" variant="outlined" @click="onCancel" />
          <AppBaseButton
            label="Submit"
            :disabled="!selectedValue"
            @click="onSubmit"
          />
        </div>
      </template>
    </AppBaseDialog>
  </div>
</template>

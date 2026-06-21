<script lang="ts" setup>
import type { Option } from "@/shared/types/option.type";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
} from "vue";

export interface AppBaseInputOptionProps {
  options: Option[];
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
  filter?: boolean;
  disabled?: boolean;
  isError?: boolean;
}

const props = withDefaults(defineProps<AppBaseInputOptionProps>(), {
  optionLabel: "label",
  optionValue: "value",
  placeholder: "",
  filter: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "filter", payload: { value: string }): void;
}>();

const model = defineModel<string | null>({ default: null });

const isOpen = ref(false);
const filterText = ref("");
const wrapperRef = useTemplateRef<HTMLDivElement>("wrapper");
const triggerRef = useTemplateRef<HTMLButtonElement>("trigger");
const filterInputRef = useTemplateRef<HTMLInputElement>("filterInput");
const dropdownPanelRef = useTemplateRef<HTMLDivElement>("dropdownPanel");

const dropdownStyle = ref<{ top: string; left: string; width: string }>({
  top: "0px",
  left: "0px",
  width: "0px",
});

function isSelected(option: Option): boolean {
  return option.value === model.value;
}

const displayLabel = computed<string>(() => {
  if (model.value === null) return "";
  return props.options.find((op) => op.value === model.value)?.label ?? "";
});

function updateDropdownPosition() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  dropdownStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  };
}

async function toggleOpen() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    updateDropdownPosition();
    if (props.filter) {
      await nextTick();
      filterInputRef.value?.focus();
    }
  }
}

function closeDropdown() {
  isOpen.value = false;
  filterText.value = "";
}

function selectOption(option: Option) {
  model.value = option.value;
  closeDropdown();
}

function onFilterInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  filterText.value = value;
  emit("filter", { value });
}

function onClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  if (!wrapperRef.value) return;
  if (
    !wrapperRef.value.contains(target) &&
    !dropdownPanelRef.value?.contains(target)
  ) {
    closeDropdown();
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape" && isOpen.value) {
    closeDropdown();
  }
}

function onScroll() {
  if (isOpen.value) closeDropdown();
}

onMounted(() => {
  document.addEventListener("mousedown", onClickOutside);
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("scroll", onScroll, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
  document.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("scroll", onScroll, true);
});
</script>

<template>
  <div ref="wrapper">
    <button
      ref="trigger"
      type="button"
      :disabled="props.disabled"
      class="flex items-center justify-between w-full p-3 rounded cursor-pointer text-left outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      :class="props.isError ? 'bg-red-100' : 'bg-app-field-backgroud'"
      @click="toggleOpen"
    >
      <span
        :class="[
          displayLabel
            ? props.isError
              ? 'text-red-500'
              : 'text-app-black'
            : 'text-gray-400',
        ]"
      >
        {{ displayLabel || props.placeholder }}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="18"
        height="18"
        fill="currentColor"
        class="text-gray-500 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      >
        <path d="M480-360 280-560h400L480-360Z" />
      </svg>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdownPanel"
        class="fixed flex flex-col bg-white border border-gray-300 rounded shadow-lg z-9999 max-h-60 overflow-hidden"
        :style="dropdownStyle"
      >
        <div v-if="props.filter" class="p-2 border-b border-gray-200">
          <input
            ref="filterInput"
            :value="filterText"
            type="text"
            placeholder="Search..."
            class="w-full px-2 py-1 bg-white text-app-black border border-gray-300 rounded outline-none text-sm"
            @input="onFilterInput"
          />
        </div>

        <ul class="overflow-auto">
          <li
            v-for="option in props.options"
            :key="option.value"
            class="px-3 py-2 cursor-pointer text-app-black hover:bg-gray-100"
            :class="{ 'bg-blue-50 text-app-blue': isSelected(option) }"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </li>
          <li
            v-if="props.options.length === 0"
            class="px-3 py-2 text-gray-400 text-center"
          >
            No options
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

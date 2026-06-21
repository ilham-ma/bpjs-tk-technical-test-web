<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";

defineOptions({ inheritAttrs: false });

export interface AppBaseInputDateProps {
  isError?: boolean;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

const props = withDefaults(defineProps<AppBaseInputDateProps>(), {
  isError: false,
  placeholder: "",
});

const model = defineModel<Date | null>({ default: null });

const isOpen = ref(false);
const viewMonth = ref<number>(0);
const viewYear = ref<number>(0);
const showMonthDropdown = ref(false);
const showYearDropdown = ref(false);

const wrapperRef = useTemplateRef<HTMLDivElement>("wrapper");
const triggerRef = useTemplateRef<HTMLInputElement>("trigger");
const panelRef = useTemplateRef<HTMLDivElement>("panel");

const panelStyle = ref<{ top: string; left: string }>({
  top: "0px",
  left: "0px",
});

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const YEAR_RANGE_SIZE = 12;

function formatDate(date: Date | null): string {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function isDisabled(date: Date): boolean {
  if (props.minDate && date < props.minDate) {
    const minDateNormalized = new Date(
      props.minDate.getFullYear(),
      props.minDate.getMonth(),
      props.minDate.getDate(),
    );
    if (date.getTime() < minDateNormalized.getTime()) return true;
  }
  if (props.maxDate) {
    const maxDateNormalized = new Date(
      props.maxDate.getFullYear(),
      props.maxDate.getMonth(),
      props.maxDate.getDate(),
    );
    if (date.getTime() > maxDateNormalized.getTime()) return true;
  }
  return false;
}

function getCalendarCells(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();

  const cells: Date[] = [];
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  for (let i = startDay - 1; i >= 0; i--) {
    cells.push(new Date(year, month - 1, prevMonthLastDay - i));
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(new Date(year, month, i));
  }

  while (cells.length < 42) {
    cells.push(new Date(year, month + 1, cells.length - 28));
  }

  return cells;
}

const displayLabel = computed(() => formatDate(model.value));

const yearRangeStart = computed(
  () => Math.floor(viewYear.value / YEAR_RANGE_SIZE) * YEAR_RANGE_SIZE,
);

const visibleYears = computed(() => {
  const years: number[] = [];
  for (let i = 0; i < YEAR_RANGE_SIZE; i++) {
    years.push(yearRangeStart.value + i);
  }
  return years;
});

function updatePanelPosition() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  panelStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
  };
}

function openPanel() {
  if (model.value) {
    viewYear.value = model.value.getFullYear();
    viewMonth.value = model.value.getMonth();
  } else {
    const today = new Date();
    viewYear.value = today.getFullYear();
    viewMonth.value = today.getMonth();
  }
  updatePanelPosition();
  isOpen.value = true;
  showMonthDropdown.value = false;
  showYearDropdown.value = false;
}

function closePanel() {
  isOpen.value = false;
  showMonthDropdown.value = false;
  showYearDropdown.value = false;
}

function toggleOpen() {
  if (isOpen.value) {
    closePanel();
  } else {
    openPanel();
  }
}

function prevMonth() {
  viewMonth.value--;
  if (viewMonth.value < 0) {
    viewMonth.value = 11;
    viewYear.value--;
  }
}

function nextMonth() {
  viewMonth.value++;
  if (viewMonth.value > 11) {
    viewMonth.value = 0;
    viewYear.value++;
  }
}

function selectMonth(monthIndex: number) {
  viewMonth.value = monthIndex;
  showMonthDropdown.value = false;
}

function selectYear(year: number) {
  viewYear.value = year;
  showYearDropdown.value = false;
}

function prevYearRange() {
  viewYear.value -= YEAR_RANGE_SIZE;
}

function nextYearRange() {
  viewYear.value += YEAR_RANGE_SIZE;
}

function selectDate(date: Date) {
  if (isDisabled(date)) return;
  model.value = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  closePanel();
}

function toggleMonthDropdown() {
  showMonthDropdown.value = !showMonthDropdown.value;
  if (showMonthDropdown.value) {
    showYearDropdown.value = false;
  }
}

function toggleYearDropdown() {
  showYearDropdown.value = !showYearDropdown.value;
  if (showYearDropdown.value) {
    showMonthDropdown.value = false;
  }
}

function onClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  if (!wrapperRef.value) return;
  if (!wrapperRef.value.contains(target) && !panelRef.value?.contains(target)) {
    closePanel();
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape" && isOpen.value) {
    closePanel();
  }
}

function onScroll() {
  if (isOpen.value) closePanel();
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
    <input
      ref="trigger"
      v-bind="$attrs"
      type="text"
      readonly
      :value="displayLabel"
      :placeholder="props.placeholder"
      class="outline-none p-3 rounded cursor-pointer w-full"
      :class="[
        props.isError
          ? 'bg-red-100 text-red-500 placeholder:text-red-300'
          : 'bg-app-field-backgroud text-app-black placeholder:text-gray-400',
      ]"
      @click="toggleOpen"
    />
  </div>

  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="panel"
      class="fixed bg-white border border-gray-300 rounded shadow-lg z-9999 p-3 w-72"
      :style="panelStyle"
    >
      <header class="flex items-center justify-between mb-2">
        <button
          type="button"
          class="p-1 rounded hover:bg-gray-100"
          @click="prevMonth"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width="20"
            height="20"
            fill="currentColor"
            class="text-gray-600"
          >
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </svg>
        </button>

        <div class="flex items-center space-x-1">
          <button
            type="button"
            class="px-2 py-1 text-app-black rounded hover:bg-gray-100 font-medium text-sm"
            @click="toggleMonthDropdown"
          >
            {{ MONTH_NAMES[viewMonth] }}
          </button>
          <button
            type="button"
            class="px-2 py-1 text-app-black rounded hover:bg-gray-100 font-medium text-sm"
            @click="toggleYearDropdown"
          >
            {{ viewYear }}
          </button>
        </div>

        <button
          type="button"
          class="p-1 rounded hover:bg-gray-100"
          @click="nextMonth"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width="20"
            height="20"
            fill="currentColor"
            class="text-gray-600"
          >
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </svg>
        </button>
      </header>

      <div v-if="showMonthDropdown" class="grid grid-cols-3 gap-1 mb-2">
        <button
          v-for="(m, idx) in MONTH_NAMES"
          :key="m"
          type="button"
          class="px-2 py-2 rounded text-sm text-app-black hover:bg-gray-100"
          :class="{ 'bg-blue-50 text-app-blue': idx === viewMonth }"
          @click="selectMonth(idx)"
        >
          {{ m }}
        </button>
      </div>

      <div v-else-if="showYearDropdown" class="mb-2">
        <div class="flex items-center justify-between mb-1">
          <button
            type="button"
            class="p-1 rounded hover:bg-gray-100"
            @click="prevYearRange"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              width="20"
              height="20"
              fill="currentColor"
              class="text-gray-600"
            >
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>
          </button>
          <span class="text-xs text-gray-500">
            {{ yearRangeStart }} - {{ yearRangeStart + YEAR_RANGE_SIZE - 1 }}
          </span>
          <button
            type="button"
            class="p-1 rounded hover:bg-gray-100"
            @click="nextYearRange"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              width="20"
              height="20"
              fill="currentColor"
              class="text-gray-600"
            >
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
          </button>
        </div>
        <div class="grid grid-cols-3 gap-1">
          <button
            v-for="y in visibleYears"
            :key="y"
            type="button"
            class="px-2 py-2 rounded text-sm text-app-black hover:bg-gray-100"
            :class="{ 'bg-blue-50 text-app-blue': y === viewYear }"
            @click="selectYear(y)"
          >
            {{ y }}
          </button>
        </div>
      </div>

      <template v-else>
        <div class="grid grid-cols-7 mb-1">
          <div
            v-for="d in WEEKDAYS"
            :key="d"
            class="text-center text-xs text-gray-500 py-1"
          >
            {{ d }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="(cell, idx) in getCalendarCells(viewYear, viewMonth)"
            :key="idx"
            type="button"
            :disabled="isDisabled(cell)"
            class="aspect-square rounded text-sm flex items-center justify-center"
            :class="[
              cell.getMonth() !== viewMonth
                ? 'text-gray-300'
                : 'text-app-black',
              model && isSameDay(cell, model)
                ? 'bg-app-blue text-white'
                : 'hover:bg-gray-100',
              isToday(cell) && !(model && isSameDay(cell, model))
                ? 'border border-app-blue'
                : '',
              isDisabled(cell)
                ? 'opacity-30 cursor-not-allowed'
                : 'cursor-pointer',
            ]"
            @click="selectDate(cell)"
          >
            {{ cell.getDate() }}
          </button>
        </div>
      </template>
    </div>
  </Teleport>
</template>

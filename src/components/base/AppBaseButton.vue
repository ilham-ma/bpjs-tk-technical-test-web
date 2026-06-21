<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "filled" | "outlined";
  color?: "blue" | "green" | "yellow" | "red";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  variant: "filled",
  color: "blue",
  disabled: false,
  loading: false,
  type: "button",
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-base gap-2",
  lg: "px-5 py-2.5 text-lg gap-2",
  xl: "px-6 py-3 text-xl gap-2.5",
};

const filledClasses: Record<string, string> = {
  blue: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300",
  green: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-300",
  yellow: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300",
  red: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300",
};

const outlinedClasses: Record<string, string> = {
  blue: "border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-300",
  green:
    "border border-green-500 text-green-500 hover:bg-green-50 focus:ring-green-300",
  yellow:
    "border border-yellow-500 text-yellow-500 hover:bg-yellow-50 focus:ring-yellow-300",
  red: "border border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-300",
};

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1";

const disabledClasses = "opacity-50 cursor-not-allowed pointer-events-none";

const buttonClasses = computed(() => {
  const colorClasses =
    props.variant === "filled"
      ? filledClasses[props.color]
      : outlinedClasses[props.color];

  const classes = [
    baseClasses,
    sizeClasses[props.size],
    colorClasses,
    props.disabled || props.loading ? disabledClasses : "",
  ];

  return classes.filter(Boolean).join(" ");
});

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return;
  emit("click", event);
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot>{{ label }}</slot>
  </button>
</template>

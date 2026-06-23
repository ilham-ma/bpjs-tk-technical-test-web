<script lang="ts" setup>
export interface AppBaseSwitchProps {
  disabled?: boolean;
  isError?: boolean;
}

const props = withDefaults(defineProps<AppBaseSwitchProps>(), {
  disabled: false,
  isError: false,
});

const model = defineModel<boolean>({ default: false });

function toggle() {
  if (props.disabled) return;
  model.value = !model.value;
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :disabled="props.disabled"
    :class="[
      'relative inline-flex items-center w-10 h-5 rounded-full transition-colors duration-200',
      props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      props.isError
        ? 'bg-red-100'
        : model
          ? 'bg-app-blue'
          : 'bg-gray-200',
    ]"
    @click="toggle"
  >
    <span
      :class="[
        'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
        model ? 'translate-x-5' : 'translate-x-0',
      ]"
    />
  </button>
</template>

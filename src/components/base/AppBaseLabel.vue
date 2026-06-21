<script lang="ts" setup>
export interface AppBaseLabelProps {
  for: string;
  label: string;
}

const props = defineProps<AppBaseLabelProps>();
</script>

<template>
  <label :for="props.for" class="text-app-label">{{ props.label }}</label>
</template>

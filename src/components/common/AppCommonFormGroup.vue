<script lang="ts" setup>
import { computed } from "vue";
import AppBaseLabel from "../base/AppBaseLabel.vue";
import IconHelp from "../icon/IconHelp.vue";

export interface AppCommonFormGroupProps {
  label?: string;
  id: string;
  errorMessage?: string;
  tooltip?: string;
}

const props = defineProps<AppCommonFormGroupProps>();

const isError = computed(() => !!props.errorMessage);
</script>

<template>
  <section class="flex flex-col gap-2">
    <span v-if="props.label" class="flex gap-2 items-center">
      <AppBaseLabel :for="props.id" :label="props.label" />

      <IconHelp
        v-tooltip="{
          value: props.tooltip,
        }"
        color="#458fe9"
      />
    </span>

    <slot isError></slot>

    <span v-if="isError" class="text-app-blue">{{ props.errorMessage }}</span>
  </section>
</template>

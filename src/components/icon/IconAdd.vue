<script lang="ts" setup>
import { ICON_COMPONENT_DEFAULT_PROPS } from "@/shared/constants/iconComponent.constant";
import type { IconComponentProps } from "@/shared/types/iconComponent.type";

const props = withDefaults(defineProps<IconComponentProps>(), {
  ...ICON_COMPONENT_DEFAULT_PROPS,
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :height="props.height"
    viewBox="0 -960 960 960"
    :width="props.width"
    :fill="props.color"
  >
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  </svg>
</template>

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
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </svg>
</template>

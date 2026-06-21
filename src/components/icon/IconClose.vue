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
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    />
  </svg>
</template>

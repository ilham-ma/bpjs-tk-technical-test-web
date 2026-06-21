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
    <path
      d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"
    />
  </svg>
</template>

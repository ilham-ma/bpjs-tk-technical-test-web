<script lang="ts" setup>
import { useSwitch } from "@/shared/composables/useSwitch.ts";
import IconArrowDown from "../icon/IconArrowDown.vue";

export interface AppBaseAccordionProps {
  disabled?: boolean;
}
const props = defineProps<AppBaseAccordionProps>();

const { state: visible, toggle: changeVisible } = useSwitch();
function clickButton() {
  if (props.disabled) return;
  changeVisible();
}
</script>

<template>
  <section class="border rounded border-app-field-backgroud p-4">
    <header class="flex justify-between items-center">
      <slot name="header" />

      <button
        :class="[props.disabled ? 'cursor-not-allow' : 'cursor-pointer']"
        @click="clickButton"
      >
        <IconArrowDown
          color="#6a7282"
          :width="24"
          :height="24"
          :class="[
            visible ? 'rotate-180' : 'rotate-0',
            'transition-all duration-150',
          ]"
        />
      </button>
    </header>

    <div v-show="visible" class="mt-5"><slot /></div>
  </section>
</template>

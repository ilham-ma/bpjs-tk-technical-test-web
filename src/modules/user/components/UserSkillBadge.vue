<script lang="ts" setup>
import IconAdd from "@/components/icon/IconAdd.vue";
import IconCheck from "@/components/icon/IconCheck.vue";

export interface UserSkillBadgeProps {
  label: string;
  isActive?: boolean;
}

const props = withDefaults(defineProps<UserSkillBadgeProps>(), {
  isActive: false,
});

const emit = defineEmits<{
  (e: "click"): void;
}>();

function onClick() {
  emit("click");
}
</script>

<template>
  <button
    type="button"
    :class="[
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors duration-150',
      props.isActive
        ? 'bg-app-blue text-white'
        : 'bg-gray-100 text-app-black hover:bg-gray-200',
    ]"
    @click="onClick"
  >
    <span>{{ props.label }}</span>
    <IconCheck
      v-if="props.isActive"
      :width="16"
      :height="16"
      color="#ffffff"
    />
    <IconAdd
      v-else
      :width="16"
      :height="16"
      color="#6B7280"
    />
  </button>
</template>

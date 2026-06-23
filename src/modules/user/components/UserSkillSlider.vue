<script setup lang="ts">
import { computed, ref } from "vue";
import { SkillLevelEnum } from "@/shared/enums/skillLevel.enum";

export interface UserSkillSliderProps {
  disabled?: boolean;
}

const props = withDefaults(defineProps<UserSkillSliderProps>(), {
  disabled: false,
});

const model = defineModel<SkillLevelEnum>({
  default: SkillLevelEnum.Basic,
});

const LEVELS = [
  SkillLevelEnum.Basic,
  SkillLevelEnum.Intermediate,
  SkillLevelEnum.Skillfull,
  SkillLevelEnum.Experienced,
  SkillLevelEnum.Expert,
];

const COLOR_MAP: Record<
  SkillLevelEnum,
  {
    block: string;
    text: string;
    track: string;
    tick: string;
  }
> = {
  [SkillLevelEnum.Basic]: {
    block: "bg-red-500",
    text: "text-red-500",
    track: "bg-red-50",
    tick: "bg-red-200",
  },
  [SkillLevelEnum.Intermediate]: {
    block: "bg-gray-400",
    text: "text-gray-500",
    track: "bg-gray-100",
    tick: "bg-gray-300",
  },
  [SkillLevelEnum.Skillfull]: {
    block: "bg-orange-500",
    text: "text-orange-500",
    track: "bg-orange-50",
    tick: "bg-orange-200",
  },
  [SkillLevelEnum.Experienced]: {
    block: "bg-green-500",
    text: "text-green-500",
    track: "bg-green-50",
    tick: "bg-green-200",
  },
  [SkillLevelEnum.Expert]: {
    block: "bg-violet-500",
    text: "text-violet-500",
    track: "bg-violet-50",
    tick: "bg-violet-200",
  },
};

const trackRef = ref<HTMLDivElement | null>(null);
const isDragging = ref(false);

const currentIndex = computed(() => LEVELS.indexOf(model.value));
const colors = computed(() => COLOR_MAP[model.value]);

function indexFromClientX(clientX: number): number {
  if (!trackRef.value) return 0;
  const rect = trackRef.value.getBoundingClientRect();
  const ratio = (clientX - rect.left) / rect.width;
  const idx = Math.floor(ratio * LEVELS.length);
  return Math.max(0, Math.min(LEVELS.length - 1, idx));
}

function setLevelFromClientX(clientX: number) {
  if (props.disabled) return;
  const idx = indexFromClientX(clientX);
  const next = LEVELS[idx];
  if (next !== model.value) {
    model.value = next;
  }
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return;
  isDragging.value = true;
  const target = e.target as HTMLElement;
  target.setPointerCapture?.(e.pointerId);
  setLevelFromClientX(e.clientX);

  const onMove = (ev: PointerEvent) => {
    if (!isDragging.value) return;
    setLevelFromClientX(ev.clientX);
  };

  const onUp = (ev: PointerEvent) => {
    isDragging.value = false;
    const upTarget = ev.target as HTMLElement;
    upTarget?.releasePointerCapture?.(ev.pointerId);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
}
</script>

<template>
  <div class="flex flex-col space-y-2">
    <!-- Label "Level — {Name}" -->
    <p class="text-sm">
      <span class="text-app-label">Level —</span>
      <span :class="['font-medium ml-1', colors.text]">{{ model }}</span>
    </p>

    <!-- Slider track -->
    <div
      ref="trackRef"
      :class="[
        'relative h-12 rounded-md overflow-hidden select-none',
        colors.track,
        props.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
      ]"
      @pointerdown="onPointerDown"
    >
      <!-- Tick marks: 4 gaps, render only if not adjacent to current block -->
      <div
        v-for="gap in 4"
        :key="`tick-${gap}`"
        v-show="gap - 1 !== currentIndex && gap !== currentIndex"
        :class="['absolute top-1/4 bottom-1/4 w-px', colors.tick]"
        :style="{ left: `${(gap / 5) * 100}%` }"
      />

      <!-- Colored block -->
      <div
        :class="['absolute top-0 bottom-0 transition-all duration-150', colors.block]"
        :style="{
          left: `${(currentIndex / 5) * 100}%`,
          width: `${100 / 5}%`,
        }"
      />
    </div>
  </div>
</template>

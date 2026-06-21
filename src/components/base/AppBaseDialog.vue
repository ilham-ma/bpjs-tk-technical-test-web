<script lang="ts" setup>
import { onBeforeUnmount, onMounted, useSlots, watch } from "vue";
import IconClose from "../icon/IconClose.vue";

export interface AppBaseDialogProps {
  visible: boolean;
  header?: string;
  width?: string;
}

const props = withDefaults(defineProps<AppBaseDialogProps>(), {
  header: "",
  width: "28rem",
});

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "hide"): void;
}>();

const slots = useSlots();

function close() {
  if (!props.visible) return;
  emit("update:visible", false);
  emit("hide");
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.visible) {
    close();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
  document.body.style.overflow = "";
});

watch(
  () => props.visible,
  (val) => {
    document.body.style.overflow = val ? "hidden" : "";
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="props.visible"
        class="fixed inset-0 z-1000 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/50" @click="close"></div>

        <div
          class="relative flex flex-col bg-white rounded-lg shadow-xl max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
          :style="{ width: props.width }"
          role="dialog"
          aria-modal="true"
        >
          <header
            class="flex items-center justify-between px-5 py-4 border-b border-gray-200"
          >
            <h2 class="text-lg font-semibold text-gray-900">
              {{ props.header }}
            </h2>
            <button
              type="button"
              class="flex items-center justify-center w-8 h-8 rounded cursor-pointer hover:bg-gray-100"
              aria-label="Close"
              @click="close"
            >
              <IconClose />
            </button>
          </header>

          <div class="px-5 py-4 overflow-auto">
            <slot />
          </div>

          <footer
            v-if="slots.footer"
            class="px-5 py-4 border-t border-gray-200"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>

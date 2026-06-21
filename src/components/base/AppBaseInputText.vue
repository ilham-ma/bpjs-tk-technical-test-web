<script lang="ts" setup>
import { computed, watch } from "vue";

export type AppBaseInputTextType = "NUMBER" | "TEXT";
export interface AppBaseInputTextProps {
  isError?: boolean;
  type?: AppBaseInputTextType;
  maxLength?: number;
  placeholder?: string;
}
const props = withDefaults(defineProps<AppBaseInputTextProps>(), {
  type: "TEXT",
  placeholder: "",
});

const model = defineModel<string | undefined>({ default: "" });

const effectiveMaxLength = computed(() => {
  const m = props.maxLength;
  if (typeof m !== "number") return undefined;
  if (!Number.isFinite(m)) return undefined;
  if (m <= 0) return undefined;
  return m;
});

function onBeforeInput(event: InputEvent) {
  if (props.type !== "NUMBER") return;
  if (event.data !== null && !/^\d+$/.test(event.data)) {
    event.preventDefault();
  }
}

watch(model, (val) => {
  if (typeof val !== "string") return;
  let sanitized = val;
  if (props.type === "NUMBER") {
    sanitized = sanitized.replace(/\D/g, "");
  }
  const max = effectiveMaxLength.value;
  if (max !== undefined && sanitized.length > max) {
    sanitized = sanitized.slice(0, max);
  }
  if (sanitized !== val) {
    model.value = sanitized;
  }
});
</script>

<template>
  <input
    v-model="model"
    type="text"
    :placeholder="props.placeholder"
    :maxlength="effectiveMaxLength"
    class="outline-none p-3 rounded"
    :class="[
      props.isError
        ? 'bg-red-100 text-red-500'
        : 'bg-app-field-backgroud text-app-black',
    ]"
    @beforeinput="onBeforeInput"
  />
</template>

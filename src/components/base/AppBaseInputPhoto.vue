<script lang="ts" setup>
import { computed, useTemplateRef } from "vue";
import { useToast } from "primevue/usetoast";

export interface AppBaseInputPhotoProps {
  id: string;
  disabled?: boolean;
}
const props = defineProps<AppBaseInputPhotoProps>();

const input = useTemplateRef<HTMLInputElement>("input");
const toast = useToast();

const model = defineModel<File | undefined>();

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function clickUpload() {
  input.value?.click();
}

function changeInput(ev: Event) {
  const target = ev.target as HTMLInputElement;
  const files = target.files;

  if (!files?.length) return;

  const file = files[0];

  if (file.size > MAX_SIZE_BYTES) {
    toast.add({
      severity: "error",
      summary: "File Too Large",
      detail: "Photo must not exceed 2MB. Please choose a smaller file.",
      life: 4000,
    });
    target.value = "";
    return;
  }

  model.value = file;
}

const previewUrl = computed<string>(() => {
  if (!model.value) return "";
  const url = URL.createObjectURL(model.value);

  return url;
});
</script>

<template>
  <section class="flex items-center gap-3">
    <img
      v-if="model"
      :src="previewUrl"
      class="size-16 rounded"
      alt="upload-photo"
    />
    <div
      v-else
      class="bg-app-field-backgroud flex items-center justify-center p-3 size-16 rounded"
    >
      <i class="pi pi-user text-app-label!" :style="{ fontSize: '1.5rem' }"></i>
    </div>

    <button
      :class="[
        props.disabled
          ? 'cursor-not-allowed text-app-label'
          : 'cursor-pointer text-app-blue',
      ]"
      @click="clickUpload"
    >
      Upload photo
    </button>

    <input
      ref="input"
      :id="props.id"
      type="file"
      hidden
      accept="image/*"
      @change="changeInput"
    />
  </section>
</template>

<script lang="ts" setup></script>

<template>
  <div class="px-10 py-12 space-y-5 animate-pulse">
    <div class="h-8 w-56 bg-gray-200 rounded"></div>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
      <div v-for="i in 14" :key="`field-${i}`" class="flex flex-col gap-2">
        <div class="h-4 w-32 bg-gray-200 rounded"></div>
        <div class="h-12 w-full bg-gray-200 rounded"></div>
      </div>

      <div
        v-for="i in 4"
        :key="`block-${i}`"
        class="col-span-1 md:col-span-2 flex flex-col gap-3"
      >
        <div class="flex flex-col space-y-2">
          <div class="h-6 w-48 bg-gray-200 rounded"></div>
          <div class="h-4 w-full max-w-2xl bg-gray-200 rounded"></div>
          <div class="h-4 w-3/4 max-w-xl bg-gray-200 rounded"></div>
        </div>
        <div class="h-40 w-full bg-gray-200 rounded"></div>
      </div>
    </section>

    <div class="h-12 w-full bg-gray-200 rounded mt-10"></div>
  </div>
</template>

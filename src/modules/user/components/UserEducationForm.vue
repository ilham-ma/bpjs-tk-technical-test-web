<script lang="ts" setup>
import AppBaseAccordion from "@/components/base/AppBaseAccordion.vue";
import AppBaseEditor from "@/components/base/AppBaseEditor.vue";
import AppBaseInputDate from "@/components/base/AppBaseInputDate.vue";
import AppBaseInputText from "@/components/base/AppBaseInputText.vue";
import AppCommonFormGroup from "@/components/common/AppCommonFormGroup.vue";
import IconAdd from "@/components/icon/IconAdd.vue";
import dayjs from "dayjs";
import type { UserEducation } from "../interfaces/userEducation.interface";

export interface UserEducationFormProps {
  isError?: boolean;
  errorFor?: (index: number, field: string) => string;
}

const props = defineProps<UserEducationFormProps>();

function getError(index: number, field: string): string {
  return props.errorFor ? props.errorFor(index, field) : "";
}

const model = defineModel<Partial<UserEducation>[]>({ default: () => [] });

function formatDate(date: string): string {
  return dayjs(date, "YYYY-MM").format("MMM YYYY");
}

const maxMonth = dayjs().format("YYYY-MM");

function clickAddButton() {
  model.value = [
    ...model.value,
    {
      school: undefined,
      degree: undefined,
      city: undefined,
      description: undefined,
      startDate: undefined,
    },
  ];
}
</script>

<template>
  <section class="space-y-8">
    <div class="space-y-3">
      <AppBaseAccordion v-for="(item, index) in model" :key="index">
        <template #header>
          <span v-if="item.school && item.startDate">
            <h6 class="font-bold text-base text-app-black">
              {{ item.school }}
            </h6>

            <span class="flex items-center space-x-2">
              <p class="text-app-label">{{ formatDate(item.startDate) }}</p>
              <p class="text-app-label">-</p>
              <p class="text-app-label">
                {{ item.endDate ? formatDate(item.endDate) : "Now" }}
              </p>
            </span>
          </span>

          <h6 v-else class="font-bold text-base text-app-black">
            (Not Specified)
          </h6>
        </template>
        <div class="space-y-3">
          <section class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AppCommonFormGroup
              :id="`school-${index}`"
              v-slot="attrs"
              label="School"
              :error-message="getError(index, 'school')"
            >
              <AppBaseInputText v-bind="attrs" v-model="item.school" />
            </AppCommonFormGroup>

            <AppCommonFormGroup
              :id="`degree-${index}`"
              v-slot="attrs"
              label="Degree"
              :error-message="getError(index, 'degree')"
            >
              <AppBaseInputText v-bind="attrs" v-model="item.degree" />
            </AppCommonFormGroup>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="grid grid-cols-2 gap-3 items-end">
              <AppCommonFormGroup
                :id="`start-date-${index}`"
                v-slot="attrs"
                label="Start & End Date"
                :error-message="getError(index, 'startDate')"
              >
                <AppBaseInputDate
                  v-model="item.startDate"
                  v-bind="attrs"
                  placeholder="MM/YYYY"
                  format="MM/YYYY"
                  without-date
                  :max-date="maxMonth"
                />
              </AppCommonFormGroup>

              <AppCommonFormGroup :id="`end-date-${index}`" v-slot="attrs">
                <AppBaseInputDate
                  v-model="item.endDate"
                  v-bind="attrs"
                  placeholder="MM/YYYY"
                  format="MM/YYYY"
                  without-date
                  :max-date="maxMonth"
                />
              </AppCommonFormGroup>
            </div>

            <AppCommonFormGroup
              :id="`city-${index}`"
              v-slot="attrs"
              label="City"
              :error-message="getError(index, 'city')"
            >
              <AppBaseInputText v-bind="attrs" v-model="item.city" />
            </AppCommonFormGroup>
          </section>

          <AppCommonFormGroup
            :id="`description-${index}`"
            v-slot="attrs"
            :error-message="getError(index, 'description')"
          >
            <AppBaseEditor
              v-bind="attrs"
              v-model="item.description"
              using-counter
              placeholder="e.g. Graduated with honors. Specialized in advanced mathematics."
            />
          </AppCommonFormGroup>
        </div>
      </AppBaseAccordion>
    </div>

    <button
      type="button"
      class="flex items-center space-x-1 cursor-pointer"
      :class="props.isError ? 'text-red-500' : 'text-app-blue'"
      @click="clickAddButton"
    >
      <IconAdd color="currentColor" />
      <span>Add one more education</span>
    </button>
  </section>
</template>

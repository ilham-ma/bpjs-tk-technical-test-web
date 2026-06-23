<script lang="ts" setup>
import AppBaseAccordion from "@/components/base/AppBaseAccordion.vue";
import AppBaseEditor from "@/components/base/AppBaseEditor.vue";
import AppBaseInputDate from "@/components/base/AppBaseInputDate.vue";
import AppBaseInputText from "@/components/base/AppBaseInputText.vue";
import AppCommonFormGroup from "@/components/common/AppCommonFormGroup.vue";
import IconAdd from "@/components/icon/IconAdd.vue";
import type { EmploymentHistory } from "@/shared/types/employmentHistory.type";
import dayjs from "dayjs";
import type { UserEmploymentHistory } from "../interfaces/userEmploymentHistory.interface";

export interface UserEmploymentHistoryFormProps {
  isError?: boolean;
  errorFor?: (index: number, field: string) => string;
}

const props = defineProps<UserEmploymentHistoryFormProps>();

function getError(index: number, field: string): string {
  return props.errorFor ? props.errorFor(index, field) : "";
}

const model = defineModel<Partial<UserEmploymentHistory>[]>({
  default: () => [],
});

function formatDate(date: string): string {
  return dayjs(date, "YYYY-MM").format("MMM YYYY");
}

const maxMonth = dayjs().format("YYYY-MM");

function clickAddButton() {
  model.value = [
    ...model.value,
    {
      jobTitle: undefined,
      employer: undefined,
      city: undefined,
      description: undefined,
      startDate: undefined,
      endDate: null,
    },
  ];
}
</script>

<template>
  <section class="space-y-8">
    <div class="space-y-3">
      <AppBaseAccordion v-for="(item, index) in model" :key="index">
        <template #header>
          <span v-if="item.jobTitle && item.startDate">
            <h6 class="font-bold text-base text-app-black">
              {{ item.jobTitle }}
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
              :id="`job-title-${index}`"
              v-slot="attrs"
              label="Job Title"
              :error-message="getError(index, 'jobTitle')"
            >
              <AppBaseInputText v-bind="attrs" v-model="item.jobTitle" />
            </AppCommonFormGroup>

            <AppCommonFormGroup
              :id="`employer-${index}`"
              v-slot="attrs"
              label="Employer"
              :error-message="getError(index, 'employer')"
            >
              <AppBaseInputText v-bind="attrs" v-model="item.employer" />
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
              placeholder="e.g. Created and implemented lesson plans based on child-led interests and curiosities."
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
      <span>Add one more employment</span>
    </button>
  </section>
</template>

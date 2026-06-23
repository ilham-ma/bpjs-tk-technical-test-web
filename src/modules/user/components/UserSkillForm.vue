<script lang="ts" setup>
import AppBaseAccordion from "@/components/base/AppBaseAccordion.vue";
import AppBaseInputText from "@/components/base/AppBaseInputText.vue";
import AppCommonFormGroup from "@/components/common/AppCommonFormGroup.vue";
import IconAdd from "@/components/icon/IconAdd.vue";
import UserSkillSlider from "./UserSkillSlider.vue";
import { SkillLevelEnum } from "@/shared/enums/skillLevel.enum";
import type { UserSkill } from "../interfaces/userSkill.interface.ts";

export interface UserEducationFormProps {
  isError?: boolean;
  isNotUsingLevel?: boolean;
  errorFor?: (index: number, field: string) => string;
}

const props = defineProps<UserEducationFormProps>();

function getError(index: number, field: string): string {
  return props.errorFor ? props.errorFor(index, field) : "";
}

const model = defineModel<Partial<UserSkill>[]>({ default: () => [] });

function clickAddButton() {
  model.value = [
    ...model.value,
    {
      id: "",
      name: "",
      level: SkillLevelEnum.Basic,
    },
  ];
}
</script>

<template>
  <section class="space-y-8">
    <div class="space-y-3">
      <AppBaseAccordion v-for="(item, index) in model" :key="index">
        <template #header>
          <span v-if="item.name && item.level">
            <h6 class="font-bold text-base text-app-black">
              {{ item.name }}
            </h6>

            <p v-if="!props.isNotUsingLevel" class="text-app-label">
              {{ item.level }}
            </p>
          </span>

          <h6 v-else class="font-bold text-base text-app-black">
            (Not Specified)
          </h6>
        </template>
        <div class="space-y-3">
          <section class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AppCommonFormGroup
              :id="`skill-${index}`"
              v-slot="attrs"
              label="Skill"
              :error-message="getError(index, 'skill')"
            >
              <AppBaseInputText v-bind="attrs" v-model="item.name" />
            </AppCommonFormGroup>

            <AppCommonFormGroup
              :id="`level-${index}`"
              v-slot="attrs"
              :error-message="getError(index, 'level')"
            >
              <UserSkillSlider v-bind="attrs" v-model="item.level" />
            </AppCommonFormGroup>
          </section>
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
      <span>Add one more skill</span>
    </button>
  </section>
</template>

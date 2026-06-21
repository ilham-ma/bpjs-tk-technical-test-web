<script setup lang="ts">
import AppBaseEditor from "@/components/base/AppBaseEditor.vue";
import AppBaseInputDate from "@/components/base/AppBaseInputDate.vue";
import AppBaseInputPhoto from "@/components/base/AppBaseInputPhoto.vue";
import AppBaseInputText from "@/components/base/AppBaseInputText.vue";
import AppCommonChipInputDialog from "@/components/common/AppCommonChipInputDialog.vue";
import AppCommonFormGroup from "@/components/common/AppCommonFormGroup.vue";
import { ref } from "vue";

const file = ref<File | undefined>();
const dateOfBirth = ref<Date | null>(null);

const employments = ref<string[]>([]);
</script>

<template>
  <div class="px-10 py-12 space-y-5">
    <h4 class="font-bold text-app-black text-2xl">Personal Details</h4>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
      <AppCommonFormGroup
        id="title"
        v-slot="attrs"
        label="Wanted Job Title"
        tooltip="hello world"
      >
        <AppBaseInputText v-bind="attrs" />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="photo" v-slot="attrs">
        <AppBaseInputPhoto id="photo" v-bind="attrs" v-model="file" />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="first-name" v-slot="attrs" label="First Name">
        <AppBaseInputText v-bind="attrs" />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="last-name" v-slot="attrs" label="Last Name">
        <AppBaseInputText v-bind="attrs" />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="email" v-slot="attrs" label="Email">
        <AppBaseInputText v-bind="attrs" />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="phone" v-slot="attrs" label="Phone">
        <AppBaseInputText v-bind="attrs" type="NUMBER" />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="country" v-slot="attrs" label="Country">
        <AppBaseInputText v-bind="attrs" />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="city" v-slot="attrs" label="City">
        <AppBaseInputText v-bind="attrs" />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="address" v-slot="attrs" label="Address">
        <AppBaseInputText v-bind="attrs" />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="postal-code" v-slot="attrs" label="Postal Code">
        <AppBaseInputText v-bind="attrs" type="NUMBER" :max-length="5" />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="driving-license"
        v-slot="attrs"
        label="Driver License"
        tooltip="hello world"
      >
        <AppBaseInputText v-bind="attrs" />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="nationality"
        v-slot="attrs"
        label="Nationality"
        tooltip="hello world"
      >
        <AppBaseInputText v-bind="attrs" />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="place-of-birth"
        v-slot="attrs"
        label="Place Of Birth"
        tooltip="hello world"
      >
        <AppBaseInputText v-bind="attrs" />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="date-of-birth"
        v-slot="attrs"
        label="Date Of Birth"
        tooltip="hello world"
      >
        <AppBaseInputDate
          v-model="dateOfBirth"
          v-bind="attrs"
          placeholder="DD/MM/YYYY"
          :max-date="new Date()"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="professional-summary"
        v-slot="attrs"
        class="col-span-2"
      >
        <header class="flex flex-col space-y-1">
          <h5 class="font-bold text-xl text-app-black">Professional Summary</h5>
          <p class="text-app-label">
            Write 2-4 short & energetic sentences to interest the reader!
            Mention your role, experience & most importantly - your biggest
            achievements, best qualities and skills.
          </p>
        </header>

        <AppBaseEditor
          v-bind="attrs"
          placeholder="e.g. Passionate science teacher with 8+ years of experience and a track record of ..."
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup
        id="employment-history"
        v-slot="attrs"
        class="col-span-2"
      >
        <header class="flex flex-col space-y-1">
          <h5 class="font-bold text-xl text-app-black">Employment History</h5>
          <p class="text-app-label">
            Show your relevant experience (last 10 years). Use bullet points to
            note your achievements, if possible - use numbers/facts (Achieved X,
            measured by Y, by doing Z).
          </p>
        </header>

        <AppCommonChipInputDialog
          v-bind="attrs"
          v-model="employments"
          label="Add Employment"
          :options="[]"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="education" v-slot="attrs" class="col-span-2">
        <header class="flex flex-col space-y-1">
          <h5 class="font-bold text-xl text-app-black">Education</h5>
          <p class="text-app-label">
            A varied education on your resume sums up the value that your
            learnings and background will bring to job.
          </p>
        </header>

        <AppCommonChipInputDialog
          v-bind="attrs"
          v-model="employments"
          label="Add Employment"
          :options="[]"
        />
      </AppCommonFormGroup>

      <AppCommonFormGroup id="skill" v-slot="attrs" class="col-span-2">
        <header class="flex flex-col space-y-1">
          <h5 class="font-bold text-xl text-app-black">Skills</h5>
          <p class="text-app-label">
            Choose 5 of the most important skills to show your talents! Make
            sure they match the keywords of the job listing if applying via an
            online system.
          </p>
        </header>

        <AppCommonChipInputDialog
          v-bind="attrs"
          v-model="employments"
          label="Add Employment"
          :options="[]"
        />
      </AppCommonFormGroup>
    </section>
  </div>
</template>

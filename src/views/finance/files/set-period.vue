<template>
  <MainLayout>
    <h1 class="text-2xl font-bold text-primary mb-4">Change Current Day</h1>

    <div class="flex gap-4">
      <!-- Year Dropdown -->
      <div class="flex gap-2 items-center">
        <label class="block w-16" for="">Year:</label>
        <a-select
          class="w-64"
          v-model:value="selectedYear"
          :options="yearOptions"
          placeholder="Select Year"
        />
      </div>

      <!-- Month Dropdown -->
      <div class="flex gap-2 items-center">
        <label class="block w-16" for="">Month:</label>
        <a-select
          class="w-64"
          v-model:value="selectedMonth"
          :options="monthOptions"
          placeholder="Select Month"
        />
      </div>

      <!-- Ok Button -->
      <div>
        <a-button type="primary" @click="handleOk"> Set Period</a-button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: "overview" });
};

const selectedYear = ref();
const selectedMonth = ref();

// Generate options for the Year (2025-2030, for example)
const yearOptions = [
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
  { label: "2030", value: "2030" },
];

// Generate options for the Month (January - December)
const monthOptions = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

// Handle the OK button click event
const handleOk = () => {
  console.log(
    `Selected Year: ${selectedYear.value}, Selected Month: ${selectedMonth.value}`
  );
};
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

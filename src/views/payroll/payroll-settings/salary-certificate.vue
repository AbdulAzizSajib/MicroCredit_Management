<template>
  <PayrollLayout>
 
    <h1 class="text-2xl font-bold text-primary mb-4"> Salary Certificate (0)</h1>
    <div class="flex justify-between">


    </div>

    <div class="flex justify-between gap-2 mb-4">
      <div>
        <div class="mt-6">
          <a-input placeholder="Search here..." />
        </div>
      </div>
      <div class="flex gap-4">
        <div>
          <label for="">From</label>
          <a-date-picker class="w-full" placeholder="Select Date" />
        </div>
        <div>
          <label for="">To</label>
          <a-date-picker class="w-full" placeholder="Select Date" />
        </div>
      </div>
      <div></div>
    </div>
    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Employee Code</th>
          <th class="border border-white px-4 py-2">Name</th>
          <th class="border border-white px-4 py-2">Designation</th>
          <th class="border border-white px-4 py-2">Department</th>
          <th class="border border-white px-4 py-2">Income Tax</th>
          <th class="border border-white px-4 py-2">CPF</th>
          <th class="border border-white px-4 py-2">Loan / Advance</th>
          <th class="border border-white px-4 py-2">Others</th>
          <th class="border border-white px-4 py-2">Total Deduction</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr>
          <td class="px-4 border">EMP001</td>
          <td class="px-4 border">John Doe</td>
          <td class="px-4 border">Software Engineer</td>
          <td class="px-4 border">IT Department</td>
          <td class="px-4 border w-32 text-end">500</td>
          <td class="px-4 border w-32 text-end">200</td>
          <td class="px-4 border w-32 text-end">100</td>
          <td class="px-4 border w-32 text-end">50</td>
          <td class="px-4 border w-32 text-end">850</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3 my-2">
              <button class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-primary">View</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>



  </PayrollLayout>
</template>

<script setup>
import { ref } from 'vue';
import PayrollLayout from '@/components/layouts/PayrollLayout.vue';

import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: 'overview' });
};
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>
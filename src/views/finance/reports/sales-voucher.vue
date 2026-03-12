<template>
  <MainLayout>
    <h1 class="text-2xl font-bold text-indigo-700 mb-6">Sales Voucher</h1>

    <div class="bg-white shadow-md rounded-xl p-6">
      <!-- Grid: Left (Dates) and Right (Business + Buttons) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <!-- Date Column -->
        <div class="flex flex-col gap-2">
          <!-- Date From -->
          <div class="flex flex-col md:flex-row md:items-center gap-1">
            <label for="dateFrom" class="font-semibold text-gray-700 md:w-24">
              Date From:
            </label>
            <a-date-picker
              id="dateFrom"
              class="w-full"
              placeholder="Select Date From"
              :format="dateFormat"
            />
          </div>
          <!-- Date To -->
          <div class="flex flex-col md:flex-row md:items-center gap-1">
            <label for="dateTo" class="font-semibold text-gray-700 md:w-24">
              Date To:
            </label>
            <a-date-picker
              id="dateTo"
              class="w-full"
              placeholder="Select Date To"
              :format="dateFormat"
            />
          </div>
        </div>
        <!-- Right Section: Business + Buttons -->
        <div
          class="col-span-1 md:col-span-2 flex flex-col md:flex-row md:items-start md:gap-4"
        >
          <!-- Business Section -->
          <div
            class="flex flex-col md:flex-row md:items-center md:gap-2 border border-gray-300 rounded-lg p-4 flex-1"
          >
            <label class="font-semibold text-gray-700 md:w-24 mb-2"> Customer: </label>
            <a-select class="w-full md:w-48 flex-1" placeholder="Select Business" />
            <a-radio-group class="flex flex-wrap gap-2 mt-2 md:mt-0 md:ml-4 items-center">
              <a-radio value="sales">Sales</a-radio>
              <a-radio value="credit">Credit</a-radio>
            </a-radio-group>
            <a-button type="primary">Show</a-button>
          </div>
          <!-- Save & Close Buttons -->
          <div class="flex gap-2 mt-4 items-center">
            <a-button type="primary">Save</a-button>
            <a-button
              type=""
              class="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 items-center"
              >Close</a-button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- table -->
    <table class="w-full border border-collapse text-left mt-5">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">SL</th>
          <th class="border border-white px-4 py-2">A/C Code</th>
          <th class="border border-white px-4 py-2">ASCode</th>
          <th class="border border-white px-4 py-2">Description</th>
          <th class="border border-white px-4 py-2">Debit</th>
          <th class="border border-white px-4 py-2">Credit</th>
        </tr>
      </thead>

      <tbody class="capitalize">
        <tr>
          <td class="px-4 border">1</td>
          <td class="px-4 border">2</td>
          <td class="px-4 border">3</td>
          <td class="px-4 border">4</td>
          <td class="px-4 border">5</td>
          <td class="px-4 border">6</td>
        </tr>
      </tbody>
    </table>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
const dateFormat = "YYYY-MM-DD";
</script>

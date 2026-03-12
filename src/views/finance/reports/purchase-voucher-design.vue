<template>
  <MainLayout>
    <h1 class="text-2xl font-bold text-indigo-700 mb-6">Purchase Voucher</h1>

    <div class="bg-white shadow-md rounded-xl p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <!-- Date Column -->
        <div class="flex flex-col gap-2">
          <div class="flex flex-col md:flex-row md:items-center gap-1">
            <label class="font-semibold text-gray-700 md:w-24"> Date From: </label>
            <a-date-picker class="w-full" :format="dateFormat" />
          </div>

          <div class="flex flex-col md:flex-row md:items-center gap-1">
            <label class="font-semibold text-gray-700 md:w-24"> Date To: </label>
            <a-date-picker class="w-full" :format="dateFormat" />
          </div>
        </div>

        <!-- Supplier / Select / Show -->
        <div class="col-span-1 md:col-span-2">
          <div
            class="flex flex-col md:flex-row md:items-center md:gap-2 border border-gray-300 rounded-lg p-4"
          >
            <label class="font-semibold text-gray-700 md:w-24 mb-2"> Supplier: </label>
            <a-select class="flex-1" placeholder="Select Business" />

            <label class="font-semibold text-gray-700 md:w-24 mb-2"> Select: </label>
            <a-select class="flex-1" placeholder="Select Type">
              <a-select-option value="local">Local</a-select-option>
              <a-select-option value="global">Global</a-select-option>
            </a-select>

            <a-button type="primary">Show</a-button>
          </div>
        </div>
        <div class="flex gap-3 mt-4 items-start">
          <a-button type="primary" class="w-32"> Save </a-button>
          <a-button class="w-32 bg-red-600 text-white hover:bg-red-700"> Close </a-button>
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

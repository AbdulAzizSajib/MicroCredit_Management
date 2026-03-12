<template>
  <MainLayout>
    <h1 class="text-2xl font-bold text-indigo-700 mb-6">Bill Receive</h1>

    <div class="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
      <div class="flex items-center gap-x-1 whitespace-nowrap">
        <!-- Bill Forward By -->
        <label for="" class="text-gray-700 font-medium"> Bill Forward By : </label>
        <select
          id=""
          class="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-52"
        >
          <option value="" disabled selected>Select a person</option>
        </select>

        <a-button type="primary"> Load Data </a-button>

        <!-- ACI Ref No -->
        <label for="aciRefNo" class="text-gray-700 font-medium ml-2">
          ACI Ref No :
        </label>
        <input
          id=""
          type="text"
          placeholder="Enter reference no"
          class="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-40"
        />

        <!-- Action Buttons -->
        <a-button type="primary"> Receive </a-button>
        <a-button type="primary"> Return </a-button>
        <a-button type="primary"> Select All </a-button>
        <a-button type="primary"> Clear </a-button>
        <a-button
          class="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 items-center"
        >
          Close
        </a-button>
      </div>
    </div>

    <!-- table  -->
    <table class="w-full border border-collapse text-left mt-5">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">SL</th>
          <th class="border border-white px-4 py-2">ACI Bill Dt.</th>
          <th class="border border-white px-4 py-2">Business</th>
          <th class="border border-white px-4 py-2">Suppiler ID</th>
          <th class="border border-white px-4 py-2">Suppiler Name</th>
          <th class="border border-white px-4 py-2">GL ID</th>
          <th class="border border-white px-4 py-2">Bill No</th>
          <th class="border border-white px-4 py-2">Bill Date</th>
          <th class="border border-white px-4 py-2">Amount</th>
          <th class="border border-white px-4 py-2">VAT</th>
          <th class="border border-white px-4 py-2">Discount</th>
          <th class="border border-white px-4 py-2">Bill Amount</th>
          <th class="border border-white px-4 py-2">Select</th>
          <th class="border border-white px-4 py-2">Remarks</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr>
          <td class="px-4 border">1</td>
          <td class="px-4 border">2</td>
          <td class="px-4 border">3</td>
          <td class="px-4 border">4</td>
          <td class="px-4 border">5</td>
          <td class="px-4 border">7</td>
          <td class="px-4 border">a</td>
          <td class="px-4 border">d</td>
          <td class="px-4 border">g</td>
          <td class="px-4 border">d</td>
          <td class="px-4 border">d</td>
          <td class="px-4 border">e</td>
          <td class="px-4 border">s</td>
          <td class="px-4 border">f</td>
        </tr>
      </tbody>
    </table>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
</script>

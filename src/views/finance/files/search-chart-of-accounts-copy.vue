<template>
  <MainLayout>
    <div>
      <h2 class="text-center font-bold text-primary py-8 text-xl">Search Chart of Accounts</h2>

      <div class="grid grid-cols-4 mb-4 gap-8">
        <a-input v-model="filterText" placeholder="Search" class="w-full" />
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto">
        <table class="w-full border border-collapse text-left">
          <thead>
            <tr class="bg-primary text-white">
              <th class="border border-white px-4 py-2">Account Details</th>
              <th class="border border-white px-4 py-2">Account Code</th>
            </tr>
          </thead>
          <tbody class="capitalize">
            <tr>
              <td class="px-4 border">001</td>
              <td class="px-4 border">Bills Payable</td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>

</template>

<script setup>
import MainLayout from '@/components/layouts/mainLayout.vue';


</script>

<style scoped></style>
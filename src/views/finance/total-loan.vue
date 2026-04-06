<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-indigo-700">Total Loan</h1>
        <a-button @click="$router.back()">Back</a-button>
      </div>

      <div class="text-right mb-3 flex justify-end items-center gap-2">
        <label class="font-semibold text-gray-700">Total Loan</label>
        <input
          type="text"
          class="w-32 border rounded-lg p-1 text-right bg-yellow-300 text-black font-bold"
          :value="totalLoan"
          readonly
        />
      </div>

      <div class="">
        <div v-if="loading" class="text-center py-10">
          <a-spin size="large" />
        </div>

        <table v-else class="w-full border border-collapse text-left">
          <thead>
            <tr class="bg-primary text-white">
              <th class="border border-white px-4 py-2">#</th>
              <th class="border border-white px-4 py-2">AM Code</th>
              <th class="border border-white px-4 py-2">AM Details</th>
              <th class="border border-white px-4 py-2">Member Code</th>
              <th class="border border-white px-4 py-2 text-right">Total Debit</th>
              <th class="border border-white px-4 py-2 text-right">Total Credit</th>
              <th class="border border-white px-4 py-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rows.length === 0">
              <td colspan="7" class="text-center py-4 text-gray-500">
                No data available.
              </td>
            </tr>
            <tr v-for="(item, index) in rows" :key="item.AMCode">
              <td class="px-4 border">{{ index + 1 }}</td>
              <td class="px-4 border">{{ item.AMCode }}</td>
              <td class="px-4 border">{{ item.AMDetails }}</td>
              <td class="px-4 border">{{ item.MemberCode }}</td>
              <td class="px-4 border text-right">{{ item.TotalDebit }}</td>
              <td class="px-4 border text-right">{{ item.TotalCredit }}</td>
              <td class="px-4 border text-right">{{ item.Balance }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";

const loading = ref(false);
const rows = ref([]);
const totalLoan = ref(0);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${apiBase}/dashboard/total-loan`, getToken());
    rows.value = res?.data?.data || [];
    totalLoan.value = res?.data?.total_loan ?? 0;
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to fetch total loan.");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<template>
  <MainLayout>
    <div class="bg-white rounded-xl p-6 space-y-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-primary mb-2">Summary</h1>

      <div v-if="loading" class="text-center py-8">
        <a-spin />
        <span class="ml-2 text-gray-500">Loading...</span>
      </div>

      <div v-else-if="summaryData" class="grid grid-cols-1 md:grid-cols-3 gap-7">
        <!-- Total Members -->
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-9 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-5">
            <div class="bg-purple-200/60 rounded-full p-5">
              <Icon icon="mdi:account-group-outline" class="text-purple-600 text-5xl" />
            </div>
            <div class="text-right flex-1">
              <div class="text-base font-semibold text-purple-500 uppercase tracking-wide">Total Members</div>
              <div class="text-3xl font-bold text-purple-700 mt-1">{{ summaryData.allMemberCount }}</div>
            </div>
          </div>
        </div>

        <!-- Loan Members -->
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-9 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-5">
            <div class="bg-indigo-200/60 rounded-full p-5">
              <Icon icon="mdi:account-cash-outline" class="text-indigo-600 text-5xl" />
            </div>
            <div class="text-right flex-1">
              <div class="text-base font-semibold text-indigo-500 uppercase tracking-wide">Loan Members</div>
              <div class="text-3xl font-bold text-indigo-700 mt-1">{{ summaryData.loanMemberCount }}</div>
            </div>
          </div>
        </div>

        <!-- Total Saving -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-9 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-5">
            <div class="bg-green-200/60 rounded-full p-5">
              <Icon icon="mdi:piggy-bank-outline" class="text-green-600 text-5xl" />
            </div>
            <div class="text-right flex-1">
              <div class="text-base font-semibold text-green-500 uppercase tracking-wide">Total Saving</div>
              <div class="text-3xl font-bold text-green-700 mt-1">{{ formatAmount(Number(summaryData.totalSaving || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- Total Loan -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-9 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-5">
            <div class="bg-blue-200/60 rounded-full p-5">
              <Icon icon="mdi:bank-outline" class="text-blue-600 text-5xl" />
            </div>
            <div class="text-right flex-1">
              <div class="text-base font-semibold text-blue-500 uppercase tracking-wide">Total Loan</div>
              <div class="text-3xl font-bold text-blue-700 mt-1">{{ formatAmount(Number(summaryData.totalLoan || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- Total Earning -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-9 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-5">
            <div class="bg-amber-200/60 rounded-full p-5">
              <Icon icon="mdi:trending-up" class="text-amber-600 text-5xl" />
            </div>
            <div class="text-right flex-1">
              <div class="text-base font-semibold text-amber-500 uppercase tracking-wide">Total Earning</div>
              <div class="text-3xl font-bold text-amber-700 mt-1">{{ formatAmount(Number(summaryData.totalEarning || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- Remaining Balance -->
        <div class="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-9 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-5">
            <div class="bg-rose-200/60 rounded-full p-5">
              <Icon icon="mdi:wallet-outline" class="text-rose-600 text-5xl" />
            </div>
            <div class="text-right flex-1">
              <div class="text-base font-semibold text-rose-500 uppercase tracking-wide">Remaining Balance</div>
              <div class="text-3xl font-bold text-rose-700 mt-1">{{ formatAmount(Number(summaryData.remaingBalance || 0)) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">No summary data found.</div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";
import axios from "axios";

const summaryData = ref(null);
const loading = ref(false);

const fetchSummary = async () => {
  try {
    loading.value = true;
    const res = await axios.get(`${apiBase}/gl-summary`, getToken());
    if (res.data?.success && res.data.data?.length) {
      summaryData.value = res.data.data[0];
    }
  } catch (error) {
    console.log(error);
    showNotification("error", "Failed to fetch summary.");
  } finally {
    loading.value = false;
  }
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

onMounted(() => {
  fetchSummary();
});
</script>

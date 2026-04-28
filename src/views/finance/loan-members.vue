<template>
  <MainLayout>
    <div class="flex justify-end mb-4">
      <a-input :placeholder="$t('common.searchByName')" v-model:value="search"
        class="w-full sm:w-64" />
    </div>

    <div class="flex flex-wrap justify-between items-center mb-4 gap-2 mt-5" data-aos="fade-right">
      <h1 class="text-2xl font-bold text-primary">
        {{ $t('dashboard.loanMembers') }} ({{ filteredData.length }})
      </h1>
      <div v-if="showLoanVouchered" class="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-2 shadow-sm">
        <span class="text-xs font-semibold text-violet-500 uppercase tracking-wider">{{ $t('dashboard.totalLoanVouchered') }}</span>
        <span class="text-xl font-extrabold text-violet-700">{{ formatAmount(loanVoucheredSum) }}</span>
      </div>
      <div v-if="showLoanGiven" class="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-4 py-2 shadow-sm">
        <span class="text-xs font-semibold text-teal-500 uppercase tracking-wider">{{ $t('dashboard.totalLoanPosted') }}</span>
        <span class="text-xl font-extrabold text-teal-700">{{ formatAmount(loanAmountSum) }}</span>
      </div>
    </div>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[1100px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2 sticky left-0 bg-primary z-20">{{ $t('customer.customerName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('customer.customerBanglaName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('common.mobile') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('loan.installment') }}</th>
            <th class="border border-white px-4 py-2 text-center">{{ $t('loan.installmentNumber') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('loan.loanAmount') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('loan.totalLoanVoucherable') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('customer.voucheredAmount') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('customer.dueVoucher') }}</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-for="(item, index) in filteredData" :key="index">
            <td class="px-4 border sticky left-0 bg-white z-10">
              {{ item?.CustomerName || item?.AMDetails }}
              <span v-if="item?.MemberCode" class="ml-1 text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">{{ item?.MemberCode }}</span>
            </td>
            <td class="px-4 border">{{ item?.CustomerBanglaName }}</td>
            <td class="px-4 border">{{ item?.Mobile }}</td>
            <td class="px-4 border text-right">{{ item?.Installment != null ? formatAmount(Number(item.Installment)) : '' }}</td>
            <td class="px-4 border text-center">{{ item?.InstallmentNumber != null ? item.InstallmentNumber : '' }}</td>
            <td class="px-4 border text-right">{{ item?.LoanAmount != null ? formatAmount(Number(item.LoanAmount)) : '' }}</td>
            <td class="px-4 border text-right">{{ item?.TotalLoanPayable != null ? formatAmount(Number(item.TotalLoanPayable)) : '' }}</td>
            <td class="px-4 border text-right">{{ item?.VoucheredAmount != null ? formatAmount(Number(item.VoucheredAmount)) : '' }}</td>
            <td class="px-4 border text-right">{{ item?.DueAmount != null ? formatAmount(Number(item.DueAmount)) : '' }}</td>
          </tr>
          <tr v-if="!loading && !filteredData.length">
            <td colspan="9" class="px-4 py-6 border text-center text-gray-500">{{ $t('common.noData') }}</td>
          </tr>
          <tr v-if="loading">
            <td colspan="9" class="text-center py-8"><a-spin /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";
import axios from "axios";

const route = useRoute();
const showLoanVouchered = computed(() => !!route.query.showLoanVouchered);
const showLoanGiven = computed(() => !!route.query.showLoanGiven);

const data = ref([]);
const loading = ref(false);
const search = ref("");

const loanVoucheredSum = computed(() =>
  data.value.reduce((sum, item) => sum + (Number(item.VoucheredAmount) || 0), 0)
);

const loanAmountSum = computed(() =>
  data.value.reduce((sum, item) => sum + (Number(item.LoanAmount) || 0), 0)
);

const filteredData = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return data.value;
  return data.value.filter((item) => {
    const name = (item?.CustomerName || item?.AMDetails || "").toLowerCase();
    const banglaName = (item?.CustomerBanglaName || "").toLowerCase();
    const mobile = (item?.Mobile || "").toLowerCase();
    const code = (item?.MemberCode || "").toLowerCase();
    return name.includes(q) || banglaName.includes(q) || mobile.includes(q) || code.includes(q);
  });
});

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

const fetchLoanMembers = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${apiBase}/dashboard/loan-members`, getToken());
    if (res.data?.success) {
      data.value = Array.isArray(res.data.data) ? res.data.data : [];
    }
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to fetch loan members.");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLoanMembers);
</script>

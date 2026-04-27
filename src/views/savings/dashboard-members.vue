<template>
  <MainLayout>
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
      <a-button @click="$router.back()">{{ $t('common.back') }}</a-button>
      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
        <a-input :placeholder="$t('common.searchByName')" v-model:value="search" @input="handleSearch"
          class="w-full sm:w-64" />
        <a-range-picker v-model:value="dateRange" value-format="YYYY-MM-DD" format="DD-MMM-YYYY"
          class="w-full sm:w-auto" @change="handleDateChange" />
      </div>
    </div>

    <div class="flex flex-wrap justify-between items-center mb-4 gap-2 mt-5" data-aos="fade-right">
      <h1 class="text-2xl font-bold text-primary">
        {{ $t('customer.savingsMembers') }} ({{ allData.length }})
      </h1>
    </div>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[900px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2 sticky left-0 bg-primary z-20">{{ $t('customer.customerName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('customer.customerBanglaName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('common.mobile') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('loan.installment') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('customer.totalSavingsVoucherable') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('customer.voucheredAmount') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('customer.dueVoucher') }}</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-if="loading">
            <td colspan="7" class="text-center py-8"><a-spin /></td>
          </tr>
          <template v-else>
            <tr v-for="(data, index) in allData" :key="index">
              <td class="px-4 border sticky left-0 bg-white z-10">
                {{ data?.CustomerName }}
                <span v-if="data?.MemberCode" class="ml-1 text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">{{ data?.MemberCode }}</span>
              </td>
              <td class="px-4 border">{{ data?.CustomerBanglaName }}</td>
              <td class="px-4 border">{{ data?.Mobile }}</td>
              <td class="px-4 border text-right">{{ data?.Installment != null ? formatAmount(Number(data.Installment)) : '' }}</td>
              <td class="px-4 border text-right">{{ data?.TotalSavingsVoucherable != null ? formatAmount(Number(data.TotalSavingsVoucherable)) : '' }}</td>
              <td class="px-4 border text-right">{{ data?.VoucheredAmount != null ? formatAmount(Number(data.VoucheredAmount)) : '' }}</td>
              <td class="px-4 border text-right">{{ data?.DueVoucher != null ? formatAmount(Number(data.DueVoucher)) : '' }}</td>
            </tr>
            <tr v-if="!loading && !allData.length">
              <td colspan="7" class="px-4 py-6 border text-center text-gray-500">{{ $t('common.noData') }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";

const route = useRoute();
const router = useRouter();

const toYmd = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const now = new Date();
const defaultTo = toYmd(new Date(now.getFullYear(), now.getMonth() + 1, 0));

const dateRange = ref([
  route.query.from_date || "2024-07-01",
  route.query.to_date || defaultTo,
]);
const search = ref(route.query.search || "");

const allData = ref([]);
const loading = ref(false);

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

const fetchData = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (dateRange.value?.[0]) params.append("from_date", dateRange.value[0]);
    if (dateRange.value?.[1]) params.append("to_date", dateRange.value[1]);
    if (search.value?.trim()) params.append("search", search.value.trim());
    const res = await axios.get(`${apiBase}/dashboard/members?${params.toString()}`, getToken());
    allData.value = Array.isArray(res?.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to fetch members.");
  } finally {
    loading.value = false;
  }
};

const syncQuery = () => {
  router.replace({
    query: {
      from_date: dateRange.value?.[0],
      to_date: dateRange.value?.[1],
      ...(search.value?.trim() ? { search: search.value.trim() } : {}),
    },
  });
};

const handleDateChange = () => {
  syncQuery();
  fetchData();
};

let searchTimer = null;
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    syncQuery();
    fetchData();
  }, 350);
};

onMounted(fetchData);
</script>

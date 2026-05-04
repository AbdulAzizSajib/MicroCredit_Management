<template>
  <MainLayout>
    <div class="flex justify-end mb-4">
      <a-input :placeholder="$t('common.searchByName')" v-model:value="search" @input="handleSearch"
        class="w-full sm:w-64" />
    </div>

    <div class="flex flex-wrap justify-between items-center mb-4 gap-2 mt-5" data-aos="fade-right">
      <h1 class="text-2xl font-bold text-primary">
        {{ $t('customer.savingsMembers') }} ({{ total }})
      </h1>
      <div v-if="showVoucherTotal" class="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2 shadow-sm">
        <span class="text-xs font-semibold text-green-500 uppercase tracking-wider">{{ $t('dashboard.totalSavingsVouchered') }}</span>
        <span class="text-xl font-extrabold text-green-700">{{ formatAmount(voucheredTotalSum) }}</span>
      </div>

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
                <span v-if="data?.CustomerCode" class="ml-1 text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">{{ data?.CustomerCode }}</span>
              </td>
              <td class="px-4 border">{{ data?.CustomerBanglaName }}</td>
              <td class="px-4 border">{{ data?.Mobile }}</td>
              <td class="px-4 border text-right">{{ data?.SavingAmount != null ? formatAmount(Number(data.SavingAmount)) : '' }}</td>
              <td class="px-4 border text-right">{{ data?.TotalSavingsPayable != null ? formatAmount(Number(data.TotalSavingsPayable)) : '' }}</td>
              <td class="px-4 border text-right">{{ data?.PaidAmount != null ? formatAmount(Number(data.PaidAmount)) : '' }}</td>
              <td class="px-4 border text-right">{{ data?.DueAmount != null ? formatAmount(Number(data.DueAmount)) : '' }}</td>
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";

const route = useRoute();
const router = useRouter();

const total = ref(0);
const search = ref(route.query.search || "");

const allData = ref([]);
const loading = ref(false);

const showVoucherTotal = computed(() => !!route.query.showVoucherTotal);
const voucheredTotalSum = ref(0);
const showDueTotal = computed(() => !!route.query.showDueTotal);
const dueTotalSum = ref(0);

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/customer/accountant/index?search=${search.value}&limit=99999&page=1`,
      getToken()
    );
    const rows = res?.data?.data || [];
    allData.value = Array.isArray(rows) ? rows : [];
    total.value = res?.data?.total ?? allData.value.length;
  } catch (error) {
    console.error(error);
    allData.value = [];
    total.value = 0;
    showNotification("error", "Failed to fetch members.");
  } finally {
    loading.value = false;
  }
};

const syncQuery = () => {
  const query = {
    ...(search.value?.trim() ? { search: search.value.trim() } : {}),
    ...(route.query.showVoucherTotal ? { showVoucherTotal: route.query.showVoucherTotal } : {}),
    ...(route.query.showDueTotal ? { showDueTotal: route.query.showDueTotal } : {}),
  };
  router.replace({ query });
};

let searchTimer = null;
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    syncQuery();
    fetchData();
  }, 350);
};

const fetchAllForTotals = async () => {
  try {
    const res = await axios.get(
      `${apiBase}/customer/accountant/index?search=&limit=99999&page=1`,
      getToken()
    );
    const rows = res?.data?.data || [];
    voucheredTotalSum.value = rows.reduce((sum, item) => sum + (Number(item.PaidAmount) || 0), 0);
    dueTotalSum.value = rows.reduce((sum, item) => sum + (Number(item.DueAmount) || 0), 0);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchData();
  if (showVoucherTotal.value || showDueTotal.value) fetchAllForTotals();
});
</script>

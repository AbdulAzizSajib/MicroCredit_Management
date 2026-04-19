<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-bold text-indigo-700">Total Loan Payable</h1>
        <div class="flex items-center gap-2">
          <a-range-picker v-model:value="dateRange" value-format="YYYY-MM-DD" format="DD-MMM-YYYY"
            @change="handleDateChange" />
          <a-button @click="$router.back()">Back</a-button>
        </div>
      </div>

      <div class="text-right mb-3 flex justify-end items-center gap-2">
        <label class="font-semibold text-gray-700">Total Loan Payable</label>
        <input type="text" class="w-36 border rounded-lg p-1 text-right bg-yellow-300 text-black font-bold"
          :value="formatAmount(totalLoanPayable)" readonly />
      </div>

      <div v-if="loading" class="text-center py-10">
        <a-spin size="large" />
      </div>

      <table v-else class="w-full border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">#</th>
            <th class="border border-white px-4 py-2">Entry Date</th>
            <th class="border border-white px-4 py-2">Member Code</th>
            <th class="border border-white px-4 py-2">Customer Name</th>
            <th class="border border-white px-4 py-2">Bangla Name</th>
            <th class="border border-white px-4 py-2 text-right">Loan Amount</th>
            <th class="border border-white px-4 py-2 text-right">Interest Amount</th>
            <th class="border border-white px-4 py-2 text-right">Total Payment</th>
            <th class="border border-white px-4 py-2 text-right">Total Loan Payable</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rows.length === 0">
            <td colspan="9" class="text-center py-4 text-gray-500">
              No data available.
            </td>
          </tr>
          <tr v-for="(item, index) in rows" :key="`${item.MemberCode}-${index}`">
            <td class="px-4 border">{{ index + 1 }}</td>
            <td class="px-4 border">{{ formatDate(item.EntryDate) }}</td>
            <td class="px-4 border">{{ item.MemberCode }}</td>
            <td class="px-4 border">{{ item.CustomerName }}</td>
            <td class="px-4 border">{{ item.CustomerBanglaName }}</td>
            <td class="px-4 border text-right">{{ formatAmount(Number(item.LoanAmount || 0)) }}</td>
            <td class="px-4 border text-right">{{ formatAmount(Number(item.InterestAmount || 0)) }}</td>
            <td class="px-4 border text-right">{{ formatAmount(Number(item.TotalPayment || 0)) }}</td>
            <td class="px-4 border text-right">{{ formatAmount(getTotalLoanPayable(item)) }}</td>
          </tr>
        </tbody>
      </table>

      <a-pagination v-if="total > perPage" v-model:current="page" :page-size="perPage" :total="total"
        :show-size-changer="false" :show-total="(t) => `Total ${t} items`" @change="handlePageChange" />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const rows = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalLoanPayable = ref(0);

const toYmd = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getCurrentMonthDateRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return [toYmd(start), toYmd(end)];
};

const defaultDateRange = getCurrentMonthDateRange();
const dateRange = ref([
  route.query.from_date || defaultDateRange[0],
  route.query.to_date || defaultDateRange[1],
]);

const buildQuery = () => {
  const params = new URLSearchParams({ page: page.value, per_page: perPage.value });
  if (dateRange.value?.[0]) params.append("from_date", dateRange.value[0]);
  if (dateRange.value?.[1]) params.append("to_date", dateRange.value[1]);
  return params.toString();
};

const getTotalLoanPayable = (item) => Number(item?.LoanAmount || 0) + Number(item?.InterestAmount || 0);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${apiBase}/member-wise-loan?${buildQuery()}`, getToken());
    rows.value = res?.data?.data || [];
    total.value = res?.data?.pagination?.total || 0;
    totalLoanPayable.value = rows.value.reduce((sum, item) => sum + getTotalLoanPayable(item), 0);
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to fetch total loan payable.");
  } finally {
    loading.value = false;
  }
};

const handleDateChange = () => {
  page.value = 1;
  router.replace({
    query: {
      ...route.query,
      from_date: dateRange.value?.[0] || undefined,
      to_date: dateRange.value?.[1] || undefined,
    },
  });
  fetchData();
};

const handlePageChange = (pageNo) => {
  page.value = pageNo;
  fetchData();
};

const formatDate = (value) => {
  if (!value) return "";
  return String(value).split(" ")[0];
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

onMounted(fetchData);
</script>
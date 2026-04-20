<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-bold text-indigo-700">{{ $t('loan.totalPaid') }}</h1>
        <div class="flex items-center gap-2">
          <a-range-picker v-model:value="dateRange" value-format="YYYY-MM-DD" format="DD-MMM-YYYY"
            @change="handleDateChange" />
          <a-button @click="$router.back()">{{ $t('common.back') }}</a-button>
        </div>
      </div>

      <div class="text-right mb-3 flex justify-end items-center gap-2">
        <label class="font-semibold text-gray-700">{{ $t('loan.totalPaid') }}</label>
        <input type="text" class="w-36 border rounded-lg p-1 text-right bg-yellow-300 text-black font-bold"
          :value="formatAmount(totalLoanPaid)" readonly />
      </div>

      <div v-if="loading" class="text-center py-10">
        <a-spin size="large" />
      </div>

      <table v-else class="w-full border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">#</th>
            <th class="border border-white px-4 py-2">{{ $t('loan.entryDate') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('loan.memberCode') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('loan.customerName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('loan.banglaName') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('loan.loanAmount') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('loan.interestAmount') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('loan.totalPayment') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('loan.totalLoanPaid') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rows.length === 0">
            <td colspan="9" class="text-center py-4 text-gray-500">
              {{ $t('common.noData') }}
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
            <td class="px-4 border text-right">{{ formatAmount(Number(item.TotalPayment || 0)) }}</td>
          </tr>
        </tbody>
      </table>

      <a-pagination v-if="total > perPage" v-model:current="page" :page-size="perPage" :total="total"
        :show-size-changer="false" :show-total="(t) => `${$t('common.total')} ${t}`" @change="handlePageChange" />
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const rows = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalLoanPaid = ref(0);

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

const getTotalLoanPaid = (item) => Number(item?.TotalPayment || 0);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${apiBase}/member-wise-loan?${buildQuery()}`, getToken());
    rows.value = res?.data?.data || [];
    total.value = res?.data?.pagination?.total || 0;
    totalLoanPaid.value = rows.value.reduce((sum, item) => sum + getTotalLoanPaid(item), 0);
  } catch (error) {
    console.error(error);
    showNotification("error", t("loan.fetchErrorPaid"));
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

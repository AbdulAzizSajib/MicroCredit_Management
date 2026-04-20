<template>
  <MainLayout>
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-bold text-primary" data-aos="fade-right">{{ $t('dashboard.totalDue') }}</h1>
        <a-range-picker v-model:value="dateRange" value-format="YYYY-MM-DD" format="DD-MMM-YYYY"
          @change="handleDateChange" />
      </div>

      <div v-if="loading" class="text-center py-12"><a-spin size="large" /></div>

      <table v-else class="w-full border border-collapse text-left" data-aos="fade-up" data-aos-delay="150">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">{{ $t('customer.customerCode') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('customer.customerName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('customer.customerBanglaName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('common.period') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('dashboard.totalDue') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in allData" :key="i" class="hover:bg-gray-50">
            <td class="px-4 border">{{ item.CustomerCode }}</td>
            <td class="px-4 border">{{ item.CustomerName }}</td>
            <td class="px-4 border">{{ item.CustomerBanglaName }}</td>
            <td class="px-4 border">{{ formatPeriod(item.Period) }}</td>
            <td class="px-4 border text-right">{{ formatAmount(Number(item.DueAmount || 0)) }}</td>
          </tr>
          <tr v-if="!allData.length">
            <td colspan="5" class="text-center py-4 text-gray-500">{{ $t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>

      <a-pagination class="mt-4" v-model:current="page" :page-size="perPage" :total="total" :show-size-changer="false"
        :show-total="(t) => $t('common.totalItems', { total: t })"
        v-if="total > perPage" />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken } from "@/utilities/common.js";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const filteredData = ref([]);
const loading = ref(false);
const page = ref(1);
const perPage = ref(10);

const total = computed(() => filteredData.value.length);
const allData = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filteredData.value.slice(start, start + perPage.value);
});

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

const fetchData = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({ page: 1, per_page: 1000 });
    if (dateRange.value?.[0]) params.append("from_date", dateRange.value[0]);
    if (dateRange.value?.[1]) params.append("to_date", dateRange.value[1]);
    const res = await axios.get(`${apiBase}/member-wise-collection?${params.toString()}`, getToken());
    const raw = res?.data?.data || [];
    filteredData.value = raw.filter(item => Number(item.DueAmount || 0) > 0);
  } catch (error) {
    console.log(error);
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

const formatPeriod = (period) => {
  if (!period) return "";
  const s = String(period);
  if (s.length !== 6) return s;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(s.slice(4, 6), 10) - 1] || ""} ${s.slice(0, 4)}`;
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

onMounted(() => fetchData());
</script>

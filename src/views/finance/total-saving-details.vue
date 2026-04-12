<template>
  <MainLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-primary" data-aos="fade-right">{{ $t('dashboard.totalSaving') }}</h1>

      <div v-if="loading" class="text-center py-12"><a-spin size="large" /></div>

      <table v-else class="w-full border border-collapse text-left" data-aos="fade-up" data-aos-delay="150">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">{{ $t('customer.customerCode') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('customer.customerName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('customer.customerBanglaName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('common.period') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('dashboard.totalSaving') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in allData" :key="i" class="hover:bg-gray-50">
            <td class="px-4 border">{{ item.CustomerCode }}</td>
            <td class="px-4 border">{{ item.CustomerName }}</td>
            <td class="px-4 border">{{ item.CustomerBanglaName }}</td>
            <td class="px-4 border">{{ formatPeriod(item.Period) }}</td>
            <td class="px-4 border text-right">{{ formatAmount(Number(item.PaidAmount || 0)) }}</td>
          </tr>
          <tr v-if="!allData.length">
            <td colspan="5" class="text-center py-4 text-gray-500">{{ $t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken } from "@/utilities/common.js";
import axios from "axios";

const allData = ref([]);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${apiBase}/member-wise-collection`, getToken());
    allData.value = res?.data?.data || [];
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const formatPeriod = (period) => {
  if (!period) return "";
  const s = String(period);
  if (s.length !== 6) return s;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
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

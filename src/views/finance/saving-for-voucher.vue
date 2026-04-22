<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-bold text-primary" data-aos="fade-right">{{ $t('finance.savingForVoucherTitle') }}</h1>
        <a-button @click="$router.back()">{{ $t('common.back') }}</a-button>
      </div>

      <div v-if="loading" class="text-center py-10">
        <a-spin size="large" />
      </div>

      <table v-else class="w-full border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">#</th>
            <th class="border border-white px-4 py-2">{{ $t('collection.customerCode') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('collection.customerName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('common.date') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('common.amount') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('common.remarks') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rows.length === 0">
            <td colspan="6" class="text-center py-4 text-gray-500">{{ $t('common.noData') }}</td>
          </tr>
          <tr v-for="(item, index) in rows" :key="item.ID">
            <td class="px-4 border">{{ (page - 1) * perPage + index + 1 }}</td>
            <td class="px-4 border">{{ item.CustomerCode }}</td>
            <td class="px-4 border">{{ item.CustomerName }}</td>
            <td class="px-4 border">{{ formatDate(item.Date) }}</td>
            <td class="px-4 border text-right">{{ formatAmount(Number(item.Amount || 0)) }}</td>
            <td class="px-4 border">{{ item.Remarks || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <a-pagination
        v-if="total > perPage"
        v-model:current="page"
        :page-size="perPage"
        :total="total"
        :show-size-changer="false"
        :show-total="(t) => $t('common.totalItems', { total: t })"
        @change="handlePageChange"
      />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken } from "@/utilities/common.js";

const loading = ref(false);
const rows = ref([]);
const page = ref(1);
const perPage = ref(20);
const total = ref(0);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${apiBase}/member-collection-voucher/pending-collections?page=${page.value}`, getToken());
    const data = res.data;
    rows.value = data?.data || [];
    total.value = data?.total || 0;
    perPage.value = data?.per_page || 20;
  } catch (error) {
    console.error(error);
    rows.value = [];
  } finally {
    loading.value = false;
  }
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

<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 class="text-2xl font-bold text-primary">
          Total Expense Vouchered
          <span class="ml-2 text-base font-normal text-gray-500">({{ total }})</span>
        </h1>
        <div class="flex flex-wrap items-center gap-3">
          <a-range-picker
            v-model:value="dateRange"
            value-format="YYYY-MM-DD"
            format="DD-MMM-YYYY"
            :input-read-only="true"
            @change="fetchData(1)"
            class="w-full sm:w-auto"
          />
          <a-button @click="$router.back()">Back</a-button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div v-if="loading" class="text-center py-12">
          <a-spin size="large" />
        </div>

        <table v-else class="w-full min-w-[700px] border border-collapse text-left">
          <thead>
            <tr class="bg-primary text-white">
              <th class="border border-white px-4 py-2">#</th>
              <th class="border border-white px-4 py-2">AM Code</th>
              <th class="border border-white px-4 py-2">Category</th>
              <th class="border border-white px-4 py-2">Expense Date</th>
              <th class="border border-white px-4 py-2 text-right">Amount</th>
              <th class="border border-white px-4 py-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rows.length === 0">
              <td colspan="6" class="text-center py-6 text-gray-500 border">No data found</td>
            </tr>
            <tr
              v-for="(item, index) in rows"
              :key="item.ID"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 border">{{ (currentPage - 1) * perPage + index + 1 }}</td>
              <td class="px-4 py-2 border">{{ item.AMCode || "-" }}</td>
              <td class="px-4 py-2 border">
                {{ item.ExpenseCatName || "-" }}
                <span
                  v-if="item.ExpenseCatId"
                  class="ml-1 text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5"
                >
                  {{ item.ExpenseCatId }}
                </span>
              </td>
              <td class="px-4 py-2 border">{{ formatDate(item.ExpenseDate) }}</td>
              <td class="px-4 py-2 border text-right font-medium">{{ formatAmount(item.Amount) }}</td>
              <td class="px-4 py-2 border">{{ item.Remarks || "-" }}</td>
            </tr>
            <tr v-if="rows.length > 0" class="bg-gray-100 font-bold">
              <td colspan="4" class="px-4 py-2 border text-right">Total</td>
              <td class="px-4 py-2 border text-right">{{ formatAmount(grandTotal) }}</td>
              <td class="border"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="lastPage > 1" class="flex justify-center mt-6">
        <a-pagination
          :current="currentPage"
          :total="total"
          :page-size="perPage"
          show-less-items
          @change="fetchData"
        />
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";

const loading = ref(false);
const rows = ref([]);
const total = ref(0);
const lastPage = ref(1);
const currentPage = ref(1);
const perPage = ref(10);

const today = new Date();
const firstDay = `${today.getFullYear()}-01-01`;
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
const dateRange = ref([firstDay, todayStr]);

const grandTotal = computed(() =>
  rows.value.reduce((sum, item) => sum + Number(item.Amount || 0), 0)
);

const fetchData = async (page = 1) => {
  currentPage.value = page;
  loading.value = true;
  try {
    const from = dateRange.value?.[0] || firstDay;
    const to = dateRange.value?.[1] || todayStr;
    const res = await axios.get(
      `${apiBase}/expense-voucher/vouchered-expenses?per_page=${perPage.value}&page=${page}&from=${from}&to=${to}`,
      getToken()
    );
    rows.value = res.data?.data || [];
    total.value = res.data?.total || 0;
    lastPage.value = res.data?.last_page || 1;
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to fetch vouchered expenses.");
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const formatAmount = (val) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    Number(val || 0)
  );

onMounted(() => fetchData(1));
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="w-full sm:w-48">
          <label class="text-xs font-medium text-gray-600 block mb-1">Plant</label>
          <a-select
            v-model:value="selectedPlant"
            class="w-full"
            placeholder="Select Plant"
            show-search
            allow-clear
            :filter-option="filterOption"
            option-filter-prop="label"
            :loading="plantLoading"
          >
            <a-select-option
              v-for="p in plants"
              :key="p.PlantCode"
              :value="p.PlantCode"
              :label="`${p.PlantCode} ${p.PlantName}`"
            >
              {{ p.PlantCode }} — {{ p.PlantName }}
            </a-select-option>
          </a-select>
        </div>
        <div class="w-full sm:w-48">
          <label class="text-xs font-medium text-gray-600 block mb-1">Business</label>
          <a-select
            v-model:value="selectedBusiness"
            class="w-full"
            placeholder="Select Business"
            show-search
            allow-clear
            :filter-option="filterOption"
            option-filter-prop="label"
            :loading="businessLoading"
          >
            <a-select-option
              v-for="b in businesses"
              :key="b.Business"
              :value="b.Business"
              :label="`${b.Business} ${b.BusinessName}`"
            >
              {{ b.Business }} — {{ b.BusinessName }}
            </a-select-option>
          </a-select>
        </div>
        <button
          class="bg-primary text-white px-5 py-1.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
          :disabled="loading"
          @click="fetchData"
        >
          <Icon v-if="loading" icon="line-md:loading-loop" class="size-4" />
          GO
        </button>
        <div class="flex gap-2 sm:ml-2">
          <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium">
            CSV
          </button>
          <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium">
            PDF
          </button>
        </div>
        <div class="flex items-center gap-2 sm:ml-auto">
          <label class="text-sm text-gray-600 whitespace-nowrap">Search:</label>
          <a-input v-model:value="search" class="w-48" allow-clear />
        </div>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex items-center gap-3 mb-4" data-aos="fade-right">
      Current Stock Report ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[800px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2 cursor-pointer" @click="sortBy('ProductCode')">
              Product Code <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-4 py-2 cursor-pointer" @click="sortBy('ProductName')">
              Product Name <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-4 py-2 text-right cursor-pointer" @click="sortBy('NotRelease')">
              Not Release QTY <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-4 py-2 text-right cursor-pointer" @click="sortBy('SB_Balance')">
              SB Balance <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-4 py-2 text-right cursor-pointer" @click="sortBy('NotRelease_SBBalance')">
              (Not Release + SB Balance) QTY <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-4 py-2 text-right cursor-pointer" @click="sortBy('TradePrice')">
              Trade Price <span class="text-white/60 text-xs">⇅</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filtered" :key="i" class="hover:bg-gray-50">
            <td class="px-4 border font-medium text-primary">{{ row.ProductCode }}</td>
            <td class="px-4 border">{{ row.ProductName }}</td>
            <td class="px-4 border text-right">{{ row.NotRelease }}</td>
            <td class="px-4 border text-right">{{ row.SB_Balance }}</td>
            <td class="px-4 border text-right">{{ row.NotRelease_SBBalance }}</td>
            <td class="px-4 border text-right">{{ row.TradePrice }}</td>
          </tr>
          <tr v-if="!filtered.length && !loading">
            <td colspan="6" class="px-4 py-6 border text-center text-gray-400">No data found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { fetchAllPlants } from "./plants-api";
import { fetchAllBusinesses } from "./business-api";

const selectedPlant = ref(undefined);
const selectedBusiness = ref(undefined);
const search = ref("");
const sortKey = ref("");
const sortOrder = ref(1);
const loading = ref(false);

const plants = ref([]);
const businesses = ref([]);
const plantLoading = ref(false);
const businessLoading = ref(false);

const tableData = ref([]);
const total = ref(0);

const filterOption = (input, option) => {
  const text = (option?.label ?? "").toString().toLowerCase();
  return text.includes(input.toLowerCase());
};

const fetchData = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      PlantCode: selectedPlant.value || "",
      Business: selectedBusiness.value || "",
    }).toString();
    const res = await axios.get(
      `${apiBase}/inventory/stock/current?${params}`,
      getToken(),
    );
    const payload = res?.data?.data ?? res?.data;
    tableData.value = Array.isArray(payload) ? payload : (payload?.data ?? []);
    total.value = res?.data?.total ?? tableData.value.length;
  } catch (e) {
    tableData.value = [];
    total.value = 0;
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    loading.value = false;
  }
};

const sortBy = (key) => {
  if (sortKey.value === key) sortOrder.value *= -1;
  else { sortKey.value = key; sortOrder.value = 1; }
};

const filtered = computed(() => {
  let data = tableData.value;
  if (search.value) {
    const s = search.value.toLowerCase();
    data = data.filter(
      (r) =>
        r.ProductCode?.toLowerCase().includes(s) ||
        r.ProductName?.toLowerCase().includes(s),
    );
  }
  if (sortKey.value) {
    data = [...data].sort((a, b) =>
      a[sortKey.value] > b[sortKey.value] ? sortOrder.value : -sortOrder.value,
    );
  }
  return data;
});

onMounted(async () => {
  plantLoading.value = true;
  businessLoading.value = true;
  try {
    const [allPlants, allBusinesses] = await Promise.all([
      fetchAllPlants(),
      fetchAllBusinesses(),
    ]);
    plants.value = allPlants;
    businesses.value = allBusinesses;
  } finally {
    plantLoading.value = false;
    businessLoading.value = false;
  }
});
</script>

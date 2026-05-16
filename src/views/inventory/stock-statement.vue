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
        <div class="w-full sm:w-auto">
          <label class="text-xs font-medium text-gray-600 block mb-1">Date From</label>
          <a-date-picker
            v-model:value="dateFrom"
            format="MM/DD/YYYY"
            value-format="YYYY-MM-DD"
            class="w-36"
          />
        </div>
        <div class="w-full sm:w-auto">
          <label class="text-xs font-medium text-gray-600 block mb-1">Date To</label>
          <a-date-picker
            v-model:value="dateTo"
            format="MM/DD/YYYY"
            value-format="YYYY-MM-DD"
            class="w-36"
          />
        </div>
        <button
          class="bg-primary text-white px-5 py-1.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
          :disabled="loading"
          @click="onGo"
        >
          <Icon v-if="loading" icon="line-md:loading-loop" class="size-4" />
          GO
        </button>
        <div class="flex gap-2 sm:ml-2">
          <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm font-medium">
            CSV
          </button>
          <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm font-medium">
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
      Stock Statement ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[1400px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-3 py-2 cursor-pointer" @click="sortBy('ProductCode')">
              ProductCode <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-3 py-2 cursor-pointer" @click="sortBy('ProductName')">
              ProductName <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-3 py-2 text-center">Pack Size</th>
            <th class="border border-white px-3 py-2 text-right cursor-pointer" @click="sortBy('Opening')">
              Opening <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-3 py-2 text-right cursor-pointer" @click="sortBy('Receive')">
              Receive <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-3 py-2 text-right cursor-pointer" @click="sortBy('Issue')">
              Issue <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-3 py-2 text-right">Replacement</th>
            <th class="border border-white px-3 py-2 text-right">Sample</th>
            <th class="border border-white px-3 py-2 text-right">SampleIssue</th>
            <th class="border border-white px-3 py-2 text-right">OthersIssue</th>
            <th class="border border-white px-3 py-2 text-right">Adjustment</th>
            <th class="border border-white px-3 py-2 text-right">WriteOff</th>
            <th class="border border-white px-3 py-2 text-right cursor-pointer" @click="sortBy('Closing')">
              Closing <span class="text-white/60 text-xs">⇅</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filtered" :key="i" class="hover:bg-gray-50">
            <td class="px-3 py-2 border font-medium text-primary">{{ row.ProductCode }}</td>
            <td class="px-3 py-2 border">{{ row.ProductName }}</td>
            <td class="px-3 py-2 border text-center">{{ row.PackSize || "—" }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Opening }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Receive }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Issue }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Replacement }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Sample }}</td>
            <td class="px-3 py-2 border text-right">{{ row.SampleIssue }}</td>
            <td class="px-3 py-2 border text-right">{{ row.OthersIssue }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Adjustment }}</td>
            <td class="px-3 py-2 border text-right">{{ row.WriteOff }}</td>
            <td class="px-3 py-2 border text-right font-medium">{{ row.Closing }}</td>
          </tr>
          <tr v-if="!filtered.length && !loading">
            <td colspan="13" class="px-4 py-6 border text-center text-gray-400">
              {{ hasSearched ? "No data found." : "Select filters and click GO to load data." }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import axios from "axios";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { fetchAllPlants } from "./plants-api";
import { fetchAllBusinesses } from "./business-api";

const dateFrom = ref(dayjs().startOf("month").format("YYYY-MM-DD"));
const dateTo = ref(dayjs().format("YYYY-MM-DD"));
const selectedPlant = ref(undefined);
const selectedBusiness = ref(undefined);
const search = ref("");
const sortKey = ref("");
const sortOrder = ref(1);
const loading = ref(false);
const hasSearched = ref(false);

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

const onGo = async () => {
  loading.value = true;
  hasSearched.value = true;
  try {
    const params = new URLSearchParams({
      PlantCode: selectedPlant.value || "",
      Business: selectedBusiness.value || "",
      from_date: dateFrom.value || "",
      to_date: dateTo.value || "",
    }).toString();
    const res = await axios.get(
      `${apiBase}/inventory/stock/statement?${params}`,
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

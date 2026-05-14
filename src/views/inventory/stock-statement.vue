<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
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
        <div class="w-full sm:w-52">
          <label class="text-xs font-medium text-gray-600 block mb-1">Business</label>
          <a-select
            v-model:value="selectedBusiness"
            class="w-full"
            placeholder="Select Business"
            show-search
            allow-clear
          >
            <a-select-option v-for="b in businesses" :key="b.value" :value="b.value">
              {{ b.label }}
            </a-select-option>
          </a-select>
        </div>
        <button
          class="bg-primary text-white px-5 py-2 rounded font-semibold hover:opacity-90"
          @click="onGo"
        >
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

    <h1 class="text-2xl font-bold text-primary mb-4" data-aos="fade-right">Stock Statement</h1>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[1300px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-3 py-2 cursor-pointer" @click="sortBy('ProductCode')">
              ProductCode <span class="text-white/60 text-xs">⇅</span>
            </th>
            <th class="border border-white px-3 py-2 cursor-pointer" @click="sortBy('ProductName')">
              ProductName <span class="text-white/60 text-xs">⇅</span>
            </th>
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
            <th class="border border-white px-3 py-2 text-right cursor-pointer" @click="sortBy('Closing')">
              Closing <span class="text-white/60 text-xs">⇅</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filtered" :key="i" class="hover:bg-gray-50">
            <td class="px-3 py-2 border">{{ row.ProductCode }}</td>
            <td class="px-3 py-2 border">{{ row.ProductName }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Opening }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Receive }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Issue }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Replacement }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Sample }}</td>
            <td class="px-3 py-2 border text-right">{{ row.SampleIssue }}</td>
            <td class="px-3 py-2 border text-right">{{ row.OthersIssue }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Adjustment }}</td>
            <td class="px-3 py-2 border text-right">{{ row.Closing }}</td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="11" class="px-4 py-6 border text-center text-gray-400">No data found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import MainLayout from "@/components/layouts/mainLayout.vue";

const dateFrom = ref(dayjs().startOf("month").format("YYYY-MM-DD"));
const dateTo = ref(dayjs().format("YYYY-MM-DD"));
const selectedBusiness = ref("C");
const search = ref("");
const sortKey = ref("");
const sortOrder = ref(1);

const businesses = [
  { value: "C", label: "Crop Care & Pub..." },
  { value: "H", label: "Home Care" },
  { value: "P", label: "Personal Care" },
];

const staticData = [
  { ProductCode: "A001", ProductName: "Sulphur 80% WG 20Kg (Export)", Opening: ".0000", Receive: ".0000", Issue: ".0000", Replacement: ".00", Sample: ".00", SampleIssue: ".00", OthersIssue: ".00", Adjustment: ".00", Closing: ".0000" },
  { ProductCode: "A002", ProductName: "Sulphur 80% WG 25 Kg (Export)", Opening: ".0000", Receive: ".0000", Issue: ".0000", Replacement: ".00", Sample: ".00", SampleIssue: ".00", OthersIssue: ".00", Adjustment: ".00", Closing: ".0000" },
  { ProductCode: "A003", ProductName: "Aimcoflow 80WG (Sulfur 80% WDG)", Opening: ".0000", Receive: ".0000", Issue: ".0000", Replacement: ".00", Sample: ".00", SampleIssue: ".00", OthersIssue: ".00", Adjustment: ".00", Closing: ".0000" },
  { ProductCode: "A004", ProductName: "Superheat 500EC (Pretilachlor 50%)", Opening: ".0000", Receive: ".0000", Issue: ".0000", Replacement: ".00", Sample: ".00", SampleIssue: ".00", OthersIssue: ".00", Adjustment: ".00", Closing: ".0000" },
  { ProductCode: "A005", ProductName: "PinSein-Manco 80 WP (Mancozeb 80%)", Opening: ".0000", Receive: ".0000", Issue: ".0000", Replacement: ".00", Sample: ".00", SampleIssue: ".00", OthersIssue: ".00", Adjustment: ".00", Closing: ".0000" },
  { ProductCode: "A006", ProductName: "PinSein - Manco 80 WP (Mancozeb 80%)", Opening: ".0000", Receive: ".0000", Issue: ".0000", Replacement: ".00", Sample: ".00", SampleIssue: ".00", OthersIssue: ".00", Adjustment: ".00", Closing: ".0000" },
  { ProductCode: "AG0A", ProductName: "FIGHTER PLUS 2.5 EC (TEA) PER LTR", Opening: ".0000", Receive: ".0000", Issue: ".0000", Replacement: ".00", Sample: ".00", SampleIssue: ".00", OthersIssue: ".00", Adjustment: ".00", Closing: ".0000" },
  { ProductCode: "AG0C", ProductName: "PLATINUM 20SP 20 GM", Opening: ".0000", Receive: ".0000", Issue: ".0000", Replacement: ".00", Sample: ".00", SampleIssue: ".00", OthersIssue: ".00", Adjustment: ".00", Closing: ".0000" },
  { ProductCode: "AG0D", ProductName: "ACI CARB 85WP 500 GM", Opening: ".0000", Receive: ".0000", Issue: ".0000", Replacement: ".00", Sample: ".00", SampleIssue: ".00", OthersIssue: ".00", Adjustment: ".00", Closing: ".0000" },
  { ProductCode: "AG0P", ProductName: "RELEASE 9 EC 100 ML", Opening: ".0000", Receive: ".0000", Issue: ".0000", Replacement: ".00", Sample: ".00", SampleIssue: ".00", OthersIssue: ".00", Adjustment: ".00", Closing: ".0000" },
];

const tableData = ref(staticData);

const onGo = () => {
  tableData.value = staticData;
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
      (r) => r.ProductCode.toLowerCase().includes(s) || r.ProductName.toLowerCase().includes(s),
    );
  }
  if (sortKey.value) {
    data = [...data].sort((a, b) =>
      a[sortKey.value] > b[sortKey.value] ? sortOrder.value : -sortOrder.value,
    );
  }
  return data;
});
</script>

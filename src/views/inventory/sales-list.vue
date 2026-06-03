<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="w-full sm:w-64">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search Issue / Order No..."
            v-model:value="search"
            allow-clear
            @change="onSearchChange"
          />
        </div>
        <div class="w-full sm:w-48">
          <label class="text-xs font-medium text-gray-600 block mb-1">Plant</label>
          <a-select
            class="w-full"
            placeholder="All Plants"
            v-model:value="filterPlant"
            allow-clear
            show-search
            option-filter-prop="label"
            @change="onFilterChange"
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
        <div class="w-full sm:w-40">
          <label class="text-xs font-medium text-gray-600 block mb-1">Business</label>
          <a-select
            class="w-full"
            placeholder="All Business"
            v-model:value="filterBusiness"
            allow-clear
            show-search
            option-filter-prop="label"
            @change="onFilterChange"
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
        <div class="w-full sm:w-44">
          <label class="text-xs font-medium text-gray-600 block mb-1">From Date</label>
          <a-date-picker
            class="w-full"
            v-model:value="fromDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="onFilterChange"
          />
        </div>
        <div class="w-full sm:w-44">
          <label class="text-xs font-medium text-gray-600 block mb-1">To Date</label>
          <a-date-picker
            class="w-full"
            v-model:value="toDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="onFilterChange"
          />
        </div>
        <button
          class="bg-primary text-white px-4 py-2 rounded font-semibold sm:ml-auto"
          @click="$router.push('/inventory/sales/create')"
        >
          + New Sales
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4" data-aos="fade-right">
      Sales ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[1000px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Issue No</th>
            <th class="border border-white px-4 py-2">Issue Date</th>
            <th class="border border-white px-4 py-2">Customer</th>
            <th class="border border-white px-4 py-2">Plant</th>
            <th class="border border-white px-4 py-2">Business</th>
            <th class="border border-white px-4 py-2">Order No</th>
            <th class="border border-white px-4 py-2">Vehicle</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-for="(row, i) in list" :key="row.IssueNo">
            <td class="px-4 border">{{ (page - 1) * per_page + i + 1 }}</td>
            <td class="px-4 border font-medium text-primary">{{ row.IssueNo }}</td>
            <td class="px-4 border">{{ formatDate(row.IssueDate) }}</td>
            <td class="px-4 border">{{ row.CustomerCode || "—" }}</td>
            <td class="px-4 border">{{ row.PlantCode }}</td>
            <td class="px-4 border">{{ row.Business }}</td>
            <td class="px-4 border">{{ row.OrderNo || "—" }}</td>
            <td class="px-4 border">{{ row.VehicleNo || "—" }}</td>
            <td class="px-4 border text-center">
              <div class="flex justify-center items-center gap-1">
                <a-tooltip title="View">
                  <button
                    type="button"
                    class="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    @click="viewRow(row)"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                </a-tooltip>
                <a-tooltip title="Edit">
                  <button
                    type="button"
                    class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                    @click="editRow(row)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </a-tooltip>
                <a-popconfirm
                  title="Delete this sales entry?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteRow(row)"
                >
                  <button
                    type="button"
                    class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </a-popconfirm>
              </div>
            </td>
          </tr>
          <tr v-if="!list.length && !loading">
            <td colspan="9" class="px-4 py-6 border text-center text-gray-400">
              No records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <a-pagination
      class="mt-4"
      v-model:current="page"
      :page-size="per_page"
      :total="total"
      :show-size-changer="false"
      :show-total="(t) => `Total ${t} items`"
      @change="(p) => { page = p; fetchAllData(); }"
      v-if="total > per_page"
    />

    <a-modal v-model:open="viewModal" title="Sales Details" :footer="null" width="800px">
      <div v-if="selected" class="space-y-3 text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-3">
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Issue No:</span>
            <span class="text-primary font-medium">{{ selected.IssueNo }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Issue Date:</span>
            <span>{{ formatDate(selected.IssueDate) }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Customer:</span>
            <span>{{ selected.CustomerCode || "—" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Plant:</span>
            <span>{{ selected.PlantCode }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Business:</span>
            <span>{{ selected.Business }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Movement:</span>
            <span>{{ selected.MovementId || "—" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Order No:</span>
            <span>{{ selected.OrderNo || "—" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Vehicle No:</span>
            <span>{{ selected.VehicleNo || "—" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">VAT Challan No:</span>
            <span>{{ selected.VatChallanNo || "—" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">VAT Challan Date:</span>
            <span>{{ formatDate(selected.VatChallanDate) || "—" }}</span>
          </div>
        </div>
        <table class="w-full border border-collapse mt-2">
          <thead>
            <tr class="bg-primary text-white text-xs">
              <th class="border border-white px-3 py-1.5 text-left">#</th>
              <th class="border border-white px-3 py-1.5 text-left">Product</th>
              <th class="border border-white px-3 py-1.5 text-left">Batch</th>
              <th class="border border-white px-3 py-1.5 text-right">Qty</th>
              <th class="border border-white px-3 py-1.5 text-right">TP</th>
              <th class="border border-white px-3 py-1.5 text-right">VAT</th>
              <th class="border border-white px-3 py-1.5 text-right">Net</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in selectedDetails" :key="idx">
              <td class="px-3 py-1.5 border text-xs">{{ idx + 1 }}</td>
              <td class="px-3 py-1.5 border text-xs">
                <div class="font-medium">{{ item.ProductCode }}</div>
                <div class="text-gray-500">{{ item.ProductName || "" }}</div>
              </td>
              <td class="px-3 py-1.5 border text-xs">{{ item.BatchNo || "—" }}</td>
              <td class="px-3 py-1.5 border text-xs text-right">{{ item.Quantity }}</td>
              <td class="px-3 py-1.5 border text-xs text-right">{{ formatMoney(item.TP) }}</td>
              <td class="px-3 py-1.5 border text-xs text-right">{{ formatMoney(item.Vat) }}</td>
              <td class="px-3 py-1.5 border text-xs text-right">{{ formatMoney(item.Net) }}</td>
            </tr>
            <tr v-if="!selectedDetails.length">
              <td colspan="7" class="px-3 py-3 border text-center text-gray-400 text-xs">
                No items.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import dayjs from "dayjs";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { fetchAllPlants } from "./plants-api";
import { fetchAllBusinesses } from "./business-api";

const router = useRouter();

const plants = ref([]);
const businesses = ref([]);

const list = ref([]);
const total = ref(0);
const page = ref(1);
const per_page = ref(10);
const loading = ref(false);

const search = ref("");
const filterPlant = ref(undefined);
const filterBusiness = ref(undefined);
const fromDate = ref(undefined);
const toDate = ref(undefined);

const viewModal = ref(false);
const selected = ref(null);

const selectedDetails = computed(
  () => selected.value?.details ?? selected.value?.Items ?? selected.value?.items ?? [],
);

const formatDate = (val) => {
  if (!val) return "";
  const d = dayjs(val);
  return d.isValid() ? d.format("YYYY-MM-DD") : val;
};

const formatMoney = (val) => {
  if (val == null || val === "") return "—";
  return Number(val).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

let searchTimer = null;
const onSearchChange = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    fetchAllData();
  }, 350);
};

const onFilterChange = () => {
  page.value = 1;
  fetchAllData();
};

const fetchAllData = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      search: search.value || "",
      PlantCode: filterPlant.value || "",
      Business: filterBusiness.value || "",
      from_date: fromDate.value || "",
      to_date: toDate.value || "",
      per_page: per_page.value,
      page: page.value,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/sales?${params}`, getToken());
    const payload = res?.data?.data ?? res?.data;
    list.value = payload?.data ?? payload ?? [];
    total.value = payload?.total ?? list.value.length ?? 0;
  } catch (err) {
    list.value = [];
    total.value = 0;
    showNotification("error", err?.response?.data?.message || err?.message);
  } finally {
    loading.value = false;
  }
};

const viewRow = async (row) => {
  selected.value = row;
  viewModal.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/sales/show?IssueNo=${encodeURIComponent(row.IssueNo)}`,
      getToken(),
    );
    const detail = res?.data?.data ?? res?.data;
    if (detail) {
      const master = detail.master ?? detail;
      const items = detail.details ?? detail.Items ?? detail.items ?? [];
      selected.value = { ...row, ...master, details: items };
    }
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const editRow = (row) => {
  router.push({
    path: "/inventory/sales/edit",
    query: { IssueNo: row.IssueNo },
  });
};

const deleteRow = async (row) => {
  try {
    const res = await axios.delete(
      `${apiBase}/inventory/sales?IssueNo=${encodeURIComponent(row.IssueNo)}`,
      getToken(),
    );
    showNotification(
      res?.data?.success !== false ? "success" : "error",
      res?.data?.message || "Deleted",
    );
    await fetchAllData();
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

onMounted(async () => {
  const [allPlants, allBusinesses] = await Promise.all([
    fetchAllPlants(),
    fetchAllBusinesses(),
  ]);
  plants.value = allPlants;
  businesses.value = allBusinesses;
  fetchAllData();
});
</script>

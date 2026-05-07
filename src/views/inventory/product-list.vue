<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="w-full sm:w-64">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search by code or name..."
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
            @change="onFilterChange"
          >
            <a-select-option v-for="p in plants" :key="p.PlantCode" :value="p.PlantCode">
              {{ p.PlantCode }} — {{ p.PlantName }}
            </a-select-option>
          </a-select>
        </div>
        <div class="w-full sm:w-36">
          <label class="text-xs font-medium text-gray-600 block mb-1">Active</label>
          <a-select
            class="w-full"
            placeholder="All"
            v-model:value="filterActive"
            allow-clear
            @change="onFilterChange"
          >
            <a-select-option value="Y">Active</a-select-option>
            <a-select-option value="N">Inactive</a-select-option>
          </a-select>
        </div>
        <button
          class="bg-primary text-white px-4 py-2 rounded font-semibold sm:ml-auto"
          @click="$router.push('/inventory/product/create')"
        >
          + Create Product
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Products ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Code</th>
            <th class="border border-white px-4 py-2">Product Name</th>
            <th class="border border-white px-4 py-2">Plant</th>
            <th class="border border-white px-4 py-2">Pack Size</th>
            <th class="border border-white px-4 py-2 text-right">Trade Price</th>
            <th class="border border-white px-4 py-2 text-right">MRP</th>
            <th class="border border-white px-4 py-2 text-center">Active</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in list" :key="row.ProductCode + (row.PlantCode || '')">
            <td class="px-4 py-2 border">{{ (page - 1) * per_page + i + 1 }}</td>
            <td class="px-4 py-2 border font-medium text-primary">{{ row.ProductCode }}</td>
            <td class="px-4 py-2 border">
              <div>{{ row.ProductName }}</div>
              <div v-if="row.ProductNameBangla" class="text-gray-400 text-xs">{{ row.ProductNameBangla }}</div>
            </td>
            <td class="px-4 py-2 border">{{ row.PlantCode }}</td>
            <td class="px-4 py-2 border">{{ row.PackSize || "-" }}</td>
            <td class="px-4 py-2 border text-right">{{ row.TradePrice ?? "-" }}</td>
            <td class="px-4 py-2 border text-right">{{ row.MRP ?? "-" }}</td>
            <td class="px-4 py-2 border text-center">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="row.Active === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
              >
                {{ row.Active === "Y" ? "Active" : "Inactive" }}
              </span>
            </td>
            <td class="px-4 py-2 border text-center">
              <div class="flex justify-center gap-x-2">
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
                  title="Delete this product?"
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
            <td colspan="9" class="px-4 py-6 border text-center text-gray-500">
              No products found.
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
      @change="(p) => { page = p; fetchList(); }"
      v-if="total > per_page"
    />

    <!-- View Modal -->
    <a-modal v-model:open="viewModal" title="Product Details" :footer="null" width="700px">
      <div v-if="selected" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Product Code:</span>
          <span>{{ selected.ProductCode }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Plant:</span>
          <span>{{ selected.PlantCode }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Product Name:</span>
          <span>{{ selected.ProductName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Name (Bangla):</span>
          <span>{{ selected.ProductNameBangla || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Pack Size:</span>
          <span>{{ selected.PackSize || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Pack Size WT:</span>
          <span>{{ selected.PackSizeWT ?? "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Batch Size:</span>
          <span>{{ selected.BatchSize ?? "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Carton:</span>
          <span>{{ selected.Carton ?? "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Trade Price:</span>
          <span>{{ selected.TradePrice ?? "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">VAT:</span>
          <span>{{ selected.VAT ?? "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">MRP:</span>
          <span>{{ selected.MRP ?? "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Business:</span>
          <span>{{ selected.Business || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Sub Business:</span>
          <span>{{ selected.SubBusinessCode || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Mushok Print:</span>
          <span>{{ selected.MushokPrint === "Y" ? "Yes" : "No" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Active:</span>
          <span>{{ selected.Active === "Y" ? "Yes" : "No" }}</span>
        </div>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { fetchAllPlants } from "./plants-api";

const router = useRouter();

const plants = ref([]);

const list = ref([]);
const total = ref(0);
const page = ref(1);
const per_page = ref(10);
const loading = ref(false);

const search = ref("");
const filterPlant = ref(undefined);
const filterActive = ref(undefined);

const viewModal = ref(false);
const selected = ref(null);

let searchTimer = null;
const onSearchChange = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    fetchList();
  }, 350);
};

const onFilterChange = () => {
  page.value = 1;
  fetchList();
};

const fetchList = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      search: search.value || "",
      PlantCode: filterPlant.value || "",
      Active: filterActive.value || "",
      per_page: per_page.value,
      page: page.value,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/product?${params}`, getToken());
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
      `${apiBase}/inventory/product/show?ProductCode=${row.ProductCode}&PlantCode=${row.PlantCode}`,
      getToken(),
    );
    const detail = res?.data?.data ?? res?.data;
    if (detail) selected.value = { ...row, ...detail };
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const editRow = (row) => {
  router.push({
    path: "/inventory/product/edit",
    query: { ProductCode: row.ProductCode, PlantCode: row.PlantCode },
  });
};

const deleteRow = async (row) => {
  try {
    const res = await axios.delete(
      `${apiBase}/inventory/product?ProductCode=${row.ProductCode}&PlantCode=${row.PlantCode}`,
      getToken(),
    );
    showNotification(
      res?.data?.success !== false ? "success" : "error",
      res?.data?.message || "Deleted",
    );
    await fetchList();
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

onMounted(async () => {
  const allPlants = await fetchAllPlants();
  plants.value = allPlants;
  fetchList();
});
</script>

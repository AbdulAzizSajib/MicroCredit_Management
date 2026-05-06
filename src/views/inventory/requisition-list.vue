<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="flex-1 min-w-[200px]">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search Ref / Customer..."
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
          @click="$router.push('/inventory/requisition/create')"
        >
          + Create Requisition
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Purchase Requisition ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Requisition No</th>
            <th class="border border-white px-4 py-2">Plant</th>
            <th class="border border-white px-4 py-2">Customer</th>
            <th class="border border-white px-4 py-2">Date</th>
            <th class="border border-white px-4 py-2">Delivery Date</th>
            <th class="border border-white px-4 py-2 text-right">Items</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-for="(row, i) in list" :key="row.RequisitionNo + (row.PlantCode || '')">
            <td class="px-4 border">{{ (page - 1) * per_page + i + 1 }}</td>
            <td class="px-4 border font-medium text-primary">{{ row.RequisitionNo }}</td>
            <td class="px-4 border">{{ row.PlantCode }} — {{ row.PlantName || plantName(row.PlantCode) }}</td>
            <td class="px-4 border">{{ row.CustomerCode || "-" }}</td>
            <td class="px-4 border">{{ row.Date || row.RequisitionDate || "-" }}</td>
            <td class="px-4 border">{{ row.DeliveryDate || "-" }}</td>
            <td class="px-4 border text-right">{{ (row.Items ?? row.items)?.length ?? row.ItemCount ?? "-" }}</td>
            <td class="px-4 border text-center">
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
                  title="Delete this requisition?"
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
            <td colspan="8" class="px-4 py-6 border text-center text-gray-500">
              No requisitions found.
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

    <!-- View Modal -->
    <a-modal
      v-model:open="viewModal"
      title="Requisition Details"
      :footer="null"
      width="800px"
    >
      <div v-if="selected" class="space-y-3 text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-3">
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Requisition No:</span>
            <span class="text-primary font-medium">{{ selected.RequisitionNo }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Status:</span>
            <span
              class="px-2 py-0.5 rounded text-xs font-semibold"
              :class="selected.Status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'"
            >{{ selected.Status || "-" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Plant:</span>
            <span>{{ selected.PlantCode }} — {{ selected.PlantName || plantName(selected.PlantCode) }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Period:</span>
            <span>{{ selected.Period || "-" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Business:</span>
            <span>{{ selected.Business || "-" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Project:</span>
            <span>{{ selected.Project || "-" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Customer:</span>
            <span>{{ selected.CustomerCode || "-" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Segment:</span>
            <span>{{ selected.Segment || selected.SalesType || "-" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Date:</span>
            <span>{{ selected.Date || selected.RequisitionDate || "-" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Delivery Date:</span>
            <span>{{ selected.DeliveryDate || "-" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Invoice Type:</span>
            <span>{{ selected.InvoiceType || "-" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Auto Receive:</span>
            <span>{{ selected.AutoReceive || "-" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Approved:</span>
            <span
              class="px-2 py-0.5 rounded text-xs font-semibold"
              :class="selected.IsApproved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
            >{{ selected.IsApproved ? "Yes" : "No" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Approve Date:</span>
            <span>{{ selected.ApproveDate || "-" }}</span>
          </div>
        </div>
        <div v-if="selected.Notes" class="border-b pb-2">
          <span class="font-semibold text-gray-600">Notes:</span>
          <span class="ml-2">{{ selected.Notes }}</span>
        </div>
        <table class="w-full border border-collapse mt-2">
          <thead>
            <tr class="bg-primary text-white text-xs">
              <th class="border border-white px-3 py-1.5 text-left">#</th>
              <th class="border border-white px-3 py-1.5 text-left">Product</th>
              <th class="border border-white px-3 py-1.5 text-left">Pack Size</th>
              <th class="border border-white px-3 py-1.5 text-right">Qty</th>
              <th class="border border-white px-3 py-1.5 text-right">Invoice Qty</th>
              <th class="border border-white px-3 py-1.5 text-center">OK</th>
              <th class="border border-white px-3 py-1.5 text-left">Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in (selected.Items ?? selected.items ?? [])" :key="idx">
              <td class="px-3 py-1.5 border text-xs">{{ idx + 1 }}</td>
              <td class="px-3 py-1.5 border text-xs">
                <div class="font-medium">{{ item.ProductCode }}</div>
                <div class="text-gray-500">{{ item.ProductName }}</div>
              </td>
              <td class="px-3 py-1.5 border text-xs">{{ item.PackSize || "-" }}</td>
              <td class="px-3 py-1.5 border text-xs text-right">{{ item.Quantity }}</td>
              <td class="px-3 py-1.5 border text-xs text-right">{{ item.InvoiceQty ?? "-" }}</td>
              <td class="px-3 py-1.5 border text-xs text-center">
                <span
                  class="px-1.5 py-0.5 rounded text-xs font-semibold"
                  :class="item.InvoiceOK === 'Y' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                >{{ item.InvoiceOK === "Y" ? "Yes" : "No" }}</span>
              </td>
              <td class="px-3 py-1.5 border text-xs">{{ item.Remark || "-" }}</td>
            </tr>
            <tr v-if="!(selected.Items ?? selected.items ?? []).length">
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
const plantMap = ref({});
const plantName = (code) => plantMap.value[code] || code || "-";

const list = ref([]);
const total = ref(0);
const page = ref(1);
const per_page = ref(10);
const loading = ref(false);

const search = ref("");
const filterPlant = ref(undefined);
const fromDate = ref(undefined);
const toDate = ref(undefined);

const viewModal = ref(false);
const selected = ref(null);

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
      from_date: fromDate.value || "",
      to_date: toDate.value || "",
      per_page: per_page.value,
      page: page.value,
    }).toString();
    const res = await axios.get(
      `${apiBase}/inventory/requisition?${params}`,
      getToken(),
    );
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
  // Fetch full detail (with items) since list may not include them
  try {
    const res = await axios.get(
      `${apiBase}/inventory/requisition/show?RequisitionNo=${row.RequisitionNo}&PlantCode=${row.PlantCode}`,
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
    path: "/inventory/requisition/edit",
    query: { RequisitionNo: row.RequisitionNo, PlantCode: row.PlantCode },
  });
};

const deleteRow = async (row) => {
  try {
    const res = await axios.delete(
      `${apiBase}/inventory/requisition?RequisitionNo=${row.RequisitionNo}&PlantCode=${row.PlantCode}`,
      getToken(),
    );
    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message || "Deleted",
    );
    await fetchAllData();
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

onMounted(async () => {
  const list = await fetchAllPlants();
  plants.value = list;
  list.forEach((p) => { plantMap.value[p.PlantCode] = p.PlantName; });
  fetchAllData();
});
</script>

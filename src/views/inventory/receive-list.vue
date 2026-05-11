<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="w-full sm:w-64">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search Quarantine / Reference No..."
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
        <div class="w-full sm:w-40">
          <label class="text-xs font-medium text-gray-600 block mb-1">Business</label>
          <a-select
            class="w-full"
            placeholder="All Business"
            v-model:value="filterBusiness"
            allow-clear
            @change="onFilterChange"
          >
            <a-select-option v-for="b in businesses" :key="b.Business" :value="b.Business">
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
          @click="$router.push('/inventory/receive/create')"
        >
          + New Receive
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4" data-aos="fade-right">
      Goods Receive ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[900px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Quarantine No</th>
            <th class="border border-white px-4 py-2">Receive Date</th>
            <th class="border border-white px-4 py-2">Movement</th>
            <th class="border border-white px-4 py-2">Business</th>
            <th class="border border-white px-4 py-2">Store</th>
            <th class="border border-white px-4 py-2">Reference No</th>
            <th class="border border-white px-4 py-2">FGTN No</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-for="(row, i) in list" :key="row.QuarantineReceiveNo">
            <td class="px-4 border">{{ (page - 1) * per_page + i + 1 }}</td>
            <td class="px-4 border font-medium text-primary">{{ row.QuarantineReceiveNo }}</td>
            <td class="px-4 border">{{ formatDate(row.QuarantineReceiveDate) }}</td>
            <td class="px-4 border">{{ row.MovementId }}</td>
            <td class="px-4 border">{{ row.Business }}</td>
            <td class="px-4 border">{{ row.StoreCode }}</td>
            <td class="px-4 border">{{ row.ReferenceNo || "—" }}</td>
            <td class="px-4 border">{{ row.FgtnNo || "—" }}</td>
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
                  title="Delete this receive entry?"
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

    <a-modal v-model:open="viewModal" title="Goods Receive Details" :footer="null" width="800px">
      <div v-if="selected" class="space-y-3 text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-3">
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Quarantine No:</span>
            <span class="text-primary font-medium">{{ selected.QuarantineReceiveNo }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Receive Date:</span>
            <span>{{ formatDate(selected.QuarantineReceiveDate) }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Plant:</span>
            <span>{{ selected.PlantCode }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Movement:</span>
            <span>{{ selected.MovementId }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Business:</span>
            <span>{{ selected.Business }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Store:</span>
            <span>{{ selected.StoreCode }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">FGTN No:</span>
            <span>{{ selected.FgtnNo || "—" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Reference No:</span>
            <span>{{ selected.ReferenceNo || "—" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Reference Date:</span>
            <span>{{ formatDate(selected.ReferenceDate) || "—" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Created By:</span>
            <span>{{ selected.CreateBy || "—" }}</span>
          </div>
        </div>
        <div v-if="selected.Comment" class="border-b pb-2">
          <span class="font-semibold text-gray-600">Comment:</span>
          <span class="ml-2">{{ selected.Comment }}</span>
        </div>
        <table class="w-full border border-collapse mt-2">
          <thead>
            <tr class="bg-primary text-white text-xs">
              <th class="border border-white px-3 py-1.5 text-left">#</th>
              <th class="border border-white px-3 py-1.5 text-left">Product</th>
              <th class="border border-white px-3 py-1.5 text-left">Batch</th>
              <th class="border border-white px-3 py-1.5 text-right">Qty</th>
              <th class="border border-white px-3 py-1.5 text-left">Carton</th>
              <th class="border border-white px-3 py-1.5 text-left">MFG</th>
              <th class="border border-white px-3 py-1.5 text-left">Expire</th>
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
              <td class="px-3 py-1.5 border text-xs">{{ item.CartonPack || "—" }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ formatDate(item.MFGDate) || "—" }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ formatDate(item.ExpireDate) || "—" }}</td>
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
    const res = await axios.get(`${apiBase}/inventory/receive?${params}`, getToken());
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
      `${apiBase}/inventory/receive/show?QuarantineReceiveNo=${encodeURIComponent(row.QuarantineReceiveNo)}`,
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
    path: "/inventory/receive/edit",
    query: { QuarantineReceiveNo: row.QuarantineReceiveNo },
  });
};

const deleteRow = async (row) => {
  try {
    const res = await axios.delete(
      `${apiBase}/inventory/receive?QuarantineReceiveNo=${encodeURIComponent(row.QuarantineReceiveNo)}`,
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

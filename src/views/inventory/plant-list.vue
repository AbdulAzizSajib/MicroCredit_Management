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
        <div class="w-full sm:w-40">
          <label class="text-xs font-medium text-gray-600 block mb-1">Depot Code</label>
          <a-input
            placeholder="Depot code..."
            v-model:value="filterDepot"
            allow-clear
            @change="onSearchChange"
          />
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
          @click="$router.push('/inventory/plant/create')"
        >
          + Create Plant
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Plants ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Code</th>
            <th class="border border-white px-4 py-2">Plant Name</th>
            <th class="border border-white px-4 py-2">Address</th>
            <th class="border border-white px-4 py-2">Phone</th>
            <th class="border border-white px-4 py-2">Depot</th>
            <th class="border border-white px-4 py-2 text-center">Active</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in list" :key="row.PlantCode">
            <td class="px-4 py-2 border">{{ (page - 1) * per_page + i + 1 }}</td>
            <td class="px-4 py-2 border font-medium text-primary">{{ row.PlantCode }}</td>
            <td class="px-4 py-2 border">{{ row.PlantName }}</td>
            <td class="px-4 py-2 border">{{ row.PlantAddress || "-" }}</td>
            <td class="px-4 py-2 border">{{ row.PlantPhone || "-" }}</td>
            <td class="px-4 py-2 border">{{ row.DepotCode || "-" }}</td>
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
                    @click="$router.push({ path: '/inventory/plant/edit', query: { PlantCode: row.PlantCode } })"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </a-tooltip>
                <a-popconfirm
                  title="Delete this plant?"
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
              No plants found.
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
    <a-modal v-model:open="viewModal" title="Plant Details" :footer="null" width="600px">
      <div v-if="selected" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Plant Code:</span>
          <span>{{ selected.PlantCode }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Plant Name:</span>
          <span>{{ selected.PlantName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1 col-span-2">
          <span class="font-semibold text-gray-600">Address:</span>
          <span>{{ selected.PlantAddress || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Email:</span>
          <span>{{ selected.PlantEmail || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Phone:</span>
          <span>{{ selected.PlantPhone || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Depot Code:</span>
          <span>{{ selected.DepotCode || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">MM Plant ID:</span>
          <span>{{ selected.MM_PlantId ?? "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Active:</span>
          <span>{{ selected.Active === "Y" ? "Yes" : "No" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Update Undelivered:</span>
          <span>{{ selected.UpdateUndeliverd === "Y" ? "Yes" : "No" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Production Receive:</span>
          <span>{{ selected.ProductionReceive === "Y" ? "Yes" : "No" }}</span>
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
import { clearPlantsCache } from "./plants-api";

const router = useRouter();

const list = ref([]);
const total = ref(0);
const page = ref(1);
const per_page = ref(10);
const loading = ref(false);

const search = ref("");
const filterDepot = ref("");
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
      Active: filterActive.value || "",
      DepotCode: filterDepot.value || "",
      per_page: per_page.value,
      page: page.value,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/plant?${params}`, getToken());
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
      `${apiBase}/inventory/plant/show?PlantCode=${row.PlantCode}`,
      getToken(),
    );
    const detail = res?.data?.data ?? res?.data;
    if (detail) selected.value = { ...row, ...detail };
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const deleteRow = async (row) => {
  try {
    const res = await axios.delete(
      `${apiBase}/inventory/plant?PlantCode=${row.PlantCode}`,
      getToken(),
    );
    showNotification(
      res?.data?.success !== false ? "success" : "error",
      res?.data?.message || "Deleted",
    );
    clearPlantsCache();
    await fetchList();
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

onMounted(fetchList);
</script>

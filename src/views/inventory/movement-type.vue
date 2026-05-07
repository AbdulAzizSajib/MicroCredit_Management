<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="w-full sm:w-64">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search by id or type..."
            v-model:value="search"
            allow-clear
            @change="onSearchChange"
          />
        </div>
        <div class="w-full sm:w-44">
          <label class="text-xs font-medium text-gray-600 block mb-1">Production Data</label>
          <a-select
            class="w-full"
            placeholder="All"
            v-model:value="filterProduction"
            allow-clear
            @change="onFilterChange"
          >
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
        <button
          class="bg-primary text-white px-4 py-2 rounded font-semibold sm:ml-auto"
          @click="openCreate"
        >
          + Create Movement Type
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Movement Types ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[800px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Movement</th>
            <th class="border border-white px-4 py-2">Description</th>
            <th class="border border-white px-4 py-2 text-center">Production Data</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in list" :key="row.MovementId">
            <td class="px-4 py-2 border">{{ (page - 1) * per_page + i + 1 }}</td>
            <td class="px-4 py-2 border">
              <div class="flex items-center gap-2">
                <span class="text-gray-700">{{ row.MovementType }}</span>
                <span
                  class="inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold tracking-wide"
                >
                  {{ row.MovementId }}
                </span>
              </div>
            </td>
            <td class="px-4 py-2 border">{{ row.MovmentDescription || "-" }}</td>
            <td class="px-4 py-2 border text-center">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="row.ProductionData === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
              >
                {{ row.ProductionData === "Y" ? "Yes" : "No" }}
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
                    @click="openEdit(row)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </a-tooltip>
                <a-popconfirm
                  title="Delete this movement type?"
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
            <td colspan="5" class="px-4 py-6 border text-center text-gray-500">
              No movement type found.
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

    <!-- Create / Edit Modal -->
    <a-modal
      v-model:open="formModal"
      :title="isEditing ? 'Edit Movement Type' : 'Create Movement Type'"
      :footer="null"
      width="600px"
      :mask-closable="false"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Movement ID <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="3 chars (e.g. GR1)"
            v-model:value="form.MovementId"
            :maxlength="3"
            :disabled="isEditing"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Production Data <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.ProductionData">
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Movement Type <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Movement type name"
            v-model:value="form.MovementType"
            :maxlength="30"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">Description</label>
          <a-textarea
            placeholder="Describe the movement"
            v-model:value="form.MovmentDescription"
            :maxlength="100"
            :rows="3"
          />
        </div>
      </div>

      <div class="flex gap-3 mt-5 justify-end">
        <button
          class="bg-gray-200 text-gray-700 px-5 py-2 rounded hover:bg-gray-300"
          :disabled="isSaving"
          @click="formModal = false"
          type="button"
        >
          Cancel
        </button>
        <button
          class="bg-primary text-white px-5 py-2 rounded hover:opacity-90 disabled:opacity-60"
          :disabled="isSaving"
          @click="save"
          type="button"
        >
          {{ isSaving ? "Saving..." : isEditing ? "Update" : "Save" }}
        </button>
      </div>
    </a-modal>

    <!-- View Modal -->
    <a-modal v-model:open="viewModal" title="Movement Type Details" :footer="null" width="520px">
      <div v-if="selected" class="grid grid-cols-1 gap-y-2 text-sm">
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Movement ID:</span>
          <span>{{ selected.MovementId }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Movement Type:</span>
          <span>{{ selected.MovementType }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Description:</span>
          <span class="text-right max-w-[60%]">{{ selected.MovmentDescription || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Production Data:</span>
          <span>{{ selected.ProductionData === "Y" ? "Yes" : "No" }}</span>
        </div>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";

const list = ref([]);
const total = ref(0);
const page = ref(1);
const per_page = ref(10);
const loading = ref(false);

const search = ref("");
const filterProduction = ref(undefined);

const formModal = ref(false);
const viewModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const selected = ref(null);
const editingKey = ref(null);

const blank = () => ({
  MovementId: "",
  MovementType: "",
  MovmentDescription: "",
  ProductionData: "N",
});

const form = ref(blank());

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
      ProductionData: filterProduction.value || "",
      per_page: per_page.value,
      page: page.value,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/movement-type?${params}`, getToken());
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
      `${apiBase}/inventory/movement-type/show?MovementId=${encodeURIComponent(row.MovementId)}`,
      getToken(),
    );
    const detail = res?.data?.data ?? res?.data;
    if (detail) selected.value = { ...row, ...detail };
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const openCreate = () => {
  form.value = blank();
  isEditing.value = false;
  editingKey.value = null;
  formModal.value = true;
};

const openEdit = async (row) => {
  isEditing.value = true;
  editingKey.value = row.MovementId;
  form.value = { ...blank(), ...row };
  formModal.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/movement-type/show?MovementId=${encodeURIComponent(row.MovementId)}`,
      getToken(),
    );
    const detail = res?.data?.data ?? res?.data;
    if (detail) form.value = { ...form.value, ...detail };
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const validate = () => {
  const f = form.value;
  if (!f.MovementId?.trim()) return "Movement ID is required";
  if (f.MovementId.length > 3) return "Movement ID must be 3 characters max";
  if (!f.MovementType?.trim()) return "Movement Type is required";
  if (f.MovementType.length > 30) return "Movement Type must be 30 characters max";
  if (f.MovmentDescription && f.MovmentDescription.length > 100)
    return "Description must be 100 characters max";
  if (!f.ProductionData) return "Production Data is required";
  return null;
};

const save = async () => {
  const err = validate();
  if (err) {
    showNotification("error", err);
    return;
  }
  isSaving.value = true;
  try {
    const payload = { ...form.value };
    let res;
    if (isEditing.value) {
      res = await axios.put(
        `${apiBase}/inventory/movement-type?MovementId=${encodeURIComponent(editingKey.value)}`,
        payload,
        getToken(),
      );
    } else {
      res = await axios.post(`${apiBase}/inventory/movement-type`, payload, getToken());
    }
    if (res?.data?.success !== false) {
      showNotification(
        "success",
        res?.data?.message ||
          (isEditing.value ? "Movement type updated" : "Movement type created"),
      );
      formModal.value = false;
      await fetchList();
    } else {
      showNotification("error", res?.data?.message || "Operation failed");
    }
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isSaving.value = false;
  }
};

const deleteRow = async (row) => {
  try {
    const res = await axios.delete(
      `${apiBase}/inventory/movement-type?MovementId=${encodeURIComponent(row.MovementId)}`,
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

onMounted(fetchList);
</script>

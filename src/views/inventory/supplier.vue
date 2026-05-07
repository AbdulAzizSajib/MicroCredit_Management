<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="w-full sm:w-64">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search by code, name or mobile..."
            v-model:value="search"
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
          @click="openCreate"
        >
          + Create Supplier
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Suppliers ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Supplier</th>
            <th class="border border-white px-4 py-2">Address</th>
            <th class="border border-white px-4 py-2">Mobile No</th>
            <th class="border border-white px-4 py-2 text-center">Active</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in list" :key="row.SupplierCode || i">
            <td class="px-4 py-2 border">{{ (page - 1) * per_page + i + 1 }}</td>
            <td class="px-4 py-2 border">
              <div class="flex items-center gap-2">
                <span class="text-gray-700">{{ row.SupplierName }}</span>
                <span
                  v-if="row.SupplierCode"
                  class="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold tracking-wide"
                >
                  {{ row.SupplierCode }}
                </span>
              </div>
            </td>
            <td class="px-4 py-2 border">{{ row.Address }}</td>
            <td class="px-4 py-2 border">{{ row.MobileNo }}</td>
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
                    @click="openEdit(row)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </a-tooltip>
                <a-popconfirm
                  title="Delete this supplier?"
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
            <td colspan="6" class="px-4 py-6 border text-center text-gray-500">
              No supplier found.
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
      :title="isEditing ? 'Edit Supplier' : 'Create Supplier'"
      :footer="null"
      width="640px"
      :mask-closable="false"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Supplier Code
          </label>
          <a-input
            placeholder="Max 10 chars (e.g. SUP001)"
            v-model:value="form.SupplierCode"
            :maxlength="10"
            :disabled="isEditing"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Active <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.Active">
            <a-select-option value="Y">Active</a-select-option>
            <a-select-option value="N">Inactive</a-select-option>
          </a-select>
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Supplier Name <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Supplier name"
            v-model:value="form.SupplierName"
            :maxlength="150"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Address <span class="text-red-500">*</span>
          </label>
          <a-textarea
            placeholder="Full address"
            v-model:value="form.Address"
            :maxlength="500"
            :rows="3"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Mobile No <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="01XXXXXXXXX"
            v-model:value="form.MobileNo"
            :maxlength="15"
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
    <a-modal v-model:open="viewModal" title="Supplier Details" :footer="null" width="560px">
      <div v-if="selected" class="grid grid-cols-1 gap-y-2 text-sm">
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Supplier Code:</span>
          <span>{{ selected.SupplierCode || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Supplier Name:</span>
          <span>{{ selected.SupplierName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Address:</span>
          <span class="text-right max-w-[60%]">{{ selected.Address }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Mobile No:</span>
          <span>{{ selected.MobileNo }}</span>
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
const filterActive = ref(undefined);

const formModal = ref(false);
const viewModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const selected = ref(null);
const editingKey = ref(null);

const blank = () => ({
  SupplierCode: "",
  SupplierName: "",
  Address: "",
  MobileNo: "",
  Active: "Y",
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
      Active: filterActive.value || "",
      per_page: per_page.value,
      page: page.value,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/supplier?${params}`, getToken());
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
  if (!row.SupplierCode) return;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/supplier/show?SupplierCode=${encodeURIComponent(row.SupplierCode)}`,
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
  editingKey.value = row.SupplierCode;
  form.value = { ...blank(), ...row };
  formModal.value = true;
  if (!row.SupplierCode) return;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/supplier/show?SupplierCode=${encodeURIComponent(row.SupplierCode)}`,
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
  if (f.SupplierCode && f.SupplierCode.length > 10)
    return "Supplier Code must be 10 characters max";
  if (!f.SupplierName?.trim()) return "Supplier Name is required";
  if (f.SupplierName.length > 150) return "Supplier Name must be 150 characters max";
  if (!f.Address?.trim()) return "Address is required";
  if (f.Address.length > 500) return "Address must be 500 characters max";
  if (!f.MobileNo?.trim()) return "Mobile No is required";
  if (f.MobileNo.length > 15) return "Mobile No must be 15 characters max";
  {
    const m = f.MobileNo.replace(/[\s\-()]/g, "");
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(m))
      return "Invalid Mobile No (e.g. 01711111111 or +8801711111111)";
  }
  if (!f.Active) return "Active is required";
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
        `${apiBase}/inventory/supplier?SupplierCode=${encodeURIComponent(editingKey.value)}`,
        payload,
        getToken(),
      );
    } else {
      res = await axios.post(`${apiBase}/inventory/supplier`, payload, getToken());
    }
    if (res?.data?.success !== false) {
      showNotification(
        "success",
        res?.data?.message || (isEditing.value ? "Supplier updated" : "Supplier created"),
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
  if (!row.SupplierCode) {
    showNotification("error", "Cannot delete: missing Supplier Code");
    return;
  }
  try {
    const res = await axios.delete(
      `${apiBase}/inventory/supplier?SupplierCode=${encodeURIComponent(row.SupplierCode)}`,
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

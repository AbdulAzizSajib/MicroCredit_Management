<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="w-full sm:w-64">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search by code, name or company..."
            v-model:value="search"
            allow-clear
            @change="onSearchChange"
          />
        </div>
        <div class="w-full sm:w-36">
          <label class="text-xs font-medium text-gray-600 block mb-1">Delivered</label>
          <a-select
            class="w-full"
            placeholder="All"
            v-model:value="filterDelivered"
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
          + Create Business
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Business ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[1100px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Business</th>
            <th class="border border-white px-4 py-2">Company Name</th>
            <th class="border border-white px-4 py-2">VAT Reg No</th>
            <th class="border border-white px-4 py-2">Address</th>
            <th class="border border-white px-4 py-2 text-center">Delivered</th>
            <th class="border border-white px-4 py-2 text-center">Inv Approved</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in list" :key="row.Business">
            <td class="px-4 py-2 border">{{ (page - 1) * per_page + i + 1 }}</td>
            <td class="px-4 py-2 border">
              <div class="flex items-center gap-2">
                <span class="text-gray-700">{{ row.BusinessName }}</span>
                <span
                  class="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold tracking-wide"
                >
                  {{ row.Business }}
                </span>
              </div>
            </td>
            <td class="px-4 py-2 border">{{ row.CompanyName }}</td>
            <td class="px-4 py-2 border">{{ row.VatRegNo }}</td>
            <td class="px-4 py-2 border">{{ row.Address }}</td>
            <td class="px-4 py-2 border text-center">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="row.Delivered === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
              >
                {{ row.Delivered === "Y" ? "Yes" : "No" }}
              </span>
            </td>
            <td class="px-4 py-2 border text-center">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="row.InvApproved === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
              >
                {{ row.InvApproved === "Y" ? "Yes" : "No" }}
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
                  title="Delete this business?"
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
              No business found.
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
      :title="isEditing ? 'Edit Business' : 'Create Business'"
      :footer="null"
      width="700px"
      :mask-closable="false"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Business Code <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="2 chars (e.g. AG)"
            v-model:value="form.Business"
            :maxlength="2"
            :disabled="isEditing"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Business Name <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Business name"
            v-model:value="form.BusinessName"
            :maxlength="40"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Company Name <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Company name"
            v-model:value="form.CompanyName"
            :maxlength="30"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            VAT Reg No <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="VAT registration number"
            v-model:value="form.VatRegNo"
            :maxlength="50"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Address <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Address"
            v-model:value="form.Address"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Stored</label>
          <a-select class="w-full" v-model:value="form.Stored" allow-clear>
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Stored Comment</label>
          <a-input
            placeholder="Comment"
            v-model:value="form.StoredComment"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Delivered <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.Delivered">
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Server Name <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Server name"
            v-model:value="form.ServerName"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Delivery Notification <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.DeliveryNotification">
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Inv Approved <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.InvApproved">
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
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
    <a-modal v-model:open="viewModal" title="Business Details" :footer="null" width="640px">
      <div v-if="selected" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Code:</span>
          <span>{{ selected.Business }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Business Name:</span>
          <span>{{ selected.BusinessName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Company Name:</span>
          <span>{{ selected.CompanyName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">VAT Reg No:</span>
          <span>{{ selected.VatRegNo }}</span>
        </div>
        <div class="flex justify-between border-b pb-1 col-span-2">
          <span class="font-semibold text-gray-600">Address:</span>
          <span>{{ selected.Address }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Stored:</span>
          <span>{{ selected.Stored || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Stored Comment:</span>
          <span>{{ selected.StoredComment || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Delivered:</span>
          <span>{{ selected.Delivered === "Y" ? "Yes" : "No" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Server Name:</span>
          <span>{{ selected.ServerName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Delivery Notification:</span>
          <span>{{ selected.DeliveryNotification === "Y" ? "Yes" : "No" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Inv Approved:</span>
          <span>{{ selected.InvApproved === "Y" ? "Yes" : "No" }}</span>
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
import { clearBusinessCache } from "./business-api";

const list = ref([]);
const total = ref(0);
const page = ref(1);
const per_page = ref(10);
const loading = ref(false);

const search = ref("");
const filterDelivered = ref(undefined);

const formModal = ref(false);
const viewModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const selected = ref(null);
const editingKey = ref(null);

const blank = () => ({
  Business: "",
  BusinessName: "",
  CompanyName: "",
  VatRegNo: "",
  Address: "",
  Stored: undefined,
  StoredComment: "",
  Delivered: "Y",
  ServerName: "",
  DeliveryNotification: "Y",
  InvApproved: "Y",
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
      Delivered: filterDelivered.value || "",
      per_page: per_page.value,
      page: page.value,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/business?${params}`, getToken());
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
      `${apiBase}/inventory/business/show?Business=${encodeURIComponent(row.Business)}`,
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
  editingKey.value = row.Business;
  form.value = { ...blank(), ...row };
  formModal.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/business/show?Business=${encodeURIComponent(row.Business)}`,
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
  if (!f.Business?.trim()) return "Business code is required";
  if (f.Business.length > 2) return "Business code must be 2 characters max";
  if (!f.BusinessName?.trim()) return "Business name is required";
  if (f.BusinessName.length > 40) return "Business name must be 40 characters max";
  if (!f.CompanyName?.trim()) return "Company name is required";
  if (f.CompanyName.length > 30) return "Company name must be 30 characters max";
  if (!f.VatRegNo?.trim()) return "VAT Reg No is required";
  if (f.VatRegNo.length > 50) return "VAT Reg No must be 50 characters max";
  if (!f.Address?.trim()) return "Address is required";
  if (f.Address.length > 50) return "Address must be 50 characters max";
  if (f.StoredComment && f.StoredComment.length > 50) return "Stored Comment must be 50 characters max";
  if (!f.Delivered) return "Delivered is required";
  if (!f.ServerName?.trim()) return "Server Name is required";
  if (f.ServerName.length > 50) return "Server Name must be 50 characters max";
  if (!f.DeliveryNotification) return "Delivery Notification is required";
  if (!f.InvApproved) return "Inv Approved is required";
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
        `${apiBase}/inventory/business?Business=${encodeURIComponent(editingKey.value)}`,
        payload,
        getToken(),
      );
    } else {
      res = await axios.post(`${apiBase}/inventory/business`, payload, getToken());
    }
    if (res?.data?.success !== false) {
      showNotification(
        "success",
        res?.data?.message || (isEditing.value ? "Business updated" : "Business created"),
      );
      clearBusinessCache();
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
      `${apiBase}/inventory/business?Business=${encodeURIComponent(row.Business)}`,
      getToken(),
    );
    showNotification(
      res?.data?.success !== false ? "success" : "error",
      res?.data?.message || "Deleted",
    );
    clearBusinessCache();
    await fetchList();
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

onMounted(fetchList);
</script>

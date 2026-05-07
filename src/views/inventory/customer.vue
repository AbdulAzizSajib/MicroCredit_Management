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
        <div class="w-full sm:w-44">
          <label class="text-xs font-medium text-gray-600 block mb-1">Plant</label>
          <a-select
            class="w-full"
            placeholder="All Plants"
            v-model:value="filterPlant"
            allow-clear
            show-search
            :filter-option="filterOption"
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
        <div class="w-full sm:w-44">
          <label class="text-xs font-medium text-gray-600 block mb-1">Business</label>
          <a-select
            class="w-full"
            placeholder="All Business"
            v-model:value="filterBusiness"
            allow-clear
            show-search
            :filter-option="filterOption"
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
          + Create Customer
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Customers ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[1100px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Customer</th>
            <th class="border border-white px-4 py-2">Contact Person</th>
            <th class="border border-white px-4 py-2">Mobile</th>
            <th class="border border-white px-4 py-2">Business</th>
            <th class="border border-white px-4 py-2">Plant</th>
            <th class="border border-white px-4 py-2">Type</th>
            <th class="border border-white px-4 py-2 text-center">Active</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in list" :key="row.CustomerCode + (row.PlantCode || '')">
            <td class="px-4 py-2 border">{{ (page - 1) * per_page + i + 1 }}</td>
            <td class="px-4 py-2 border">
              <div class="flex items-center gap-2">
                <span class="text-gray-700">{{ row.CustomerName }}</span>
                <span
                  class="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold tracking-wide"
                >
                  {{ row.CustomerCode }}
                </span>
              </div>
            </td>
            <td class="px-4 py-2 border">{{ row.ContactPerson }}</td>
            <td class="px-4 py-2 border">{{ row.Mobile }}</td>
            <td class="px-4 py-2 border">{{ row.Business }}</td>
            <td class="px-4 py-2 border">{{ row.PlantCode }}</td>
            <td class="px-4 py-2 border">{{ row.CustomerType }}</td>
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
                  title="Delete this customer?"
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
              No customer found.
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
      :title="isEditing ? 'Edit Customer' : 'Create Customer'"
      :footer="null"
      width="780px"
      :mask-closable="false"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Customer Code <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Max 10 chars"
            v-model:value="form.CustomerCode"
            :maxlength="10"
            :disabled="isEditing"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Plant <span class="text-red-500">*</span>
          </label>
          <a-select
            class="w-full"
            placeholder="Select Plant"
            v-model:value="form.PlantCode"
            show-search
            :filter-option="filterOption"
            option-filter-prop="label"
            :disabled="isEditing"
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
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Customer Name <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Customer name"
            v-model:value="form.CustomerName"
            :maxlength="100"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Contact Person <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Contact name"
            v-model:value="form.ContactPerson"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Email <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="email@example.com"
            v-model:value="form.Email"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Phone <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Phone"
            v-model:value="form.Phone"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Mobile <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="01XXXXXXXXX"
            v-model:value="form.Mobile"
            :maxlength="50"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Address Line 1 <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Address line 1"
            v-model:value="form.Add1"
            :maxlength="255"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Address Line 2 <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Address line 2"
            v-model:value="form.Add2"
            :maxlength="255"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Business <span class="text-red-500">*</span>
          </label>
          <a-select
            class="w-full"
            placeholder="Select Business"
            v-model:value="form.Business"
            show-search
            :filter-option="filterOption"
            option-filter-prop="label"
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
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Customer Type <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.CustomerType">
            <a-select-option value="RETAIL">RETAIL</a-select-option>
            <a-select-option value="WHOLESALE">WHOLESALE</a-select-option>
            <a-select-option value="DEALER">DEALER</a-select-option>
            <a-select-option value="CORPORATE">CORPORATE</a-select-option>
          </a-select>
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
    <a-modal v-model:open="viewModal" title="Customer Details" :footer="null" width="700px">
      <div v-if="selected" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Code:</span>
          <span>{{ selected.CustomerCode }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Plant Code:</span>
          <span>{{ selected.PlantCode }}</span>
        </div>
        <div class="flex justify-between border-b pb-1 col-span-2">
          <span class="font-semibold text-gray-600">Customer Name:</span>
          <span>{{ selected.CustomerName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Contact Person:</span>
          <span>{{ selected.ContactPerson }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Email:</span>
          <span>{{ selected.Email }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Phone:</span>
          <span>{{ selected.Phone }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Mobile:</span>
          <span>{{ selected.Mobile }}</span>
        </div>
        <div class="flex justify-between border-b pb-1 col-span-2">
          <span class="font-semibold text-gray-600">Address 1:</span>
          <span>{{ selected.Add1 }}</span>
        </div>
        <div class="flex justify-between border-b pb-1 col-span-2">
          <span class="font-semibold text-gray-600">Address 2:</span>
          <span>{{ selected.Add2 }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Business:</span>
          <span>{{ selected.Business }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Customer Type:</span>
          <span>{{ selected.CustomerType }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Active:</span>
          <span>{{ selected.Active === "Y" ? "Yes" : "No" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Created:</span>
          <span>{{ selected.CreateDate || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Edited:</span>
          <span>{{ selected.EditDate || "-" }}</span>
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
import { fetchAllPlants } from "./plants-api";
import { fetchAllBusinesses } from "./business-api";

const list = ref([]);
const total = ref(0);
const page = ref(1);
const per_page = ref(10);
const loading = ref(false);

const search = ref("");
const filterPlant = ref(undefined);
const filterBusiness = ref(undefined);
const filterActive = ref(undefined);

const plants = ref([]);
const businesses = ref([]);

const formModal = ref(false);
const viewModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const selected = ref(null);
const editingKey = ref({ CustomerCode: null, PlantCode: null });

const blank = () => ({
  CustomerCode: "",
  PlantCode: undefined,
  CustomerName: "",
  ContactPerson: "",
  Add1: "",
  Add2: "",
  Phone: "",
  Mobile: "",
  Email: "",
  Business: undefined,
  CustomerType: "RETAIL",
  Active: "Y",
});

const form = ref(blank());

const filterOption = (input, option) => {
  const text = (option?.label ?? "").toString().toLowerCase();
  return text.includes(input.toLowerCase());
};

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
      Business: filterBusiness.value || "",
      Active: filterActive.value || "",
      per_page: per_page.value,
      page: page.value,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/customer?${params}`, getToken());
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

const showUrl = (row) =>
  `${apiBase}/inventory/customer/show?CustomerCode=${encodeURIComponent(
    row.CustomerCode,
  )}&PlantCode=${encodeURIComponent(row.PlantCode)}`;

const viewRow = async (row) => {
  selected.value = row;
  viewModal.value = true;
  try {
    const res = await axios.get(showUrl(row), getToken());
    const detail = res?.data?.data ?? res?.data;
    if (detail) selected.value = { ...row, ...detail };
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const openCreate = () => {
  form.value = blank();
  isEditing.value = false;
  editingKey.value = { CustomerCode: null, PlantCode: null };
  formModal.value = true;
};

const openEdit = async (row) => {
  isEditing.value = true;
  editingKey.value = { CustomerCode: row.CustomerCode, PlantCode: row.PlantCode };
  form.value = { ...blank(), ...row };
  formModal.value = true;
  try {
    const res = await axios.get(showUrl(row), getToken());
    const detail = res?.data?.data ?? res?.data;
    if (detail) form.value = { ...form.value, ...detail };
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const validate = () => {
  const f = form.value;
  if (!f.CustomerCode?.trim()) return "Customer Code is required";
  if (f.CustomerCode.length > 10) return "Customer Code must be 10 characters max";
  if (!f.PlantCode) return "Please select a Plant";
  if (!f.CustomerName?.trim()) return "Customer Name is required";
  if (f.CustomerName.length > 100) return "Customer Name must be 100 characters max";
  if (!f.ContactPerson?.trim()) return "Contact Person is required";
  if (f.ContactPerson.length > 50) return "Contact Person must be 50 characters max";
  if (!f.Add1?.trim()) return "Address Line 1 is required";
  if (f.Add1.length > 255) return "Address Line 1 must be 255 characters max";
  if (!f.Add2?.trim()) return "Address Line 2 is required";
  if (f.Add2.length > 255) return "Address Line 2 must be 255 characters max";
  if (!f.Phone?.trim()) return "Phone is required";
  if (f.Phone.length > 50) return "Phone must be 50 characters max";
  if (!/^[\d+\-\s()]+$/.test(f.Phone.trim()))
    return "Phone can only contain digits, +, -, () and spaces";
  {
    const digits = f.Phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15)
      return "Phone must be 7–15 digits (e.g. 02-9999999)";
  }
  if (!f.Mobile?.trim()) return "Mobile is required";
  if (f.Mobile.length > 50) return "Mobile must be 50 characters max";
  {
    const m = f.Mobile.replace(/[\s\-()]/g, "");
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(m))
      return "Invalid Mobile (e.g. 01711111111 or +8801711111111)";
  }
  if (!f.Email?.trim()) return "Email is required";
  if (f.Email.length > 50) return "Email must be 50 characters max";
  if (!/^\S+@\S+\.\S+$/.test(f.Email)) return "Email is invalid";
  if (!f.Business) return "Please select a Business";
  if (!f.CustomerType?.trim()) return "Customer Type is required";
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
        `${apiBase}/inventory/customer?CustomerCode=${encodeURIComponent(
          editingKey.value.CustomerCode,
        )}&PlantCode=${encodeURIComponent(editingKey.value.PlantCode)}`,
        payload,
        getToken(),
      );
    } else {
      res = await axios.post(`${apiBase}/inventory/customer`, payload, getToken());
    }
    if (res?.data?.success !== false) {
      showNotification(
        "success",
        res?.data?.message || (isEditing.value ? "Customer updated" : "Customer created"),
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
      `${apiBase}/inventory/customer?CustomerCode=${encodeURIComponent(
        row.CustomerCode,
      )}&PlantCode=${encodeURIComponent(row.PlantCode)}`,
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
  const [allPlants, allBusinesses] = await Promise.all([
    fetchAllPlants(),
    fetchAllBusinesses(),
  ]);
  plants.value = allPlants;
  businesses.value = allBusinesses;
  fetchList();
});
</script>

<template>
  <MainLayout>
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input
          placeholder="Search here..."
          v-model:value="search"
          @input="handleSearch"
          class="w-64"
        />
      </div>
      <div class="mb-4">
        <button
          class="bg-primary text-white px-4 py-2 rounded"
          @click="openCreateModal"
        >
          Add Collection
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4">
      Member Collection ({{ total }})
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">ID</th>
          <th class="border border-white px-4 py-2">Customer Code</th>
          <th class="border border-white px-4 py-2">Customer Name</th>
          <th class="border border-white px-4 py-2">Period</th>
          <th class="border border-white px-4 py-2 text-right">Amount</th>
          <th class="border border-white px-4 py-2">Remarks</th>
          <th class="border border-white px-4 py-2">Date</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.ID }}</td>
          <td class="px-4 border">{{ data?.CustomerCode }}</td>
          <td class="px-4 border">{{ data?.CustomerName || '-' }}</td>
          <td class="px-4 border">{{ formatPeriod(data?.Period) }}</td>
          <td class="px-4 border text-right">{{ formatAmount(Number(data?.Amount || 0)) }}</td>
          <td class="px-4 border">{{ data?.Remarks }}</td>
          <td class="px-4 border">{{ formatDate(data?.Date) }}</td>
          <td class="px-4 border text-center">
            <div class="flex justify-center gap-x-3">
              <button
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                @click="openEditModal(data)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <a-popconfirm
                @confirm="deleteCollection(data?.ID)"
                title="Are you sure?"
                ok-text="Yes"
                cancel-text="No"
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
      </tbody>
    </table>

    <div
      v-if="loading"
      class="mt-2 text-center text-gray-500 flex justify-center items-center gap-2"
    >
      <span><a-spin></a-spin></span>
    </div>

    <a-pagination
      class="mt-4"
      v-model:current="page"
      :page-size="per_page"
      :total="total"
      :show-size-changer="false"
      :show-total="(total) => `Total ${total} items`"
      @change="
        (pageNo) => {
          page = pageNo;
          fetchAllData();
        }
      "
      v-if="total > per_page"
    />

    <!-- Create Modal -->
    <a-modal
      v-model:open="isCreateModalVisible"
      title="Add Collection"
      @cancel="isCreateModalVisible = false"
      :footer="null"
      width="550px"
    >
      <form @submit.prevent="createCollection">
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name <span class="text-red-500">*</span></label>
            <a-select
              show-search
              class="w-full"
              placeholder="Search Customer"
              v-model:value="formData.CustomerCode"
              :filter-option="false"
              @input="searchCustomer($event.target.value)"
              @change="(val) => onCustomerChange(val, 'create')"
              allowClear
            >
              <a-select-option
                v-for="c in customerList"
                :key="c.AMCode"
                :value="c.CustomerCode"
              >
                {{ c.AMDetails }} ({{ c.CustomerCode }})
              </a-select-option>
            </a-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">AM Code</label>
            <a-input :value="formData.AMCode" disabled placeholder="Auto filled" />
          </div>
          <div v-if="customerInfo" class="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
            <div class="text-center">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">Total</div>
              <div class="text-sm font-bold text-blue-700">{{ Number(customerInfo.TotalAmount || 0).toFixed(2) }}</div>
            </div>
            <div class="text-center border-x">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">Receivable</div>
              <div class="text-sm font-bold text-green-700">{{ Number(customerInfo.TotalGivenAmount || 0).toFixed(2) }}</div>
            </div>
            <div class="text-center">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">Due</div>
              <div class="text-sm font-bold text-red-600">{{ Number(customerInfo.DueAmount || 0).toFixed(2) }}</div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date <span class="text-red-500">*</span></label>
            <a-date-picker
              class="w-full"
              placeholder="Select Date"
              value-format="YYYY-MM-DD"
              v-model:value="formData.Date"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Period <span class="text-red-500">*</span></label>
            <a-week-picker
              v-if="formData.CollectionType === 'W'"
              class="w-full"
              placeholder="Select Week"
              value-format="YYYYWW"
              format="[Week] WW, YYYY"
              v-model:value="formData.Period"
            />
            <a-month-picker
              v-else
              class="w-full"
              placeholder="Select Month"
              value-format="YYYYMM"
              format="MMM YYYY"
              :disabled-date="disabledPeriodDate"
              v-model:value="formData.Period"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount <span class="text-red-500">*</span></label>
            <a-input-number
              class="w-full"
              v-model:value="formData.Amount"
              placeholder="Amount"
              :precision="2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Remarks <span class="text-red-500">*</span></label>
            <a-textarea v-model:value="formData.Remarks" placeholder="Remarks" :rows="3" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isCreateModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            type="submit"
            :disabled="isCreating"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            {{ isCreating ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal
      v-model:open="isEditModalVisible"
      title="Edit Collection"
      @cancel="isEditModalVisible = false"
      :footer="null"
      width="550px"
    >
      <form @submit.prevent="updateCollection">
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name <span class="text-red-500">*</span></label>
            <a-input
              :value="`${editFormData.CustomerName || ''} (${editFormData.CustomerCode || ''})`"
              disabled
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date <span class="text-red-500">*</span></label>
            <a-date-picker
              class="w-full"
              placeholder="Select Date"
              value-format="YYYY-MM-DD"
              v-model:value="editFormData.Date"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Period <span class="text-red-500">*</span></label>
            <a-week-picker
              v-if="editFormData.CollectionType === 'W'"
              class="w-full"
              placeholder="Select Week"
              value-format="YYYYWW"
              format="[Week] WW, YYYY"
              v-model:value="editFormData.Period"
            />
            <a-month-picker
              v-else
              class="w-full"
              placeholder="Select Month"
              value-format="YYYYMM"
              format="MMM YYYY"
              v-model:value="editFormData.Period"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount <span class="text-red-500">*</span></label>
            <a-input-number
              class="w-full"
              v-model:value="editFormData.Amount"
              placeholder="Amount"
              :precision="2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Remarks <span class="text-red-500">*</span></label>
            <a-textarea v-model:value="editFormData.Remarks" placeholder="Remarks" :rows="3" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isEditModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            type="submit"
            :disabled="isUpdating"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            {{ isUpdating ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";
import dayjs from "dayjs";

const page = ref(1);
const per_page = ref(10);
const total = ref(0);
const search = ref("");
const allData = ref([]);
const loading = ref(false);

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);

const defaultForm = {
  CustomerCode: "",
  CollectionType: "M",
  Date: null,
  Period: null,
  Amount: null,
  Remarks: "",
  AMCode: "",
  JVType: "CSH",
  JVCat: "R",
  Narration: "",
};

const formData = ref({ ...defaultForm });
const editFormData = ref({ ...defaultForm, ID: null });
const customerList = ref([]);
const customerInfo = ref(null);
const allowedPeriods = ref([]);

const currentPeriod = () => {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const disabledPeriodDate = (current) => {
  if (!current) return false;
  const p = `${current.year()}${String(current.month() + 1).padStart(2, "0")}`;
  const allowed = new Set([...allowedPeriods.value, currentPeriod()]);
  return !allowed.has(p);
};

const searchCustomer = async (q) => {
  try {
    const res = await axios.get(`${apiBase}/get_customer_for_saving?q=${q}`, getToken());
    customerList.value = Array.isArray(res.data) ? res.data : res.data?.data || [];
  } catch (error) {
    console.log(error);
  }
};

const onCustomerChange = async (val, mode) => {
  const selected = customerList.value.find(c => c.CustomerCode === val);
  if (mode === 'create') {
    formData.value.AMCode = selected?.AMCode || "";
  } else {
    editFormData.value.AMCode = selected?.AMCode || "";
  }
  if (!val) {
    customerInfo.value = null;
    allowedPeriods.value = [];
    return;
  }
  try {
    const infoRes = await axios.get(`${apiBase}/customer/${val}/info`, getToken());
    customerInfo.value = infoRes?.data?.data?.[0] || null;
  } catch (e) { customerInfo.value = null; }
  try {
    const mRes = await axios.get(`${apiBase}/customer/${val}/missing-installment`, getToken());
    allowedPeriods.value = (mRes?.data?.data || []).map(x => String(x.MissingPeriod));
  } catch (e) { allowedPeriods.value = []; }
  try {
    const res = await axios.get(`${apiBase}/customer/${val}`, getToken());
    const cust = res?.data?.data || {};
    const amount = Number(cust.SavingAmount || 0);
    if (mode === 'create') {
      formData.value.Amount = amount;
      formData.value.CollectionType = cust.CollectionType || 'M';
      formData.value.Period = null;
    } else {
      editFormData.value.Amount = amount;
      editFormData.value.CollectionType = cust.CollectionType || 'M';
    }
  } catch (error) {
    console.log(error);
  }
};

const handleSearch = () => {
  page.value = 1;
  fetchAllData();
};

const formatDate = (date) => {
  return date ? dayjs(date).format("DD-MMM-YYYY") : "";
};

const formatPeriod = (period) => {
  if (!period) return "";
  const s = String(period);
  if (s.length !== 6) return s;
  const year = s.slice(0, 4);
  const month = parseInt(s.slice(4, 6), 10);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[month - 1] || ""} ${year}`;
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// List
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/member-collection?search=${search.value}&limit=${per_page.value}&page=${page.value}`,
      getToken()
    );
    loading.value = false;
    allData.value = res?.data?.data?.data || [];
    total.value = res?.data?.data?.total || 0;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    console.error("Failed to fetch collections:", err);
  }
};

// Create
const openCreateModal = () => {
  formData.value = { ...defaultForm };
  customerInfo.value = null;
  isCreateModalVisible.value = true;
};

const createCollection = async () => {
  if (!formData.value.CustomerCode?.trim()) return showNotification("error", "Customer Name is required.");
  if (!formData.value.Date) return showNotification("error", "Date is required.");
  if (!formData.value.Period) return showNotification("error", "Period is required.");
  if (!formData.value.Amount || formData.value.Amount <= 0) return showNotification("error", "Amount is required.");
  if (!formData.value.Remarks?.trim()) return showNotification("error", "Remarks is required.");
  isCreating.value = true;
  try {
    formData.value.Narration = formData.value.Remarks;
    const res = await axios.post(
      `${apiBase}/member-collection`,
      formData.value,
      getToken()
    );
    isCreating.value = false;
    showNotification("success", res?.data?.message || "Collection created successfully!");
    isCreateModalVisible.value = false;
    formData.value = { ...defaultForm };
    await fetchAllData();
  } catch (error) {
    isCreating.value = false;
    showNotification("error", error?.response?.data?.message || "Failed to create collection.");
  }
};

// Edit
const openEditModal = async (data) => {
  try {
    const res = await axios.get(
      `${apiBase}/member-collection/${data.ID}`,
      getToken()
    );
    const item = res?.data?.data || data;
    let collectionType = 'M';
    try {
      const cRes = await axios.get(`${apiBase}/customer/${item.CustomerCode}`, getToken());
      collectionType = cRes?.data?.data?.CollectionType || 'M';
    } catch (e) { console.log(e); }
    editFormData.value = {
      ID: item.ID,
      CustomerCode: item.CustomerCode,
      CustomerName: item.CustomerName,
      CollectionType: collectionType,
      Date: item.Date ? dayjs(item.Date).format("YYYY-MM-DD") : null,
      Period: item.Period || null,
      Amount: Number(item.Amount) || null,
      Remarks: item.Remarks,
    };
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", "Failed to load collection data.");
  }
};

const updateCollection = async () => {
  if (!editFormData.value.CustomerCode?.trim()) return showNotification("error", "Customer Name is required.");
  if (!editFormData.value.Date) return showNotification("error", "Date is required.");
  if (!editFormData.value.Period) return showNotification("error", "Period is required.");
  if (!editFormData.value.Amount || editFormData.value.Amount <= 0) return showNotification("error", "Amount is required.");
  if (!editFormData.value.Remarks?.trim()) return showNotification("error", "Remarks is required.");
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/member-collection/${editFormData.value.ID}`,
      {
        CustomerCode: editFormData.value.CustomerCode,
        Date: editFormData.value.Date,
        Period: editFormData.value.Period,
        Amount: editFormData.value.Amount,
        Remarks: editFormData.value.Remarks,
      },
      getToken()
    );
    isUpdating.value = false;
    showNotification("success", res?.data?.message || "Collection updated successfully!");
    isEditModalVisible.value = false;
    await fetchAllData();
  } catch (error) {
    isUpdating.value = false;
    showNotification("error", error?.response?.data?.message || "Failed to update collection.");
  }
};

// Delete
const deleteCollection = async (id) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/member-collection/${id}`,
      getToken()
    );
    showNotification("success", res?.data?.message || "Collection deleted successfully!");
    await fetchAllData();
  } catch (error) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || "Failed to delete collection.");
  }
};

onMounted(async () => {
  await fetchAllData();
});
</script>

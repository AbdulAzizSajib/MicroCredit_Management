<template>
  <MainLayout>
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input
          :placeholder="$t('common.searchHere')"
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
          {{ $t('collection.addCollection') }}
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4" data-aos="fade-right">
      {{ $t('collection.title') }} ({{ total }})
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left" data-aos="fade-up" data-aos-delay="150">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">{{ $t('collection.id') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('collection.customerCode') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('collection.customerName') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.period') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('common.amount') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.remarks') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.date') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('common.actions') }}</th>
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
            <div class="flex justify-center items-center gap-1" v-if="data?.IsVoucher === 'N'">
              <a-tooltip :title="$t('common.edit')">
                <button type="button" class="action-btn action-btn-edit" @click="openEditModal(data)">
                  <i class="bi bi-pencil-square"></i>
                </button>
              </a-tooltip>
              <a-popconfirm
                @confirm="deleteCollection(data?.ID)"
                :title="$t('common.areYouSure')"
                :ok-text="$t('common.yes')"
                :cancel-text="$t('common.no')"
              >
                <a-tooltip :title="$t('common.delete')">
                  <button type="button" class="action-btn action-btn-danger">
                    <i class="bi bi-trash3"></i>
                  </button>
                </a-tooltip>
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
      :show-total="(total) => $t('common.totalItems', { total })"
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
      :title="$t('collection.addCollection')"
      @cancel="isCreateModalVisible = false"
      :footer="null"
      width="550px"
    >
      <form @submit.prevent="createCollection">
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('collection.customerName') }} <span class="text-red-500">*</span></label>
            <a-select
              show-search
              class="w-full"
              :placeholder="$t('common.search')"
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
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.amCode') }}</label>
            <a-input :value="formData.AMCode" disabled :placeholder="$t('common.autoGenerated')" />
          </div>
          <div v-if="customerInfo" class="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
            <div class="text-center">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">{{ $t('collection.totalAmount') }}</div>
              <div class="text-sm font-bold text-blue-700">{{ Number(customerInfo.TotalAmount || 0).toFixed(2) }}</div>
            </div>
            <div class="text-center border-x">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">{{ $t('collection.receivable') }}</div>
              <div class="text-sm font-bold text-green-700">{{ Number(customerInfo.TotalGivenAmount || 0).toFixed(2) }}</div>
            </div>
            <div class="text-center">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">{{ $t('collection.dueAmount') }}</div>
              <div class="text-sm font-bold text-red-600">{{ Number(customerInfo.DueAmount || 0).toFixed(2) }}</div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.period') }} <span class="text-red-500">*</span></label>
            <a-week-picker
              v-if="formData.CollectionType === 'W'"
              class="w-full"
              :placeholder="$t('common.period')"
              value-format="YYYYWW"
              format="[Week] WW, YYYY"
              v-model:value="formData.Period"
            />
            <a-month-picker
              v-else
              class="w-full"
              :placeholder="$t('common.period')"
              value-format="YYYYMM"
              format="MMM YYYY"
              :disabled-date="disabledPeriodDate"
              v-model:value="formData.Period"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.amount') }} <span class="text-red-500">*</span></label>
            <a-input-number
              class="w-full"
              v-model:value="formData.Amount"
              :placeholder="$t('common.amount')"
              :precision="2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.remarks') }} <span class="text-red-500">*</span></label>
            <a-textarea v-model:value="formData.Remarks" :placeholder="$t('common.remarks')" :rows="3" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isCreateModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            {{ $t('common.close') }}
          </button>
          <button
            type="submit"
            :disabled="isCreating"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            {{ isCreating ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal
      v-model:open="isEditModalVisible"
      :title="$t('collection.editCollection')"
      @cancel="isEditModalVisible = false"
      :footer="null"
      width="550px"
    >
      <form @submit.prevent="updateCollection">
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('collection.customerName') }} <span class="text-red-500">*</span></label>
            <a-input
              :value="`${editFormData.CustomerName || ''} (${editFormData.CustomerCode || ''})`"
              disabled
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.period') }} <span class="text-red-500">*</span></label>
            <a-week-picker
              v-if="editFormData.CollectionType === 'W'"
              class="w-full"
              :placeholder="$t('common.period')"
              value-format="YYYYWW"
              format="[Week] WW, YYYY"
              v-model:value="editFormData.Period"
            />
            <a-month-picker
              v-else
              class="w-full"
              :placeholder="$t('common.period')"
              value-format="YYYYMM"
              format="MMM YYYY"
              v-model:value="editFormData.Period"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.amount') }} <span class="text-red-500">*</span></label>
            <a-input-number
              class="w-full"
              v-model:value="editFormData.Amount"
              :placeholder="$t('common.amount')"
              :precision="2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.remarks') }} <span class="text-red-500">*</span></label>
            <a-textarea v-model:value="editFormData.Remarks" :placeholder="$t('common.remarks')" :rows="3" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isEditModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            {{ $t('common.close') }}
          </button>
          <button
            type="submit"
            :disabled="isUpdating"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            {{ isUpdating ? $t('common.updating') : $t('common.update') }}
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
const startPeriod = ref(null);

const disabledPeriodDate = (current) => {
  if (!current) return false;
  const p = `${current.year()}${String(current.month() + 1).padStart(2, "0")}`;
  // missing periods are always enabled
  if (allowedPeriods.value.includes(p)) return false;
  // current period enabled
  const now = new Date();
  const cp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  if (p === cp) return false;
  // future periods → enable
  if (p > cp) return false;
  // everything else (past paid periods) → disable
  return true;
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
    startPeriod.value = null;
    return;
  }
  try {
    const infoRes = await axios.get(`${apiBase}/customer/${val}/info`, getToken());
    customerInfo.value = infoRes?.data?.data?.[0] || null;
  } catch (e) { customerInfo.value = null; }
  try {
    const mRes = await axios.get(`${apiBase}/customer/${val}/missing-installment`, getToken());
    const periods = (mRes?.data?.data || []).map(x => String(x.MissingPeriod));
    allowedPeriods.value = periods;
    startPeriod.value = periods.length ? periods.sort()[0] : null;
  } catch (e) { allowedPeriods.value = []; startPeriod.value = null; }
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
  if (!formData.value.Period) return showNotification("error", "Period is required.");
  formData.value.Date = dayjs().format("YYYY-MM-DD");
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
  if (!editFormData.value.Period) return showNotification("error", "Period is required.");
  editFormData.value.Date = dayjs().format("YYYY-MM-DD");
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

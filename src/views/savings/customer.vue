<template>
  <MainLayout>
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input :placeholder="$t('common.searchHere')" v-model:value="search" @input="handleSearch" class="w-64" />
      </div>
      <div class="mb-4">
        <button class="bg-primary text-white px-4 py-2 rounded" @click="openCreateModal">
          {{ $t('customer.addCustomer') }}
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4" data-aos="fade-right">
      {{ $t('customer.title') }} ({{ total }})
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left" data-aos="fade-up" data-aos-delay="150">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">{{ $t('customer.customerCode') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('customer.customerName') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('customer.customerBanglaName') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.address') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.mobile') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.email') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('customer.collectionType') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('customer.savingAmount') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('common.status') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.CustomerCode }}</td>
          <td class="px-4 border">{{ data?.CustomerName }}</td>
          <td class="px-4 border">{{ data?.CustomerBanglaName }}</td>
          <td class="px-4 border">{{ data?.Add1 }}</td>
          <td class="px-4 border">{{ data?.Mobile }}</td>
          <td class="px-4 border lowercase">{{ data?.Email }}</td>
          <td class="px-4 border text-center">
            <span class="px-2 py-0.5 rounded text-xs font-semibold"
              :class="data?.CollectionType === 'W' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'">
              {{ data?.CollectionType === 'W' ? $t('common.weekly') : $t('common.monthly') }}
            </span>
          </td>
          <td class="px-4 border text-right">{{ Number(data?.SavingAmount || 0).toFixed(2) }}</td>
          <td class="px-4 border text-center">
            <span class="px-2 py-0.5 rounded text-xs font-semibold"
              :class="data?.Active === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              {{ data?.Active === 'Y' ? $t('common.active') : $t('common.inactive') }}
            </span>
          </td>
          <td class="px-4 border text-center">
            <div class="flex justify-center items-center gap-1">
              <a-tooltip :title="$t('common.details')">
                <button type="button" class="action-btn action-btn-info" @click="openDetailsModal(data)">
                  <i class="bi bi-eye"></i>
                </button>
              </a-tooltip>
              <a-tooltip :title="$t('customer.collections')">
                <button type="button" class="action-btn action-btn-primary" @click="openCollectionsModal(data)">
                  <i class="bi bi-cash-stack"></i>
                </button>
              </a-tooltip>
              <a-tooltip :title="$t('common.edit')">
                <button type="button" class="action-btn action-btn-edit" @click="openEditModal(data)">
                  <i class="bi bi-pencil-square"></i>
                </button>
              </a-tooltip>
              <a-popconfirm @confirm="deleteCustomer(data?.CustomerCode)" :title="$t('common.areYouSure')" :ok-text="$t('common.yes')"
                :cancel-text="$t('common.no')">
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

    <div v-if="loading" class="mt-2 text-center text-gray-500 flex justify-center items-center gap-2">
      <span><a-spin></a-spin></span>
    </div>

    <a-pagination class="mt-4" v-model:current="page" :page-size="per_page" :total="total" :show-size-changer="false"
      :show-total="(total) => $t('common.totalItems', { total })" @change="
        (pageNo) => {
          page = pageNo;
          fetchAllData();
        }
      " v-if="total > per_page" />

    <!-- Create Modal -->
    <a-modal v-model:open="isCreateModalVisible" :title="$t('customer.addCustomer')" @cancel="isCreateModalVisible = false"
      :footer="null" width="550px">
      <form @submit.prevent="createCustomer">
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.customerCode') }} <span
                class="text-red-500">*</span></label>
            <a-input v-model:value="formData.CustomerCode" :placeholder="$t('common.autoGenerated')" readonly />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.customerName') }} <span
                class="text-red-500">*</span></label>
            <a-input v-model:value="formData.CustomerName" :placeholder="$t('customer.customerName')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.customerBanglaName') }}</label>
            <a-input v-model:value="formData.CustomerBanglaName" placeholder="গ্রাহকের নাম" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.address') }} <span
                class="text-red-500">*</span></label>
            <a-input v-model:value="formData.Add1" :placeholder="$t('common.address')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.mobile') }} <span
                class="text-red-500">*</span></label>
            <a-input v-model:value="formData.Mobile" :placeholder="$t('common.mobile')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.email') }} <span
                class="text-red-500">*</span></label>
            <a-input v-model:value="formData.Email" :placeholder="$t('common.email')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.collectionType') }} <span
                class="text-red-500">*</span></label>
            <a-select v-model:value="formData.CollectionType" class="w-full">
              <a-select-option value="M">{{ $t('common.monthly') }}</a-select-option>
              <a-select-option value="W">{{ $t('common.weekly') }}</a-select-option>
            </a-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.savingAmount') }} <span
                class="text-red-500">*</span></label>
            <a-input-number v-model:value="formData.SavingAmount" :min="0" :step="0.01" class="w-full"
              :placeholder="$t('customer.savingAmount')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.status') }} <span
                class="text-red-500">*</span></label>
            <a-select v-model:value="formData.Active" class="w-full">
              <a-select-option value="Y">{{ $t('common.active') }}</a-select-option>
              <a-select-option value="N">{{ $t('common.inactive') }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" @click="isCreateModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors">
            {{ $t('common.close') }}
          </button>
          <button type="submit" :disabled="isCreating"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors">
            {{ isCreating ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal v-model:open="isEditModalVisible" :title="$t('customer.editCustomer')" @cancel="isEditModalVisible = false" :footer="null"
      width="550px">
      <form @submit.prevent="updateCustomer">
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.customerCode') }} <span
                class="text-red-500">*</span></label>
            <a-input :value="editFormData.CustomerCode" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.customerName') }} <span
                class="text-red-500">*</span></label>
            <a-input v-model:value="editFormData.CustomerName" :placeholder="$t('customer.customerName')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.customerBanglaName') }}</label>
            <a-input v-model:value="editFormData.CustomerBanglaName" placeholder="গ্রাহকের নাম" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.address') }} <span
                class="text-red-500">*</span></label>
            <a-input v-model:value="editFormData.Add1" :placeholder="$t('common.address')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.mobile') }} <span
                class="text-red-500">*</span></label>
            <a-input v-model:value="editFormData.Mobile" :placeholder="$t('common.mobile')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.email') }} <span
                class="text-red-500">*</span></label>
            <a-input v-model:value="editFormData.Email" :placeholder="$t('common.email')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.collectionType') }} <span
                class="text-red-500">*</span></label>
            <a-select v-model:value="editFormData.CollectionType" class="w-full">
              <a-select-option value="M">{{ $t('common.monthly') }}</a-select-option>
              <a-select-option value="W">{{ $t('common.weekly') }}</a-select-option>
            </a-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.savingAmount') }} <span
                class="text-red-500">*</span></label>
            <a-input-number v-model:value="editFormData.SavingAmount" :min="0" :step="0.01" class="w-full"
              :placeholder="$t('customer.savingAmount')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.status') }} <span
                class="text-red-500">*</span></label>
            <a-select v-model:value="editFormData.Active" class="w-full">
              <a-select-option value="Y">{{ $t('common.active') }}</a-select-option>
              <a-select-option value="N">{{ $t('common.inactive') }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" @click="isEditModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors">
            {{ $t('common.close') }}
          </button>
          <button type="submit" :disabled="isUpdating"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors">
            {{ isUpdating ? $t('common.updating') : $t('common.update') }}
          </button>
        </div>
      </form>
    </a-modal>

    <!-- Collections Modal -->
    <a-modal v-model:open="isCollectionsModalVisible" :title="$t('customer.collections')" @cancel="isCollectionsModalVisible = false"
      :footer="null" width="800px">
      <div v-if="collectionsLoading" class="text-center py-8"><a-spin /></div>
      <div v-else>
        <div v-if="collectionsData.length" class="mb-3 grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded">
          <div><span class="font-semibold">{{ $t('common.code') }}:</span> {{ collectionsData[0].CustomerCode }}</div>
          <div><span class="font-semibold">{{ $t('common.name') }}:</span> {{ collectionsData[0].CustomerName }}</div>
          <div><span class="font-semibold">{{ $t('customer.savingAmount') }}:</span> {{ Number(collectionsData[0].SavingAmount || 0).toFixed(2) }}</div>
        </div>
        <table class="w-full border text-sm">
          <thead class="bg-primary text-white">
            <tr>
              <th class="border px-2 py-1 text-left">{{ $t('common.period') }}</th>
              <th class="border px-2 py-1 text-right">{{ $t('common.amount') }}</th>
              <th class="border px-2 py-1 text-left">{{ $t('common.date') }}</th>
              <th class="border px-2 py-1 text-center">{{ $t('common.type') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c, i) in collectionsData" :key="i">
              <td class="border px-2 py-1">{{ formatPeriod(c.Period) }}</td>
              <td class="border px-2 py-1 text-right">{{ Number(c.Amount || 0).toFixed(2) }}</td>
              <td class="border px-2 py-1">{{ formatDate(c.Date) }}</td>
              <td class="border px-2 py-1 text-center">{{ c.CollectionType === 'W' ? $t('common.weekly') : $t('common.monthly') }}</td>
            </tr>
            <tr v-if="!collectionsData.length">
              <td colspan="4" class="text-center py-3 text-gray-500">{{ $t('common.noCollections') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-modal>

    <!-- Details Modal -->
    <a-modal v-model:open="isDetailsModalVisible" :title="$t('customer.details')" @cancel="isDetailsModalVisible = false"
      :footer="null" width="700px">
      <div v-if="detailsLoading" class="text-center py-8"><a-spin /></div>
      <div v-else-if="detailsData" class="space-y-4">
        <div class="grid grid-cols-2 gap-3 border-b pb-3">
          <div><span class="font-semibold">{{ $t('common.code') }}:</span> {{ detailsData.CustomerCode }}</div>
          <div><span class="font-semibold">{{ $t('common.name') }}:</span> {{ detailsData.CustomerName }}</div>
          <div class="col-span-2"><span class="font-semibold">{{ $t('common.mobile') }}:</span> {{ detailsData.Mobile }}</div>
        </div>

        <div v-if="detailsData.SavingAccounts?.length">
          <h3 class="font-bold text-primary mb-2">{{ $t('customer.savingAccounts') }}</h3>
          <table class="w-full border text-sm">
            <thead class="bg-gray-100">
              <tr><th class="border px-2 py-1 text-left">{{ $t('customer.amCode') }}</th><th class="border px-2 py-1 text-left">{{ $t('customer.acType') }}</th><th class="border px-2 py-1 text-left">{{ $t('common.details') }}</th></tr>
            </thead>
            <tbody>
              <tr v-for="(a, i) in detailsData.SavingAccounts" :key="i">
                <td class="border px-2 py-1">{{ a.AMCode }}</td>
                <td class="border px-2 py-1">{{ a.ACType1 }}</td>
                <td class="border px-2 py-1">{{ a.AMDetails }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="detailsData.LoanAccounts?.length">
          <h3 class="font-bold text-primary mb-2">{{ $t('customer.loanAccounts') }}</h3>
          <table class="w-full border text-sm">
            <thead class="bg-gray-100">
              <tr><th class="border px-2 py-1 text-left">{{ $t('customer.amCode') }}</th><th class="border px-2 py-1 text-left">{{ $t('customer.acType') }}</th><th class="border px-2 py-1 text-left">{{ $t('common.details') }}</th></tr>
            </thead>
            <tbody>
              <tr v-for="(a, i) in detailsData.LoanAccounts" :key="i">
                <td class="border px-2 py-1">{{ a.AMCode }}</td>
                <td class="border px-2 py-1">{{ a.ACType1 }}</td>
                <td class="border px-2 py-1">{{ a.AMDetails }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="detailsData.Saving">
          <h3 class="font-bold text-primary mb-2">{{ $t('customer.savingSummary') }}</h3>
          <div class="grid grid-cols-2 gap-2 text-sm border rounded p-3 bg-green-50">
            <div>{{ $t('customer.monthlyTarget') }}: <b>{{ Number(detailsData.Saving.MonthlyTarget || 0).toFixed(2) }}</b></div>
            <div>{{ $t('customer.currentPeriod') }}: <b>{{ formatPeriodFull(detailsData.Saving.CurrentPeriod) }}</b></div>
            <div>{{ $t('customer.collectedPeriod') }}: <b>{{ detailsData.Saving.CollectedPeriod }}</b></div>
            <div>{{ $t('customer.due') }}: <b class="text-red-600">{{ Number(detailsData.Saving.Due || 0).toFixed(2) }}</b></div>
            <div>{{ $t('customer.totalDeposit') }}: <b>{{ Number(detailsData.Saving.TotalDeposit || 0).toFixed(2) }}</b></div>
            <div>{{ $t('customer.totalWithdraw') }}: <b>{{ Number(detailsData.Saving.TotalWithdraw || 0).toFixed(2) }}</b></div>
            <div class="col-span-2">{{ $t('customer.balance') }}: <b class="text-green-700">{{ Number(detailsData.Saving.Balance || 0).toFixed(2) }}</b></div>
          </div>
        </div>

        <div v-if="detailsData.Loan">
          <h3 class="font-bold text-primary mb-2">{{ $t('customer.loanSummary') }}</h3>
          <div class="grid grid-cols-2 gap-2 text-sm border rounded p-3 bg-blue-50">
            <div>{{ $t('customer.totalDisbursed') }}: <b>{{ Number(detailsData.Loan.TotalDisbursed || 0).toFixed(2) }}</b></div>
            <div>{{ $t('customer.totalRepaid') }}: <b>{{ Number(detailsData.Loan.TotalRepaid || 0).toFixed(2) }}</b></div>
            <div>{{ $t('customer.outstanding') }}: <b class="text-orange-600">{{ Number(detailsData.Loan.Outstanding || 0).toFixed(2) }}</b></div>
            <div>{{ $t('customer.due') }}: <b class="text-red-600">{{ Number(detailsData.Loan.Due || 0).toFixed(2) }}</b></div>
          </div>
        </div>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";

const page = ref(1);
const per_page = ref(10);
const total = ref(0);
const search = ref("");
const allData = ref([]);
const loading = ref(false);

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isDetailsModalVisible = ref(false);
const detailsLoading = ref(false);
const detailsData = ref(null);

const isCollectionsModalVisible = ref(false);
const collectionsLoading = ref(false);
const collectionsData = ref([]);

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return String(d).split(" ")[0];
  return dt.toISOString().split("T")[0];
};

const formatPeriod = (period) => {
  if (!period) return "";
  const s = String(period);
  if (s.length !== 6) return s;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(s.slice(4, 6), 10) - 1] || ""} ${s.slice(0, 4)}`;
};

const formatPeriodFull = (period) => {
  if (!period) return "";
  const s = String(period);
  if (s.length !== 6) return s;
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[parseInt(s.slice(4, 6), 10) - 1] || ""} ${s.slice(0, 4)}`;
};

const openCollectionsModal = async (data) => {
  isCollectionsModalVisible.value = true;
  collectionsLoading.value = true;
  collectionsData.value = [];
  try {
    const res = await axios.get(`${apiBase}/customer/${data.CustomerCode}/collections`, getToken());
    collectionsData.value = res?.data?.data || [];
  } catch (error) {
    showNotification("error", "Failed to load collections.");
  } finally {
    collectionsLoading.value = false;
  }
};

const openDetailsModal = async (data) => {
  isDetailsModalVisible.value = true;
  detailsLoading.value = true;
  detailsData.value = null;
  try {
    const res = await axios.get(`${apiBase}/customer/${data.CustomerCode}/summary`, getToken());
    detailsData.value = res?.data?.data || null;
  } catch (error) {
    showNotification("error", "Failed to load details.");
  } finally {
    detailsLoading.value = false;
  }
};
const isCreating = ref(false);
const isUpdating = ref(false);

const defaultForm = {
  CustomerCode: "",
  CustomerName: "",
  Add1: "",
  Mobile: "",
  Email: "",
  Business: "01",
  Active: "Y",
  CollectionType: "M",
  SavingAmount: 0,
  CustomerBanglaName: "",
};

const cloneDefault = () => ({ ...defaultForm });

const formData = ref(cloneDefault());
const editFormData = ref(cloneDefault());

const handleSearch = () => {
  page.value = 1;
  fetchAllData();
};

// List
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/customer?search=${search.value}&limit=${per_page.value}&page=${page.value}`,
      getToken()
    );
    loading.value = false;
    allData.value = res?.data?.data?.data || [];
    total.value = res?.data?.data?.total || 0;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    console.error("Failed to fetch customers:", err);
  }
};

// Generate next CustomerCode by analyzing existing codes
const generateNextCustomerCode = async () => {
  try {
    const res = await axios.get(
      `${apiBase}/customer?search=&limit=100000&page=1`,
      getToken()
    );
    const list = res?.data?.data?.data || [];

    let prefix = "C";
    let width = 3;
    let maxNum = 0;

    list.forEach((c) => {
      const m = String(c.CustomerCode || "").match(/^([A-Za-z]*)(\d+)$/);
      if (m) {
        const num = parseInt(m[2], 10);
        if (num > maxNum) {
          maxNum = num;
          prefix = m[1] || prefix;
          width = m[2].length;
        }
      }
    });

    const next = String(maxNum + 1).padStart(width, "0");
    return `${prefix}${next}`;
  } catch (err) {
    console.error("Failed to generate customer code:", err);
    return "C001";
  }
};

// Create
const openCreateModal = async () => {
  formData.value = cloneDefault();
  isCreateModalVisible.value = true;
  formData.value.CustomerCode = await generateNextCustomerCode();
};

const createCustomer = async () => {
  if (!formData.value.CustomerCode?.trim()) return showNotification("error", "Customer Code is required.");
  if (!formData.value.CustomerName?.trim()) return showNotification("error", "Customer Name is required.");
  if (!formData.value.Add1?.trim()) return showNotification("error", "Address is required.");
  if (!formData.value.Mobile?.trim()) return showNotification("error", "Mobile is required.");
  if (!formData.value.Email?.trim()) return showNotification("error", "Email is required.");
  if (!formData.value.CollectionType) return showNotification("error", "Collection Type is required.");
  if (formData.value.SavingAmount == null || Number(formData.value.SavingAmount) < 0)
    return showNotification("error", "Saving Amount is required.");
  isCreating.value = true;
  try {
    const payload = {
      ...formData.value,
      SavingAmount: Number(formData.value.SavingAmount || 0),
    };
    const res = await axios.post(
      `${apiBase}/customer`,
      payload,
      getToken()
    );
    isCreating.value = false;
    showNotification("success", res?.data?.message || "Customer created successfully!");
    isCreateModalVisible.value = false;
    formData.value = cloneDefault();
    await fetchAllData();
  } catch (error) {
    isCreating.value = false;
    showNotification("error", error?.response?.data?.message || "Failed to create customer.");
  }
};

// Edit
const openEditModal = async (data) => {
  try {
    const res = await axios.get(
      `${apiBase}/customer/${data.CustomerCode}`,
      getToken()
    );
    const customer = res?.data?.data || data;
    editFormData.value = {
      CustomerCode: customer.CustomerCode,
      CustomerName: customer.CustomerName,
      Add1: customer.Add1,
      Mobile: customer.Mobile,
      Email: customer.Email,
      Business: customer.Business,
      Active: customer.Active,
      CollectionType: customer.CollectionType || "M",
      SavingAmount: Number(customer.SavingAmount || 0),
      CustomerBanglaName: customer.CustomerBanglaName || "",
    };
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", "Failed to load customer data.");
  }
};

const updateCustomer = async () => {
  if (!editFormData.value.CustomerName?.trim()) return showNotification("error", "Customer Name is required.");
  if (!editFormData.value.Add1?.trim()) return showNotification("error", "Address is required.");
  if (!editFormData.value.Mobile?.trim()) return showNotification("error", "Mobile is required.");
  if (!editFormData.value.Email?.trim()) return showNotification("error", "Email is required.");
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/customer/${editFormData.value.CustomerCode}`,
      {
        CustomerName: editFormData.value.CustomerName,
        CustomerBanglaName: editFormData.value.CustomerBanglaName,
        Add1: editFormData.value.Add1,
        Mobile: editFormData.value.Mobile,
        Email: editFormData.value.Email,
        Business: editFormData.value.Business,
        Active: editFormData.value.Active,
        CollectionType: editFormData.value.CollectionType,
        SavingAmount: Number(editFormData.value.SavingAmount || 0),
      },
      getToken()
    );
    isUpdating.value = false;
    showNotification("success", res?.data?.message || "Customer updated successfully!");
    isEditModalVisible.value = false;
    await fetchAllData();
  } catch (error) {
    isUpdating.value = false;
    showNotification("error", error?.response?.data?.message || "Failed to update customer.");
  }
};

// Delete
const deleteCustomer = async (customerCode) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/customer/${customerCode}`,
      getToken()
    );
    showNotification("success", res?.data?.message || "Customer deleted successfully!");
    await fetchAllData();
  } catch (error) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || "Failed to delete customer.");
  }
};

onMounted(async () => {
  await fetchAllData();
});
</script>

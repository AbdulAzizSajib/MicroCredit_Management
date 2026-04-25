<template>
  <MainLayout>
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
      <a-input :placeholder="$t('common.searchHere')" v-model:value="search" @input="handleSearch" class="w-full sm:w-64" />
      <button class="bg-primary text-white px-4 py-2 rounded whitespace-nowrap w-full sm:w-auto" @click="openCreateModal">
        {{ $t('customer.addCustomer') }}
      </button>
    </div>
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2 mt-5" data-aos="fade-right">
      <h1 class="text-2xl font-bold text-primary">
        Savings Members ({{ total }})
      </h1>
      <div v-if="showTotalBadge" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200">
        <span class="text-xs uppercase font-semibold text-gray-500">Total Savings Due</span>
        <span class="text-lg font-bold text-rose-700">{{ formatAmount(totalAmount) }}</span>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
    <table class="w-full min-w-[900px] border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2 sticky left-0 bg-primary z-20">{{ $t('customer.customerName') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('customer.customerBanglaName') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.mobile') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.email') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('loan.installment') }}</th>
          <th class="border border-white px-4 py-2 text-right">Total Savings Payable</th>
          <th class="border border-white px-4 py-2 text-right">Paid Amount</th>
          <th class="border border-white px-4 py-2 text-right">Due Amount</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('common.status') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border sticky left-0 bg-white z-10">
            {{ data?.CustomerName }}
            <span class="ml-1 text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">{{ data?.CustomerCode }}</span>
          </td>
          <td class="px-4 border">{{ data?.CustomerBanglaName }}</td>
          <td class="px-4 border">{{ data?.Mobile }}</td>
          <td class="px-4 border lowercase">{{ data?.Email }}</td>
          <td class="px-4 border text-right">{{ Number(data?.SavingAmount || 0).toFixed(2) }}</td>
          <td class="px-4 border text-right">{{ data?.TotalSavingsPayable != null ? Number(data.TotalSavingsPayable).toFixed(2) : '' }}</td>
          <td class="px-4 border text-right">{{ data?.TotalGivenAmount != null ? Number(data.TotalGivenAmount).toFixed(2) : '' }}</td>
          <td class="px-4 border text-right">{{ data?.DueAmount != null ? Number(data.DueAmount).toFixed(2) : '' }}</td>
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
    </div>

    <div v-if="loading" class="mt-2 text-center text-gray-500 flex justify-center items-center gap-2">
      <span><a-spin></a-spin></span>
    </div>

    <div ref="loadMoreSentinel" class="h-6"></div>
    <div v-if="!loading && allData.length >= total && total > 0" class="text-center text-gray-400 text-sm py-3">
      {{ $t('common.totalItems', { total }) }}
    </div>

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
      :footer="null" width="900px">
      <div v-if="detailsLoading" class="text-center py-8"><a-spin /></div>
      <div v-else-if="customerInfo" class="space-y-5">
        <!-- Customer Info Header -->
        <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div><span class="text-gray-500 text-xs uppercase">{{ $t('common.code') }}</span><div class="font-semibold text-primary">{{ customerInfo.CustomerCode }}</div></div>
            <div><span class="text-gray-500 text-xs uppercase">{{ $t('common.name') }}</span><div class="font-semibold">{{ customerInfo.CustomerName }}</div></div>
            <div><span class="text-gray-500 text-xs uppercase">{{ $t('customer.customerBanglaName') }}</span><div class="font-semibold">{{ customerInfo.CustomerBanglaName }}</div></div>
            <div><span class="text-gray-500 text-xs uppercase">{{ $t('common.mobile') }}</span><div class="font-semibold">{{ customerInfo.Mobile }}</div></div>
            <div class="col-span-2"><span class="text-gray-500 text-xs uppercase">{{ $t('common.address') }}</span><div class="font-semibold">{{ customerInfo.Add1 }}</div></div>
          </div>
        </div>

        <!-- Savings Summary -->
        <div>
          <h3 class="font-bold text-primary mb-2 text-sm uppercase tracking-wide">{{ $t('customer.savingSummary') }}</h3>
          <div class="grid grid-cols-3 gap-3">
            <div class="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">{{ $t('collection.totalAmount') }}</div>
              <div class="text-lg font-bold text-blue-700">{{ Number(customerInfo.TotalAmount || 0).toFixed(2) }}</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">{{ $t('collection.receivable') }}</div>
              <div class="text-lg font-bold text-green-700">{{ Number(customerInfo.TotalGivenAmount || 0).toFixed(2) }}</div>
            </div>
            <div class="text-center p-3 bg-rose-50 rounded-lg border border-rose-100">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">{{ $t('customer.due') }}</div>
              <div class="text-lg font-bold text-rose-700">{{ Number(customerInfo.DueAmount || 0).toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- Loan Summary -->
        <div>
          <h3 class="font-bold text-primary mb-2 text-sm uppercase tracking-wide">{{ $t('customer.loanSummary') }}</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">{{ $t('loan.loanAmount') }}</div>
              <div class="text-lg font-bold text-indigo-700">{{ Number(customerInfo.LoanAmount || 0).toFixed(2) }}</div>
            </div>
            <div class="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">{{ $t('loan.interestAmount') }}</div>
              <div class="text-lg font-bold text-purple-700">{{ Number(customerInfo.InterestAmount || 0).toFixed(2) }}</div>
            </div>
            <div class="text-center p-3 bg-teal-50 rounded-lg border border-teal-100">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">{{ $t('loan.totalPaid') }}</div>
              <div class="text-lg font-bold text-teal-700">{{ Number(customerInfo.TotalPayment || 0).toFixed(2) }}</div>
            </div>
            <div class="text-center p-3 bg-rose-50 rounded-lg border border-rose-100">
              <div class="text-[10px] uppercase text-gray-500 font-semibold">{{ $t('customer.due') }}</div>
              <div class="text-lg font-bold text-rose-700">{{ Number(customerInfo.TotalDueAmount || 0).toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- Collections Table -->
        <div v-if="collections.length">
          <h3 class="font-bold text-primary mb-2 text-sm uppercase tracking-wide">{{ $t('customer.collections') }}</h3>
          <table class="w-full border text-sm">
            <thead class="bg-primary text-white">
              <tr>
                <th class="border border-white px-3 py-1.5 text-left">{{ $t('common.period') }}</th>
                <th class="border border-white px-3 py-1.5 text-right">{{ $t('common.amount') }}</th>
                <th class="border border-white px-3 py-1.5 text-left">{{ $t('common.remarks') }}</th>
                <th class="border border-white px-3 py-1.5 text-left">{{ $t('common.date') }}</th>
                <th class="border border-white px-3 py-1.5 text-center">{{ $t('common.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, i) in collections" :key="i" class="hover:bg-gray-50">
                <td class="border px-3 py-1.5">{{ formatPeriod(c.Period) }}</td>
                <td class="border px-3 py-1.5 text-right">{{ Number(c.Amount || 0).toFixed(2) }}</td>
                <td class="border px-3 py-1.5">{{ c.Remarks }}</td>
                <td class="border px-3 py-1.5">{{ formatDate(c.Date) }}</td>
                <td class="border px-3 py-1.5 text-center">
                  <span class="px-2 py-0.5 rounded text-xs font-semibold"
                    :class="c.IsVoucher === 'Y' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                    {{ c.IsVoucher === 'Y' ? 'Voucher' : 'Pending' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";

const route = useRoute();
const showTotalBadge = ref(!!route.query.showTotal && route.query.kind === "savingsDue");
const totalAmount = ref(Number(route.query.total) || 0);

const page = ref(1);
const per_page = ref(20);
const total = ref(0);
const search = ref("");
const allData = ref([]);
const loading = ref(false);
const loadMoreSentinel = ref(null);
let scrollObserver = null;

const formatAmount = (amount) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isDetailsModalVisible = ref(false);
const detailsLoading = ref(false);
const detailsData = ref(null);
const customerInfo = ref(null);
const collections = ref([]);

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
  customerInfo.value = null;
  collections.value = [];
  try {
    const res = await axios.get(`${apiBase}/customer/${data.CustomerCode}/summary_member_collection`, getToken());
    const d = res?.data?.data || {};
    customerInfo.value = d.CustomerInfo?.[0] || null;
    collections.value = d.Collections || [];
    detailsData.value = d;
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
  allData.value = [];
  fetchAllData();
};

// List
const fetchAllData = async ({ append = false } = {}) => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/customer?search=${search.value}&limit=${per_page.value}&page=${page.value}`,
      getToken()
    );
    loading.value = false;
    const rows = res?.data?.data?.data || [];
    allData.value = append ? [...allData.value, ...rows] : rows;
    total.value = res?.data?.data?.total || 0;
  } catch (err) {
    loading.value = false;
    if (!append) allData.value = [];
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
  if (!formData.value.CustomerCode?.trim()) return showNotification("error", "Member Code is required.");
  if (!formData.value.CustomerName?.trim()) return showNotification("error", "Member Name is required.");
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
  if (!editFormData.value.CustomerName?.trim()) return showNotification("error", "Member Name is required.");
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

const loadMore = () => {
  if (loading.value) return;
  if (allData.value.length >= total.value) return;
  page.value += 1;
  fetchAllData({ append: true });
};

onMounted(async () => {
  await fetchAllData();
  scrollObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    },
    { root: null, rootMargin: "200px", threshold: 0 }
  );
  if (loadMoreSentinel.value) scrollObserver.observe(loadMoreSentinel.value);
});

onBeforeUnmount(() => {
  if (scrollObserver) {
    scrollObserver.disconnect();
    scrollObserver = null;
  }
});
</script>

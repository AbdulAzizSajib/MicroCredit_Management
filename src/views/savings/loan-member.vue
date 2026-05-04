<template>
  <MainLayout>
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2 mt-5" data-aos="fade-right">
      <h1 class="text-2xl font-bold text-primary">
        {{ $t('dashboard.loanMembers') }} ({{ data.length }})
      </h1>
      <div class="flex items-center gap-3 flex-wrap">
        <a-input
          v-model:value="search"
          :placeholder="$t('common.searchByName')"
          allow-clear
          style="width: 240px"
          @change="onSearchChange"
        >
          <template #prefix><i class="bi bi-search text-gray-400"></i></template>
        </a-input>
        <div v-if="showTotalBadge" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200">
          <span class="text-xs uppercase font-semibold text-gray-500">Total Loan Due</span>
          <span class="text-lg font-bold text-rose-700">{{ formatAmount(Number(totalAmount)) }}</span>
        </div>
        <div v-if="showLoanPayableBadge" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200">
          <span class="text-xs uppercase font-semibold text-indigo-500">{{ $t('loan.totalLoanPayable') }}</span>
          <span class="text-lg font-bold text-indigo-700">{{ formatAmount(loanPayableTotal) }}</span>
        </div>
      </div>
    </div>

    <div class="w-full overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
    <table class="w-full min-w-[1500px] border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2 sticky left-0 bg-primary z-20">{{ $t('customer.customerName') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('customer.customerBanglaName') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.mobile') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.email') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('loan.installment') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('loan.installmentNumber') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('loan.loanAmount') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('loan.totalLoanPayable') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('customer.paidAmount') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('customer.dueAmount') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('common.status') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(item, index) in data" :key="index">
          <td class="px-4 border sticky left-0 bg-white z-10">
            {{ item?.CustomerName || item?.AMDetails }}
            <span v-if="item?.MemberCode" class="ml-1 text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">{{ item?.MemberCode }}</span>
          </td>
          <td class="px-4 border">{{ item?.CustomerBanglaName }}</td>
          <td class="px-4 border">{{ item?.Mobile }}</td>
          <td class="px-4 border lowercase">{{ item?.Email }}</td>
          <td class="px-4 border text-right">{{ item?.Installment != null ? formatAmount(Number(item.Installment)) : '' }}</td>
          <td class="px-4 border text-center">{{ item?.InstallmentNumber != null ? item.InstallmentNumber : '' }}</td>
          <td class="px-4 border text-right">{{ item?.LoanAmount != null ? formatAmount(Number(item.LoanAmount)) : '' }}</td>
          <td class="px-4 border text-right">{{ item?.TotalLoanPayable != null ? formatAmount(Number(item.TotalLoanPayable)) : '' }}</td>
          <td class="px-4 border text-right">{{ item?.PaidAmount != null ? formatAmount(Number(item.PaidAmount)) : '' }}</td>
          <td class="px-4 border text-right">{{ item?.DueAmount != null ? formatAmount(Number(item.DueAmount)) : '' }}</td>
          <td class="px-4 border text-center">
            <span v-if="item?.Active" class="px-2 py-0.5 rounded text-xs font-semibold"
              :class="item?.Active === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              {{ item?.Active === 'Y' ? $t('common.active') : $t('common.inactive') }}
            </span>
          </td>
          <td class="px-4 border text-center">
            <div class="flex justify-center items-center gap-1">
              <a-tooltip :title="$t('loan.addCollection')">
                <button type="button" class="action-btn action-btn-success" @click="openLoanCollectionModal(item)">
                  <i class="bi bi-plus-circle"></i>
                </button>
              </a-tooltip>
              <a-tooltip :title="$t('common.details')">
                <button type="button" class="action-btn action-btn-info" @click="openDetailsModal(item)">
                  <i class="bi bi-eye"></i>
                </button>
              </a-tooltip>
              <a-tooltip :title="$t('customer.collections')">
                <button type="button" class="action-btn action-btn-primary" @click="openCollectionsModal(item)">
                  <i class="bi bi-cash-stack"></i>
                </button>
              </a-tooltip>
            </div>
          </td>
        </tr>
        <tr v-if="!loading && !data.length">
          <td colspan="12" class="px-4 py-6 border text-center text-gray-500">{{ $t('common.noData') }}</td>
        </tr>
      </tbody>
    </table>
    </div>

    <!-- Infinite scroll sentinel -->
    <div ref="scrollSentinel" class="py-4 text-center">
      <a-spin v-if="loadingMore" />
    </div>

    <!-- Add Loan Collection Modal -->
    <a-modal
      v-model:open="isLoanCollectionModalVisible"
      :title="$t('loan.payment')"
      @cancel="isLoanCollectionModalVisible = false"
      :footer="null"
      width="500px"
    >
      <div v-if="loanCollectionLoading" class="text-center py-8"><a-spin /></div>
      <form v-else @submit.prevent="submitLoanCollection">
        <div v-if="loanCollectionDetails" class="mb-4 p-3 bg-blue-50 rounded-lg border text-sm space-y-1">
          <div class="flex justify-between">
            <span class="font-semibold text-gray-600">Actual Loan:</span>
            <span class="font-bold text-blue-700">{{ formatAmount(Number(loanCollectionDetails.loan?.LoanAmount || 0)) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-600">{{ $t('loan.noOfInstallment') }}:</span>
            <span class="font-bold text-blue-700">{{ loanCollectionDetails.loan?.NofInstallment }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-600">{{ $t('loan.installment') }} No:</span>
            <span class="font-bold text-blue-700">{{ loanCollectionDetails.payments?.length || 0 }} / {{ loanCollectionDetails.loan?.NofInstallment }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-600">Running {{ $t('loan.installment') }} No:</span>
            <span class="font-bold text-green-700">{{ (loanCollectionDetails.payments?.length || 0) + 1 }} / {{ loanCollectionDetails.loan?.NofInstallment }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-600">{{ $t('loan.installmentAmount') }}:</span>
            <span class="font-bold text-blue-700">{{ formatAmount(Number(loanCollectionDetails.loan?.Installment || 0)) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-600">{{ $t('loan.totalLoanPayable') }}:</span>
            <span class="font-bold text-blue-700">{{ formatAmount(Number(loanCollectionDetails.loan?.InterestAmount || 0)) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-600">{{ $t('loan.remaining') }}:</span>
            <span class="font-bold text-red-600">{{ formatAmount(Number(loanCollectionDetails.loan?.InterestAmount || 0) - Number(loanCollectionDetails.total_payment || 0)) }}</span>
          </div>
        </div>
        <div class="space-y-5 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('loan.payment') }}</label>
            <a-input
              class="w-full"
              placeholder="Enter Payment Amount"
              v-model:value="loanCollectionForm.Payment"
              type="number"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('loan.paymentDate') }}</label>
            <a-date-picker
              class="w-full"
              placeholder="Payment Date"
              value-format="YYYY-MM-DD"
              v-model:value="loanCollectionForm.PaymentDate"
            />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" @click="isLoanCollectionModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors">
            {{ $t('common.close') }}
          </button>
          <button type="submit" :disabled="isLoanCollectionSaving"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors">
            {{ isLoanCollectionSaving ? $t('loan.saveChanges') : $t('loan.saveChanges') }}
          </button>
        </div>
      </form>
    </a-modal>

    <!-- Collections Modal -->
    <a-modal v-model:open="isCollectionsModalVisible" :title="$t('customer.collections')"
      @cancel="isCollectionsModalVisible = false" :footer="null" width="800px">
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
        <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div><span class="text-gray-500 text-xs uppercase">{{ $t('common.code') }}</span>
              <div class="font-semibold text-primary">{{ customerInfo.CustomerCode }}</div>
            </div>
            <div><span class="text-gray-500 text-xs uppercase">{{ $t('common.name') }}</span>
              <div class="font-semibold">{{ customerInfo.CustomerName }}</div>
            </div>
            <div><span class="text-gray-500 text-xs uppercase">{{ $t('customer.customerBanglaName') }}</span>
              <div class="font-semibold">{{ customerInfo.CustomerBanglaName }}</div>
            </div>
            <div><span class="text-gray-500 text-xs uppercase">{{ $t('common.mobile') }}</span>
              <div class="font-semibold">{{ customerInfo.Mobile }}</div>
            </div>
            <div class="col-span-2"><span class="text-gray-500 text-xs uppercase">{{ $t('common.address') }}</span>
              <div class="font-semibold">{{ customerInfo.Add1 }}</div>
            </div>
          </div>
        </div>

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
let searchTimeout = null;
import { useRoute } from "vue-router";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { getToken, showNotification } from "@/utilities/common";
import axios from "axios";
import { apiBase } from "@/config";
import dayjs from "dayjs";

const route = useRoute();
const showTotalBadge = ref(!!route.query.showTotal && route.query.kind === "loanDue");
const totalAmount = ref(Number(route.query.total) || 0);
const showLoanPayableBadge = ref(!!route.query.showLoanPayable);
const loanPayableTotal = ref(0);

const formatAmount = (amount) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

const data = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const search = ref("");
const currentPage = ref(1);
const perPage = 20;
const hasMore = ref(true);
const scrollSentinel = ref(null);
let observer = null;

const isDetailsModalVisible = ref(false);
const detailsLoading = ref(false);
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

const fetchLoanMembers = async (append = false) => {
  if (append) {
    if (loadingMore.value || !hasMore.value) return;
    loadingMore.value = true;
  } else {
    loading.value = true;
    currentPage.value = 1;
    hasMore.value = true;
    data.value = [];
  }
  try {
    const token = getToken();
    const params = { limit: perPage, page: currentPage.value };
    if (search.value) params.search = search.value;
    const res = await axios.get(`${apiBase}/dashboard/loan-members`, { ...token, params });
    if (res.data?.success) {
      const rows = Array.isArray(res.data.data) ? res.data.data : [];
      data.value = append ? [...data.value, ...rows] : rows;
      hasMore.value = rows.length === perPage;
      if (hasMore.value) currentPage.value++;
    }
  } catch (error) {
    console.log(error);
    showNotification("error", "Failed to fetch loan members.");
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const onSearchChange = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchLoanMembers(false), 400);
};

const setupObserver = () => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value) fetchLoanMembers(true);
  }, { threshold: 0.1 });
  if (scrollSentinel.value) observer.observe(scrollSentinel.value);
};

const openCollectionsModal = async (item) => {
  isCollectionsModalVisible.value = true;
  collectionsLoading.value = true;
  collectionsData.value = [];
  try {
    const res = await axios.get(
      `${apiBase}/customer/${item.MemberCode}/collections`,
      getToken(),
    );
    collectionsData.value = res?.data?.data || [];
  } catch (error) {
    console.log(error);
    showNotification("error", "Failed to load collections.");
  } finally {
    collectionsLoading.value = false;
  }
};

const openDetailsModal = async (item) => {
  isDetailsModalVisible.value = true;
  detailsLoading.value = true;
  customerInfo.value = null;
  collections.value = [];
  try {
    const res = await axios.get(
      `${apiBase}/customer/${item.MemberCode}/summary_member_collection`,
      getToken(),
    );
    const d = res?.data?.data || {};
    customerInfo.value = d.CustomerInfo?.[0] || null;
    collections.value = d.Collections || [];
  } catch (error) {
    console.log(error);
    showNotification("error", "Failed to load details.");
  } finally {
    detailsLoading.value = false;
  }
};

// Loan Collection
const isLoanCollectionModalVisible = ref(false);
const isLoanCollectionSaving = ref(false);
const loanCollectionLoading = ref(false);
const loanCollectionDetails = ref(null);
const loanCollectionForm = ref({
  MemberCode: "",
  CustomerName: "",
  LoanId: null,
  Payment: null,
  PaymentDate: dayjs().format("YYYY-MM-DD"),
});

const openLoanCollectionModal = async (item) => {
  loanCollectionForm.value = {
    MemberCode: item.MemberCode || "",
    CustomerName: item.CustomerName || item.AMDetails || "",
    LoanId: null,
    Payment: Number(item.Installment) || null,
    PaymentDate: dayjs().format("YYYY-MM-DD"),
  };
  loanCollectionDetails.value = null;
  isLoanCollectionModalVisible.value = true;
  loanCollectionLoading.value = true;

  try {
    const memberCode = (item.MemberCode || "").toLowerCase();
    const memberName = (item.CustomerName || item.AMDetails || "").toLowerCase();
    let foundLoanId = null;
    let foundInstallment = null;

    // Step 1: search pay-loan-payment — each row has a nested `loan` object (payment?.loan)
    const res = await axios.get(
      `${apiBase}/settings/pay-loan-payment?search=&per_page=9999&page=1`,
      getToken()
    );
    const rows = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];

    let memberLoan = rows.find(l =>
      (l.loan?.account?.MemberCode || "").toLowerCase() === memberCode
    );
    if (!memberLoan && memberName) {
      memberLoan = rows.find(l =>
        (l.loan?.account?.AMDetails || "").toLowerCase().includes(memberName)
      );
    }

    if (memberLoan?.loan?.LoanId) {
      foundLoanId = memberLoan.loan.LoanId;
      foundInstallment = memberLoan.loan.Installment;
    } else {
      // Step 2: fallback — search pay-loan list (covers members with 0 payments)
      const loanRes = await axios.get(
        `${apiBase}/settings/pay-loan?per_page=9999`,
        getToken()
      );
      const loans = Array.isArray(loanRes.data?.data) ? loanRes.data.data : [];
      const loan = loans.find(l =>
        (l.account?.MemberCode || "").toLowerCase() === memberCode ||
        (l.AMDetails || "").toLowerCase() === memberName
      );
      if (loan?.LoanId) {
        foundLoanId = loan.LoanId;
        foundInstallment = loan.Installment;
      }
    }

    if (foundLoanId) {
      loanCollectionForm.value.LoanId = foundLoanId;
      if (foundInstallment) loanCollectionForm.value.Payment = Number(foundInstallment);
      const detailRes = await axios.get(
        `${apiBase}/settings/pay-loan-payment/show?loanId=${foundLoanId}`,
        getToken()
      );
      if (detailRes.data?.success) loanCollectionDetails.value = detailRes.data.data || null;
    } else {
      showNotification("error", "No active loan found for this member.");
    }
  } catch (e) {
    console.log(e);
    showNotification("error", "Failed to fetch loan data.");
  } finally {
    loanCollectionLoading.value = false;
  }
};

const submitLoanCollection = async () => {
  if (!loanCollectionForm.value.LoanId) return showNotification("error", "Loan not found for this member.");
  if (!Number(loanCollectionForm.value.Payment)) return showNotification("error", "Please enter a valid payment amount.");
  if (!loanCollectionForm.value.PaymentDate) return showNotification("error", "Payment date is required.");

  isLoanCollectionSaving.value = true;
  try {
    const payload = {
      Payment: Number(loanCollectionForm.value.Payment),
      PaymentDate: loanCollectionForm.value.PaymentDate,
      EntryBy: "cashier",
      EntryDate: dayjs().format("YYYY-MM-DD"),
    };
    const res = await axios.post(
      `${apiBase}/settings/pay-loan-payment?loanId=${loanCollectionForm.value.LoanId}`,
      payload,
      getToken()
    );
    if (res.data?.success) {
      showNotification("success", "Collection added successfully!");
      isLoanCollectionModalVisible.value = false;
      fetchLoanMembers(false);
    } else {
      showNotification("error", res.data?.message || "Failed to add collection.");
    }
  } catch (e) {
    showNotification("error", e?.response?.data?.message || "Failed to add collection.");
  } finally {
    isLoanCollectionSaving.value = false;
  }
};

const fetchLoanPayableTotal = async () => {
  try {
    const res = await axios.get(`${apiBase}/dashboard/loan-members`, {
      ...getToken(),
      params: { limit: 99999, page: 1 },
    });
    if (res.data?.success) {
      const rows = Array.isArray(res.data.data) ? res.data.data : [];
      loanPayableTotal.value = rows.reduce((sum, item) => sum + (Number(item.TotalLoanPayable) || 0), 0);
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchLoanMembers(false);
  setupObserver();
  if (showLoanPayableBadge.value) fetchLoanPayableTotal();
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

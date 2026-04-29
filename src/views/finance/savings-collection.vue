<template>
  <MainLayout>
    <h1 class="text-2xl font-bold text-indigo-700 mb-6">{{ $t('menu.savingsCollection') }}</h1>

    <div class="bg-white shadow-md rounded-xl p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col md:flex-row items-start gap-1">
            <label class="font-semibold text-gray-700 w-24">{{ $t('common.dateFrom') }}</label>
            <a-date-picker
              v-model:value="formData.from"
              class="w-full"
              placeholder="Select Date From"
              :format="dateFormat"
              @change="fetchAllData"
            />
          </div>
          <div class="flex flex-col md:flex-row items-start gap-1">
            <label class="font-semibold text-gray-700 w-24">{{ $t('common.dateTo') }}</label>
            <a-date-picker
              v-model:value="formData.to"
              class="w-full"
              placeholder="Select Date To"
              :format="dateFormat"
              @change="fetchAllData"
            />
          </div>
        </div>

        <div class="col-span-1 md:col-span-2 flex flex-col md:flex-row md:items-start md:gap-4">
          <div class="flex flex-col md:flex-row items-center gap-1 border border-gray-300 rounded-lg p-4 flex-1">
            <label class="font-semibold text-gray-700 md:w-24 mb-2">Expense Category:</label>
            <a-select
              v-model:value="formData.category"
              class="w-full md:w-48 flex-1"
              show-search
              allowClear
              :filter-option="false"
              @select="handleCategorySelect"
              @search="fetchCategories"
              placeholder="Select Expense Category"
            >
              <a-select-option value="%">{{ $t('common.all') }}</a-select-option>
              <template v-for="(item, index) in categoryData" :key="index">
                <a-select-option :value="item.ExpenseCatId">
                  {{ item.ExpenseCatName }} - {{ item.ExpenseCatId }}
                </a-select-option>
              </template>
            </a-select>
          </div>

          <div class="flex gap-2 mt-4 items-center">
            <a-button type="primary" @click="handleAddExpense">{{ $t('common.add') }}</a-button>
            <a-button class="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700">
              {{ $t('common.close') }}
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <div class="text-right mt-3 flex justify-end items-center gap-2">
      <label class="font-semibold text-gray-700 md:w-24 mb-2">{{ $t('common.total') }}</label>
      <input
        type="text"
        class="w-24 border rounded-lg p-1 text-right bg-yellow-300 text-black font-bold"
        :value="totalSelectedNet"
        readonly
      />
    </div>

    <div class="overflow-x-auto mt-5">
      <table class="w-full min-w-[900px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2 w-[3%]">
              <input
                type="checkbox"
                :disabled="allData.length === 0"
                ref="selectAllCheckbox"
                :checked="isAllSelected"
                @change="toggleSelectAll($event)"
              />
            </th>
            <th class="border border-white px-4 py-2">ID</th>
            <th class="border border-white px-4 py-2">{{ $t('common.date') }}</th>
            <th class="border border-white px-4 py-2">Account Code</th>
            <th class="border border-white px-4 py-2">Category ID</th>
            <th class="border border-white px-4 py-2">Category Name</th>
            <th class="border border-white px-4 py-2">Remarks</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('common.amount') }}</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-if="allData.length === 0">
            <td colspan="8" class="text-center py-4 text-gray-500">
              {{ $t('common.noData') }}
            </td>
          </tr>
          <template v-else v-for="row in paginatedData" :key="row.InvoiceNo">
            <tr>
              <td class="px-4 border">
                <input
                  type="checkbox"
                  :value="row.InvoiceNo"
                  v-model="checkedInvoice"
                  @change="updateTotalForIndividual"
                />
              </td>
              <td class="px-4 border">{{ row.ID }}</td>
              <td class="px-4 border">{{ row.InvoiceDate }}</td>
              <td class="px-4 border">{{ row.AMCode }}</td>
              <td class="px-4 border">{{ row.ExpenseCatId }}</td>
              <td class="px-4 border">{{ row.ExpenseCatName }}</td>
              <td class="px-4 border">{{ row.Remarks }}</td>
              <td class="px-4 border text-right">{{ row.NET }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <a-pagination
      v-if="allData.length > pageSize"
      class="mt-4"
      v-model:current="currentPage"
      v-model:pageSize="pageSize"
      :total="allData.length"
      :show-size-changer="true"
      :page-size-options="['10', '20', '50', '100']"
      :show-total="(t) => $t('common.totalItems', { total: t })"
      @change="() => {}"
    />

    <a-modal
      v-model:open="isModalOpen"
      title="Add Expense Voucher"
      :footer="false"
      :width="1000"
      :maskClosable="false"
    >
      <div class="space-y-2">
        <a-form>
          <div class="p-2 bg-gray-50 rounded">
            <div class="flex flex-wrap gap-3">
              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700">Period</label>
                <input v-model="modalForm.Period" class="w-full border rounded-lg p-1 focus:outline-indigo-500" />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700">Site Code</label>
                <input v-model="modalForm.SiteCode" class="w-full border rounded-lg p-1 focus:outline-indigo-500" />
              </div>

              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700">{{ $t('common.date') }}</label>
                <a-date-picker v-model:value="modalForm.JVDate" class="w-full" format="YYYY-MM-DD" />
              </div>

              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('voucher.voucherType') }} <span class="text-red-500">*</span>
                </label>
                <a-select v-model:value="modalForm.JVType" class="w-full" @change="handleJVTypeChange">
                  <a-select-option value="NCC">NCC - 021-00001</a-select-option>
                  <a-select-option value="CSH">Cash - 021-01001</a-select-option>
                </a-select>
              </div>

              <div class="w-full sm:w-[576px]">
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('voucher.narration') }} <span class="text-red-500">*</span>
                </label>
                <input
                  required
                  v-model="commonNarration"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                  :placeholder="$t('voucher.enterNarration')"
                />
              </div>

              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700 text-end">{{ $t('common.amount') }}</label>
                <input
                  :value="calculateTotalSelectedAmount()"
                  readonly
                  class="w-full border rounded-lg p-1 bg-gray-100 text-end"
                />
              </div>
            </div>
          </div>

          <div class="bg-gray-50">
            <div
              class="flex flex-wrap gap-3 mb-3 p-3 border border-indigo-200 rounded"
              v-if="modalForm.JVType === 'NCC'"
            >
              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700">{{ $t('voucher.chequeNo') }}</label>
                <input v-model="chequeDetails.ChequeNo" type="text" class="w-full border rounded-lg p-1 focus:outline-indigo-500" :placeholder="$t('voucher.enterChequeNo')" />
              </div>
              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700">{{ $t('voucher.chequeName') }}</label>
                <input v-model="chequeDetails.ChequeName" class="w-full border rounded-lg p-1 focus:outline-indigo-500" />
              </div>
              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700">{{ $t('voucher.chequeDate') }}</label>
                <a-date-picker v-model:value="chequeDetails.ChequePayDate" class="w-full" format="YYYY-MM-DD" />
              </div>
            </div>
          </div>

          <div class="mt-2 flex justify-start gap-2">
            <a-button type="primary" @click="addVoucherEntry">{{ $t('common.add') }}</a-button>
            <a-button
              type="primary"
              @click="saveExpenseVoucher"
              :disabled="!debitVoucherEntry || creditVoucherEntries.length === 0"
            >{{ $t('common.save') }}</a-button>
          </div>

          <div class="shadow rounded-lg my-2 p-2 border border-gray-300">
            <h1 class="text-2xl font-bold text-primary mb-2">{{ $t('voucher.voucher') }}</h1>

            <div class="overflow-y-auto" style="max-height: 300px;">
              <table class="w-full text-left">
                <thead class="sticky top-0 z-10">
                  <tr class="bg-primary text-white">
                    <th class="border border-white px-4 py-2">{{ $t('voucher.accountCode') }}</th>
                    <th class="border border-white px-4 py-2">{{ $t('voucher.accountDetails') }}</th>
                    <th class="border border-white px-4 py-2">{{ $t('voucher.billNo') }}</th>
                    <th class="border border-white px-4 py-2">{{ $t('common.date') }}</th>
                    <th class="border border-white px-4 py-2 text-right">{{ $t('voucher.debit') }}</th>
                    <th class="border border-white px-4 py-2 text-right">{{ $t('voucher.credit') }}</th>
                  </tr>
                </thead>
                <tbody class="capitalize">
                  <tr v-if="!creditVoucherEntries.length && !modalForm.Details.length">
                    <td colspan="6" class="text-center py-4 text-gray-500">
                      No voucher data available. Click 'Add' above to populate.
                    </td>
                  </tr>

                  <tr v-for="item in creditVoucherEntries" :key="'confirmed-' + item.BillNo" class="bg-gray-100 hover:bg-gray-200">
                    <td class="px-4 border">{{ item.AccountCode }}</td>
                    <td class="px-4 border">{{ item.AccountDetails }}</td>
                    <td class="px-4 border">{{ item.BillNo }}</td>
                    <td class="px-4 border">{{ item.BillDate ? dayjs(item.BillDate).format("YYYY-MM-DD") : "" }}</td>
                    <td class="px-4 border text-right">{{ 0.0 }}</td>
                    <td class="px-4 border text-right">{{ (parseFloat(item.Credit) || 0).toFixed(2) }}</td>
                  </tr>

                  <tr v-for="item in modalForm.Details" :key="'pending-' + item.BillNo" class="bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-400">
                    <td class="px-4 border">{{ item.AccountCode }}</td>
                    <td class="px-4 border">{{ item.AccountDetails }}</td>
                    <td class="px-4 border">
                      {{ item.BillNo }}
                      <span class="text-xs text-yellow-600">(pending)</span>
                    </td>
                    <td class="px-4 border">{{ item.BillDate ? dayjs(item.BillDate).format("YYYY-MM-DD") : "" }}</td>
                    <td class="px-4 border text-right">{{ 0.0 }}</td>
                    <td class="px-4 border text-right">{{ (parseFloat(item.Credit) || 0).toFixed(2) }}</td>
                  </tr>

                  <tr v-if="debitVoucherEntry" key="debit-entry" class="bg-gray-100 hover:bg-gray-200">
                    <td class="px-4 border">{{ debitVoucherEntry.AccountCode }}</td>
                    <td class="px-4 border">{{ debitVoucherEntry.AccountDetails }}</td>
                    <td class="px-4 border">-</td>
                    <td class="px-4 border">-</td>
                    <td class="px-4 border text-right">{{ calculateTotalCredit() }}</td>
                    <td class="px-4 border text-right">{{ 0.0 }}</td>
                  </tr>
                </tbody>

                <tr class="bg-gray-50 border-t-2 border-gray-400" v-if="creditVoucherEntries.length > 0">
                  <td colspan="4"></td>
                  <td class="px-4 border">
                    <div class="w-full h-8 bg-teal-500 text-white text-center flex justify-center items-center rounded font-bold">
                      {{ calculateTotalDebit() }}
                    </div>
                  </td>
                  <td class="px-4 border">
                    <div class="w-full h-8 bg-blue-700 text-white text-center flex justify-center items-center rounded font-bold">
                      {{ calculateTotalCredit() }}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </a-form>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import dayjs from "dayjs";

const formData = ref({
  from: dayjs("2024-07-01"),
  to: dayjs().endOf("month"),
  category: "%",
});
const dateFormat = "YYYY-MM-DD";
const currentPage = ref(1);
const pageSize = ref(10);
const allData = ref([]);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return allData.value.slice(start, start + pageSize.value);
});

const categoryData = ref([]);
const checkedInvoice = ref([]);
const selectAllCheckbox = ref(null);
const isModalOpen = ref(false);
const userInfo = JSON.parse(localStorage.getItem("user_info"));
const commonNarration = ref("");
const totalSelectedNet = ref(0);

const chequeDetails = ref({
  ChequeNo: "",
  ChequeName: "",
  ChequePayDate: null,
});

const modalForm = ref({
  SiteCode: "01",
  Period: dayjs().format("YYYYMM"),
  JVType: "",
  JVCat: "R",
  JVDate: dayjs(),
  Posted: 0,
  UserId: userInfo?.UserId || "",
  EditDate: dayjs(),
  EditUserID: userInfo?.UserId || "",
  AMCode: "",
  ASCode: "0",
  Details: [],
});

const creditVoucherEntries = ref([]);
const debitVoucherEntry = ref(null);

const fetchAllData = async () => {
  try {
    const fromDate = formData.value.from ? dayjs(formData.value.from).format("YYYY-MM-DD") : "";
    const toDate = formData.value.to ? dayjs(formData.value.to).format("YYYY-MM-DD") : "";
    const catId = formData.value.category === "%" ? "" : formData.value.category;

    const res = await axios.get(
      `${apiBase}/expense-voucher/get-expense-details?ExpenseCatId=${catId}&from=${fromDate}&to=${toDate}`,
      getToken()
    );

    currentPage.value = 1;
    allData.value = (res?.data || []).map((item, idx) => ({
      ...item,
      InvoiceNo: `${item.ID}-${idx}`,
      InvoiceDate: item.ExpenseDate ? dayjs(item.ExpenseDate).format("YYYY-MM-DD") : "",
      NET: item.Amount || 0,
    }));

    totalSelectedNet.value = allData.value.reduce((sum, item) => sum + (Number(item.NET) || 0), 0);
    checkedInvoice.value = [];
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to fetch expense details.");
  }
};

const fetchCategories = async (search = "") => {
  try {
    const res = await axios.get(
      `${apiBase}/expense-voucher/get-category?q=${search}`,
      getToken()
    );
    if (res?.data) {
      categoryData.value = res.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleCategorySelect = (catId) => {
  const selected = categoryData.value.find((item) => item.ExpenseCatId === catId);
  if (selected?.AMCode) {
    modalForm.value.AMCode = selected.AMCode;
  }
  fetchAllData();
};

const isAllSelected = computed(() =>
  allData.value.length > 0 && checkedInvoice.value.length === allData.value.length
);

const isIndeterminate = computed(() =>
  checkedInvoice.value.length > 0 && checkedInvoice.value.length < allData.value.length
);

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    checkedInvoice.value = allData.value.map((item) => item.InvoiceNo);
  } else {
    checkedInvoice.value = [];
  }
  let total = 0;
  allData.value.forEach((item) => {
    if (checkedInvoice.value.includes(item.InvoiceNo)) total += Number(item.NET) || 0;
  });
  totalSelectedNet.value = total;
};

const updateTotalForIndividual = () => {
  let total = 0;
  allData.value.forEach((item) => {
    if (checkedInvoice.value.includes(item.InvoiceNo)) total += Number(item.NET) || 0;
  });
  totalSelectedNet.value = total;
};

watch(
  [checkedInvoice, allData],
  () => {
    if (selectAllCheckbox.value) {
      selectAllCheckbox.value.indeterminate = isIndeterminate.value;
    }
  },
  { deep: true }
);

const handleJVTypeChange = (value) => {
  if (value === "CSH") {
    chequeDetails.value = { ChequeNo: "", ChequeName: "", ChequePayDate: null };
  }
};

const handleAddExpense = () => {
  if (!isModalOpen.value) {
    creditVoucherEntries.value = [];
    debitVoucherEntry.value = null;
    commonNarration.value = "";
    chequeDetails.value = { ChequeNo: "", ChequeName: "", ChequePayDate: null };
    modalForm.value.JVType = "CSH";
    modalForm.value.Details = [];
  }

  const currentBatchInvoices = checkedInvoice.value.filter(
    (invNo) => !creditVoucherEntries.value.some((entry) => entry.BillNo === invNo)
  );

  if (currentBatchInvoices.length === 0) {
    const message = isModalOpen.value
      ? "Please select a new expense not already added to the voucher."
      : "Please select an expense.";
    showNotification("warning", message);
    return;
  }

  const initialCreditEntries = currentBatchInvoices.map((invNo) => {
    const invoice = allData.value.find((item) => item.InvoiceNo === invNo);
    const invoiceDateDayjs = invoice?.InvoiceDate ? dayjs(invoice.InvoiceDate) : null;

    return {
      AccountCode: invoice?.AMCode || "",
      AccountDetails: invoice?.ExpenseCatName || "",
      Credit: parseFloat(invoice?.NET) || 0,
      BillNo: invNo,
      BillDate: invoiceDateDayjs,
      TransType: "s",
      Person: invoice?.ExpenseCatName || "",
      Period: invoice?.InvoiceDate ? dayjs(invoice.InvoiceDate).format("YYYYMM") : "",
      ExpenseCatId: invoice?.ExpenseCatId || "",
    };
  });

  modalForm.value.Details = initialCreditEntries;

  const uniquePeriods = [...new Set(initialCreditEntries.map((e) => e.Period).filter(Boolean))];
  if (uniquePeriods.length && !commonNarration.value?.trim()) {
    commonNarration.value = uniquePeriods.join(", ");
  }

  isModalOpen.value = true;
};

const addVoucherEntry = () => {
  if (!commonNarration.value?.trim()) {
    showNotification("warning", "Please fill in the Narration.");
    return;
  }

  if (modalForm.value.JVType === "NCC") {
    const { ChequeNo, ChequeName, ChequePayDate } = chequeDetails.value;
    if (!ChequeNo || !ChequeName || !ChequePayDate) {
      showNotification("warning", "Please fill in all Cheque details for NCC type.");
      return;
    }
  }

  if (modalForm.value.Details.length === 0) {
    showNotification("warning", "No new expenses selected or ready to be added to the voucher.");
    return;
  }

  const newCreditEntries = modalForm.value.Details.map((detail) => ({
    AccountCode: detail.AccountCode,
    AccountDetails: detail.AccountDetails,
    Credit: detail.Credit,
    BillNo: detail.BillNo,
    BillDate: detail.BillDate,
    TransType: detail.TransType,
    Person: detail.Person,
    Narration: commonNarration.value,
    ExpenseCatId: detail.ExpenseCatId,
    ChequeNo: modalForm.value.JVType === "NCC" ? chequeDetails.value.ChequeNo : null,
    ChequeName: modalForm.value.JVType === "NCC" ? chequeDetails.value.ChequeName : null,
    ChequePayDate: modalForm.value.JVType === "NCC" ? chequeDetails.value.ChequePayDate : null,
  }));

  creditVoucherEntries.value.push(...newCreditEntries);
  modalForm.value.Details = [];

  const totalCreditAmount = calculateTotalCredit();
  const debitAC = modalForm.value.JVType === "NCC" ? "021-00001" : "021-01001";

  debitVoucherEntry.value = {
    AccountCode: debitAC,
    AccountDetails: modalForm.value.JVType === "NCC" ? "NCC A/C" : "Cash A/C",
    Debit: parseFloat(totalCreditAmount) || 0,
    Credit: 0,
    Narration: commonNarration.value,
  };
};

const calculateTotalDebit = () =>
  creditVoucherEntries.value.reduce((sum, item) => sum + (parseFloat(item.Credit) || 0), 0).toFixed(2);

const calculateTotalCredit = () =>
  creditVoucherEntries.value.reduce((sum, item) => sum + (parseFloat(item.Credit) || 0), 0).toFixed(2);

const saveExpenseVoucher = async () => {
  if (modalForm.value.Details.length > 0) {
    showNotification("warning", "You have pending entries. Please click 'Add' first before saving.");
    return;
  }

  if (creditVoucherEntries.value.length === 0 || !debitVoucherEntry.value) {
    showNotification("warning", "Voucher details are empty. Please select expenses and click 'Add' first.");
    return;
  }

  try {
    const jvDate = modalForm.value.JVDate
      ? dayjs(modalForm.value.JVDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");

    const payload = {
      SiteCode: modalForm.value.SiteCode || "01",
      Period: Number(dayjs(jvDate).format("YYYYMM")),
      JVType: modalForm.value.JVType || "CSH",
      JVCat: modalForm.value.JVCat || "P",
      JVDate: jvDate,
      AMCode: debitVoucherEntry.value?.AccountCode || "",
      Narration: commonNarration.value,
      ExpenseEntries: creditVoucherEntries.value.map((item) => ({
        ExpenseCatId: item.ExpenseCatId,
        AMCode: item.AccountCode,
        Amount: item.Credit,
        Narration: item.Narration,
      })),
    };

    await axios.post(`${apiBase}/expense-voucher/store`, payload, getToken());
    showNotification("success", "Expense voucher saved successfully!");
    isModalOpen.value = false;

    creditVoucherEntries.value = [];
    debitVoucherEntry.value = null;
    commonNarration.value = "";
    chequeDetails.value = { ChequeNo: "", ChequeName: "", ChequePayDate: null };
    checkedInvoice.value = [];
    totalSelectedNet.value = 0;
    modalForm.value.JVType = "";
    modalForm.value.Details = [];

    await fetchAllData();
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to save expense voucher.");
  }
};

const calculateTotalSelectedAmount = () =>
  checkedInvoice.value
    .map((invNo) => {
      const item = allData.value.find((d) => d.InvoiceNo === invNo);
      return item ? Number(item.NET) : 0;
    })
    .reduce((sum, net) => sum + net, 0);

onMounted(() => {
  fetchCategories();
  fetchAllData();
});
</script>

<template>
  <MainLayout>
    <h1 class="text-2xl font-bold text-indigo-700 mb-6">{{ $t('menu.memberLoan') }}</h1>

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

        <div
          class="col-span-1 md:col-span-2 flex flex-col md:flex-row md:items-start md:gap-4"
        >
          <div
            class="flex flex-col md:flex-row items-center gap-1 border border-gray-300 rounded-lg p-4 flex-1"
          >
            <label class="font-semibold text-gray-700 md:w-24 mb-2"
              >{{ $t('customer.title') }}:</label
            >
            <a-select
              v-model:value="formData.customer"
              class="w-full md:w-48 flex-1"
              show-search
              allowClear
              :filter-option="false"
              @select="handleCustomerSelect"
              @search="customerfetch"
              placeholder="Select Customer"
            >
              <a-select-option value="%">{{ $t('common.all') }}</a-select-option>
              <template v-for="(item, index) in customerData" :key="index">
                <a-select-option :value="item?.CustomerCode">
                  {{ item.CustomerName }} - {{ item.CustomerCode }}
                </a-select-option>
              </template>
            </a-select>

          </div>

          <div class="flex gap-2 mt-4 items-center">
            <a-button type="primary" @click="handleAddSale">{{ $t('common.add') }}</a-button>
            <a-button
              class="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
              >{{ $t('common.close') }}</a-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- total of selected InvoiceNo -->
    <div class="text-right mt-3 flex justify-end items-center gap-2">
      <label class="font-semibold text-gray-700 md:w-24 mb-2"> {{ $t('common.total') }}</label>
      <input
        type="text"
        class="w-24 border rounded-lg p-1 text-right bg-yellow-300 text-black font-bold"
        :value="totalSelectedNet"
        readonly
      />
    </div>
    <table class="w-full border border-collapse text-left mt-5">
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
          <th class="border border-white px-4 py-2">{{ $t('loan.loanId') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('loan.loanDate') }}</th>
          <!-- ACCOUNT CODE -->
          <th class="border border-white px-4 py-2">Account Code</th>
          <th class="border border-white px-4 py-2">{{ $t('customer.customerCode') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('customer.customerName') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('common.amount') }}</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-if="allData.length === 0">
          <td colspan="6" class="text-center py-4 text-gray-500">
            {{ $t('common.noData') }}
          </td>
        </tr>
        <template v-else v-for="data in paginatedData" :key="data.InvoiceNo">
          <tr>
            <td class="px-4 border">
              <input
                type="checkbox"
                :value="data.InvoiceNo"
                v-model="checkedInvoice"
                @change="updateTotalForIndividual"
              />
            </td>
            <td class="px-4 border">{{ data.InvoiceNo }}</td>
            <td class="px-4 border">{{ data?.InvoiceDate }}</td>
            <td class="px-4 border">{{ data?.AMCode }}</td>
            <td class="px-4 border">{{ data?.CustomerCode }}</td>
            <td class="px-4 border">{{ data?.CustomerName }}</td>
            <td class="px-4 border text-right">{{ data?.NET }}</td>
          </tr>
        </template>
      </tbody>
    </table>

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
      :title="$t('voucher.addMemberLoanVoucher')"
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

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700">JV Category</label>
                <input v-model="modalForm.JVCat" class="w-full border rounded-lg p-1 focus:outline-indigo-500" />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700">Trans Date</label>
                <a-date-picker v-model:value="modalForm.TransDate" class="w-full" format="YYYY-MM-DD" />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700">Posted</label>
                <input v-model="modalForm.Posted" class="w-full border rounded-lg p-1 focus:outline-indigo-500" />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700">User ID</label>
                <input v-model="modalForm.UserId" class="w-full border rounded-lg p-1 focus:outline-indigo-500" />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700">Edit Date</label>
                <a-date-picker v-model:value="modalForm.EditDate" class="w-full" format="YYYY-MM-DD" />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700">AM Code</label>
                <input v-model="modalForm.AMCode" class="w-full border rounded-lg p-1 focus:outline-indigo-500" />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700">AS Code</label>
                <input v-model="modalForm.ASCode" class="w-full border rounded-lg p-1 focus:outline-indigo-500" />
              </div>

              <div class="w-full sm:w-[576px]">
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('voucher.narration') }} <span class="text-red-500">*</span></label>
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
            <a-button type="primary" @click="saveLoanVoucher">{{ $t('common.save') }}</a-button>
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
                  <th class="border border-white px-4 py-2 text-right">{{ $t('voucher.debit') }}</th>
                  <th class="border border-white px-4 py-2 text-right">{{ $t('voucher.credit') }}</th>
                </tr>
              </thead>
              <tbody class="capitalize">
                <tr v-if="!creditVoucherEntries.length && !modalForm.Details.length">
                  <td colspan="5" class="text-center py-4 text-gray-500">
                    No voucher data available. Click 'Add' above to populate.
                  </td>
                </tr>

                <tr v-for="item in creditVoucherEntries" :key="'confirmed-' + item.BillNo" class="bg-gray-100 hover:bg-gray-200">
                  <td class="px-4 border">{{ item.AccountCode }}</td>
                  <td class="px-4 border">{{ item.AccountDetails }}</td>
                  <td class="px-4 border">{{ item.BillNo }}</td>
                  <td class="px-4 border text-right">{{ (parseFloat(item.Credit) || 0).toFixed(2) }}</td>
                  <td class="px-4 border text-right">{{ 0.0 }}</td>
                </tr>

                <tr v-for="item in modalForm.Details" :key="'pending-' + item.BillNo" class="bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-400">
                  <td class="px-4 border">{{ item.AccountCode }}</td>
                  <td class="px-4 border">{{ item.AccountDetails }}</td>
                  <td class="px-4 border">
                    {{ item.BillNo }}
                    <span class="text-xs text-yellow-600">(pending)</span>
                  </td>
                  <td class="px-4 border text-right">{{ (parseFloat(item.Credit) || 0).toFixed(2) }}</td>
                  <td class="px-4 border text-right">{{ 0.0 }}</td>
                </tr>

                <tr v-if="debitVoucherEntry" key="debit-entry" class="bg-gray-100 hover:bg-gray-200">
                  <td class="px-4 border">{{ debitVoucherEntry.AccountCode }}</td>
                  <td class="px-4 border">{{ debitVoucherEntry.AccountDetails }}</td>
                  <td class="px-4 border">-</td>
                  <td class="px-4 border text-right">{{ 0.0 }}</td>
                  <td class="px-4 border text-right">{{ calculateTotalCredit() }}</td>
                </tr>
              </tbody>

              <tr class="bg-gray-50 border-t-2 border-gray-400" v-if="creditVoucherEntries.length > 0">
                <td colspan="3"></td>
                <td class="px-4 border">
                  <div class="w-full h-8 bg-blue-700 text-white text-center flex justify-center items-center rounded font-bold">
                    {{ calculateTotalDebit() }}
                  </div>
                </td>
                <td class="px-4 border">
                  <div class="w-full h-8 bg-teal-500 text-white text-center flex justify-center items-center rounded font-bold">
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
  customer: "%",
});
const dateFormat = "YYYY-MM-DD";
const currentPage = ref(1);
const pageSize = ref(10);
const allData = ref([]);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return allData.value.slice(start, start + pageSize.value);
});
const customerData = ref([]);
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
  JVCat: "P",
  JVDate: dayjs(),
  TransDate: dayjs(),
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

// TODO: Replace with actual loan API endpoint
const fetchAllData = async () => {
  try {
    const fromDate = formData.value.from
      ? dayjs(formData.value.from).format("YYYY-MM-DD")
      : "";
    const toDate = formData.value.to
      ? dayjs(formData.value.to).format("YYYY-MM-DD")
      : "";

    const res = await axios.get(
      `${apiBase}/pay-loan-voucher/get-loan-details?CustomerCode=${formData.value.customer}&from=${fromDate}&to=${toDate}`,
      getToken()
    );
    if (!res?.data || res.data.length === 0) {
      showNotification("info", "No loan data found for the selected criteria.");
    }
    currentPage.value = 1;
    allData.value = (res?.data || []).map((item) => ({
      ...item,
      InvoiceNo: item.LoanId || item.ID,
      InvoiceDate: item.LoanDate ? dayjs(item.LoanDate).format("YYYY-MM-DD") : (item.Date ? dayjs(item.Date).format("YYYY-MM-DD") : ""),
      CustomerCode: item.MemberCode || item.CustomerCode,
      CustomerName: item.CustomerName || "",
      NET: item.LoanAmount || item.Amount,
    }));
    totalSelectedNet.value = allData.value.reduce(
      (sum, item) => sum + (Number(item.NET) || 0),
      0
    );
    checkedInvoice.value = [];
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to fetch loan details.");
  }
};

// TODO: Replace with actual loan customer API endpoint
const customerfetch = async (search = "") => {
  try {
    const res = await axios.get(
      `${apiBase}/pay-loan-voucher/get-employee?q=${search}`,
      getToken()
    );
    if (res?.data) {
      customerData.value = res?.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleCustomerSelect = (customerCode) => {
  const selectedCustomer = customerData.value.find(
    (item) => item.CustomerCode === customerCode
  );
  if (selectedCustomer && selectedCustomer.AMCode) {
    modalForm.value.AMCode = selectedCustomer.AMCode;
  }
  fetchAllData();
};

const isAllSelected = computed(() => {
  return (
    allData.value.length > 0 &&
    checkedInvoice.value.length === allData.value.length
  );
});

const isIndeterminate = computed(() => {
  return (
    checkedInvoice.value.length > 0 &&
    checkedInvoice.value.length < allData.value.length
  );
});

const toggleSelectAll = (event) => {
  let total = 0;
  if (event.target.checked) {
    checkedInvoice.value = allData.value.map((item) => item.InvoiceNo);
  } else {
    checkedInvoice.value = [];
  }
  allData.value.forEach((item) => {
    if (checkedInvoice.value.includes(item.InvoiceNo)) {
      total += Number(item.NET) || 0;
    }
  });
  totalSelectedNet.value = total;
};

const updateTotalForIndividual = () => {
  let total = 0;
  allData.value.forEach((item) => {
    if (checkedInvoice.value.includes(item.InvoiceNo)) {
      total += Number(item.NET) || 0;
    }
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
    chequeDetails.value.ChequeNo = "";
    chequeDetails.value.ChequeName = "";
    chequeDetails.value.ChequePayDate = null;
  }
};

const handleAddSale = () => {
  if (!isModalOpen.value) {
    creditVoucherEntries.value = [];
    debitVoucherEntry.value = null;
    commonNarration.value = "";
    chequeDetails.value = { ChequeNo: "", ChequeName: "", ChequePayDate: null };
    modalForm.value.JVType = "CSH";
    modalForm.value.Details = [];
  }

  const currentBatchInvoices = checkedInvoice.value.filter(
    (invNo) =>
      !creditVoucherEntries.value.some((entry) => entry.BillNo === invNo)
  );

  if (currentBatchInvoices.length === 0) {
    const message = isModalOpen.value
      ? "Please select a new loan not already added to the voucher."
      : "Please select a loan.";
    showNotification("warning", message);
    return;
  }

  const initialCreditEntries = currentBatchInvoices.map((invNo) => {
    const invoice = allData.value.find((item) => item.InvoiceNo === invNo);
    const invoiceDateDayjs = invoice?.InvoiceDate
      ? dayjs(invoice.InvoiceDate)
      : null;

    return {
      AccountCode: invoice?.AMCode || "",  // ✅ Fix
      AccountDetails: invoice?.CustomerName || "",
      Credit: parseFloat(invoice?.NET) || 0,
      BillNo: invNo,
      BillDate: invoiceDateDayjs,
      TransType: "s",
      Person: invoice?.CustomerName || "",
    };
  });

  modalForm.value.Details = initialCreditEntries;
  isModalOpen.value = true;
};

const addVoucherEntry = () => {
  if (!commonNarration.value || commonNarration.value.trim() === "") {
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
    showNotification("warning", "No new loans selected or ready to be added to the voucher.");
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

const calculateTotalDebit = () => {
  return creditVoucherEntries.value
    .reduce((sum, item) => sum + (parseFloat(item.Credit) || 0), 0)
    .toFixed(2);
};

const calculateTotalCredit = () => {
  return creditVoucherEntries.value
    .reduce((sum, item) => sum + (parseFloat(item.Credit) || 0), 0)
    .toFixed(2);
};

// TODO: Replace with actual loan voucher store API endpoint
const saveLoanVoucher = async () => {
  if (modalForm.value.Details.length > 0) {
    showNotification("warning", "You have pending entries. Please click 'Add' first to confirm them with narration before saving.");
    return;
  }

  if (creditVoucherEntries.value.length === 0 || !debitVoucherEntry.value) {
    showNotification("warning", "Voucher details are empty. Please select loans and click 'Add' first.");
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
      LoanIDs: checkedInvoice.value.map((id) => Number(id)),
    };

    await axios.post(
      `${apiBase}/pay-loan-voucher/store`,
      payload,
      getToken()
    );
    showNotification("success", "Loan voucher saved successfully!");
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
    showNotification("error", "Failed to save loan voucher");
  }
};

const calculateTotalSelectedAmount = () => {
  return checkedInvoice.value
    .map((invNo) => {
      const item = allData.value.find((d) => d.InvoiceNo === invNo);
      return item ? Number(item.NET) : 0;
    })
    .reduce((sum, net) => sum + net, 0);
};

onMounted(() => {
  customerfetch();
  fetchAllData();
});
</script>

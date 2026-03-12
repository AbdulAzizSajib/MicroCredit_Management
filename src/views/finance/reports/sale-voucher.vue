<template>
  <MainLayout>
    <h1 class="text-2xl font-bold text-indigo-700 mb-6">Sales Voucher</h1>

    <div class="bg-white shadow-md rounded-xl p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col md:flex-row items-start gap-1">
            <label class="font-semibold text-gray-700 w-24">Date From:</label>
            <a-date-picker
              v-model:value="formData.from"
              class="w-full"
              placeholder="Select Date From"
              :format="dateFormat"
            />
          </div>
          <div class="flex flex-col md:flex-row items-start gap-1">
            <label class="font-semibold text-gray-700 w-24">Date To:</label>
            <a-date-picker
              v-model:value="formData.to"
              class="w-full"
              placeholder="Select Date To"
              :format="dateFormat"
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
              >Customer:</label
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
              <template v-for="(item, index) in customerData" :key="index">
                <a-select-option :value="item?.CustomerCode">
                  {{ item.CustomerName }} - {{ item.CustomerCode }}
                </a-select-option>
              </template>
            </a-select>

            <a-button type="primary" @click="fetchAllData">Show</a-button>
          </div>

          <div class="flex gap-2 mt-4 items-center">
            <a-button type="primary" @click="handleAddSale">Add</a-button>
            <a-button
              class="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
              >Close</a-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- total of selected InvoiceNo -->
    <div class="text-right mt-3 flex justify-end items-center gap-2">
      <label class="font-semibold text-gray-700 md:w-24 mb-2"> Total</label>
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
          <th class="border border-white px-4 py-2">Invoice No</th>
          <th class="border border-white px-4 py-2">Invoice Date</th>
          <th class="border border-white px-4 py-2">Customer Code</th>
          <th class="border border-white px-4 py-2">Customer Name</th>
          <th class="border border-white px-4 py-2">NET</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-if="allData.length === 0">
          <td colspan="6" class="text-center py-4 text-gray-500">
            No data available.
          </td>
        </tr>
        <template v-else v-for="data in allData" :key="data.InvoiceNo">
          <tr>
            <td class="px-4 border">
              <input
                type="checkbox"
                :value="data.InvoiceNo"
                v-model="checkedInvoice"
                @change="updateTotalForIndividual"
              />
            </td>
            <td class="px-4 border relative">
              <div class="flex items-center cursor-pointer gap-2">
                <span @click="toggleInvoice(data.InvoiceNo)" class="flex-1">
                  {{ data.InvoiceNo }}
                </span>

                <Icon
                  class="text-lg"
                  :icon="
                    isOpen(data.InvoiceNo)
                      ? 'mdi:chevron-down'
                      : 'mdi:chevron-up'
                  "
                  @click.stop="toggleInvoice(data.InvoiceNo)"
                />
              </div>
            </td>

            <td class="px-4 border">{{ data?.InvoiceDate }}</td>
            <td class="px-4 border">{{ data?.CustomerCode }}</td>
            <td class="px-4 border">{{ data?.CustomerName }}</td>
            <td class="px-4 border text-right">{{ data?.NET }}</td>
          </tr>

          <tr v-if="isOpen(data.InvoiceNo)">
            <td colspan="6" class="bg-gray-50">
              <div
                v-if="invoiceDetails[data.InvoiceNo]?.length"
                class="overflow-x-auto"
              >
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-gray-200 border border-gray-400">
                      <th class="border px-2 py-1">Product Code</th>
                      <th class="border px-2 py-1">Product Name</th>
                      <th class="border px-2 py-1">Unit Price</th>
                      <th class="border px-2 py-1">Sales VAT</th>
                      <th class="border px-2 py-1">Quantity</th>
                      <th class="border px-2 py-1">Discount</th>
                      <th class="border px-2 py-1">NET</th>
                      <th class="border px-2 py-1">NSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="inv in invoiceDetails[data.InvoiceNo]"
                      :key="`${data.InvoiceNo}-${inv.ProductCode}`"
                    >
                      <td class="border px-2 py-1">{{ inv.ProductCode }}</td>
                      <td class="border px-2 py-1">{{ inv.ProductName }}</td>
                      <td class="border px-2 py-1">{{ inv.UnitPrice }}</td>
                      <td class="border px-2 py-1">{{ inv.SalesVat }}</td>
                      <td class="border px-2 py-1">{{ inv.SalesQTY }}</td>
                      <td class="border px-2 py-1">{{ inv.Discount }}</td>
                      <td class="border px-2 py-1">{{ inv.NET }}</td>
                      <td class="border px-2 py-1">{{ inv.NSI }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-gray-500 text-center py-4">
                Loading...
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <a-modal
      v-model:open="isModalOpen"
      title="Add Sale Voucher"
      :footer="false"
      :width="1000"
      :maskClosable="false"
    >
      <div class="space-y-2">
        <a-form>
          <div class="p-6 bg-gray-50 rounded">
            <div class="flex flex-wrap gap-3">
              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700"
                  >Period</label
                >
                <input
                  v-model="modalForm.Period"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700"
                  >Site Code</label
                >
                <input
                  v-model="modalForm.SiteCode"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                />
              </div>

              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700"
                  >Date</label
                >
                <a-date-picker
                  v-model:value="modalForm.JVDate"
                  class="w-full"
                  format="YYYY-MM-DD"
                />
              </div>

              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700">
                  Voucher Type <span class="text-red-500">*</span>
                </label>
                <a-select
                  v-model:value="modalForm.JVType"
                  class="w-full"
                  @change="handleJVTypeChange"
                  :rules="[
                    {
                      required: false,
                      message: 'Please select a Voucher Type!',
                    },
                  ]"
                  required
                >
                  <a-select-option value="NCC">NCC - 021-00001</a-select-option>
                  <a-select-option value="CSH"
                    >Cash - 021-01001</a-select-option
                  >
                </a-select>
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700"
                  >JV Category</label
                >
                <input
                  v-model="modalForm.JVCat"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700"
                  >Trans Date</label
                >
                <a-date-picker
                  v-model:value="modalForm.TransDate"
                  class="w-full"
                  format="YYYY-MM-DD"
                />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700"
                  >Posted</label
                >
                <input
                  v-model="modalForm.Posted"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700"
                  >User ID</label
                >
                <input
                  v-model="modalForm.UserId"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700"
                  >Edit Date</label
                >
                <a-date-picker
                  v-model:value="modalForm.EditDate"
                  class="w-full"
                  format="YYYY-MM-DD"
                />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700"
                  >AM Code</label
                >
                <input
                  v-model="modalForm.AMCode"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                />
              </div>

              <div class="w-[280px] hidden">
                <label class="block text-sm font-medium text-gray-700"
                  >AS Code</label
                >
                <input
                  v-model="modalForm.ASCode"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                />
              </div>

              <div class="w-full sm:w-[576px]">
                <label class="block text-sm font-medium text-gray-700">
                  Narration <span class="text-red-500">*</span></label
                >
                <input
                  required
                  v-model="commonNarration"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                  placeholder="Enter a  narration"
                />
              </div>

              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700 text-end"
                  >Amount</label
                >
                <input
                  :value="calculateTotalSelectedAmount()"
                  readonly
                  class="w-full border rounded-lg p-1 bg-gray-100 text-end"
                />
              </div>
            </div>
          </div>

          <div class="p-2 bg-gray-50">
            <div
              class="flex flex-wrap gap-3 mb-3 p-3 border border-indigo-200 rounded"
              v-if="modalForm.JVType === 'NCC'"
            >
              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700"
                  >Cheque No</label
                >
                <input
                  v-model="chequeDetails.ChequeNo"
                  type="text"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                  placeholder="Enter Cheque No"
                />
              </div>

              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700"
                  >Cheque Name</label
                >
                <input
                  v-model="chequeDetails.ChequeName"
                  class="w-full border rounded-lg p-1 focus:outline-indigo-500"
                />
              </div>

              <div class="w-[280px]">
                <label class="block text-sm font-medium text-gray-700"
                  >Cheque Date</label
                >
                <a-date-picker
                  v-model:value="chequeDetails.ChequePayDate"
                  class="w-full"
                  format="YYYY-MM-DD"
                />
              </div>
            </div>
          </div>
          <div class="mt-4 flex justify-start gap-2">
            <a-button type="primary" @click="addVoucherEntry">Add</a-button>
            <a-button type="primary" @click="saveSaleVoucher">Save</a-button>
          </div>
          <div class="shadow rounded-lg my-4 p-4 border border-gray-300">
            <h1 class="text-2xl font-bold text-primary mb-4">Voucher</h1>

            <table class="w-full text-left">
              <thead>
                <tr class="bg-primary text-white">
                  <th class="border border-white px-4 py-2">Account Code</th>
                  <th class="border border-white px-4 py-2">Account Details</th>
                  <th class="border border-white px-4 py-2">Bill No</th>
                  <th class="border border-white px-4 py-2 text-right">
                    Debit
                  </th>
                  <th class="border border-white px-4 py-2 text-right">
                    Credit
                  </th>
                </tr>
              </thead>
              <tbody class="capitalize">
                <tr
                  v-if="
                    !creditVoucherEntries.length && !modalForm.Details.length
                  "
                >
                  <td colspan="5" class="text-center py-4 text-gray-500">
                    No voucher data available. Click 'Add' above to populate.
                  </td>
                </tr>

                <!-- Show confirmed entries (already added with narration) -->
                <tr
                  v-for="(item, index) in creditVoucherEntries"
                  :key="'confirmed-' + item.BillNo"
                  class="bg-gray-100 hover:bg-gray-200"
                >
                  <td class="px-4 border">{{ item.AccountCode }}</td>
                  <td class="px-4 border">{{ item.AccountDetails }}</td>
                  <td class="px-4 border">{{ item.BillNo }}</td>
                  <td class="px-4 border text-right">{{ 0.0 }}</td>
                  <td class="px-4 border text-right">
                    {{ (parseFloat(item.Credit) || 0).toFixed(2) }}
                  </td>
                </tr>

                <!-- Show pending entries (selected but not yet confirmed with narration) -->
                <tr
                  v-for="(item, index) in modalForm.Details"
                  :key="'pending-' + item.BillNo"
                  class="bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-400"
                >
                  <td class="px-4 border">{{ item.AccountCode }}</td>
                  <td class="px-4 border">{{ item.AccountDetails }}</td>
                  <td class="px-4 border">
                    {{ item.BillNo }}
                    <span class="text-xs text-yellow-600">(pending)</span>
                  </td>
                  <td class="px-4 border text-right">{{ 0.0 }}</td>
                  <td class="px-4 border text-right">
                    {{ (parseFloat(item.Credit) || 0).toFixed(2) }}
                  </td>
                </tr>

                <!-- Debit entry row - only show after user clicks Add inside modal -->
                <tr
                  v-if="debitVoucherEntry"
                  key="debit-entry"
                  class="bg-gray-100 hover:bg-gray-200"
                >
                  <td class="px-4 border">
                    {{ debitVoucherEntry.AccountCode }}
                  </td>
                  <td class="px-4 border">
                    {{ debitVoucherEntry.AccountDetails }}
                  </td>
                  <td class="px-4 border">-</td>
                  <td class="px-4 border text-right">
                    {{ calculateTotalCredit() }}
                  </td>
                  <td class="px-4 border text-right">{{ 0.0 }}</td>
                </tr>
              </tbody>

              <!-- Totals row - only show after user clicks Add inside modal -->
              <tr
                class="bg-gray-50 border-t-2 border-gray-400"
                v-if="creditVoucherEntries.length > 0"
              >
                <td colspan="3"></td>
                <td class="px-4 border">
                  <div
                    class="w-full h-8 bg-blue-700 text-white text-center flex justify-center items-center rounded font-bold"
                  >
                    {{ calculateTotalDebit() }}
                  </div>
                </td>
                <td class="px-4 border">
                  <div
                    class="w-full h-8 bg-teal-500 text-white text-center flex justify-center items-center rounded font-bold"
                  >
                    {{ calculateTotalCredit() }}
                  </div>
                </td>
              </tr>
            </table>
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
import { Icon } from "@iconify/vue";

// --- Existing Refs (Outside Modal Logic) ---
const formData = ref({
  from: dayjs().startOf("month"),
  to: dayjs().endOf("month"),
  customer: "",
});
const dateFormat = "YYYY-MM-DD";
const allData = ref([]);
const customerData = ref([]);
const openInvoices = ref([]);
const invoiceDetails = ref({});
const checkedInvoice = ref([]);
const selectAllCheckbox = ref(null);
const isModalOpen = ref(false);
const userInfo = JSON.parse(localStorage.getItem("user_info"));
// --- New/Modified Refs for Modal State ---
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
  TransDate: dayjs(),
  Posted: 0,
  UserId: userInfo?.UserId || "",
  EditDate: dayjs(),
  EditUserID: userInfo?.UserId || "",
  AMCode: "",
  ASCode: "0",
  Details: [], // Temporary: Holds basic credit structure on handleAddSale.
});

const creditVoucherEntries = ref([]);
const debitVoucherEntry = ref(null);

// --- Existing Logic (Outside Modal Logic) ---
const fetchAllData = async () => {
  try {
    const fromDate = formData.value.from
      ? dayjs(formData.value.from).format("YYYY-MM-DD")
      : "";
    const toDate = formData.value.to
      ? dayjs(formData.value.to).format("YYYY-MM-DD")
      : "";

    const res = await axios.get(
      `${apiBase}/get_sales_details?q=${formData.value.customer}&from=${fromDate}&to=${toDate}`,
      getToken()
    );
    if (!res?.data || res.data.length === 0) {
      showNotification(
        "info",
        "No sales data found for the selected criteria."
      );
    }
    allData.value = res?.data?.map((item) => ({
      ...item,
      InvoiceDate: item.InvoiceDate
        ? dayjs(item.InvoiceDate).format("YYYY-MM-DD")
        : "",
    }));
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to fetch sales details.");
  }
};

const customerfetch = async (search = "") => {
  try {
    const res = await axios.get(
      `${apiBase}/get_customer?q=${search}`,
      getToken()
    );
    if (res?.data) {
      customerData.value = res?.data;
      // customerData.value = res?.data?.map((item) => ({
      //   value: item.CustomerCode,
      //   label: item.CustomerName,
      // }));
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
};

const fetchInvoiceDetails = async (invoiceNo) => {
  try {
    if (!invoiceDetails.value[invoiceNo]) {
      const res = await axios.get(
        `${apiBase}/get_invoice_details?InvoiceNo=${invoiceNo}`,
        getToken()
      );
      invoiceDetails.value[invoiceNo] = res?.data;
    }
  } catch (error) {
    console.error(error);
    invoiceDetails.value[invoiceNo] = [];
  }
};

const isOpen = (invoiceNo) => openInvoices.value.includes(invoiceNo);

// Select All functionality
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
    // Select all invoices
    checkedInvoice.value = allData.value.map((item) => item.InvoiceNo);
  } else {
    // Deselect all
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

// Watch for changes to update indeterminate state
watch(
  [checkedInvoice, allData],
  () => {
    if (selectAllCheckbox.value) {
      selectAllCheckbox.value.indeterminate = isIndeterminate.value;
    }
  },
  { deep: true }
);

const toggleInvoice = (invoiceNo) => {
  if (isOpen(invoiceNo)) {
    openInvoices.value = openInvoices.value.filter((inv) => inv !== invoiceNo);
  } else {
    openInvoices.value.push(invoiceNo);
    fetchInvoiceDetails(invoiceNo);
  }
};

// --- MODIFIED Modal Logic START ---

const handleJVTypeChange = (value) => {
  if (value === "CSH") {
    // Clear Cheque fields if Cash is selected
    chequeDetails.value.ChequeNo = "";
    chequeDetails.value.ChequeName = "";
    chequeDetails.value.ChequePayDate = null;
  }
};

// Helper functions for debit entry display when pending entries exist
const getDebitAccountCode = () => {
  return modalForm.value.JVType === "NCC" ? "021-00001" : "021-01001";
};

const getDebitAccountDetails = () => {
  return modalForm.value.JVType === "NCC" ? "NCC A/C" : "Cash A/C";
};

// 1. Opens the modal and prepares the base credit entries
const handleAddSale = () => {
  // If the modal is NOT open (opening fresh), reset everything first
  if (!isModalOpen.value) {
    creditVoucherEntries.value = [];
    debitVoucherEntry.value = null;
    commonNarration.value = "";
    chequeDetails.value = { ChequeNo: "", ChequeName: "", ChequePayDate: null };
    modalForm.value.JVType = "CSH";
    modalForm.value.Details = [];
  }

  // Now filter after reset - this ensures fresh state when modal reopens
  const currentBatchInvoices = checkedInvoice.value.filter(
    (invNo) =>
      !creditVoucherEntries.value.some((entry) => entry.BillNo === invNo)
  );

  // If no invoices are selected, warn and return.
  if (currentBatchInvoices.length === 0) {
    const message = isModalOpen.value
      ? "Please select a new invoice not already added to the voucher."
      : "Please select an invoice.";
    showNotification("warning", message);
    return;
  }

  // Create entries for the newly selected invoices (these will show as "pending")
  const initialCreditEntries = currentBatchInvoices.map((invNo) => {
    const invoice = allData.value.find((item) => item.InvoiceNo === invNo);
    const invoiceDateDayjs = invoice?.InvoiceDate
      ? dayjs(invoice.InvoiceDate)
      : null;

    return {
      AccountCode: modalForm.value.AMCode,
      AccountDetails: invoice?.CustomerName || "",
      Credit: parseFloat(invoice?.NET) || 0,
      BillNo: invNo,
      BillDate: invoiceDateDayjs,
      TransType: "s",
      Person: invoice?.CustomerName || "",
    };
  });

  // Store them temporarily in Details - they will show as "pending" in the table
  modalForm.value.Details = initialCreditEntries;

  isModalOpen.value = true;
};

// 2. Populates the Voucher table inside the modal
const addVoucherEntry = () => {
  if (!commonNarration.value || commonNarration.value.trim() === "") {
    showNotification("warning", "Please fill in the Narration.");
    return;
  }

  if (modalForm.value.JVType === "NCC") {
    const { ChequeNo, ChequeName, ChequePayDate } = chequeDetails.value;
    if (!ChequeNo || !ChequeName || !ChequePayDate) {
      showNotification(
        "warning",
        "Please fill in all Cheque details for NCC type."
      );
      return;
    }
  }

  // If Details is empty, it means the batch was already added or nothing was selected.
  if (modalForm.value.Details.length === 0) {
    showNotification(
      "warning",
      "No new invoices selected or ready to be added to the voucher."
    );
    return;
  }

  // 1. Create Credit Entries (applying single narration and cheque info)
  const newCreditEntries = modalForm.value.Details.map((detail) => ({
    AccountCode: detail.AccountCode,
    AccountDetails: detail.AccountDetails,
    Credit: detail.Credit,
    BillNo: detail.BillNo,
    BillDate: detail.BillDate,
    TransType: detail.TransType,
    Person: detail.Person,
    Narration: commonNarration.value,
    ChequeNo:
      modalForm.value.JVType === "NCC" ? chequeDetails.value.ChequeNo : null,
    ChequeName:
      modalForm.value.JVType === "NCC" ? chequeDetails.value.ChequeName : null,
    ChequePayDate:
      modalForm.value.JVType === "NCC"
        ? chequeDetails.value.ChequePayDate
        : null,
  }));

  // ACCUMULATE: Add new entries to the existing entries
  creditVoucherEntries.value.push(...newCreditEntries);

  // Clear the temporary batch holder (modalForm.Details) ONLY.
  modalForm.value.Details = [];

  // 2. Create/Update Debit Entry (The balancing line must be the total of ALL Credit entries)
  const totalCreditAmount = calculateTotalCredit();
  const debitAC = modalForm.value.JVType === "NCC" ? "021-00001" : "021-01001"; // Bank/Cash A/C

  debitVoucherEntry.value = {
    AccountCode: debitAC,
    AccountDetails: modalForm.value.JVType === "NCC" ? "NCC A/C" : "Cash A/C",
    Debit: parseFloat(totalCreditAmount) || 0,
    Credit: 0,
    Narration: commonNarration.value,
  };
};

// 3. Calculate total debit (sum of credit amounts for balancing)
const calculateTotalDebit = () => {
  const totalCredit = creditVoucherEntries.value.reduce((sum, item) => {
    return sum + (parseFloat(item.Credit) || 0);
  }, 0);

  return totalCredit.toFixed(2);
};

// 4. Calculate total credit (sum of all credit entries)
const calculateTotalCredit = () => {
  return creditVoucherEntries.value
    .reduce((sum, item) => {
      return sum + (parseFloat(item.Credit) || 0);
    }, 0)
    .toFixed(2);
};

// NEW: Calculate total credit including pending entries (for display purposes)
const calculateTotalCreditIncludingPending = () => {
  const confirmedTotal = creditVoucherEntries.value.reduce((sum, item) => {
    return sum + (parseFloat(item.Credit) || 0);
  }, 0);

  const pendingTotal = modalForm.value.Details.reduce((sum, item) => {
    return sum + (parseFloat(item.Credit) || 0);
  }, 0);

  return (confirmedTotal + pendingTotal).toFixed(2);
};

// 5. Save Voucher (Final preparation and API POST)

const saveSaleVoucher = async () => {
  // Check if there are pending entries that haven't been added yet
  if (modalForm.value.Details.length > 0) {
    showNotification(
      "warning",
      "You have pending entries. Please click 'Add' first to confirm them with narration before saving."
    );
    return;
  }

  if (creditVoucherEntries.value.length === 0 || !debitVoucherEntry.value) {
    showNotification(
      "warning",
      "Voucher details are empty. Please select invoices and click 'Add' first."
    );
    return;
  }

  // CRITICAL FIX: Get the BillNo from the first credit entry to satisfy the validator for Details.0.
  const firstCreditEntryBillNo = creditVoucherEntries.value[0]?.BillNo || "";

  // Construct the final Details array for the API (Debit line + all Credit lines)
  const finalDetails = [
    // 1. Debit Entry (The single balancing line)
    {
      Person: "",
      ChequeNo: debitVoucherEntry.value.AccountCode.includes("NCC")
        ? chequeDetails.value.ChequeNo
        : "",
      ChequeName: debitVoucherEntry.value.AccountCode.includes("NCC")
        ? chequeDetails.value.ChequeName
        : "",
      ChequePayDate: debitVoucherEntry.value.AccountCode.includes("NCC")
        ? chequeDetails.value.ChequePayDate
          ? dayjs(chequeDetails.value.ChequePayDate).format("YYYY-MM-DD")
          : null
        : null,
      Narration: debitVoucherEntry.value.Narration,
      Credit: 0,
      Debit: parseFloat(calculateTotalCredit()),
      BillNo: firstCreditEntryBillNo, // <--- THIS IS THE FIX
      BillDate: null,
      TransType: "",
      AccountCode: debitVoucherEntry.value.AccountCode,
    },
    // 2. All accumulated Credit Entries
    ...creditVoucherEntries.value.map((d) => ({
      Person: d.Person,
      ChequeNo: d.ChequeNo || "",
      ChequeName: d.ChequeName || "",
      ChequePayDate: d.ChequePayDate
        ? dayjs(d.ChequePayDate).format("YYYY-MM-DD")
        : null,
      Narration: d.Narration,
      Credit: parseFloat(d.Credit),
      Debit: 0,
      BillNo: d.BillNo, // This was already correct
      BillDate: d.BillDate ? dayjs(d.BillDate).format("YYYY-MM-DD") : null,
      TransType: d.TransType,
      AccountCode: d.AccountCode,
    })),
  ];

  try {
    const payload = {
      ...modalForm.value,
      JVDate: modalForm.value.JVDate
        ? modalForm.value.JVDate.format("YYYY-MM-DD")
        : "",
      TransDate: modalForm.value.TransDate
        ? modalForm.value.TransDate.format("YYYY-MM-DD")
        : "",
      EditDate: modalForm.value.EditDate
        ? modalForm.value.EditDate.format("YYYY-MM-DD")
        : "",
      EditUserID: modalForm.value.EditUserID,
      Details: finalDetails.filter((d) => d.Credit > 0 || d.Debit > 0),
    };

    // Post data to API
    await axios.post(`${apiBase}/sales_voucher_add`, payload, getToken());
    showNotification("success", "Voucher saved successfully!");
    isModalOpen.value = false;

    // Reset ALL state after successful save
    creditVoucherEntries.value = [];
    debitVoucherEntry.value = null;
    commonNarration.value = "";
    chequeDetails.value = { ChequeNo: "", ChequeName: "", ChequePayDate: null };

    // **CRITICAL FIX**: Clear checkboxes ONLY on successful SAVE
    checkedInvoice.value = [];

    // reset total
    totalSelectedNet.value = 0;

    modalForm.value.JVType = "";
    modalForm.value.Details = [];

    await fetchAllData();
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to save voucher");
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

// --- MODIFIED Modal Logic END ---

onMounted(() => {
  customerfetch();
});
</script>

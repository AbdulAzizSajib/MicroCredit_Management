<template>
  <MainLayout>
    <!-- title -->

    <div class="pt-4">
      <div class="">
        <div class="grid grid-cols-12 gap-4 filter-field">
          <!-- Title Section -->
          <div class="col-span-12 lg:col-span-2">
            <h1 class="text-2xl font-bold text-primary">Ledger Book</h1>
          </div>

          <!-- Form Section -->
          <div class="col-span-12 lg:col-span-10">
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2 mb-6 w-full items-end"
            >
              <!-- Account Head with Search -->
              <div class="col-span-5">
                <div class="flex w-full">
                  <a-form-item
                    label="Account Head"
                    class="w-full"
                    name="accountHead"
                    :rules="[
                      {
                        required: false,
                        message: 'Please select account head!',
                      },
                    ]"
                  >
                    <a-select
                      class="w-full"
                      v-model:value="formData.AMCode1"
                      placeholder="Select Account Head"
                      allow-clear
                      :loading="isLoading"
                      show-search
                      :filter-option="false"
                      option-label-prop="label"
                      @search="
                        (event) => {
                          accountHeadList = all_accountHeadList.filter(
                            (item) =>
                              item?.label
                                ?.toLowerCase()
                                .includes(event.toLowerCase()) ||
                              item?.value
                                ?.toLowerCase()
                                .includes(event.toLowerCase())
                          );
                        }
                      "
                    >
                      <a-select-option
                        v-for="item in accountHeadList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                        class="!whitespace-normal"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>

              <!-- From Date -->
              <div class="col-span-7">
                <div class="flex gap-2">
                  <div>
                    <a-form-item label="From" name="fromDate">
                      <a-date-picker
                        v-model:value="formData.Date1"
                        class="w-full"
                        format="DD-MM-YYYY"
                        value-format="YYYY-MM-DD"
                        :disabled-date="disabledDate"
                        placeholder="Select start date"
                        @change="handleDateFromChange"
                      />
                    </a-form-item>
                  </div>
                  <div>
                    <a-form-item label="To" name="toDate">
                      <a-date-picker
                        v-model:value="formData.Date2"
                        class="w-full"
                        format="DD-MM-YYYY"
                        value-format="YYYY-MM-DD"
                        :disabled-date="disabledDate"
                        placeholder="Select end date"
                        @change="handleDateToChange"
                      />
                    </a-form-item>
                  </div>
                  <div>
                    <a-button
                      type="primary"
                      @click="fetchAllData"
                      :loading="loading"
                      class="w-full"
                    >
                      Preview
                    </a-button>
                  </div>
                </div>
              </div>

              <!-- Preview Button -->
            </div>
          </div>
        </div>

        <!-- Transaction Date Section -->
      </div>

      <!-- Report Table -->
      <div
        id="ledgerBookToPrint"
        class="max-w-6xl m-auto p-8 border border-gray-200 rounded-md shadow"
        v-if="allData.length > 0"
      >
        <div class="flex justify-end gap-2 pb-4">
          <button @click="exportExcel" class="" :disabled="excelLoading">
            <a-spin v-if="excelLoading" size="small" class="spinner-white" />
            <span>
              <Icon icon="vscode-icons:file-type-excel" class="text-4xl" />
            </span>
          </button>
          <button @click="exportPDF" :disabled="pdfLoading">
            <a-spin v-if="pdfLoading" size="small" class="spinner-white" />
            <span v-if="!pdfLoading">
              <Icon icon="vscode-icons:file-type-pdf2" class="text-4xl" />
            </span>
          </button>
        </div>
        <!-- Header Area -->
        <div class="flex justify-between mb-4 items-center space-x-10">
          <div class="text-left mb-6">
            <h1 class="text-xl font-bold text-gray-800">Ledger Book</h1>
            <p class="text-lg text-gray-700 font-semibold">
              P-ERP Food and Snacks
            </p>
            <p class="text-base font-bold">
              <span>{{ allData?.[0].AMCode }}</span
              >:<span>{{ allData?.[0].AMDetails }}</span>
            </p>
          </div>
          <div class="flex gap-10">
            <!-- Print Table -->
            <table class="w-[200px] table-auto border-collapse">
              <thead>
                <tr>
                  <th class="border px-4 py-1 text-left">Print</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border px-4 py-1 text-sm">
                    Date: {{ currentDate }}
                  </td>
                </tr>
                <tr>
                  <td class="border px-4 py-1 text-sm">
                    Time: {{ currentTime }}
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Report Table -->
            <table class="w-[200px] table-auto border-collapse">
              <thead>
                <tr>
                  <th class="border px-4 py-1 text-left">Report</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border px-4 py-1 text-sm">
                    Date From: {{ formatDisplayDate(formData.Date1) }}
                  </td>
                </tr>
                <tr>
                  <td class="border px-4 py-1 text-sm">
                    Date To: {{ formatDisplayDate(formData.Date2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Table Area -->
        <div class="overflow-x-auto mt-8 report-table">
          <table class="w-full border-collapse table-print">
            <thead>
              <tr class="border-b border-gray-300">
                <th
                  class="px-2 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-700"
                >
                  Date
                </th>
                <th
                  class="px-2 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-700"
                >
                  JV Number
                </th>
                <th
                  class="px-2 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-700 min-w-[300px]"
                >
                  Details
                </th>
                <th
                  class="px-2 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-700"
                >
                  ID No
                </th>
                <th
                  class="px-2 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-700"
                >
                  Cheque No
                </th>
                <th
                  class="px-2 py-2 text-right text-sm font-semibold text-gray-700 border border-gray-700"
                >
                  Debit
                </th>
                <th
                  class="px-2 py-2 text-right text-sm font-semibold text-gray-700 border border-gray-700"
                >
                  Credit
                </th>
                <th
                  class="px-2 py-2 text-right text-sm font-semibold text-gray-700 border border-gray-700"
                >
                  Balance
                </th>
              </tr>
            </thead>

            <tbody>
              <!-- Opening Balance Row -->
              <!-- Opening Balance Row -->
              <tr class="hover:bg-gray-50">
                <td class="px-2 py-1 text-sm border border-gray-700">
                  {{ allData.at(0)?.Period }}
                </td>
                <td
                  class="px-2 py-1 text-sm border border-gray-700 text-center"
                  colspan="6"
                >
                  Opening Balance =====>
                </td>
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-for="(item, index) in allData"
                :key="index"
                class="hover:bg-gray-50"
              >
                <td class="px-2 py-1 text-sm border border-gray-700">
                  {{ formatTableDate(item.JVdate) }}
                </td>
                <td class="px-2 py-1 text-sm border border-gray-700">
                  {{ item.JvNo }}
                </td>
                <td class="px-2 py-1 text-sm border border-gray-700">
                  {{ item.Narration }}
                </td>
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
                <td class="px-2 py-1 text-sm border border-gray-700">
                  {{ item.ChequeNo }}
                </td>
                <td class="px-2 py-1 text-sm text-right border border-gray-700">
                  <!-- {{ formatCurrency(item.Debit) }} -->
                  {{
                    formatNumber(item?.Debit) == 0
                      ? "-"
                      : formatNumber(item?.Debit)
                  }}
                </td>
                <td class="px-2 py-1 text-sm text-right border border-gray-700">
                  <!-- {{ formatCurrency(item.Credit) }} -->
                  {{
                    formatNumber(item?.Credit) == 0
                      ? "-"
                      : formatNumber(item?.Credit)
                  }}
                </td>
                <td class="px-2 py-1 text-sm text-right border border-gray-700">
                  {{ formatCurrency(calculateRunningBalance(index)) }}
                </td>
              </tr>

              <!-- Sub Total Row -->
              <tr class="bg-gray-50 font-medium">
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
                <td class="px-2 py-1 text-sm text-right border border-gray-700">
                  Sub Total ====>
                </td>
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
                <td class="px-2 py-1 text-sm text-right border border-gray-700">
                  {{ formatCurrency(subTotal.debit) }}
                </td>
                <td class="px-2 py-1 text-sm text-right border border-gray-700">
                  {{ formatCurrency(subTotal.credit) }}
                </td>
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
              </tr>

              <!-- Total Row -->
              <tr class="bg-gray-100 font-semibold">
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
                <td class="px-2 py-1 text-sm text-right border border-gray-700">
                  Total ====>
                </td>
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
                <td class="px-2 py-1 text-sm border border-gray-700"></td>
                <td class="px-2 py-1 text-sm text-right border border-gray-700">
                  {{ formatCurrency(total.debit) }}
                </td>
                <td class="px-2 py-1 text-sm text-right border border-gray-700">
                  {{ formatCurrency(total.credit) }}
                </td>
                <td class="px-2 py-1 text-sm text-right border border-gray-700">
                  {{ formatCurrency(finalBalance) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data Message -->
      <div v-else-if="!loading" class="mt-8 text-center text-gray-500">
        No data available. Please select dates and account head, then click
        Preview.
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { onMounted, ref, computed, watch } from "vue";
import { getToken, showNotification } from "@/utilities/common";
import axios from "axios";
import { apiBase, formatNumber } from "@/config";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import printJS from "print-js";
import { Icon } from "@iconify/vue";
import { message } from "ant-design-vue";

const formData = ref({
  Date1: "",
  Date2: "",
  AMCode1: "",
  AMCode2: "",
});

const allData = ref([]);
const loading = ref(false);
const pdfLoading = ref(false);
const excelLoading = ref(false);
const openingBalanceData = ref([]);

// Current date and time for display
const currentDate = ref(dayjs().format("DD-MM-YYYY"));
const currentTime = ref(dayjs().format("HH:mm:ss"));

// Disable future dates
const disabledDate = (current) => {
  return current && current > dayjs().endOf("day");
};

// Format date for API (DD-MM-YYYY)
const formatDateForApi = (date) => {
  if (!date) return "";
  try {
    return dayjs(date).format("DD-MM-YYYY");
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

// Format date for display
const formatDisplayDate = (date) => {
  if (!date) return "";
  try {
    return dayjs(date).format("DD-MM-YYYY");
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

// Format date for table display
const formatTableDate = (dateString) => {
  if (!dateString) return "";
  try {
    return dayjs(dateString).format("DD-MM-YYYY");
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

// Format currency
const formatCurrency = (value) => {
  if (!value) return " ";
  return parseFloat(value)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

// Fetch ledger data
const fetchAllData = async () => {
  if (!formData.value.Date1 || !formData.value.Date2) {
    showNotification("error", "Please select both start and end dates.");
    return;
  }

  if (dayjs(formData.value.Date1).isAfter(dayjs(formData.value.Date2))) {
    showNotification("error", "Start date cannot be after end date.");
    return;
  }

  loading.value = true;
  allData.value = [];

  try {
    const requestData = {
      Date1: formatDateForApi(formData.value.Date1),
      Date2: formatDateForApi(formData.value.Date2),
      AMCode1: formData.value.AMCode1 || "",
      AMCode2: formData.value.AMCode2 || "",
    };

    console.log("Sending request data:", requestData);

    const res = await axios.post(
      `${apiBase}/journal-master/ledger`,
      requestData,
      getToken()
    );

    console.log("API Response:", res);
    loading.value = false;
    let responseData = res?.data?.records || [];
    const openingBalanceData = res?.data?.openingBalance;
    openingBalanceData.value = openingBalanceData[0];

    if (res.data && res.data.data) {
      responseData = res.data.data;
    }

    if (
      res.data &&
      typeof res.data === "object" &&
      res.data.success !== undefined
    ) {
      if (!res.data.success) {
        showNotification("error", res.data.message || "Failed to fetch data");
        return;
      }
      responseData = res.data.data || [];
    }

    if (Array.isArray(responseData)) {
      if (responseData.length > 0 && Array.isArray(responseData[0])) {
        allData.value = responseData.flat();
      } else {
        allData.value = responseData;
      }
    } else if (responseData && typeof responseData === "object") {
      allData.value = [responseData];
    } else {
      allData.value = [];
    }

    console.log("Processed data:", allData.value);

    if (allData.value.length === 0) {
      showNotification("info", "No data found for the selected criteria.");
    } else {
      showNotification(
        "success",
        `Loaded ${allData.value.length} records successfully.`
      );
    }
  } catch (err) {
    loading.value = false;
    allData.value = [];
    console.error("Failed to fetch ledger data:", err);
    showNotification("info", err?.response?.data?.message || err?.message);
  }
};

// Computed properties for calculations
const openingBalance = computed(() => {
  return {
    debit: 0,
    credit: 0,
    balance: 0,
  };
});

const subTotal = computed(() => {
  const debit = allData.value.reduce(
    (sum, item) => sum + (parseFloat(item.Debit) || 0),
    0
  );
  const credit = allData.value.reduce(
    (sum, item) => sum + (parseFloat(item.Credit) || 0),
    0
  );
  return { debit, credit };
});

const total = computed(() => {
  return {
    debit: subTotal.value.debit,
    credit: subTotal.value.credit,
  };
});

const finalBalance = computed(() => {
  const balance = subTotal.value.debit - subTotal.value.credit;
  return Math.abs(balance);
});

const calculateRunningBalance = (index) => {
  let balance = openingBalance.value.balance;
  for (let i = 0; i <= index; i++) {
    const item = allData.value[i];
    balance += (parseFloat(item.Debit) || 0) - (parseFloat(item.Credit) || 0);
  }
  return (balance = Math.abs(balance));
};

// Excel Export
const exportExcel = () => {
  if (!allData.value.length) return;
  excelLoading.value = true;
  try {
    const wsData = [
      [
        "Date",
        "JV Number",
        "Details",
        "ID No",
        "Cheque No",
        "Debit",
        "Credit",
        "Balance",
      ],
    ];

    wsData.push(["", "Opening Balance=====>", "", "", "", "", "", "-"]);

    allData.value.forEach((item, index) => {
      wsData.push([
        formatTableDate(item.JVdate),
        item.JvNo || "",
        item.AMDetails || "",
        item.AMCodeNew || item.AMCode || "",
        item.ChequeNo || "",
        Number(item.Debit || 0),
        Number(item.Credit || 0),
        calculateRunningBalance(index),
      ]);
    });

    wsData.push([
      "",
      "",
      "Sub Total ====>",
      "",
      "",
      subTotal.value.debit,
      subTotal.value.credit,
      "",
    ]);

    wsData.push([
      "",
      "",
      "Total ====>",
      "",
      "",
      total.value.debit,
      total.value.credit,
      finalBalance.value,
    ]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger Book");
    XLSX.writeFile(wb, `Ledger_Book_${dayjs().format("YYYY-MM-DD")}.xlsx`);
    showNotification("success", "Excel file exported successfully!");
  } catch (err) {
    console.error("Error exporting Excel:", err);
    showNotification("error", "Failed to export Excel file.");
  } finally {
    excelLoading.value = false;
  }
};

// PDF Export
const exportPDF = () => {
  pdfLoading.value = true;
  try {
    printJS({
      printable: "ledgerBookToPrint",
      type: "html",
      targetStyles: ["*"],
      style: `
        @page {
          size: A4 landscape;
          margin: 10mm;
        }
        
        @media print {
          body {
            font-family: Arial, sans-serif !important;
            font-size: 10px !important;
            line-height: 1.2 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          #ledgerBookToPrint {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          #ledgerBookToPrint .flex.justify-between {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            margin-bottom: 15px !important;
            width: 100% !important;
          }

          #ledgerBookToPrint .text-left.mb-6 {
            flex: 1 !important;
            margin-bottom: 0 !important;
          }
          
          #ledgerBookToPrint .text-left.mb-6 h1 {
            font-size: 14px !important;
            font-weight: bold !important;
            color: #000 !important;
            margin: 0 0 3px 0 !important;
          }
          
          #ledgerBookToPrint .text-left.mb-6 p {
            font-size: 12px !important;
            font-weight: bold !important;
            color: #000 !important;
            margin: 0 !important;
          }
          
          #ledgerBookToPrint .flex.gap-10 {
            display: flex !important;
            gap: 15px !important;
            flex-shrink: 0 !important;
          }
          
          #ledgerBookToPrint .flex.gap-10 table {
            border: 1px solid #000 !important;
            border-collapse: collapse !important;
            width: 140px !important;
            font-size: 9px !important;
          }
          
          #ledgerBookToPrint .flex.gap-10 th {
            border: 1px solid #000 !important;
            padding: 3px 4px !important;
            font-weight: bold !important;
            text-align: left !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          #ledgerBookToPrint .flex.gap-10 td {
            border: 1px solid #000 !important;
            padding: 2px 4px !important;
            font-size: 8px !important;
          }
          
          .table-print {
            width: 100% !important;
            border: 1px solid #000 !important;
            border-collapse: collapse !important;
            margin-top: 10px !important;
            font-size: 9px !important;
          }
          
          .table-print th {
            border: 1px solid #000 !important;
            padding: 4px 3px !important;
            font-size: 9px !important;
            font-weight: bold !important;
            text-align: left !important;
            -webkit-print-color-adjust: exact !important;
          }

          .table-print th.text-right {
            text-align: right !important;
          }
          
          .table-print td {
            border: 1px solid #000 !important;
            padding: 3px !important;
            font-size: 8px !important;
            vertical-align: top !important;
            word-wrap: break-word !important;
          }
          
          .table-print td.font-bold {
            font-weight: bold !important;
          }
          
          .bg-gray-50 {
            -webkit-print-color-adjust: exact !important;
          }

          .bg-gray-100 {
            -webkit-print-color-adjust: exact !important;
          }

          .bg-gray-100 td {
            font-weight: bold !important;
          }
          
          .text-right {
            text-align: right !important;
          }

          .text-center {
            text-align: center !important;
          }
          
          .overflow-x-auto {
            overflow: visible !important;
          }
          
          button,
          .flex.justify-end,
          .ant-spin,
          .ant-btn,
          .ant-select,
          .ant-picker,
          .pt-4 > .max-w-2xl,
          .relative.mb-6 {
            display: none !important;
          }
          
          .table-print {
            page-break-inside: auto !important;
          }
          
          .table-print tr {
            page-break-inside: avoid !important;
          }
          
          .table-print thead {
            display: table-header-group !important;
          }
        }
      `,
      css: null,
      scanStyles: false,
      onLoadingStart: () => {
        pdfLoading.value = true;
      },
      onLoadingEnd: () => {
        pdfLoading.value = false;
      },
      onPrintDialogClose: () => {
        pdfLoading.value = false;
      },
    });
  } catch (err) {
    console.error("Error exporting PDF:", err);
    showNotification("error", "Failed to export PDF.");
    pdfLoading.value = false;
  }
};

// Watcher to synchronize AMCode1 and AMCode2
watch(
  () => formData.value.AMCode1,
  (newAMCode) => {
    formData.value.AMCode2 = newAMCode;
  }
);

// Accounts head list
const accountHeadList = ref([]);
const all_accountHeadList = ref([]); // Add this for storing all account heads
const isLoading = ref(false);

const getAccountsHead = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      `${apiBase}/journal/account-head`,
      getToken()
    );
    if (response?.status == 200) {
      const mappedData = response?.data?.map((accountHead) => ({
        label: `${accountHead.AMDetails} (${accountHead.AMCode})`,
        value: accountHead.AMCode,
      }));
      accountHeadList.value = mappedData;
      // set auto index[0] value
      formData.value.AMCode1 = mappedData[0]?.value || "";
      all_accountHeadList.value = mappedData; // Store all account heads for filtering
      isLoading.value = false;
    }
  } catch (error) {
    showNotification(
      "error",
      error?.message || "An error occurred while fetching account heads."
    );
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getAccountsHead();
  const today = dayjs();

  formData.value.Date1 = today.startOf("month").format("YYYY-MM-DD");
  formData.value.Date2 = today.endOf("month").format("YYYY-MM-DD");

  console.log("Initialized dates:", {
    Date1: formData.value.Date1,
    Date2: formData.value.Date2,
  });
});

const handleDateFromChange = () => {
  if (!formData.value.Date2) return;

  const voucherFrom = new Date(formData.value.Date1);
  const voucherTo = new Date(formData.value.Date2);

  if (voucherFrom > voucherTo) {
    message.warning("The 'Date From' cannot be later than 'Date To'.");
    formData.value.Date1 = null;
  }
};

// Handle Date To change
const handleDateToChange = () => {
  if (!formData.value.Date1) return;
  const voucherFrom = new Date(formData.value.Date1);
  const voucherTo = new Date(formData.value.Date2);

  if (voucherTo < voucherFrom) {
    message.warning("The 'Date To' cannot be earlier than 'Date From'.");
    formData.value.Date2 = null;
  }
};
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}

.ant-picker-panel {
  z-index: 9999;
}

.overflow-x-auto::-webkit-scrollbar,
.overflow-y-auto::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.overflow-x-auto,
.overflow-y-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.filter-field :where(.css-dev-only-do-not-override-1p3hq3p).ant-form-item {
  margin-bottom: 0 !important;
}

.report-table th,
.report-table td {
  font-size: 12px;
}
</style>

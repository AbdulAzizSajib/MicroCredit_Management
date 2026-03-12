<template>
  <MainLayout>
    <div class="flex items-center">
      <h1 class="text-2xl font-bold text-primary">Trial Balance Sub</h1>

      <div class="grid filter-grid m-auto grid-cols-12 py-4 px-3 gap-2 mb-2">
        <div class="col-span-4">
          <div class="flex items-center">
            <label for="period" class="w-36 font-bold">Form Date:</label>
            <div class="w-full">
              <input
                type="date"
                v-model="FromDate"
                :max="ToDate"
                class="w-full border p-1 border-black rounded-md"
                :class="{ 'border-red-500': dateError }"
              />
            </div>
          </div>
        </div>
        <div class="col-span-4">
          <div class="flex items-center">
            <label for="period" class="w-36 font-bold">To Date:</label>
            <div class="w-full">
              <input
                type="date"
                v-model="ToDate"
                :min="FromDate"
                class="w-full border p-1 border-black rounded-md"
                :class="{ 'border-red-500': dateError }"
              />
              <p v-if="dateError" class="text-red-500 text-xs mt-1">
                To Date must be greater than or equal to From Date
              </p>
            </div>
          </div>
        </div>
        <div class="col-span-1">
          <div>
            <a-button
              type="primary"
              @click="fetchAllData"
              :loading="loading"
              :disabled="dateError"
              >Preview</a-button
            >
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center mt-4">
      <a-spin></a-spin>
    </div>

    <div v-if="allData.length === 0" class="text-center py-8">
      <a-empty description="No data found " />
    </div>

    <div class="" v-if="allData.length">
      <!-- report table -->
      <div
        id="trialBalanceToPrint"
        class="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto border"
      >
        <div class="flex justify-end gap-2 pb-4">
          <button @click="exportExcel" class="" :disabled="excelLoading">
            <a-spin v-if="excelLoading" size="small" class="spinner-white" />
            <span>
              <Icon icon="vscode-icons:file-type-excel" class="text-4xl" />
            </span>
            <!-- <span v-else>Exporting Excel</span> -->
          </button>
          <button @click="exportPDF" :disabled="pdfLoading">
            <a-spin v-if="pdfLoading" size="small" class="spinner-white" />
            <span v-if="!pdfLoading">
              <Icon icon="vscode-icons:file-type-pdf2" class="text-4xl" />
            </span>
            <!-- <span v-else>Exporting PDF</span> -->
          </button>
        </div>
        <!-- header area start -->
        <div class="flex justify-between mb-4 items-center space-x-10">
          <div class="text-left mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Particulars</h1>
          </div>
          <div>
            <table class="w-[310px] table-auto border-collapse">
              <thead>
                <tr>
                  <th class="border border-black px-4 py-1 text-center">
                    Petra Products <br />
                    <p class="text-base text-gray-700">
                      From {{ DateFrom }} to {{ DateTo }}
                    </p>
                  </th>
                  <!-- <th class="border px-4 py-1 text-center"></th> -->
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-black px-4 py-1 text-sm">
                    <!-- Date: {{ formattedToday }} -->
                    <h2 class="text-lg font-bold text-center">
                      Closing Balance
                    </h2>
                  </td>
                </tr>
                <!-- <tr>
                  <td class="border px-4 py-1 text-sm">
                    Time: {{ formattedTime }}
                  </td>
                </tr> -->
              </tbody>
            </table>
          </div>
        </div>
        <!-- table area -->
        <div class="overflow-x-auto mt-8">
          <table class="w-full border-collapse table-print">
            <!-- Table Header -->
            <thead>
              <tr class="border-b border-gray-300">
                <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center"
                >
                  SL
                </th>
                <!-- <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center"
                >
                  Account Code
                </th> -->
                <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center min-w-[300px]"
                >
                  Account Description
                </th>
                <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center"
                >
                  Debit
                </th>
                <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center"
                >
                  Credit
                </th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody>
              <!-- Data Rows -->
              <tr
                class="hover:bg-gray-50"
                v-for="(data, index) in allData"
                :key="index"
              >
                <td class="px-2 py-1.5 text-sm border border-gray-700 text-end">
                  {{ index + 1 }}
                </td>
                <!-- <td
                  class="px-2 py-1.5 text-sm border border-gray-700 text-start"
                >
                  {{ data?.AMCode }}
                </td> -->
                <td
                  class="px-2 py-1.5 text-sm border border-gray-700 text-start"
                >
                  {{ data?.GroupDetailsSub }}
                </td>
                <td class="px-2 py-1.5 text-sm border border-gray-700 text-end">
                  {{
                    formatNumber(data?.Debit) == 0
                      ? "-"
                      : formatNumber(data?.Debit)
                  }}
                </td>
                <td class="px-2 py-1.5 text-sm border border-gray-700 text-end">
                  {{
                    formatNumber(data?.Credit) == 0
                      ? "-"
                      : formatNumber(data?.Credit)
                  }}
                </td>
              </tr>
            </tbody>

            <!-- Table Footer with Totals -->
            <tfoot>
              <tr
                v-if="
                  SuspendingAccount?.Status === 'Debit' ||
                  SuspendingAccount?.Status === 'Credit'
                "
                class="font-bold"
              >
                <td
                  class="px-2 py-1.5 text-sm border border-gray-700 text-center font-normal"
                  colspan="3"
                >
                  <h2>Suspending A/C:</h2>
                </td>

                <td class="px-2 py-1.5 text-sm border border-gray-700 text-end">
                  {{
                    SuspendingAccount?.Status === "Debit" &&
                    SuspendingAccount?.Amount
                      ? formatNumber(SuspendingAccount.Amount)
                      : "-"
                  }}
                </td>
                <td class="px-2 py-1.5 text-sm border border-gray-700 text-end">
                  {{
                    SuspendingAccount?.Status === "Credit" &&
                    SuspendingAccount?.Amount
                      ? formatNumber(SuspendingAccount.Amount)
                      : "-"
                  }}
                </td>
              </tr>
              <tr class="bg-gray-100 font-bold">
                <td
                  colspan="2"
                  class="px-2 py-1.5 text-base border border-gray-700 text-end font-bold"
                >
                  Total:
                </td>
                <td
                  class="px-2 py-1.5 text-base border border-gray-700 text-end font-bold"
                >
                  {{
                    formatNumber(
                      Number(SuspendingAccount?.TotalDebit || 0).toFixed(2)
                    )
                  }}
                </td>
                <td
                  class="px-2 py-1.5 text-base border border-gray-700 text-end font-bold"
                >
                  <!-- {{
                    formatNumber(totalCredit) == 0
                      ? "-"
                      : formatNumber(totalCredit)
                  }} -->
                  {{
                    formatNumber(
                      Number(SuspendingAccount?.TotalCredit || 0).toFixed(2)
                    )
                  }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { onMounted, ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import axios from "axios";
import { apiBase, formatNumber } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import printJS from "print-js";

const selectedDate = ref(dayjs());

const formattedToday = computed(() => {
  return dayjs().format("DD-MMM-YYYY").toLowerCase();
});

const formattedTime = computed(() => {
  return dayjs().format("HH:mm:ss");
});

const formattedDate = computed(() => {
  return selectedDate.value.format("MMM, YYYY");
});

const handleDateChange = (date) => {
  selectedDate.value = date;
};

const allData = ref([]);
const loading = ref(false);
const pdfLoading = ref(false);
const excelLoading = ref(false);
const SuspendingAccount = ref();

// Fetch allData with search and pagination

const FromDate = ref(dayjs().startOf("month").format("YYYY-MM-DD"));
const ToDate = ref(dayjs().endOf("month").format("YYYY-MM-DD"));

// Computed properties for displaying formatted dates
const DateFrom = computed(() => {
  return FromDate.value ? dayjs(FromDate.value).format("DD-MMM-YYYY") : "";
});

const DateTo = computed(() => {
  return ToDate.value ? dayjs(ToDate.value).format("DD-MMM-YYYY") : "";
});

const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/journal-master/trial-balance_sub`,
      { FromDate: FromDate.value, ToDate: ToDate.value },
      getToken()
    );

    loading.value = false;
    allData.value = res?.data?.records;
    SuspendingAccount.value = res?.data?.SuspendingAccount;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    console.error("Failed to fetch allData:", err);
    showNotification("error", "Failed to fetch trial balance data.");
  }
};

// Excel Export
const exportExcel = () => {
  if (!allData.value.length) return;
  excelLoading.value = true;
  try {
    const wsData = [["SL", "Account Description", "Debit", "Credit"]];

    allData.value.forEach((data, index) => {
      wsData.push([
        index + 1,
        data?.GroupDetailsSub || "",
        data?.Debit || 0,
        data?.Credit || 0,
      ]);
    });

    // Add Suspending A/C row if exists
    if (
      SuspendingAccount.value?.Status === "Debit" ||
      SuspendingAccount.value?.Status === "Credit"
    ) {
      wsData.push([
        "",
        "Suspending A/C:",
        SuspendingAccount.value?.Status === "Debit"
          ? SuspendingAccount.value?.Amount
          : "-",
        SuspendingAccount.value?.Status === "Credit"
          ? SuspendingAccount.value?.Amount
          : "-",
      ]);
    }

    // Add totals row
    wsData.push([
      "",
      "Total:",
      Number(SuspendingAccount.value?.TotalDebit || 0).toFixed(2),
      Number(SuspendingAccount.value?.TotalCredit || 0).toFixed(2),
    ]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");
    XLSX.writeFile(
      wb,
      `Trial_Balance_${selectedDate.value.format("YYYY-MM-DD")}.xlsx`
    );
    showNotification("success", "Excel file exported successfully!");
  } catch (err) {
    console.error("Error exporting Excel:", err);
    showNotification("error", "Failed to export Excel file.");
  } finally {
    excelLoading.value = false;
  }
};

const exportPDF = () => {
  pdfLoading.value = true;
  printJS({
    printable: "trialBalanceToPrint",
    type: "html",
    targetStyles: ["*"],
    style: `
      @page {
        size: A4 portrait;
        margin: 15mm 10mm;
      }

      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }

        body {
          font-family: Arial, sans-serif !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        #trialBalanceToPrint {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 auto !important;
          padding: 10px !important;
          background: white !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* Header layout - maintain left-right layout like UI */
        #trialBalanceToPrint > .flex.justify-between {
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: center !important;
          margin-bottom: 15px !important;
          gap: 40px !important;
        }

        #trialBalanceToPrint .text-left.mb-6 {
          flex-shrink: 0 !important;
          text-align: left !important;
          margin-bottom: 0 !important;
        }

        #trialBalanceToPrint .text-left.mb-6 h1 {
          font-size: 18px !important;
          font-weight: bold !important;
          margin: 0 !important;
          color: #1f2937 !important;
        }

        #trialBalanceToPrint h1 {
          font-size: 16px !important;
          font-weight: bold !important;
          margin: 0 0 3px 0 !important;
        }

        #trialBalanceToPrint p {
          font-size: 11px !important;
          margin: 2px 0 !important;
        }

        /* Info table in header - stays on the right */
        #trialBalanceToPrint table:not(.table-print) {
          border-collapse: collapse !important;
          border: 1px solid #000 !important;
          width: 310px !important;
          flex-shrink: 0 !important;
        }

        #trialBalanceToPrint table:not(.table-print) th,
        #trialBalanceToPrint table:not(.table-print) td {
          border: 1px solid #000 !important;
          padding: 4px 10px !important;
          font-size: 11px !important;
          text-align: center !important;
        }

        #trialBalanceToPrint table:not(.table-print) th {
          font-weight: bold !important;
        }

        #trialBalanceToPrint table:not(.table-print) h2 {
          font-size: 14px !important;
          font-weight: bold !important;
          margin: 0 !important;
        }

        /* Table container */
        .overflow-x-auto {
          overflow: visible !important;
          margin-top: 15px !important;
        }

        /* Main table styling */
        table.table-print {
          width: 100% !important;
          border-collapse: collapse !important;
          border: 1px solid #000 !important;
          margin: 0 !important;
        }

        table.table-print * {
          border-collapse: collapse !important;
        }

        table.table-print thead {
          display: table-header-group !important;
        }

        table.table-print tbody {
          display: table-row-group !important;
        }

        table.table-print th {
          background-color: #f3f4f6 !important;
          font-weight: bold !important;
          font-size: 10px !important;
          padding: 6px 4px !important;
          border: 1px solid #000 !important;
          text-align: center !important;
          vertical-align: middle !important;
        }

        table.table-print td {
          font-size: 9px !important;
          padding: 4px 4px !important;
          border: 1px solid #000 !important;
          vertical-align: middle !important;
        }

        /* Footer styling - FIX: Prevent repeating on each page */
        table.table-print tfoot {
          display: table-row-group !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        table.table-print tfoot tr {
          background-color: #f3f4f6 !important;
          font-weight: bold !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-before: avoid !important;
        }

        table.table-print tfoot td {
          font-size: 10px !important;
          font-weight: bold !important;
          border: 1px solid #000 !important;
          padding: 6px 4px !important;
        }

        /* Specific alignment for footer cells */
        table.table-print tfoot td:nth-child(1) {
          text-align: right !important;
        }

        table.table-print tfoot td:nth-child(2) {
          text-align: right !important;
        }

        table.table-print tfoot td:nth-child(3) {
          text-align: right !important;
        }

        /* Force borders on all sides of each cell */
        table.table-print tr th:first-child,
        table.table-print tr td:first-child {
          border-left: 1px solid #000 !important;
        }

        table.table-print tr th:last-child,
        table.table-print tr td:last-child {
          border-right: 1px solid #000 !important;
        }

        table.table-print thead tr:first-child th {
          border-top: 1px solid #000 !important;
        }

        table.table-print tbody tr:last-child td,
        table.table-print tfoot tr:last-child td {
          border-bottom: 1px solid #000 !important;
        }

        /* Prevent row breaks */
        table.table-print tr {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* Column widths and alignment */
        table.table-print tbody td:nth-child(1) {
          width: 8% !important;
          text-align: right !important;
        }

        table.table-print tbody td:nth-child(2) {
          width: 52% !important;
          text-align: left !important;
        }

        table.table-print tbody td:nth-child(3),
        table.table-print tfoot td:nth-child(2) {
          width: 20% !important;
          text-align: right !important;
        }

        table.table-print tbody td:nth-child(4),
        table.table-print tfoot td:nth-child(3) {
          width: 20% !important;
          text-align: right !important;
        }

        /* Footer "Total:" label alignment */
        table.table-print tfoot td[colspan="2"] {
          width: 60% !important;
          text-align: right !important;
          padding-right: 8px !important;
        }

        /* Text alignment classes */
        .text-start {
          text-align: left !important;
        }

        .text-end {
          text-align: right !important;
        }

        .text-center {
          text-align: center !important;
        }

        /* Hide non-printable elements */
        button,
        .ant-button,
        .flex.justify-end.gap-2,
        .ant-spin,
        h1.text-primary.text-center,
        .w-1\\/4.p-8,
        .a-form-item {
          display: none !important;
        }

        /* Remove hover effects */
        tr:hover,
        .hover\\:bg-gray-50:hover {
          background-color: transparent !important;
        }
      }
    `,
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
};
</script>

<style scoped>
.ant-input-number-input {
  @apply !text-right !pr-10;
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
</style>

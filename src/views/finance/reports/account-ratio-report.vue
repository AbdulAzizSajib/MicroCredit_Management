<template>
  <MainLayout>
    <div class="flex items-center">
      <h1 class="text-2xl font-bold text-primary">Account Ratio Report</h1>
      <div class="p-8 flex items-end space-x-6">
        <div>
          <label for="startDate">From Date</label>

          <input
            type="date"
            :max="DateTo"
            v-model="DateFrom"
            class="w-full border p-1 border-black rounded-md"
          />
        </div>
        <div>
          <label for="endDate">To Date</label>
          <input
            type="date"
            :min="DateFrom"
            v-model="DateTo"
            class="w-full border p-1 border-black rounded-md"
          />
        </div>
        <a-button type="primary" class="" @click="fetchAllData"
          >Preview</a-button
        >
      </div>
    </div>

    <div v-if="loading" class="flex justify-center mt-4">
      <a-spin></a-spin>
    </div>

    <div class="" v-if="allData">
      <!-- report table -->
      <div
        id="trialBalanceToPrint"
        class="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto border"
      >
        <!--  -->
        <!-- <div class="flex justify-end gap-2 pb-4">
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
        </div> -->
        <!-- header area start -->
        <div class="flex justify-center mb-4 items-center space-x-10 relative">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold mb-2">P-ERP PRODUCTS</h1>
            <p class="text-sm text-gray-600 mb-1">
              House No.# 90, Main Road, Nolvog, Nishat Nagar, Turag, Dhaka-1230
            </p>
            <h2 class="text-lg font-semibold mb-1">
              Management Statement of Financial Position
            </h2>
            <p class="text-sm text-gray-600">
              {{ formatRange(DateFrom, DateTo) }}
            </p>

            <div class="absolute top-0 right-0 flex items-center gap-5">
              <button @click="exportPDF" :loading="pdfLoading">
                <Icon
                  icon="vscode-icons:file-type-pdf2"
                  width="30"
                  height="30"
                />
              </button>

              <!-- <button @click="exportExcel" :loading="excelLoading">
                <Icon
                  icon="vscode-icons:file-type-excel"
                  width="30"
                  height="30"
                />
              </button> -->
            </div>
          </div>
        </div>
        <!-- table area -->
        <div class="overflow-x-auto mt-8">
          <table class="w-full border-collapse border border-black">
            <tr>
              <td class="border border-black px-4 py-2">
                <b>1. Liquidity Ratios</b>
              </td>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2"></td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Current ratio</td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Current_Ratio || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Quick ratio</td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Quick_Ratio || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Working capital</td>
              <td class="border border-black px-4 py-2 text-right">
                <!-- = Net Sales / Working Capital -->
                {{ formatNumber(allData?.Working_Capital || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2">
                <b>2. Solvency Ratios</b>
              </td>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2"></td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">
                Debt to Assets Ratio
              </td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Debt_to_Asset_Ratio || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">
                Debt to Equity Ratio
              </td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Debt_to_Equity_Ratio || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Equity Ratio</td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Equity_Ratio || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">
                Total Equity (Including Profit)
              </td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Total_Equity || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2">
                <b>3. Profitability Ratios</b>
              </td>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2"></td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Net Profit</td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Net_Profit || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Gross Profit</td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Gross_Profit || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Profit Margin (%)</td>
              <td class="border border-black px-4 py-2 text-right">
                <!-- = (Total Revenue - Cost of Goods Sold) / Total Revenue -->
                {{ formatNumber(allData?.Profit_Margin_Percent || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Gross Margin (%)</td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Gross_Margin_Percent || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">
                Return on Assests (ROA)
              </td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Return_on_Assets || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">
                Return on Equity (ROE)
              </td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Return_on_Equity || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2">
                <b>4. Efficiency Ratios</b>
              </td>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2"></td>
            </tr>

            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Inventory Turnover</td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Inventory_Turnover || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">
                Day's Inventory Outstanding
              </td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Days_Inventory_Outstanding || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Receivable Turnover</td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Receivables_Turnover || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">
                Days Sales Outstanding
              </td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Days_Sales_Outstanding || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">Payables Turnover</td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Payables_Turnover || 0) }}
              </td>
            </tr>
            <tr>
              <td class="border border-black px-4 py-2"></td>
              <td class="border border-black px-4 py-2">
                Days Payable Outstanding
              </td>
              <td class="border border-black px-4 py-2 text-right">
                {{ formatNumber(allData?.Days_Payable_Outstanding || 0) }}
              </td>
            </tr>
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

const getOrdinal = (d) => {
  const j = d % 10,
    k = d % 100;
  if (k >= 11 && k <= 13) return "th";
  if (j === 1) return "st";
  if (j === 2) return "nd";
  if (j === 3) return "rd";
  return "th";
};

const formatDisplayDate = (date) => {
  if (!date) return "";
  const d = dayjs(date);
  if (!d.isValid()) return date;
  const dayNum = d.date();
  const ord = getOrdinal(dayNum);
  return `${dayNum}${ord} ${d.format("MMMM YYYY")}`;
};

const formatRange = (from, to) => {
  return `${formatDisplayDate(from)} to ${formatDisplayDate(to)}`;
};

const formattedToday = computed(() => {
  return dayjs().format("DD-MMM-YYYY").toLowerCase();
});

const formattedTime = computed(() => {
  return dayjs().format("HH:mm:ss");
});

const formattedDate = computed(() => {
  return selectedDate.value.format("MMM, YYYY");
});

const DateFrom = ref(dayjs().startOf("month").format("YYYY-MM-DD"));
const DateTo = ref(dayjs().endOf("month").format("YYYY-MM-DD"));

const allData = ref();
const loading = ref(false);
const pdfLoading = ref(false);
const excelLoading = ref(false);

// Fetch allData with search and pagination
const fetchAllData = async () => {
  if (!DateFrom.value) {
    showNotification("warning", "Please select From Date.");
    return;
  }

  if (!DateTo.value) {
    showNotification("warning", "Please select To Date.");
    return;
  }
  loading.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/journal-master/accounting_ratio`,
      {
        DateFrom: DateFrom.value,
        DateTo: DateTo.value,
      },
      getToken()
    );

    loading.value = false;
    allData.value = res?.data;
  } catch (err) {
    loading.value = false;
    console.error("Failed to fetch allData:", err);
    showNotification("error", "Failed to fetch trial balance data.");
  }
};

// Excel Export
const exportExcel = () => {
  if (!allData.value.length) return;
  excelLoading.value = true;
  try {
    const wsData = [
      ["SL", "Account Code", "Account Description", "Debit", "Credit"],
    ];

    allData.value.forEach((data, index) => {
      wsData.push([
        index + 1,
        data?.AMCode || "",
        data?.AMDetails || "",
        data?.Debit || "",
        data?.Credit || "",
      ]);
    });

    // Add totals row
    wsData.push(["", "", "Total:", totalDebit.value, totalCredit.value]);

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
          padding: 15px !important;
          background: white !important;
          box-shadow: none !important;
          border: 1px solid #000 !important;
        }

        /* Header layout - centered */
        #trialBalanceToPrint .flex.justify-center {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          margin-bottom: 20px !important;
          position: relative !important;
        }

        #trialBalanceToPrint .text-center {
          text-align: center !important;
          width: 100% !important;
        }

        #trialBalanceToPrint .text-center.mb-6 {
          margin-bottom: 0 !important;
        }

        #trialBalanceToPrint h1 {
          font-size: 20px !important;
          font-weight: bold !important;
          margin: 0 0 4px 0 !important;
          color: #000 !important;
        }

        #trialBalanceToPrint h2 {
          font-size: 14px !important;
          font-weight: 600 !important;
          margin: 8px 0 4px 0 !important;
          color: #000 !important;
        }

        #trialBalanceToPrint p {
          font-size: 11px !important;
          margin: 2px 0 !important;
          color: #333 !important;
        }

        #trialBalanceToPrint .text-gray-600 {
          color: #4b5563 !important;
        }

        /* Hide the absolute positioned buttons in print */
        #trialBalanceToPrint .absolute.top-0.right-0,
        #trialBalanceToPrint button {
          display: none !important;
        }

        /* Table container */
        #trialBalanceToPrint .overflow-x-auto {
          overflow: visible !important;
          margin-top: 20px !important;
        }

        /* Main ratio table styling */
        #trialBalanceToPrint table {
          width: 100% !important;
          border-collapse: collapse !important;
          border: 1px solid #000 !important;
          margin: 0 !important;
          table-layout: fixed !important;
        }

        #trialBalanceToPrint table tr {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        #trialBalanceToPrint table td {
          font-size: 11px !important;
          padding: 8px 12px !important;
          border: 1px solid #000 !important;
          vertical-align: middle !important;
          color: #000 !important;
        }

        /* Column widths for ratio table */
        #trialBalanceToPrint table td:nth-child(1) {
          width: 28% !important;
          text-align: left !important;
        }

        #trialBalanceToPrint table td:nth-child(2) {
          width: 42% !important;
          text-align: left !important;
        }

        #trialBalanceToPrint table td:nth-child(3) {
          width: 30% !important;
          text-align: right !important;
        }

        /* Bold text styling */
        #trialBalanceToPrint table td b {
          font-weight: bold !important;
          font-size: 12px !important;
        }

        /* Ensure text-right class works in print */
        #trialBalanceToPrint .text-right {
          text-align: right !important;
        }

        /* Force borders on all sides of each cell */
        #trialBalanceToPrint table tr td {
          border: 1px solid #000 !important;
        }

        /* Hide non-printable elements */
        .ant-button,
        .ant-spin,
        h1.text-primary,
        .p-8.flex.items-end,
        .flex.items-end.space-x-6,
        .flex.items-center.gap-5,
        label[for="startDate"],
        label[for="endDate"],
        input[type="date"] {
          display: none !important;
        }

        /* Ensure borders print correctly */
        .border,
        .border-black {
          border-color: #000 !important;
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

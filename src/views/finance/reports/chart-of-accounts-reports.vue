<template>
  <MainLayout>
    <!-- title -->
    <div>
      <!-- report table -->
      <div
        id="chartOfAccountsToPrint"
        class="p-8 m-auto max-w-6xl shadow-md rounded-lg"
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
        <!-- header area start -->
        <div class="flex justify-between mb-4 items-center space-x-10">
          <div class="text-left mb-6">
            <!-- title -->
            <h1 class="text-2xl font-bold text-gray-800">Chart of Accounts</h1>
            <p class="text-xl text-gray-700 font-semibold">
              P-ERP Food and Snacks
            </p>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center mt-4">
          <a-spin></a-spin>
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
                <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center"
                >
                  Group Code
                </th>
                <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center"
                >
                  Group Details
                </th>
                <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center"
                >
                  Type Code
                </th>
                <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center"
                >
                  Type Name
                </th>
                <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center"
                >
                  Accounts Code
                </th>
                <th
                  class="px-2 py-1.5 text-base font-semibold text-gray-700 border border-gray-700 text-center"
                >
                  Accounts Description
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
                <td
                  class="px-2 py-1.5 text-sm border border-gray-700 text-left"
                >
                  {{ index + 1 }}
                </td>
                <td
                  class="px-2 py-1.5 text-sm border border-gray-700 text-left"
                >
                  {{ data?.GroupCode }}
                </td>
                <td
                  class="px-2 py-1.5 text-sm border border-gray-700 text-left"
                >
                  {{ data?.groupDetails }}
                </td>

                <td
                  class="px-2 py-1.5 text-sm border border-gray-700 text-left"
                >
                  {{ data?.typeCode }}
                </td>
                <td
                  class="px-2 py-1.5 text-sm border border-gray-700 text-left"
                >
                  {{ data?.typeName }}
                </td>
                <td
                  class="px-2 py-1.5 text-sm border border-gray-700 text-left"
                >
                  {{ data?.accountCode }}
                </td>
                <td
                  class="px-2 py-1.5 text-sm font-medium border border-gray-700 text-left"
                >
                  {{ data?.accountDetails }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import printJS from "print-js";

import { Icon } from "@iconify/vue";

const allData = ref([]);
const loading = ref(false);
const pdfLoading = ref(false);
const excelLoading = ref(false);

// Fetch allData with search and pagination
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/journal-master/chart-of-accounts-report`,
      {},
      getToken()
    );

    loading.value = false;
    allData.value = res?.data;
    console.log("All data", allData.value);
  } catch (err) {
    loading.value = false;
    allData.value = [];
    console.error("Failed to fetch allData:", err);
    showNotification("error", "Failed to fetch chart of accounts data.");
  }
};

// Excel Export
const exportExcel = () => {
  if (!allData.value.length) return;
  excelLoading.value = true;
  try {
    const wsData = [
      [
        "SL",
        "Group Code",
        "Group Details",
        "Type Code",
        "Type Name",
        "Accounts Code",
        "Accounts Description",
      ],
    ];

    allData.value.forEach((data, index) => {
      wsData.push([
        index + 1,
        data?.accountCode || "",
        data?.accountDetails || "",
        data?.typeCode || "",
        data?.typeName || "",
        data?.GroupCode || "",
        data?.groupDetails || "",
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chart of Accounts");
    XLSX.writeFile(
      wb,
      `Chart_of_Accounts_${dayjs().format("YYYY-MM-DD")}.xlsx`
    );
  } catch (err) {
    console.error("Error exporting Excel:", err);
    showNotification("error", "Failed to export Excel file.");
  } finally {
    excelLoading.value = false;
  }
};

// PDF Export
const exportPDF = () => {
  printJS({
    printable: "chartOfAccountsToPrint",
    type: "html",
    targetStyles: ["*"],
    style: `
      @page {
        size: A4;
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

        /* Add right padding so the right-most border doesn't get clipped by page margin */
        #chartOfAccountsToPrint {
          width: 100% !important;
          margin: 0 !important;
          padding: 10px 8mm 10px 10px !important; /* right padding to avoid clipping */
          background: white !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }

        /* Main table - FIXED BORDERS AND WIDTH */
        .table-print {
          width: calc(100% - 8mm) !important; /* make table slightly narrower than container */
          table-layout: fixed !important;
          border: 1px solid #000 !important;
          border-collapse: collapse !important;
          border-spacing: 0 !important;
          box-sizing: border-box !important;
        }
        
        .table-print th, .table-print td {
          border: 1px solid #000 !important;
          padding: 4px 6px !important;
          font-size: 9px !important;
          font-weight: normal !important;
          text-align: left !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          box-sizing: border-box !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        .table-print th {
          font-weight: bold !important;
        }

  
         
        /* Column width hints (optional) */
        .table-print th:nth-child(1), .table-print td:nth-child(1) { width: 5% !important; }
        .table-print th:nth-child(2), .table-print td:nth-child(2) { width: 12% !important; }
        .table-print th:nth-child(3), .table-print td:nth-child(3) { width: 18% !important; }
        .table-print th:nth-child(4), .table-print td:nth-child(4) { width: 12% !important; }
        .table-print th:nth-child(5), .table-print td:nth-child(5) { width: 15% !important; }
        .table-print th:nth-child(6), .table-print td:nth-child(6) { width: 13% !important; }
        .table-print th:nth-child(7), .table-print td:nth-child(7) { width: 25% !important; }

        .text-left {
          text-align: left !important;
        }

        .text-center {
          text-align: center !important;
        }

        .overflow-x-auto {
          overflow: visible !important;
        }

        /* Hide screen-only elements */
        button,
        .flex.justify-end,
        .ant-spin {
          display: none !important;
        }

        /* Page break handling */
        .table-print {
          page-break-inside: auto !important;
        }

        .table-print tr {
          page-break-inside: avoid !important;
        }

        .table-print thead {
          display: table-header-group !important;
        }

        .hover\\:bg-gray-50:hover {
          background-color: transparent !important;
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
};

onMounted(async () => {
  await fetchAllData();
});
</script>

<style>
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

/* Ensure last-column border is visible on screen as well */
.table-print th:last-child,
.table-print td:last-child {
  border-right: 1px solid #000;
}
</style>

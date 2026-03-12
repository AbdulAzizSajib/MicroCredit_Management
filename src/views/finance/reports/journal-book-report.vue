<template>
  <MainLayout>
    <div class="grid grid-cols-12 gap-4 items-center mb-4">
      <div class="col-span-2">
        <div class="mb-2">
          <div class="flex gap-2 items-center relative">
            <p class="text-2xl voucher-page-title font-bold text-primary">
              Voucher Book
            </p>
          </div>
        </div>
      </div>
      <div class="col-span-8">
        <div
          class="grid filter-grid m-auto grid-cols-12 border border-gray-200 rounded-md shadow py-4 px-3 gap-2 mb-2"
        >
          <!-- Category Select with Search -->
          <div class="col-span-3">
            <div class="flex items-center">
              <label for="category" class="w-36 font-bold">Category:</label>
              <a-select
                v-model:value="category"
                class="w-full"
                placeholder="Select Category"
                show-search
                allowClear
                :filter-option="false"
                option-label-prop="label"
                @search="
                  (event) => {
                    voucherTypes = all_voucherTypes.filter(
                      (item) =>
                        item?.JVType?.toLowerCase().includes(
                          event.toLowerCase()
                        ) ||
                        item?.JVDetails?.toLowerCase().includes(
                          event.toLowerCase()
                        ) ||
                        item?.Location?.toLowerCase().includes(
                          event.toLowerCase()
                        ) ||
                        item?.AMCode?.toLowerCase().includes(
                          event.toLowerCase()
                        )
                    );
                  }
                "
              >
                <a-select-option
                  v-for="item in voucherTypes"
                  :key="item.JVType"
                  :value="item.JVType"
                  :label="item.JVType"
                  class="!whitespace-normal"
                >
                  {{ item.JVType }} - {{ item.JVDetails }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="col-span-3">
            <div class="flex items-center">
              <label for="period" class="w-36 font-bold">Form Date:</label>
              <a-date-picker
                v-model:value="fromDate"
                format="YYYY/MM/DD"
                class="w-full"
                @change="handleDateFromChange"
              />
            </div>
          </div>
          <div class="col-span-3">
            <div class="flex items-center">
              <label for="period" class="w-36 font-bold">To Date:</label>
              <a-date-picker
                v-model:value="toDate"
                format="YYYY/MM/DD"
                class="w-full"
                @change="handleDateToChange"
              />
            </div>
          </div>
          <div class="col-span-1">
            <div>
              <a-button type="primary" @click="fetchVouchers" :loading="loading"
                >Preview</a-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="voucherData.length === 0" class="text-center py-8">
      <a-empty description="No data found " />
    </div>

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-2"></div>
      <div class="col-span-8">
        <div class="mb-4 print-view m-auto" id="journalBookToPrint">
          <div v-if="loading" class="flex justify-center mt-4">
            <a-spin></a-spin>
          </div>
          <div
            class="p-6 border border-gray-200 rounded-md shadow"
            v-else-if="voucherData.length > 0"
          >
            <div class="flex justify-end gap-2 pb-4">
              <button @click="exportExcel" class="" :disabled="excelLoading">
                <a-spin
                  v-if="excelLoading"
                  size="small"
                  class="spinner-white"
                />
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
                <h1 class="text-2xl font-bold text-gray-800">
                  P-ERP Food and Snacks
                </h1>
                <p class="text-xl text-gray-700 font-bold">
                  Journal Book (Temporary)
                </p>
              </div>
              <div class="flex gap-10">
                <table class="w-[200px] table-auto border-collapse">
                  <thead>
                    <tr>
                      <th class="border px-4 py-1 text-left">Print</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border px-4 py-1 text-sm">
                        <span class="me-6">Date:</span>
                        {{ dayjs().format("DD-MMM-YYYY") }}
                      </td>
                    </tr>
                    <tr>
                      <td class="border px-4 py-1 text-sm">
                        <span class="me-6">Time:</span>
                        {{ dayjs().format("HH:mm:ss") }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="w-[200px] table-auto border-collapse">
                  <thead>
                    <tr>
                      <th class="border px-4 py-1 text-left">Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border px-4 py-1 text-sm">
                        <span class="me-6">Date From:</span>
                        {{ fromDate?.format("DD-MMM-YYYY") }}
                      </td>
                    </tr>
                    <tr>
                      <td class="border px-4 py-1 text-sm">
                        <span class="me-6">Date To::</span>
                        {{ toDate?.format("DD-MMM-YYYY") }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- header area end -->
            <div class="overflow-x-auto w-full report-table">
              <table
                class="min-w-full table-auto border-collapse border border-gray-800 table-print mt-8"
              >
                <thead>
                  <tr>
                    <th class="border border-gray-800 px-2 py-1 text-left">
                      Vou No
                    </th>
                    <th class="border border-gray-800 px-2 py-1 text-left">
                      Date
                    </th>
                    <th class="border border-gray-800 px-2 py-1 text-left">
                      M. Code
                    </th>
                    <th class="border border-gray-800 px-2 py-1 text-left">
                      M. Accounts Description
                    </th>
                    <th class="border border-gray-800 px-2 py-1 text-right">
                      Debit
                    </th>
                    <th class="border border-gray-800 px-2 py-1 text-right">
                      Credit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(data, index) in voucherData">
                    <template v-for="(item, i_index) in data">
                      <tr v-if="i_index == 0">
                        <td
                          class="border border-gray-800 px-2 py-1 font-bold"
                          colspan="7"
                        >
                          Period: {{ item?.Period }}
                        </td>
                      </tr>
                      <tr v-if="i_index == 0">
                        <td
                          class="border border-gray-800 px-2 py-1"
                          :rowspan="data?.length * 2"
                        >
                          {{ item?.JvNo }}
                        </td>
                        <td
                          class="border border-gray-800 px-2 py-1"
                          :rowspan="data?.length * 2"
                        >
                          {{
                            item?.JVdate
                              ? dayjs(item?.JVdate).format("DD-MMM-YYYY")
                              : "-"
                          }}
                        </td>
                        <td class="border border-gray-800 px-2 py-1">
                          {{ item?.AMCode }}
                        </td>
                        <td class="border border-gray-800 px-2 py-1">
                          {{ item?.AMDetails }}
                        </td>
                        <td
                          class="border border-gray-800 px-2 py-1 text-right"
                          rowspan="2"
                        >
                          {{
                            formatNumber(item?.Debit) == 0
                              ? "-"
                              : formatNumber(item?.Debit)
                          }}
                        </td>
                        <td
                          class="border border-gray-800 px-2 py-1 text-right"
                          rowspan="2"
                        >
                          {{
                            formatNumber(item?.Credit) == 0
                              ? "-"
                              : formatNumber(item?.Credit)
                          }}
                        </td>
                      </tr>
                      <tr v-if="i_index == 0">
                        <td
                          class="border border-gray-800 px-2 py-1"
                          colspan="2"
                        >
                          {{ item?.Narration }}
                        </td>
                      </tr>
                      <tr v-if="i_index > 0">
                        <td class="border border-gray-800 px-2 py-1">
                          {{ item?.AMCode }}
                        </td>
                        <td class="border border-gray-800 px-2 py-1">
                          {{ item?.AMDetails }}
                        </td>
                        <td
                          class="border border-gray-800 px-2 py-1 text-right"
                          rowspan="2"
                        >
                          {{
                            formatNumber(item?.Debit) == 0
                              ? "-"
                              : formatNumber(item?.Debit)
                          }}
                        </td>
                        <td
                          class="border border-gray-800 px-2 py-1 text-right"
                          rowspan="2"
                        >
                          {{
                            formatNumber(item?.Credit) == 0
                              ? "-"
                              : formatNumber(item?.Credit)
                          }}
                        </td>
                      </tr>
                      <tr v-if="i_index > 0">
                        <td
                          class="border border-gray-800 px-2 py-1"
                          colspan="2"
                        >
                          {{ item?.Narration }}
                        </td>
                      </tr>
                    </template>
                  </template>
                  <tr class="font-bold bg-gray-100">
                    <td
                      colspan="4"
                      class="border border-gray-800 px-2 py-1 text-right"
                    >
                      Journal Total ==>
                    </td>
                    <td class="border border-gray-800 px-2 py-1 text-right">
                      {{
                        totalDebit.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })
                      }}
                    </td>
                    <td class="border border-gray-800 px-2 py-1 text-right">
                      {{
                        totalCredit.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common.js";
import { apiBase, formatNumber } from "@/config.js";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import printJS from "print-js";
import { Icon } from "@iconify/vue";
import { message } from "ant-design-vue";

const SiteCode = "01";
const pdfLoading = ref(false);
const excelLoading = ref(false);

const category = ref("JVR");
const fromDate = ref(dayjs().startOf("month"));
const toDate = ref(dayjs().endOf("month"));

const loading = ref(false);
const voucherData = ref([]);
const voucherTypes = ref([]);
const all_voucherTypes = ref([]); // Add this line - stores all voucher types for filtering

const handleDateFromChange = () => {
  if (!toDate.value) return;

  const voucherFrom = new Date(fromDate.value);
  const voucherTo = new Date(toDate.value);

  if (voucherFrom > voucherTo) {
    message.warning("The 'Date From' cannot be later than 'Date To'.");
    fromDate.value = null;
  }
};

// Handle Date To change
const handleDateToChange = () => {
  if (!fromDate.value) return;
  const voucherFrom = new Date(fromDate.value);
  const voucherTo = new Date(toDate.value);

  if (voucherTo < voucherFrom) {
    message.warning("The 'Date To' cannot be earlier than 'Date From'.");
    toDate.value = null;
  }
};

const totalDebit = computed(() =>
  voucherData.value.flat().reduce((sum, v) => sum + Number(v.Debit || 0), 0)
);

const totalCredit = computed(() =>
  voucherData.value.flat().reduce((sum, v) => sum + Number(v.Credit || 0), 0)
);

const fetchVoucherTypes = async () => {
  const { data } = await axios.get(`${apiBase}/voucher/type`, getToken());
  voucherTypes.value = data;
  all_voucherTypes.value = data; // Store all voucher types for filtering
};

const fetchVouchers = async () => {
  if (fromDate.value && !toDate.value) {
    message.warning("Please Select To Date");
    return 0;
  }
  if (!fromDate.value && toDate.value) {
    message.warning("Please Select From Date");
    return 0;
  }
  try {
    loading.value = true;
    const formData = new FormData();
    formData.append("SiteCode", SiteCode);
    formData.append("Category", category.value);
    formData.append("FromDate", fromDate.value.format("YYYY-MM-DD"));
    formData.append("ToDate", toDate.value.format("YYYY-MM-DD"));

    const res = await axios.post(
      `${apiBase}/journal-master/journal_book`,
      formData,
      getToken()
    );
    voucherData.value = res.data;
    loading.value = false;
  } catch (err) {
    showNotification("warning", err?.response?.data?.message || err?.message);
    loading.value = false;
  }
};

onMounted(() => {
  fetchVoucherTypes();
});

const exportExcel = () => {
  if (!voucherData.value.length) return;
  excelLoading.value = true;
  try {
    const wsData = [
      [
        "Period",
        "Vou No",
        "Date",
        "M. Code",
        "M. Accounts Description",
        "Debit",
        "Credit",
        "Narration",
      ],
    ];
    voucherData.value.forEach((voucherGroup) => {
      voucherGroup.forEach((item) => {
        wsData.push([
          item.Period || "",
          item.JvNo || "",
          item.JVdate ? dayjs(item.JVdate).format("DD-MMM-YYYY") : "",
          item.AMCode || "",
          item.AMDetails || "",
          Number(item.Debit || 0),
          Number(item.Credit || 0),
          item.Narration || "",
        ]);
      });
    });
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Journal Book");
    XLSX.writeFile(wb, `Journal_Book_${dayjs().format("YYYY-MM-DD")}.xlsx`);
  } catch (err) {
    console.error("Error exporting Excel:", err);
  } finally {
    excelLoading.value = false;
  }
};

const exportPDF = () => {
  printJS({
    printable: "journalBookToPrint",
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
        
        #journalBookToPrint {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }
        
        #journalBookToPrint .flex.justify-between {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 15px !important;
          width: 100% !important;
        }
       #journalBookToPrint .table-print th,
        .min-w-full th {
          border: 1px solid #000 !important;
          padding: 4px 3px !important;
          font-size: 9px !important;
          font-weight: bold !important;
          text-align: left !important;
          -webkit-print-color-adjust: exact !important;
        }
        #journalBookToPrint .table-print th,
        .min-w-full th.text-right{
        text-align: right !important;
        }

        #journalBookToPrint .text-left.mb-6 {
          flex: 1 !important;
          margin-bottom: 0 !important;
        }
        
        #journalBookToPrint .text-left.mb-6 h1 {
          font-size: 14px !important;
          font-weight: bold !important;
          color: #000 !important;
          margin: 0 0 3px 0 !important;
        }
        
        #journalBookToPrint .text-left.mb-6 p {
          font-size: 12px !important;
          font-weight: bold !important;
          color: #000 !important;
          margin: 0 !important;
        }
        
        #journalBookToPrint .flex.gap-10 {
          display: flex !important;
          gap: 15px !important;
          flex-shrink: 0 !important;
        }
        
        #journalBookToPrint .flex.gap-10 table {
          border: 1px solid #000 !important;
          border-collapse: collapse !important;
          width: 140px !important;
          font-size: 9px !important;
        }
        
        #journalBookToPrint .flex.gap-10 th {
          border: 1px solid #000 !important;
          padding: 3px 4px !important;
          font-weight: bold !important;
          text-align: left !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        #journalBookToPrint .flex.gap-10 td {
          border: 1px solid #000 !important;
          padding: 2px 4px !important;
          font-size: 8px !important;
        }
        
        .table-print,
        .min-w-full {
          width: 100% !important;
          border: 1px solid #000 !important;
          border-collapse: collapse !important;
          margin-top: 10px !important;
          font-size: 9px !important;
        }
        
        .table-print th,
        .min-w-full th {
          border: 1px solid #000 !important;
          padding: 4px 3px !important;
          font-size: 9px !important;
          font-weight: bold !important;
          text-align: center !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        .table-print td,
        .min-w-full td {
          border: 1px solid #000 !important;
          padding: 3px !important;
          font-size: 8px !important;
          vertical-align: top !important;
          word-wrap: break-word !important;
        }
        
        .table-print td.font-bold,
        .min-w-full td.font-bold {
          font-weight: bold !important;
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
        
        .overflow-x-auto {
          overflow: visible !important;
        }
        
        button,
        .flex.justify-end,
        .ant-spin,
        .ant-btn,
        .ant-select,
        .ant-picker,
        .p-4,
        .grid {
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
};
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

@media (min-width: 992px) and (max-width: 1400px) {
  .filter-grid.max-w-6xl {
    max-width: 62rem !important;
  }

  .print-view.max-w-6xl {
    max-width: 62rem !important;
  }

  .voucher-page-title {
    font-size: 14px !important;
  }
}
.report-table th,
.report-table td {
  font-size: 12px;
}
</style>

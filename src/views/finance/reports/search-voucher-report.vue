<template>
  <MainLayout>
    <!-- title -->
    <h1 class="text-lg font-bold text-primary mb-3">Search Voucher</h1>
    <!-- Filters -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <!-- Date From Field -->
      <div class="flex items-center">
        <label for="dateFrom" class="mb-1 font-semibold w-48">Date From:</label>
        <a-date-picker
          v-model:value="formData.VoucherFrom"
          class="w-full"
          placeholder="Select Date From"
          :format="dateFormat"
          @change="handleDateFromChange"
        />
      </div>
      <!-- Date To Field -->
      <div class="flex items-center">
        <label for="dateTo" class="mb-1 font-semibold w-52">Date To:</label>
        <a-date-picker
          v-model:value="formData.VoucherTo"
          class="w-full"
          placeholder="Select Date To"
          :format="dateFormat"
          @change="handleDateToChange"
        />
      </div>

      <!-- Voucher Type with Search -->
      <div class="flex items-center">
        <label for="voucherType" class="mb-1 font-semibold w-52"
          >Voucher Type:</label
        >
        <a-select
          ref="voucher_type_ref"
          v-model:value="formData.Type"
          class="w-full"
          placeholder="Select Voucher Type"
          show-search
          allowClear
          :filter-option="false"
          option-label-prop="label"
          :dropdown-style="{ minWidth: '700px', maxWidth: '900px' }"
          @search="
            (event) => {
              voucherTypes = all_voucherTypes.filter(
                (item) =>
                  item?.JVType?.toLowerCase().includes(event.toLowerCase()) ||
                  item?.JVDetails?.toLowerCase().includes(
                    event.toLowerCase()
                  ) ||
                  item?.Location?.toLowerCase().includes(event.toLowerCase()) ||
                  item?.AMCode?.toLowerCase().includes(event.toLowerCase())
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
            {{ item.JVType }} - {{ item.JVDetails }} - {{ item.Location }} -
            {{ item.AMCode }}
          </a-select-option>
        </a-select>
      </div>

      <!-- Voucher No -->
      <div class="flex items-center">
        <label for="voucherNo" class="mb-1 font-semibold w-72"
          >Cheqe/Voucher No:</label
        >
        <a-input
          v-model:value="formData.ChequeNo"
          placeholder="Enter Voucher No"
          class="w-full"
        />
      </div>

      <!-- Cheque No -->
      <div class="flex items-center">
        <label for="chequeNo" class="mb-1 font-semibold w-48"
          >Master Code:</label
        >
        <a-input
          v-model:value="formData.Code"
          placeholder="Enter Master Code"
          class="w-full"
        />
      </div>

      <!-- Cheque Name -->
      <div class="flex items-center">
        <label for="chequeName" class="mb-1 font-semibold w-52"
          >Cheque Name:</label
        >
        <a-input
          v-model:value="formData.ChequeName"
          placeholder="Enter Cheque Name"
          class="w-full"
        />
      </div>

      <!-- P.O. No -->
      <div class="flex items-center">
        <label for="poNo" class="mb-1 font-semibold w-52">Narration:</label>
        <a-input
          v-model:value="formData.Narration"
          placeholder="Enter Narration"
          class="w-full"
        />
      </div>

      <div class="flex gap-2">
        <a-button
          class="px-8"
          type="primary"
          @click="fetchAllData"
          :loading="loading"
          >Show</a-button
        >
      </div>
    </div>

    <div v-if="allData.length === 0" class="text-center py-8">
      <a-empty description="No data found " />
    </div>

    <div v-if="allData.length" ref="printSection">
      <div class="mt-8" id="voucherSearchToPrint">
        <!-- Export Buttons -->
        <div class="flex justify-between items-center my-3">
          <div>
            <h1 class="text-lg font-bold text-gray-800">
              Voucher Search Report
            </h1>
            <p class="text-base text-gray-700 font-semibold">
              P-ERP Food and Snacks
            </p>
            <p class="text-[10px] text-gray-700 font-semibold">
              Statement of Voucher Search Report from
              {{
                formData.VoucherFrom
                  ? moment(formData.VoucherFrom)?.format("LL")
                  : "-"
              }}
              to
              {{
                formData.VoucherTo
                  ? moment(formData.VoucherTo)?.format("LL")
                  : "-"
              }}
            </p>
          </div>
          <div class="hide-print">
            <div class="flex gap-2">
              <button @click="exportExcel" :disabled="excelLoading">
                <Icon icon="vscode-icons:file-type-excel" class="text-4xl" />
              </button>
              <button @click="exportPDF" :disabled="pdfLoading">
                <Icon icon="vscode-icons:file-type-pdf2" class="text-4xl" />
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto report-table">
          <table class="min-w-full table-auto table-print border-print">
            <thead>
              <tr class="bg-primary text-white whitespace-nowrap">
                <th class="px-2 py-1 border border-print text-left">JV No</th>
                <th class="px-2 py-1 border border-print text-left">JV Date</th>
                <th class="px-2 py-1 border border-print text-left">Period</th>
                <th class="px-2 py-1 border border-print text-left">
                  Account Code
                </th>
                <th class="px-2 py-1 border border-print text-right">
                  Cheque/Voucher No
                </th>
                <th class="px-2 py-1 border border-print text-left">
                  Cheque Name
                </th>
                <th class="px-2 py-1 border border-print text-left">
                  Narration
                </th>
                <th class="px-2 py-1 border border-print text-right">Debit</th>
                <th
                  class="px-2 py-1 border border-print text-right border-right-force"
                >
                  Credit
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) in allData" :key="index">
                <td
                  class="px-2 py-1 border border-print text-left whitespace-nowrap w-4"
                >
                  {{ data?.JVNo }}
                </td>
                <td
                  class="px-2 py-1 border border-print text-left whitespace-nowrap w-4"
                >
                  {{ formatDisplayDate(data?.JVDate) }}
                </td>
                <td
                  class="px-2 py-1 border border-print text-left whitespace-nowrap w-4"
                >
                  {{ data?.Period }}
                </td>
                <td
                  class="px-2 py-1 border border-print text-left whitespace-nowrap w-4"
                >
                  {{ data?.AMCode }}
                </td>
                <td class="px-2 py-1 border border-print text-right">
                  {{ data?.ChequeNo }}
                </td>
                <td class="px-2 py-1 border border-print">
                  {{ data?.ChequeName }}
                </td>
                <td class="px-2 py-1 border border-print whitespace-nowrap w-4">
                  {{ data?.Narration }}
                </td>
                <td
                  class="px-2 py-1 border border-print text-right whitespace-nowrap w-4"
                >
                  {{
                    formatNumber(data?.debit) == 0
                      ? "-"
                      : formatNumber(data?.debit)
                  }}
                </td>
                <td
                  class="px-2 py-1 border border-print text-right border-right-force whitespace-nowrap w-4"
                >
                  {{
                    formatNumber(data?.Credit) == 0
                      ? "-"
                      : formatNumber(data?.Credit)
                  }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="text-gray-600 font-normal">
                <th
                  colspan="7"
                  class="px-2 py-1 border border-print text-right font-normal"
                >
                  <span class="">Total</span>
                </th>
                <th
                  class="px-2 py-1 border border-print text-right font-normal"
                >
                  <span class="">{{ formatNumber(total_debit || 0) }}</span>
                </th>
                <th
                  class="px-2 py-1 border border-print text-right font-normal"
                >
                  <span class="">{{ formatNumber(total_credit || 0) }}</span>
                </th>
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
import { ref, onMounted } from "vue";
import axios from "axios";
import { apiBase, formatNumber } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { Icon } from "@iconify/vue";
import moment from "moment";
import printJS from "print-js";
import { message } from "ant-design-vue";

// Date format for display (matches Trial Balance format)
// const dateFormat = "DD-MMM-YYYY";

const formData = ref({
  Type: "",
  VoucherFrom: "",
  VoucherTo: "",
  Code: "",
  ChequeNo: "",
  JVNo: "",
  ChequeName: "",
  Narration: "",
});

const allData = ref([]);
const total_debit = ref();
const total_credit = ref();
const loading = ref(false);
const excelLoading = ref(false);
const pdfLoading = ref(false);

const handleDateFromChange = () => {
  if (!formData.value.VoucherTo) return;

  const voucherFrom = new Date(formData.value.VoucherFrom);
  const voucherTo = new Date(formData.value.VoucherTo);

  if (voucherFrom > voucherTo) {
    message.warning("The 'Date From' cannot be later than 'Date To'.");
    formData.value.VoucherFrom = null;
  }
};

// Handle Date To change
const handleDateToChange = () => {
  if (!formData.value.VoucherFrom) return;
  const voucherFrom = new Date(formData.value.VoucherFrom);
  const voucherTo = new Date(formData.value.VoucherTo);

  if (voucherTo < voucherFrom) {
    message.warning("The 'Date To' cannot be earlier than 'Date From'.");
    formData.value.VoucherTo = null;
  }
};
// Format date for display in 0
//   table (DD-MMM-YYYY lowercase)
const formatDisplayDate = (date) => {
  if (!date) return "";
  return dayjs(date).format("DD-MMM-YYYY").toLowerCase();
};

// Fetch allData with search and pagination
const fetchAllData = async () => {
  if (formData.value.VoucherFrom && !formData.value.VoucherTo) {
    message.warning("Please Select To Date");
    return 0;
  }
  if (!formData.value.VoucherFrom && formData.value.VoucherTo) {
    message.warning("Please Select From Date");
    return 0;
  }
  loading.value = true;
  try {
    const requestData = {
      ...formData.value,
      VoucherFrom: formData.value.VoucherFrom
        ? dayjs(formData.value.VoucherFrom).format("YYYY-MM-DD")
        : "",
      VoucherTo: formData.value.VoucherTo
        ? dayjs(formData.value.VoucherTo).format("YYYY-MM-DD")
        : "",
    };

    const res = await axios.post(
      `${apiBase}/journal-master/voucher-search`,
      requestData,
      getToken()
    );

    loading.value = false;

    allData.value = res?.data || [];

    total_credit.value = allData.value?.reduce((sum, item) => {
      const credit = parseFloat(item?.Credit) || 0;
      return sum + credit;
    }, 0);
    total_debit.value = allData.value?.reduce((sum, item) => {
      const debit = parseFloat(item?.debit) || 0;
      return sum + debit;
    }, 0);
  } catch (err) {
    loading.value = false;
    allData.value = [];
    console.error("Failed to fetch allData:", err);
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

// Excel Export
const exportExcel = () => {
  if (!allData.value.length) {
    showNotification("No data to export", "warning");
    return;
  }
  excelLoading.value = true;
  try {
    const ws = XLSX.utils.json_to_sheet(allData.value);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Voucher Search");
    XLSX.writeFile(wb, `Voucher_Search_${dayjs().format("YYYY-MM-DD")}.xlsx`);
    showNotification("Excel file exported successfully", "success");
  } catch (err) {
    console.error("Error exporting Excel:", err);
    showNotification("Failed to export Excel file", "error");
  } finally {
    excelLoading.value = false;
  }
};

// PDF Export using printJS
const exportPDF = () => {
  pdfLoading.value = true;
  try {
    printJS({
      printable: "voucherSearchToPrint",
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
          
          #voucherSearchToPrint {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          #voucherSearchToPrint .flex.justify-between {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            margin-bottom: 15px !important;
            width: 100% !important;
          }

          #voucherSearchToPrint h1 {
            font-size: 14px !important;
            font-weight: bold !important;
            color: #000 !important;
            margin: 0 0 3px 0 !important;
          }
          
          #voucherSearchToPrint p {
            font-size: 10px !important;
            color: #000 !important;
            margin: 0 0 2px 0 !important;
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
            background-color: #1e3a8a !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
            color: #000 !important;
          }
          
          .table-print td.text-right {
            text-align: right !important;
          }

          .table-print td.text-left {
            text-align: left !important;
          }
          
          .table-print tfoot th {
            font-weight: bold !important;
            background-color: #f3f4f6 !important;
            color: #000 !important;
          }

          .border-right-force {
            border-right: 1px solid #000 !important;
          }
          
          .text-right {
            text-align: right !important;
          }

          .text-center {
            text-align: center !important;
          }

          .text-left {
            text-align: left !important;
          }
          
          .overflow-x-auto {
            overflow: visible !important;
          }
          
          button,
          .hide-print,
          .ant-spin,
          .ant-btn,
          .ant-select,
          .ant-picker,
          .ant-input {
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

          .table-print tfoot {
            display: table-footer-group !important;
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
    showNotification("Failed to export PDF.", "error");
    pdfLoading.value = false;
  }
};

const voucherTypes = ref([]);
const all_voucherTypes = ref([]); // Add this for storing all voucher types

const fetchVoucherTypes = async () => {
  try {
    const { data } = await axios.get(`${apiBase}/voucher/type`, getToken());
    voucherTypes.value = data;
    // auto selete fist item
    if (data.length > 0) {
      formData.value.Type = data[0].JVType;
    }
    all_voucherTypes.value = data;
  } catch (err) {
    console.error("Error fetching voucher types:", err);
  }
};
const today = moment(new Date()).format("YYYY-MM-DD");
const dateFormat = "YYYY/MM/DD";

onMounted(() => {
  fetchVoucherTypes();
  formData.value.VoucherFrom = dayjs(today, dateFormat).startOf("month");
  formData.value.VoucherTo = dayjs(today, dateFormat);
});
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

/* Non-print fallback to ensure UI shows the last column border too */
.table-print th:last-child,
.table-print td:last-child {
  border-right: 1px solid #000;
}

.report-table th,
.report-table td {
  font-size: 14px;
}

/* Ensure buttons are not disabled visually */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

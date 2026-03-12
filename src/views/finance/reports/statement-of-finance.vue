<template>
  <MainLayout>
    <div class="grid grid-cols-12 gap-4 items-center mb-4">
      <div class="col-span-2">
        <div class="mb-2">
          <div class="flex gap-2 items-center relative">
            <p class="text-2xl voucher-page-title font-bold text-primary">
              Statement of Financial Position
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
                format="DD/MM/YYYY"
                class="w-full"
              />
            </div>
          </div>
          <div class="col-span-3">
            <div class="flex items-center">
              <label for="period" class="w-36 font-bold">To Date:</label>
              <a-date-picker
                v-model:value="toDate"
                format="DD/MM/YYYY"
                class="w-full"
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

    <div class="w-full max-w-6xl mx-auto p-8">
      <!-- Header Section -->
      <div class="flex justify-between mb-8">
        <div>
          <h1 class="text-xl font-bold border-2 border-red-600 p-5">
            Need Report Format
          </h1>
          <!-- <p class="text-sm">Chartered Accountants</p> -->
        </div>
        <div class="text-right text-sm border-2 border-red-600 p-5">
          <p>Report Format</p>
          <!-- <p>23/16, Khilji Road, Block-B</p>
          <p>Shaymoli, Mohammadpur, Dhaka-1207</p>
          <p>Tel : 88-02-48117178, 01711-536193</p>
          <p>E-mail : macaudit.2002@gmail.com</p> -->
        </div>
      </div>

      <!-- Organization Name -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold">P-ERP Food and Snacks</h2>
        <p class="text-sm underline">
          145, Siddique Bazar (1st Floor), Dhaka-1000.
        </p>
      </div>

      <!-- Statement Title -->
      <div class="text-center mb-6">
        <h3 class="text-lg font-semibold inline-block px-4 py-1">
          Statement of Financial Position as on 30th June, 2024.
        </h3>
      </div>

      <!-- Financial Table -->
      <table class="w-full border-collapse">
        <!-- Table Header -->
        <thead>
          <tr class="border-2 border-black">
            <th
              class="border-r-2 border-black px-4 py-2 text-left w-16"
              rowspan="2"
            >
              Sl. #
            </th>
            <th class="border-r-2 border-black px-4 py-2 text-left" rowspan="2">
              Particulars
            </th>
            <th
              class="border-r-2 border-black px-4 py-2 text-center w-32"
              rowspan="2"
            >
              Notes/Sch.
            </th>
            <th
              class="border-b-2 border-black px-4 py-2 text-center"
              colspan="2"
            >
              Amount (Tk.)
            </th>
          </tr>
          <tr class="border-2 border-black">
            <th class="px-4 py-2 text-right w-32 border-e-2 border-black">
              30.06.2024
            </th>
            <th class="px-4 py-2 text-right w-32">30.06.2023</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <!-- Property & Assets Header -->
          <tr>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 font-bold underline" colspan="4">
              Property & Assets :
            </td>
          </tr>

          <!-- A. Non-Current Assets -->
          <tr>
            <td class="px-4 py-2 font-bold">A.</td>
            <td class="px-4 py-2 font-bold underline">Non-Current Assets :</td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2"></td>
          </tr>
          <tr>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 pl-8">Fixed Assets</td>
            <td class="px-4 py-2 text-center">Sch.-A</td>
            <td class="px-4 py-2 text-right">4,661,494</td>
            <td class="px-4 py-2 text-right">5,127,559</td>
          </tr>

          <!-- B. Current Assets -->
          <tr>
            <td class="px-4 py-2 font-bold">B.</td>
            <td class="px-4 py-2 font-bold underline">Current Assets :</td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2"></td>
          </tr>
          <tr v-for="(asset, index) in currentAssets" :key="index">
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 pl-8">{{ asset.name }}</td>
            <td class="px-4 py-2 text-center">{{ asset.note }}</td>
            <td class="px-4 py-2 text-right">{{ asset.amount2024 }}</td>
            <td class="px-4 py-2 text-right">{{ asset.amount2023 }}</td>
          </tr>
          <tr class="">
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 text-right font-semibold">41,905,397</td>
            <td class="px-4 py-2 text-right font-semibold">41,801,637</td>
          </tr>

          <!-- C. Total Property & Assets -->
          <tr class="">
            <td class="px-4 py-2 font-bold">C.</td>
            <td class="px-4 py-2 font-bold">Total Property & Assets : (A+B)</td>
            <td class="px-4 py-2"></td>
            <td
              class="px-4 py-2 text-right font-bold border-t-2 border-b-4 border-double border-black"
            >
              46,566,891
            </td>
            <td
              class="px-4 py-2 text-right font-bold border-t-2 border-b-4 border-double border-black"
            >
              46,929,196
            </td>
          </tr>

          <!-- Spacer -->
          <tr>
            <td colspan="5" class="py-4"></td>
          </tr>

          <!-- Fund & Liabilities Header -->
          <tr>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 font-bold underline" colspan="4">
              Fund & Liabilities :
            </td>
          </tr>

          <!-- D. Fund Account -->
          <tr>
            <td class="px-4 py-2 font-bold">D.</td>
            <td class="px-4 py-2 font-bold underline">Fund Account :</td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 text-right">30,175,701</td>
          </tr>
          <tr>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 pl-8">Opening Fund</td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 text-right">46,929,196</td>
            <td class="px-4 py-2 text-right">16,753,495</td>
          </tr>
          <tr class="">
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 pl-8">
              Add : Excess of Income over Expenditure
            </td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 text-right">(362,304)</td>
            <td class="px-4 py-2 text-right">46,929,196</td>
          </tr>
          <tr>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 text-right font-semibold">46,566,892</td>
            <td class="px-4 py-2"></td>
          </tr>

          <!-- Spacer -->
          <tr>
            <td colspan="5" class="py-2"></td>
          </tr>

          <!-- E. Current Liabilities -->
          <tr>
            <td class="px-4 py-2 font-bold">E.</td>
            <td class="px-4 py-2 font-bold underline">Current Liabilities :</td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2 text-right">-</td>
            <td class="px-4 py-2 text-right">-</td>
          </tr>

          <!-- F. Total Fund & Liabilities -->
          <tr>
            <td class="px-4 py-2 font-bold">F.</td>
            <td class="px-4 py-2 font-bold">
              Total Fund & Liabilities : (D+E)
            </td>
            <td class="px-4 py-2"></td>
            <td
              class="px-4 py-2 text-right font-bold border-t-2 border-b-4 border-double border-black"
            >
              46,566,892
            </td>
            <td
              class="px-4 py-2 text-right font-bold border-t-2 border-b-4 border-double border-black"
            >
              46,929,196
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import { getToken } from "@/utilities/common.js";
import { apiBase } from "@/config.js";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import printJS from "print-js";
import { Icon } from "@iconify/vue";

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
  try {
    loading.value = true;
    const formData = new FormData();
    formData.append("SiteCode", SiteCode);
    formData.append("Category", category.value);
    formData.append("FromDate", fromDate.value.format("DD/MM/YYYY"));
    formData.append("ToDate", toDate.value.format("DD/MM/YYYY"));

    const res = await axios.post(
      `${apiBase}/journal-master/journal_book`,
      formData,
      getToken()
    );
    voucherData.value = res.data;
    loading.value = false;
  } catch (err) {
    console.error("Error fetching vouchers:", err);
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

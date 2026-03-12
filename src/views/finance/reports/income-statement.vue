<template>
  <MainLayout>
    <div class="grid grid-cols-12 gap-4 items-center mb-4 no-print">
      <div class="col-span-2">
        <div class="mb-2">
          <div class="flex gap-2 items-center relative">
            <p class="text-2xl voucher-page-title font-bold text-primary">
              Income Expense
            </p>
          </div>
        </div>
      </div>
      <div class="col-span-8">
        <div
          class="grid grid-cols-12 border border-gray-200 rounded p-4 gap-2 max-w-6xl mx-auto"
        >
          <!-- Category Select with Search -->

          <div class="col-span-4">
            <div class="flex items-center">
              <label for="period" class="w-36 font-bold">Form Date:</label>
              <!-- v-model:value="formData.DateFrom" -->
              <a-date-picker
                v-model:value="formData.DateFrom"
                format="DD/MM/YYYY"
                class="w-full"
                @change="handleDateFromChange"
              />
            </div>
          </div>
          <div class="col-span-4">
            <div class="flex items-center">
              <label for="period" class="w-36 font-bold">To Date:</label>
              <!-- v-model:value="formData.DateTo" -->
              <a-date-picker
                v-model:value="formData.DateTo"
                format="DD/MM/YYYY"
                class="w-full"
                @change="handleDateToChange"
              />
            </div>
          </div>
          <div class="flex justify-end col-span-4 gap-2">
            <div>
              <a-button type="primary" @click="fetchVouchers" :loading="loading"
                >Preview</a-button
              >
            </div>
            <!-- <div>
              <a-button type="primary" @click="exportPDF" :loading="loading"
                >PDF</a-button
              >
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="voucherData"
      id="receiptPaymentReport"
      class="w-full max-w-[72rem] mx-auto p-8 bg-white border border-gray-200"
    >
      <!-- Header Section -->

      <!-- Organization Name -->
      <div class="text-center my-6 relative">
        <h2 class="text-3xl font-bold mb-2">P-ERP Food and Snacks</h2>
        <p class="text-base underline">
          145, Siddique Bazar (1st Floor), Dhaka-1000.
        </p>

        <div class="absolute top-0 right-0 no-print">
          <button @click="printReport">
            <Icon icon="vscode-icons:file-type-pdf2" width="30" height="30" />
          </button>
        </div>
      </div>

      <p class="text-sm text-center">
        {{ formatRange(formData.DateFrom, formData.DateTo) }}
      </p>

      <!-- Statement Title -->
      <div class="text-center my-6">
        <h3 class="text-lg font-semibold inline-block px-4 py-1">
          Statements of Receipts & Payments
        </h3>
      </div>

      <!-- Financial Table -->
      <table class="w-full border-collapse">
        <!-- Table Header -->
        <thead>
          <tr>
            <th
              class="border border-black p-2 text-center font-bold"
              rowspan="2"
            >
              Sl. #
            </th>
            <th
              class="border border-black p-2 text-center font-bold"
              rowspan="2"
            >
              Particulars
            </th>
            <th
              class="border border-black p-2 text-center font-bold"
              rowspan="2"
            >
              Notes/Sch.
            </th>
            <th
              class="border border-black p-2 text-center font-bold"
              colspan="2"
            >
              Amount (Tk.)
            </th>
          </tr>
          <tr>
            <th
              class="border border-black p-2 text-center font-bold"
              colspan="2"
            >
              2024-2025
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- A. Income -->
          <template v-if="A_data?.length > 0">
            <tr>
              <td class="align-top py-1 px-2 text-center font-bold">
                {{ A_data[0]?.GroupSerial }}
              </td>
              <td class="align-top py-1 px-2 font-bold underline">
                {{ A_data[0]?.GroupType }} :
              </td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
            </tr>
            <tr v-for="(item, index) in A_data" :key="`a-${index}`">
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2 pl-8">
                {{ item?.AccountDetails }}
              </td>
              <td class="align-top py-1 px-2 text-center"></td>
              <td class="align-top py-1 px-2 text-right"></td>
              <td class="align-top py-1 px-2 text-right">
                {{ formatAmount(item?.Amount) }}
              </td>
            </tr>
            <!-- sum of A -->
            <tr>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2 font-bold">Total Income</td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td
                class="align-top py-1 px-2 text-right border-t border-b border-black font-semibold"
              >
                <!-- {{ calculateTotals(A_data) }} -->
                {{ formatAmount(A_total) }}
              </td>
            </tr>
          </template>

          <!-- B. Expenditure -->
          <template v-if="B_data?.length > 0">
            <tr>
              <td class="align-top py-1 px-2 text-center font-bold">
                {{ B_data[0]?.GroupSerial }}
              </td>
              <td class="align-top py-1 px-2 font-bold underline">
                {{ B_data[0]?.GroupType }}
              </td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
            </tr>
            <tr v-for="(item, index) in B_data" :key="`b-${index}`">
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2 pl-8">
                {{ item?.AccountDetails }}
              </td>
              <td class="align-top py-1 px-2 text-center"></td>
              <td class="align-top py-1 px-2 text-center"></td>
              <td class="align-top py-1 px-2 text-right">
                {{ formatAmount(item?.Amount) }}
              </td>
            </tr>
            <!-- sum of B -->
            <tr>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2 font-bold"></td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td
                class="align-top py-1 px-2 text-right border-t font-bold border-black"
              >
                {{ formatAmount(B_total) }}
              </td>
            </tr>
          </template>

          <!-- C.-->
          <template v-if="C_data?.length > 0">
            <tr>
              <td class="align-top py-1 px-2 text-center font-bold">
                {{ C_data[0]?.GroupSerial }}
              </td>
              <td class="align-top py-1 px-2 font-bold underline">
                {{ C_data[0]?.GroupType }}
              </td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
            </tr>
            <tr v-for="(item, index) in C_data" :key="`c-${index}`">
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2 pl-8">
                {{ item?.AccountDetails }}
              </td>
              <td class="align-top py-1 px-2 text-center"></td>
              <td class="align-top py-1 px-2 text-center"></td>
              <td class="align-top py-1 px-2 text-right border-b border-black">
                ({{ formatAmount(item?.Amount) }})
              </td>
            </tr>
          </template>
          <!-- D. Payment during the year -->
          <!-- <template v-if="D_data?.length > 0">
            <tr v-for="(item, index) in D_data" :key="`d-${index}`">
              <td class="align-top py-1 px-2">{{ D_data[0]?.ReportCode }}</td>
              <td class="align-top py-1 px-2 pl-8">
                {{ item?.AccountDetails }}
              </td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td
                class="align-top py-1 px-2 text-right border-b-[3px] border-double border-black font-bold"
              >
                {{ formatAmount(item?.Amount) }}
              </td>
            </tr>
          </template> -->
        </tbody>
      </table>

      <div class="mt-12">
        <p class="text-center text-lg mb-12">
          This is the statement of Receipts & Payments prepared referred to in
          our separate report of even date
        </p>
        <div class="flex justify-between mt-16">
          <div class="flex-1 text-base">
            <p>Dated, Dhaka</p>
          </div>
          <div class="text-center text-base p-5">
            <!-- <p class="font-bold uppercase">(MASUD ALTAF & CO.)</p> -->
            <!-- <p>Chartered Accountants</p> -->
            <!-- Need Report Format -->
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
import { apiBase } from "@/config.js";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import printJS from "print-js";
import { Icon } from "@iconify/vue";
import { message } from "ant-design-vue";

const SiteCode = "01";
const pdfLoading = ref(false);
const excelLoading = ref(false);
const formData = ref({
  DateFrom: dayjs().startOf("month"),
  DateTo: dayjs().endOf("month"),
});

const category = ref("JVR");

const loading = ref(false);
const voucherData = ref();
const voucherTypes = ref([]);
const all_voucherTypes = ref([]);

const A_data = ref([]);
const B_data = ref([]);
const C_data = ref([]);
const D_data = ref([]);

// add total refs
const A_total = ref(0);
const B_total = ref(0);
const C_total = ref(0);
const D_total = ref(0);

const fetchVouchers = async () => {
  try {
    loading.value = true;

    const res = await axios.post(
      `${apiBase}/journal-master/income-expense-report`,
      {
        DateFrom: formData.value.DateFrom
          ? dayjs(formData.value.DateFrom).format("YYYY-MM-DD")
          : null,
        DateTo: formData.value.DateTo
          ? dayjs(formData.value.DateTo).format("YYYY-MM-DD")
          : null,
      },
      getToken()
    );
    loading.value = false;
    voucherData.value = res.data;
    // console.log("voucherData.value:", voucherData.value);
    A_data.value = res.data["A."]?.data;
    B_data.value = res.data["B."]?.data;
    C_data.value = res.data["C."]?.data;
    D_data.value = res.data["D."]?.data;

    // assign totals from API response (no calculateTotals)
    A_total.value = Number(res.data["A."]?.total || 0);
    B_total.value = Number(res.data["B."]?.total || 0);
    C_total.value = Number(res.data["C."]?.total || 0);
    D_total.value = Number(res.data["D."]?.total || 0);
  } catch (err) {
    console.error("Error fetching vouchers:", err);
    loading.value = false;
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const formatAmount = (amount) => {
  const num = Number(amount || 0);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Helpers to format dates for display like `1st November 2025`
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

onMounted(() => {
  // fetchVoucherTypes();
  // fetchVouchers();
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

const printReport = () => {
  printJS({
    printable: "receiptPaymentReport",
    type: "html",
    targetStyles: ["*"],
    style: `
      @page {
        size: A4;
        margin: 15mm;
      }

      @media print {
        /* Hide non-print elements */
        .no-print {
          display: none !important;
        }

        /* Base styles */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        body {
          font-family: Arial, sans-serif !important;
          font-size: 11px !important;
          line-height: 1.4 !important;
          margin: 0 !important;
          padding: 0 !important;
          color: #000 !important;
        }

        /* Container */
        #receiptPaymentReport {
          max-width: 100% !important;
          padding: 10mm !important;
          margin: 0 !important;
          background: white !important;
          border: none !important;
        }

        /* Organization header */
        h2 {
          font-size: 20px !important;
          font-weight: bold !important;
          margin-bottom: 5px !important;
        }

        h3 {
          font-size: 14px !important;
          font-weight: 600 !important;
        }

        p {
          margin: 3px 0 !important;
        }

        /* Center alignment */
        .text-center {
          text-align: center !important;
        }

        /* Spacing */
        .my-6 {
          margin-top: 15px !important;
          margin-bottom: 15px !important;
        }

        .mb-2 {
          margin-bottom: 5px !important;
        }

        .mt-12 {
          margin-top: 30px !important;
        }

        .mt-16 {
          margin-top: 40px !important;
        }

        /* Table styles */
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 10px 0 !important;
        }

        thead th {
          border: 1px solid #000 !important;
          padding: 8px !important;
          font-weight: bold !important;
          text-align: center !important;
          background-color: #fff !important;
          font-size: 11px !important;
        }

        tbody td {
          padding: 4px 8px !important;
          font-size: 11px !important;
          vertical-align: top !important;
        }

        /* Text alignment */
        .text-center {
          text-align: center !important;
        }

        .text-right {
          text-align: right !important;
        }

        /* Font weights */
        .font-bold {
          font-weight: bold !important;
        }

        .font-semibold {
          font-weight: 600 !important;
        }

        /* Text decoration */
        .underline {
          text-decoration: underline !important;
        }

        /* Padding */
        .py-1 {
          padding-top: 4px !important;
          padding-bottom: 4px !important;
        }

        .px-2 {
          padding-left: 8px !important;
          padding-right: 8px !important;
        }

        .pl-8 {
          padding-left: 25px !important;
        }

        .p-2 {
          padding: 8px !important;
        }

        /* Borders */
        .border {
          border-width: 1px !important;
        }

        .border-black {
          border-color: #000 !important;
        }

        .border-t {
          border-top: 1px solid #000 !important;
        }

        .border-b {
          border-bottom: 1px solid #000 !important;
        }

        .border-b-\\[3px\\] {
          border-bottom-width: 3px !important;
        }

        .border-double {
          border-bottom-style: double !important;
        }

        /* Alignment */
        .align-top {
          vertical-align: top !important;
        }

        /* Footer section */
        .flex {
          display: flex !important;
        }

        .justify-between {
          justify-content: space-between !important;
        }

        .flex-1 {
          flex: 1 !important;
        }

        /* Page break control */
        table {
          page-break-inside: auto !important;
        }

        tr {
          page-break-inside: avoid !important;
          page-break-after: auto !important;
        }

        thead {
          display: table-header-group !important;
        }

        tbody {
          display: table-row-group !important;
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

const handleDateFromChange = () => {
  if (!formData.value.DateTo) return;

  const voucherFrom = new Date(formData.value.DateFrom);
  const voucherTo = new Date(formData.value.DateTo);

  if (voucherFrom > voucherTo) {
    message.warning("The 'Date From' cannot be later than 'Date To'.");
    formData.value.DateFrom = null;
  }
};

// Handle Date To change
const handleDateToChange = () => {
  if (!formData.value.DateFrom) return;
  const voucherFrom = new Date(formData.value.DateFrom);
  const voucherTo = new Date(formData.value.DateTo);

  if (voucherTo < voucherFrom) {
    message.warning("The 'Date To' cannot be earlier than 'Date From'.");
    formData.value.DateTo = null;
  }
};
</script>

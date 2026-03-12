<template>
  <MainLayout>
    <div class="grid grid-cols-12 gap-4 items-center mb-4 no-print">
      <div class="col-span-2">
        <div class="mb-2">
          <div class="flex gap-2 items-center relative">
            <p class="text-2xl voucher-page-title font-bold text-primary">
              Receipts & Payments
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
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="voucherData"
      id="receiptPaymentReport"
      class="w-full max-w-5xl mx-auto p-8 bg-white border border-gray-200"
    >
      <!-- Header Section -->

      <!-- Organization Name -->
      <div class="text-center relative">
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
        <h3 class="text-lg font-semibold inline-block py-1 px-4">
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
          <!-- A. Opening Balance -->
          <template v-if="A_data?.length > 0">
            <tr>
              <td class="align-top py-1 px-2 text-center font-bold">
                {{ A_data[0]?.ReportCode }}
              </td>
              <td class="align-top py-1 px-2 font-bold underline">
                {{ A_data[0]?.ReportGroup }}
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
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td
                class="align-top py-1 px-2 text-right border-t border-b border-black font-semibold"
              >
                {{ calculateTotals(A_data) }}
              </td>
            </tr>
          </template>

          <!-- B. Receipts during the year -->
          <template v-if="B_data?.length > 0">
            <tr>
              <td class="align-top py-1 px-2 text-center font-bold">
                {{ B_data[0]?.ReportCode }}
              </td>
              <td class="align-top py-1 px-2 font-bold underline">
                {{ B_data[0]?.ReportGroup }}
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
              <td class="align-top py-1 px-2 font-bold">Total Receipts</td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td
                class="align-top py-1 px-2 text-right border-t border-b border-black font-semibold"
              >
                {{ calculateTotals(B_data) }}
              </td>
            </tr>
          </template>

          <!-- C. Fund available for Utilization -->
          <tr>
            <td class="align-top py-1 px-2 text-center font-bold">C.</td>
            <td class="align-top py-1 px-2 font-bold">
              Fund available for Utilization : (A+B)
            </td>
            <td class="align-top py-1 px-2"></td>
            <td class="align-top py-1 px-2"></td>
            <td
              class="align-top py-1 px-2 text-right border-t-2 border-b-4 border-double border-black font-bold"
            >
              {{
                formatAmount(
                  Number(calculateTotals(A_data)) +
                    Number(calculateTotals(B_data))
                )
              }}
            </td>
          </tr>

          <!-- D. Payment during the year -->
          <template v-if="D_data?.length > 0">
            <tr>
              <td class="align-top py-1 px-2 text-center font-bold">
                {{ D_data[0]?.ReportCode }}
              </td>
              <td class="align-top py-1 px-2 font-bold underline">
                {{ D_data[0]?.ReportGroup }}
              </td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
            </tr>
            <tr v-for="(item, index) in D_data" :key="`d-${index}`">
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2 pl-8">
                {{ item?.AccountDetails }}
              </td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2 text-right">
                {{ formatAmount(item?.Amount) }}
              </td>
            </tr>
            <!-- sum of D -->
            <tr>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2 font-bold">Total Payment</td>
              <td class="align-top py-1 px-2"></td>
              <td class="align-top py-1 px-2"></td>
              <td
                class="align-top py-1 px-2 text-right border-t border-b border-black font-semibold"
              >
                {{ calculateTotals(D_data) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
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
const D_data = ref([]);

const fetchVouchers = async () => {
  try {
    loading.value = true;

    const res = await axios.post(
      `${apiBase}/journal-master/receipt-payment-report`,
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
    A_data.value = res.data["A."]?.data;
    B_data.value = res.data["B."]?.data;
    D_data.value = res.data["D."]?.data;
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

const calculateTotals = (data) => {
  const total =
    data?.reduce((acc, item) => acc + Number(item?.Amount || 0), 0) || 0;
  return formatAmount(total);
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
        .no-print {
          display: none !important;
        }
        
        body {
          font-family: Arial, sans-serif !important;
          font-size: 11px !important;
          line-height: 1.3 !important;
          margin: 0 !important;
          padding: 0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        table {
          width: 100% !important;
          border-collapse: collapse !important;
        }
        
        th {
          border: 1px solid #000 !important;
          padding: 5px !important;
          font-weight: bold !important;
          text-align: center !important;
        }
        
        td {
          padding: 3px 8px !important;
        }
        
        .text-right {
          text-align: right !important;
        }
        
        .text-center {
          text-align: center !important;
        }
        
        .font-bold {
          font-weight: bold !important;
        }
        
        .underline {
          text-decoration: underline !important;
        }
        
        .pl-8 {
          padding-left: 2rem !important;
        }
        
        .border-t {
          border-top: 1px solid #000 !important;
        }
        
        .border-b {
          border-bottom: 1px solid #000 !important;
        }
        
        .border-t-2 {
          border-top: 2px solid #000 !important;
        }
        
        .border-b-4 {
          border-bottom: 4px double #000 !important;
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

<style scoped>
/* Responsive title adjustment */
@media (min-width: 992px) and (max-width: 1400px) {
  .voucher-page-title {
    font-size: 14px !important;
  }
}

/* Hide scrollbars */
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

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>

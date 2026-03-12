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

    <div v-if="voucherData" id="receiptPaymentReport" class="report-container">
      <!-- Header Section -->

      <!-- Organization Name -->
      <div class="org-section">
        <h2 class="org-name">P-ERP Food and Snacks</h2>
        <p class="org-address">145, Siddique Bazar (1st Floor), Dhaka-1000.</p>
      </div>

      <!-- Statement Title -->
      <div class="statement-title-section">
        <h3 class="statement-title">Statements of Receipts & Payments</h3>
      </div>

      <!-- Financial Table -->
      <table class="report-table">
        <!-- Table Header -->
        <thead>
          <tr>
            <th class="" rowspan="2">Sl. #</th>
            <th class="" rowspan="2">Particulars</th>
            <th class="" rowspan="2">Notes/Sch.</th>
            <th class="" colspan="2">Amount (Tk.)</th>
          </tr>
          <tr>
            <th class="" colspan="2">2024-2025</th>
          </tr>
        </thead>
        <tbody>
          <!-- A. Income -->
          <template v-if="A_data?.length > 0">
            <tr>
              <td class="table-cell text-center font-bold">
                {{ A_data[0]?.GroupSerial }}
              </td>
              <td class="table-cell font-bold text-underline">
                {{ A_data[0]?.GroupType }} :
              </td>
              <td class="table-cell"></td>
              <td class="table-cell"></td>
              <td class="table-cell"></td>
            </tr>
            <tr v-for="(item, index) in A_data" :key="`a-${index}`">
              <td class="table-cell"></td>
              <td class="table-cell indent-text">{{ item?.AccountDetails }}</td>
              <td class="table-cell text-center"></td>
              <td class="table-cell text-right"></td>
              <td class="table-cell text-right">
                {{ formatAmount(item?.Amount) }}
              </td>
            </tr>
            <!-- sum of A -->
            <tr>
              <td class="table-cell"></td>
              <td class="table-cell font-bold">Total Income</td>
              <td class="table-cell"></td>
              <td class="table-cell"></td>
              <td class="table-cell text-right total-line">
                <!-- {{ calculateTotals(A_data) }} -->
                {{ formatAmount(A_total) }}
              </td>
            </tr>
          </template>

          <!-- B. Expenditure -->
          <template v-if="B_data?.length > 0">
            <tr>
              <td class="table-cell text-center font-bold">
                {{ B_data[0]?.GroupSerial }}
              </td>
              <td class="table-cell font-bold text-underline">
                {{ B_data[0]?.GroupType }}
              </td>
              <td class="table-cell"></td>
              <td class="table-cell"></td>
              <td class="table-cell"></td>
            </tr>
            <tr v-for="(item, index) in B_data" :key="`b-${index}`">
              <td class="table-cell"></td>
              <td class="table-cell indent-text">{{ item?.AccountDetails }}</td>
              <td class="table-cell text-center"></td>
              <td class="table-cell text-center"></td>
              <td class="table-cell text-right">
                {{ formatAmount(item?.Amount) }}
              </td>
            </tr>
            <!-- sum of B -->
            <tr>
              <td class="table-cell"></td>
              <td class="table-cell font-bold"></td>
              <td class="table-cell"></td>
              <td class="table-cell"></td>
              <td class="table-cell text-right border-t font-bold border-black">
                {{ formatAmount(B_total) }}
              </td>
            </tr>
          </template>

          <!-- C. Fund available for Utilization -->
          <template v-if="C_data?.length > 0">
            <tr class="" v-for="(item, index) in C_data" :key="`c-${index}`">
              <td class="table-cell font-bold">{{ item?.GroupSerial }}</td>
              <td class="table-cell indent-text">{{ item?.AccountDetails }}</td>
              <td class="table-cell indent-text"></td>
              <td class="table-cell text-center"></td>

              <td class="table-cell text-right border-b border-black">
                ({{ formatAmount(item?.Amount) }})
              </td>
            </tr>
          </template>
          <!-- D. Payment during the year -->
          <template v-if="D_data?.length > 0">
            <tr v-for="(item, index) in D_data" :key="`d-${index}`">
              <td class="table-cell">{{ D_data[0]?.ReportCode }}</td>
              <td class="table-cell indent-text">{{ item?.AccountDetails }}</td>
              <td class="table-cell"></td>
              <td class="table-cell"></td>
              <td
                class="table-cell text-right border-b border-black font-bold border-double"
              >
                {{ formatAmount(item?.Amount) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div class="footer-section">
        <p class="footer-text">
          This is the statement of Receipts & Payments prepared referred to in
          our separate report of even date
        </p>
        <div class="signature-section">
          <div class="date-section">
            <p>Dated, Dhaka</p>
          </div>
          <div class="auditor-section p-5">
            <!-- <p class="auditor-name">(MASUD ALTAF & CO.)</p> -->
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

const calculateTotals = (data) => {
  const total =
    data?.reduce((acc, item) => acc + Number(item?.Amount || 0), 0) || 0;
  return formatAmount(total);
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

const exportPDF = () => {
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
        body {
          font-family: Arial, sans-serif !important;
          font-size: 11px !important;
          line-height: 1.3 !important;
          margin: 0 !important;
          padding: 0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Container */
        .report-container {
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* Header Section */
        .report-header {
          display: flex !important;
          justify-content: space-between !important;
          margin-bottom: 15px !important;
        }
        
        .header-left {
          flex: 1 !important;
        }
        
        .header-right {
          text-align: right !important;
          font-size: 9px !important;
          line-height: 1.2 !important;
        }
        
        .header-right p {
          margin: 1px 0 !important;
        }
        
        .company-name {
          font-size: 14px !important;
          font-weight: bold !important;
          margin: 0 0 3px 0 !important;
        }
        
        .company-subtitle {
          font-size: 10px !important;
          margin: 0 !important;
        }
        
        /* Organization Section */
        .org-section {
          text-align: center !important;
          margin: 15px 0 !important;
        }
        
        .org-name {
          font-size: 20px !important;
          font-weight: bold !important;
          margin: 0 0 5px 0 !important;
        }
        
        .org-address {
          font-size: 11px !important;
          text-decoration: underline !important;
          margin: 0 !important;
        }
        
        /* Statement Title */
        .statement-title-section {
          text-align: center !important;
          margin: 20px 0 15px 0 !important;
        }
        
        .statement-title {
          font-size: 13px !important;
          font-weight: 600 !important;
          margin: 0 !important;
          display: inline-block !important;
        }
        
        /* Table Styles */
        .report-table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 10px 0 !important;
        }
        
        .report-table thead th {
          border: 1px solid #000 !important;
          padding: 5px !important;
          font-size: 10px !important;
          font-weight: bold !important;
          text-align: center !important;
          background-color: #fff !important;
        }
        
        .report-table tbody td {
          padding: 3px 5px !important;
          font-size: 10px !important;
          border: none !important;
        }
        
        /* Column widths */
        .col-sl {
          width: 60px !important;
        }
        
        .col-particulars {
          width: auto !important;
          text-align: left !important;
          padding-left: 8px !important;
        }
        
        .col-notes {
          width: 100px !important;
        }
        
        .col-amount-header {
          width: 150px !important;
        }
        
        .col-amount-year {
          border-top: 1px solid #000 !important;
        }
        
        /* Table cell styles */
        .table-cell {
          vertical-align: top !important;
        }
        
        .text-center {
          text-align: center !important;
        }
        
        .text-right {
          text-align: right !important;
          padding-right: 8px !important;
        }
        
        .font-bold {
          font-weight: bold !important;
        }
        
        .text-underline {
          text-decoration: underline !important;
        }
        
        .indent-text {
          padding-left: 25px !important;
        }
        
        /* Total lines */
        .total-line {
          border-top: 1px solid #000 !important;
          border-bottom: 1px solid #000 !important;
          font-weight: 600 !important;
          padding: 3px 8px 3px 5px !important;
        }
        
        .grand-total {
          border-top: 2px solid #000 !important;
          border-bottom: 3px double #000 !important;
          font-weight: bold !important;
          padding: 4px 8px 4px 5px !important;
        }
        
        /* Footer Section */
        .footer-section {
          margin-top: 40px !important;
        }
        
        .footer-text {
          text-align: center !important;
          font-size: 11px !important;
          margin: 0 0 40px 0 !important;
          line-height: 1.4 !important;
        }
        
        .signature-section {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-end !important;
          margin-top: 50px !important;
        }
        
        .date-section {
          flex: 1 !important;
          font-size: 11px !important;
        }
        
        .auditor-section {
          text-align: center !important;
          font-size: 11px !important;
        }
        
        .auditor-name {
          font-weight: bold !important;
          text-transform: uppercase !important;
          margin: 0 0 2px 0 !important;
        }
        
        /* Page break control */
        .report-table {
          page-break-inside: auto !important;
        }
        
        .report-table tr {
          page-break-inside: avoid !important;
        }
        
        .report-table thead {
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

<style scoped>
/* Screen styles */
.report-container {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
}

.report-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.header-right {
  text-align: right;
  font-size: 0.875rem;
}

.header-right p {
  margin: 0.125rem 0;
}

.company-name {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.company-subtitle {
  font-size: 0.875rem;
}

.org-section {
  text-align: center;
  margin: 1.5rem 0;
}

.org-name {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.org-address {
  font-size: 1rem;
  text-decoration: underline;
}

.statement-title-section {
  text-align: center;
  margin: 1.5rem 0;
}

.statement-title {
  font-size: 1.125rem;
  font-weight: 600;
  display: inline-block;
  padding: 0.25rem 1rem;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
}

.report-table thead th {
  border: 1px solid #000;
  /* padding: 0.5rem; */
  text-align: center;
  font-weight: bold;
}

.report-table tbody td {
  padding: 0.25rem 0.5rem;
}

.table-cell {
  vertical-align: top;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.font-bold {
  font-weight: bold;
}

.text-underline {
  text-decoration: underline;
}

.indent-text {
  padding-left: 2rem;
}

.total-line {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  font-weight: 600;
}

.grand-total {
  border-top: 2px solid #000;
  border-bottom: 3px double #000;
  font-weight: bold;
}

.footer-section {
  margin-top: 3rem;
}

.footer-text {
  text-align: center;
  font-size: 1.125rem;
  margin-bottom: 3rem;
}

.signature-section {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
}

.auditor-section {
  text-align: center;
}

.auditor-name {
  font-weight: bold;
  text-transform: uppercase;
}

/* Ant Design overrides */
.ant-input-number-input {
  @apply !text-right !pr-10;
}

/* Scrollbar hide */
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

/* Responsive adjustments */
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
</style>

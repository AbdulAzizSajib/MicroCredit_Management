<template>
  <MainLayout>
    <div class="bg-white rounded-xl p-6 space-y-6 max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-primary">Customer Ledger</h1>

      <div class="grid grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium text-gray-700">Employee Code</label>
        <div class="col-span-2">
          <a-select
            show-search
            class="w-full"
            placeholder="Select Employee"
            v-model:value="selectedEmpCode"
            :filter-option="false"
            @input="getCustomerData($event.target.value)"
            @change="fetchLedger"
            allowClear
          >
            <a-select-option
              v-for="customer in customerData"
              :key="customer.AMCode"
              :value="customer.MemberCode"
            >
              {{ customer.MemberCode }} - {{ customer.AMDetails }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <button
            v-if="responseData"
            @click="downloadReport"
            class="px-4 py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Report
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        <a-spin />
        <span class="ml-2 text-gray-500">Loading...</span>
      </div>

      <div v-else-if="responseData" class="space-y-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-green-500 uppercase tracking-wide">Total Saving</div>
                <div class="text-2xl font-bold text-green-700 mt-2">{{ formatAmount(totalSaving) }}</div>
              </div>
              <div class="bg-green-200/60 rounded-full p-3">
                <Icon icon="mdi:piggy-bank-outline" class="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-blue-500 uppercase tracking-wide">Total Loan</div>
                <div class="text-2xl font-bold text-blue-700 mt-2">{{ formatAmount(totalLoan) }}</div>
              </div>
              <div class="bg-blue-200/60 rounded-full p-3">
                <Icon icon="mdi:bank-outline" class="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-orange-500 uppercase tracking-wide">Total Installment</div>
                <div class="text-2xl font-bold text-orange-700 mt-2">{{ formatAmount(totalInstallment) }}</div>
              </div>
              <div class="bg-orange-200/60 rounded-full p-3">
                <Icon icon="mdi:calendar-clock-outline" class="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <!-- Loan Info -->
        <div v-if="responseData.loans?.length">
          <h2 class="text-lg font-bold text-gray-700 mb-3">Loan Information</h2>
          <div v-for="loan in responseData.loans" :key="loan.LoanId" class="border rounded-lg p-4 mb-4 bg-gray-50">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
              <div class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Loan ID:</span>
                <span>{{ loan.LoanId }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Loan Type:</span>
                <span>{{ loan.type?.LoanTypeDetails }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Loan Amount:</span>
                <span class="font-medium">{{ formatAmount(Number(loan.LoanAmount || 0)) }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Status:</span>
                <span>{{ loan.Status === 'A' ? 'Active' : loan.Status }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Employee:</span>
                <span>{{ loan.account?.AMDetails }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Loan Date:</span>
                <span>{{ formatDate(loan.LoanDate) }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Installment:</span>
                <span>{{ formatAmount(Number(loan.Installment || 0)) }} x {{ loan.NofInstallment }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Effective Period:</span>
                <span>{{ loan.EffectivePeriod }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Interest Rate:</span>
                <span>{{ loan.InterestRate }}%</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Interest Amount:</span>
                <span class="font-medium">{{ formatAmount(Number(loan.InterestAmount || 0)) }}</span>
              </div>
              <div v-if="loan.Reference" class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Reference:</span>
                <span>{{ loan.Reference }}</span>
              </div>
              <div v-if="loan.Remarks" class="flex justify-between border-b pb-1">
                <span class="font-semibold text-gray-600">Remarks:</span>
                <span>{{ loan.Remarks }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment History -->
        <div v-if="responseData.payments?.length">
          <h2 class="text-lg font-bold text-gray-700 mb-3">Payment History</h2>
          <table class="w-full border border-collapse text-left text-sm">
            <thead>
              <tr class="bg-primary text-white">
                <th class="border border-white px-4 py-2 text-center w-10">#</th>
                <th class="border border-white px-4 py-2">Loan ID</th>
                <th class="border border-white px-4 py-2">Payment Date</th>
                <th class="border border-white px-4 py-2 text-right">Amount</th>
                <th class="border border-white px-4 py-2">Entry By</th>
                <th class="border border-white px-4 py-2">Entry Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in responseData.payments" :key="index">
                <td class="px-4 py-2 border text-center">{{ index + 1 }}</td>
                <td class="px-4 py-2 border">{{ item.LoanID }}</td>
                <td class="px-4 py-2 border">{{ formatDate(item.PaymentDate) }}</td>
                <td class="px-4 py-2 border text-right">{{ formatAmount(Number(item.Payment || 0)) }}</td>
                <td class="px-4 py-2 border">{{ item.EntryBy }}</td>
                <td class="px-4 py-2 border">{{ formatDate(item.EntryDate) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-gray-100 font-bold">
                <td class="px-4 py-2 border" colspan="3">Total Paid</td>
                <td class="px-4 py-2 border text-right text-green-600">{{ formatAmount(responseData.total_payment || 0) }}</td>
                <td class="px-4 py-2 border" colspan="2"></td>
              </tr>
              <tr class="bg-gray-100 font-bold" v-if="responseData.loans?.length">
                <td class="px-4 py-2 border" colspan="3">Remaining</td>
                <td class="px-4 py-2 border text-right text-red-500">{{ formatAmount(totalRemaining) }}</td>
                <td class="px-4 py-2 border" colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div v-else class="text-sm text-gray-500">No payments yet.</div>

        <!-- Details / Ledger -->
        <div v-if="responseData.details?.length">
          <h2 class="text-lg font-bold text-gray-700 mb-3">Ledger Details</h2>
          <table class="w-full border border-collapse text-left text-sm">
            <thead>
              <tr class="bg-primary text-white">
                <th class="border border-white px-4 py-2">Member Code</th>
                <th class="border border-white px-4 py-2">Date</th>
                <th class="border border-white px-4 py-2 text-right">Saving</th>
                <th class="border border-white px-4 py-2 text-right">Loan</th>
                <th class="border border-white px-4 py-2 text-right">Installment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in responseData.details" :key="index">
                <td class="px-4 py-2 border">{{ item.membercode }}</td>
                <td class="px-4 py-2 border">{{ formatDate(item.jvdate) }}</td>
                <td class="px-4 py-2 border text-right">{{ formatAmount(Number(item.saving || 0)) }}</td>
                <td class="px-4 py-2 border text-right">{{ formatAmount(Number(item.loan || 0)) }}</td>
                <td class="px-4 py-2 border text-right">{{ formatAmount(Number(item.installment || 0)) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-gray-100 font-bold">
                <td class="px-4 py-2 border" colspan="2">Total</td>
                <td class="px-4 py-2 border text-right">{{ formatAmount(totalSaving) }}</td>
                <td class="px-4 py-2 border text-right">{{ formatAmount(totalLoan) }}</td>
                <td class="px-4 py-2 border text-right">{{ formatAmount(totalInstallment) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div v-else-if="selectedEmpCode && !loading" class="text-center py-8 text-gray-500">
        No ledger data found.
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";
import axios from "axios";
import dayjs from "dayjs";

const selectedEmpCode = ref(null);
const customerData = ref([]);
const responseData = ref(null);
const loading = ref(false);

const getCustomerData = async (q) => {
  try {
    const res = await axios.get(`${apiBase}/get_customer?q=${q}`, getToken());
    if (res.data) {
      customerData.value = Array.isArray(res.data?.data) ? res.data.data : res.data;
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchLedger = async () => {
  if (!selectedEmpCode.value) {
    responseData.value = null;
    return;
  }

  try {
    loading.value = true;
    const res = await axios.get(
      `${apiBase}/customer-ledger?MemberCode=${selectedEmpCode.value}`,
      getToken(),
    );
    if (res.data?.success) {
      responseData.value = res.data.data;
    } else {
      responseData.value = null;
    }
  } catch (error) {
    console.log(error);
    showNotification("error", "Failed to fetch customer ledger.");
    responseData.value = null;
  } finally {
    loading.value = false;
  }
};

const totalRemaining = computed(() => {
  if (!responseData.value?.loans?.length) return 0;
  const totalLoanAmount = responseData.value.loans.reduce((sum, l) => sum + Number(l.LoanAmount || 0), 0);
  return totalLoanAmount - (responseData.value.total_payment || 0);
});

const totalSaving = computed(() =>
  (responseData.value?.details || []).reduce((sum, item) => sum + Number(item.saving || 0), 0)
);
const totalLoan = computed(() =>
  (responseData.value?.details || []).reduce((sum, item) => sum + Number(item.loan || 0), 0)
);
const totalInstallment = computed(() =>
  (responseData.value?.details || []).reduce((sum, item) => sum + Number(item.installment || 0), 0)
);

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  return date ? dayjs(date).format("DD-MMM-YYYY") : "";
};

const downloadReport = () => {
  if (!responseData.value) return;

  const data = responseData.value;
  const selectedCustomer = customerData.value.find(c => c.MemberCode === selectedEmpCode.value);
  const customerName = selectedCustomer?.AMDetails || selectedEmpCode.value;

  let loansHtml = '';
  if (data.loans?.length) {
    data.loans.forEach(loan => {
      loansHtml += `
        <div style="border:1px solid #888;border-radius:4px;padding:6px 8px;margin-bottom:6px;background:#f9fafb;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px 12px;font-size:11px;">
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Loan ID:</span><span>${loan.LoanId}</span></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Loan Type:</span><span>${loan.type?.LoanTypeDetails || ''}</span></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Loan Amount:</span><span>${formatAmount(Number(loan.LoanAmount || 0))}</span></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Status:</span><span>${loan.Status === 'A' ? 'Active' : loan.Status}</span></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Employee:</span><span>${loan.account?.AMDetails || ''}</span></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Loan Date:</span><span>${formatDate(loan.LoanDate)}</span></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Installment:</span><span>${formatAmount(Number(loan.Installment || 0))} x ${loan.NofInstallment}</span></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Effective Period:</span><span>${loan.EffectivePeriod}</span></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Interest Rate:</span><span>${loan.InterestRate}%</span></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Interest Amount:</span><span>${formatAmount(Number(loan.InterestAmount || 0))}</span></div>
            ${loan.Reference ? `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Reference:</span><span>${loan.Reference}</span></div>` : ''}
            ${loan.Remarks ? `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:1px 0;"><span style="font-weight:bold;color:#555;">Remarks:</span><span>${loan.Remarks}</span></div>` : ''}
          </div>
        </div>`;
    });
  }

  let paymentRows = '';
  if (data.payments?.length) {
    data.payments.forEach((item, i) => {
      paymentRows += `
        <tr>
          <td style="text-align:center;">${i + 1}</td>
          <td style="">${item.LoanID}</td>
          <td style="">${formatDate(item.PaymentDate)}</td>
          <td style="text-align:right;">${formatAmount(Number(item.Payment || 0))}</td>
          <td style="">${item.EntryBy}</td>
          <td style="">${formatDate(item.EntryDate)}</td>
        </tr>`;
    });
  }

  let detailRows = '';
  if (data.details?.length) {
    data.details.forEach(item => {
      detailRows += `
        <tr>
          <td style="">${item.membercode}</td>
          <td style="">${formatDate(item.jvdate)}</td>
          <td style="text-align:right;">${formatAmount(Number(item.saving || 0))}</td>
          <td style="text-align:right;">${formatAmount(Number(item.loan || 0))}</td>
          <td style="text-align:right;">${formatAmount(Number(item.installment || 0))}</td>
        </tr>`;
    });
  }

  const html = `
    <html>
    <head>
      <title>Customer Ledger - ${selectedEmpCode.value}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 15px; color: #333; font-size: 11px; }
        h2 { text-align: center; margin: 0 0 2px 0; font-size: 16px; }
        .subtitle { text-align: center; color: #666; margin: 0 0 8px 0; font-size: 11px; }
        h3 { font-size: 12px; margin: 8px 0 4px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 4px; }
        th { background: #f3f4f6; padding: 2px 4px; border: 1px solid #888; text-align: left; font-weight: bold; }
        td { padding: 2px 4px; border: 1px solid #888; }
        .total-row td { font-weight: bold; background: #f9fafb; border-top: 2px solid #999; }
        @media print { body { padding: 8px; } }
      </style>
    </head>
    <body>
      <h2>Customer Ledger Report</h2>
      <p class="subtitle">${selectedEmpCode.value} - ${customerName}</p>

      <div style="display:flex;gap:8px;margin-bottom:10px;">
        <div style="flex:1;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:6px;padding:8px 10px;">
          <div style="font-size:9px;font-weight:bold;color:#22c55e;text-transform:uppercase;letter-spacing:1px;">Total Saving</div>
          <div style="font-size:16px;font-weight:bold;color:#15803d;margin-top:2px;">${formatAmount(totalSaving.value)}</div>
        </div>
        <div style="flex:1;background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #bfdbfe;border-radius:6px;padding:8px 10px;">
          <div style="font-size:9px;font-weight:bold;color:#3b82f6;text-transform:uppercase;letter-spacing:1px;">Total Loan</div>
          <div style="font-size:16px;font-weight:bold;color:#1d4ed8;margin-top:2px;">${formatAmount(totalLoan.value)}</div>
        </div>
        <div style="flex:1;background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fed7aa;border-radius:6px;padding:8px 10px;">
          <div style="font-size:9px;font-weight:bold;color:#f97316;text-transform:uppercase;letter-spacing:1px;">Total Installment</div>
          <div style="font-size:16px;font-weight:bold;color:#c2410c;margin-top:2px;">${formatAmount(totalInstallment.value)}</div>
        </div>
      </div>

      ${data.loans?.length ? `<h3>Loan Information</h3>${loansHtml}` : ''}

      ${data.payments?.length ? `
      <h3>Payment History</h3>
      <table>
        <thead>
          <tr>
            <th style="text-align:center;width:40px;">#</th>
            <th>Loan ID</th>
            <th>Payment Date</th>
            <th style="text-align:right;">Amount</th>
            <th>Entry By</th>
            <th>Entry Date</th>
          </tr>
        </thead>
        <tbody>${paymentRows}</tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="3" style="font-weight:bold;color:#16a34a;">Total Paid</td>
            <td style="text-align:right;font-weight:bold;color:#16a34a;">${formatAmount(data.total_payment || 0)}</td>
            <td colspan="2" style=""></td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="font-weight:bold;color:#dc2626;">Remaining</td>
            <td style="text-align:right;font-weight:bold;color:#dc2626;">${formatAmount(totalRemaining.value)}</td>
            <td colspan="2" style=""></td>
          </tr>
        </tfoot>
      </table>` : '<p style="color:#999;font-size:13px;">No payments yet.</p>'}

      ${data.details?.length ? `
      <h3>Ledger Details</h3>
      <table>
        <thead>
          <tr>
            <th>Member Code</th>
            <th>Date</th>
            <th style="text-align:right;">Saving</th>
            <th style="text-align:right;">Loan</th>
            <th style="text-align:right;">Installment</th>
          </tr>
        </thead>
        <tbody>${detailRows}</tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="2" style="font-weight:bold;">Total</td>
            <td style="text-align:right;font-weight:bold;">${formatAmount(totalSaving.value)}</td>
            <td style="text-align:right;font-weight:bold;">${formatAmount(totalLoan.value)}</td>
            <td style="text-align:right;font-weight:bold;">${formatAmount(totalInstallment.value)}</td>
          </tr>
        </tfoot>
      </table>` : ''}

      <p style="text-align:center;margin-top:10px;font-size:9px;color:#999;">Generated on ${dayjs().format('YYYY-MM-DD HH:mm')}</p>
    </body>
    </html>
  `;

  let iframe = document.getElementById('ledger-print-frame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'ledger-print-frame';
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.left = '-9999px';
    document.body.appendChild(iframe);
  }
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
};
</script>

<template>
  <MainLayout>
    <div class="bg-white rounded-xl p-6 space-y-6 max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-primary">{{ $t('loanExt.customerLedger') }}</h1>

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
        <!-- Saving Summary -->
        <div>
          <h2 class="text-sm font-bold text-primary uppercase tracking-wider mb-3">Saving Summary</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="bg-blue-200/60 rounded-full p-3">
                  <Icon icon="mdi:wallet-outline" class="text-blue-600 text-2xl" />
                </div>
                <div class="flex-1 text-right">
                  <div class="text-xs font-semibold text-blue-500 uppercase tracking-wide">Total</div>
                  <div class="text-2xl font-bold text-blue-700 mt-1">{{ formatAmount(Number(customerInfo?.TotalAmount || 0)) }}</div>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="bg-green-200/60 rounded-full p-3">
                  <Icon icon="mdi:piggy-bank-outline" class="text-green-600 text-2xl" />
                </div>
                <div class="flex-1 text-right">
                  <div class="text-xs font-semibold text-green-500 uppercase tracking-wide">Receivable</div>
                  <div class="text-2xl font-bold text-green-700 mt-1">{{ formatAmount(Number(customerInfo?.TotalGivenAmount || 0)) }}</div>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="bg-rose-200/60 rounded-full p-3">
                  <Icon icon="mdi:alert-circle-outline" class="text-rose-600 text-2xl" />
                </div>
                <div class="flex-1 text-right">
                  <div class="text-xs font-semibold text-rose-500 uppercase tracking-wide">Due</div>
                  <div class="text-2xl font-bold text-rose-700 mt-1">{{ formatAmount(Number(customerInfo?.DueAmount || 0)) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loan Summary -->
        <div>
          <h2 class="text-sm font-bold text-primary uppercase tracking-wider mb-3">Loan Summary</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="bg-indigo-200/60 rounded-full p-3">
                  <Icon icon="mdi:bank-outline" class="text-indigo-600 text-2xl" />
                </div>
                <div class="flex-1 text-right">
                  <div class="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Loan Amount</div>
                  <div class="text-2xl font-bold text-indigo-700 mt-1">{{ formatAmount(Number(customerInfo?.LoanAmount || 0)) }}</div>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="bg-purple-200/60 rounded-full p-3">
                  <Icon icon="mdi:percent-outline" class="text-purple-600 text-2xl" />
                </div>
                <div class="flex-1 text-right">
                  <div class="text-xs font-semibold text-purple-500 uppercase tracking-wide">Interest Amount</div>
                  <div class="text-2xl font-bold text-purple-700 mt-1">{{ formatAmount(Number(customerInfo?.InterestAmount || 0)) }}</div>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="bg-teal-200/60 rounded-full p-3">
                  <Icon icon="mdi:cash-multiple" class="text-teal-600 text-2xl" />
                </div>
                <div class="flex-1 text-right">
                  <div class="text-xs font-semibold text-teal-500 uppercase tracking-wide">Total Loan Paid</div>
                  <div class="text-2xl font-bold text-teal-700 mt-1">{{ formatAmount(Number(customerInfo?.TotalPayment || 0)) }}</div>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="bg-rose-200/60 rounded-full p-3">
                  <Icon icon="mdi:cash-clock" class="text-rose-600 text-2xl" />
                </div>
                <div class="flex-1 text-right">
                  <div class="text-xs font-semibold text-rose-500 uppercase tracking-wide">Due</div>
                  <div class="text-2xl font-bold text-rose-700 mt-1">{{ formatAmount(Number(customerInfo?.TotalDueAmount || 0)) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Member Collections -->
        <div>
          <h2 class="text-sm font-bold text-primary uppercase tracking-wider mb-2">Member Collections</h2>
          <div class="w-full overflow-x-auto">
            <table class="w-full min-w-[800px] border border-collapse text-left text-sm">
              <thead>
                <tr class="bg-primary text-white">
                  <th class="border border-white px-4 py-2">Period</th>
                  <th class="border border-white px-4 py-2 text-right">Amount</th>
                  <th class="border border-white px-4 py-2">Remarks</th>
                  <th class="border border-white px-4 py-2">Date</th>
                  <th class="border border-white px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in collections" :key="index">
                  <td class="px-4 py-2 border">{{ formatPeriod(item.Period) }}</td>
                  <td class="px-4 py-2 border text-right">{{ formatAmount(Number(item.Amount || 0)) }}</td>
                  <td class="px-4 py-2 border">{{ item.Remarks }}</td>
                  <td class="px-4 py-2 border">{{ formatCollectionDate(item.Date) }}</td>
                  <td class="px-4 py-2 border text-center">
                    <span class="px-2 py-0.5 rounded text-xs font-semibold"
                      :class="item.IsVoucher === 'Y' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                      {{ item.IsVoucher === 'Y' ? 'Voucher' : 'Pending' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!collections.length">
                  <td colspan="5" class="px-4 py-6 border text-center text-gray-500">No collections found.</td>
                </tr>
              </tbody>
            </table>
          </div>
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

const customerInfo = computed(() => responseData.value?.CustomerInfo?.[0] || null);
const collections = computed(() => responseData.value?.Collections || []);

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  return date ? dayjs(date).format("DD-MMM-YYYY") : "";
};

const formatPeriod = (period) => {
  if (!period || period.length < 6) return period || "";
  const year = period.slice(0, 4);
  const month = Number(period.slice(4, 6));
  return dayjs(`${year}-${String(month).padStart(2, "0")}-01`).format("MMM YYYY");
};

const formatCollectionDate = (date) => {
  return date ? dayjs(date).subtract(1, "day").format("YYYY-MM-DD") : "";
};

const downloadReport = () => {
  if (!responseData.value) return;

  const info = customerInfo.value || {};
  const cols = collections.value || [];
  const customerName = info.CustomerName || selectedEmpCode.value;

  let collectionRows = '';
  cols.forEach(item => {
    collectionRows += `
      <tr>
        <td>${formatPeriod(item.Period)}</td>
        <td style="text-align:right;">${formatAmount(Number(item.Amount || 0))}</td>
        <td>${item.Remarks || ''}</td>
        <td>${formatCollectionDate(item.Date)}</td>
        <td style="text-align:center;">${item.IsVoucher === 'Y' ? 'Voucher' : 'Pending'}</td>
      </tr>`;
  });

  const summaryCard = (label, value, color) => `
    <div style="flex:1;background:${color.bg};border:1px solid ${color.border};border-radius:6px;padding:8px 10px;text-align:center;">
      <div style="font-size:9px;font-weight:bold;color:${color.label};text-transform:uppercase;letter-spacing:1px;">${label}</div>
      <div style="font-size:16px;font-weight:bold;color:${color.value};margin-top:2px;">${formatAmount(Number(value || 0))}</div>
    </div>`;

  const html = `
    <html>
    <head>
      <title>Customer Ledger - ${selectedEmpCode.value}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 15px; color: #333; font-size: 11px; }
        h2 { text-align: center; margin: 0 0 2px 0; font-size: 16px; }
        .subtitle { text-align: center; color: #666; margin: 0 0 8px 0; font-size: 11px; }
        h3 { font-size: 12px; margin: 10px 0 4px 0; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 4px; }
        th { background: #1e40af; color: #fff; padding: 4px 6px; border: 1px solid #888; text-align: left; font-weight: bold; }
        td { padding: 3px 6px; border: 1px solid #888; }
        @media print { body { padding: 8px; } }
      </style>
    </head>
    <body>
      <h2>Customer Ledger Report</h2>
      <p class="subtitle">${selectedEmpCode.value} - ${customerName}</p>

      <h3>Saving Summary</h3>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        ${summaryCard('Total', info.TotalAmount, { bg:'#eff6ff', border:'#bfdbfe', label:'#3b82f6', value:'#1d4ed8' })}
        ${summaryCard('Receivable', info.TotalGivenAmount, { bg:'#f0fdf4', border:'#bbf7d0', label:'#22c55e', value:'#15803d' })}
        ${summaryCard('Due', info.DueAmount, { bg:'#fff1f2', border:'#fecdd3', label:'#f43f5e', value:'#be123c' })}
      </div>

      <h3>Loan Summary</h3>
      <div style="display:flex;gap:8px;margin-bottom:10px;">
        ${summaryCard('Loan Amount', info.LoanAmount, { bg:'#eef2ff', border:'#c7d2fe', label:'#6366f1', value:'#4338ca' })}
        ${summaryCard('Interest Amount', info.InterestAmount, { bg:'#faf5ff', border:'#e9d5ff', label:'#a855f7', value:'#7e22ce' })}
        ${summaryCard('Total Loan Paid', info.TotalPayment, { bg:'#f0fdfa', border:'#99f6e4', label:'#14b8a6', value:'#0f766e' })}
        ${summaryCard('Due', info.TotalDueAmount, { bg:'#fff1f2', border:'#fecdd3', label:'#f43f5e', value:'#be123c' })}
      </div>

      <h3>Member Collections</h3>
      ${cols.length ? `
      <table>
        <thead>
          <tr>
            <th>Period</th>
            <th style="text-align:right;">Amount</th>
            <th>Remarks</th>
            <th>Date</th>
            <th style="text-align:center;">Status</th>
          </tr>
        </thead>
        <tbody>${collectionRows}</tbody>
      </table>` : '<p style="color:#999;font-size:13px;">No collections found.</p>'}

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

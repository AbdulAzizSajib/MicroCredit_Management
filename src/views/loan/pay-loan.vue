<template>
  <MainLayout>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Loan Payment List</h1>
      <div class="mb-4">
        <button
          class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
          @click="isCreateModalVisible = true"
        >
          New Loan Add
        </button>
      </div>
    </div>

    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 border-b-2 border-gray-300">
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">LOAN ID</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">LOAN TYPE</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">EMPLOYEE</th>
            <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">LOAN AMOUNT</th>
            <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">INSTALLMENT</th>
            <th class="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(loan, index) in loanData"
            :key="loan.id || loan.LoanId"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
            class="border-b border-gray-200 hover:bg-blue-50 transition-colors"
          >
            <td class="px-6 py-4 text-sm text-gray-900">{{ loan?.LoanId }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ loan?.type?.LoanTypeDetails }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ loan?.EmpCode }}</td>
            <td class="px-6 py-4 text-sm text-gray-900 text-right">{{ loan?.LoanAmount }}</td>
            <td class="px-6 py-4 text-sm text-gray-900 text-right">{{ loan?.NofInstallment }}</td>
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center gap-2">
                <button
                  @click="viewLoan(loan?.LoanId)"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
                >
                  VIEW
                </button>
                <button
                  @click="makePayment(loan)"
                  class="bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
                >
                  PAYMENT
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <a-modal
      v-model:open="isCreateModalVisible"
      title=""
      @cancel="isCreateModalVisible = false"
      :footer="null"
      width="600px"
    >
      <div class="mb-6">
        <h2 class="text-lg font-bold text-gray-800">PAYLOAN FORM</h2>
      </div>

      <form @submit.prevent="createLoan">
        <div class="space-y-4">
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">Loan Type</label>
            <div class="col-span-3">
              <a-select class="w-full" placeholder="Select Loan Type" v-model:value="formData.LoanType">
                <a-select-option v-for="type in loanTypeData" :key="type.LoanType" :value="type.LoanType">
                  {{ type.LoanTypeDetails }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">Employee Code</label>
            <div class="col-span-3">
              <a-select
                show-search
                class="w-full"
                placeholder="Select Employee"
                v-model:value="formData.EmpCode"
                :filter-option="false"
                @input="getCustomerData($event.target.value)"
              >
                <a-select-option
                  v-for="customer in customerData"
                  :key="customer.AMCode"
                  :value="customer.AMCode"
                >
                  {{ customer.AMCode }} - {{ customer.AMDetails }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">Date</label>
            <div class="col-span-3">
              <a-date-picker class="w-full" placeholder="Date" v-model:value="formData.LoanDate" />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">Effective Period</label>
            <div class="col-span-3">
              <a-date-picker
                class="w-full"
                placeholder="Effective Period"
                picker="month"
                format="YYYYMM"
                value-format="YYYYMM"
                v-model:value="formData.EffectivePeriod"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">Loan Amount</label>
            <div class="col-span-3">
              <a-input-number
                class="w-full"
                placeholder="Loan Amount"
                v-model:value="formData.LoanAmount"
                :min="100000"
                :max="9900000"
                :precision="2"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">No of Installment</label>
            <div class="col-span-3">
              <a-input-number
                class="w-full"
                placeholder="No of Installment"
                v-model:value="formData.NofInstallment"
                :min="1"
                :precision="0"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">Installment Amount</label>
            <div class="col-span-3">
              <a-input-number
                class="w-full"
                placeholder="Installment Amount"
                v-model:value="formData.Installment"
                :precision="2"
                :controls="false"
                :disabled="true"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">Reference No</label>
            <div class="col-span-3">
              <a-input class="w-full" placeholder="Reference No" v-model:value="formData.Reference" />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-start">
            <label class="text-sm font-medium text-gray-700 mt-2">Remarks</label>
            <div class="col-span-3">
              <a-textarea class="w-full" placeholder="Remarks" v-model:value="formData.Remarks" :rows="4" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-start mt-6">
          <button
            type="submit"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </a-modal>

    <a-modal
      v-model:open="isViewModalVisible"
      title="Loan Details"
      @cancel="isViewModalVisible = false"
      :footer="null"
      width="650px"
    >
      <div v-if="isLoadingDetails" class="py-8 text-center text-gray-500">Loading details...</div>

      <div v-else-if="viewLoanData">
        <!-- Loan Info -->
        <div class="grid grid-cols-2 gap-x-6 gap-y-2 mb-5">
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Loan ID:</span>
            <span class="text-sm">{{ viewLoanData.LoanId }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Status:</span>
            <span class="text-sm">{{ viewLoanData.Status === 'A' ? 'Active' : viewLoanData.Status }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Loan Type:</span>
            <span class="text-sm">{{ viewLoanData.type?.LoanTypeDetails }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Employee:</span>
            <span class="text-sm">{{ viewLoanData.EmpCode }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Account:</span>
            <span class="text-sm">{{ viewLoanData.account?.AMDetails }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Loan Date:</span>
            <span class="text-sm">{{ formatDate(viewLoanData.LoanDate) }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Loan Amount:</span>
            <span class="text-sm font-medium">{{ formatAmount(Number(viewLoanData.LoanAmount || 0)) }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Installment:</span>
            <span class="text-sm">{{ formatAmount(Number(viewLoanData.Installment || 0)) }} x {{ viewLoanData.NofInstallment }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Effective Period:</span>
            <span class="text-sm">{{ viewLoanData.EffectivePeriod }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Reference:</span>
            <span class="text-sm">{{ viewLoanData.Reference }}</span>
          </div>
        </div>

        <!-- Remarks -->
        <div v-if="viewLoanData.Remarks" class="mb-5">
          <span class="font-semibold text-sm text-gray-600">Remarks:</span>
          <span class="text-sm ml-2">{{ viewLoanData.Remarks }}</span>
        </div>

        <!-- Payment History -->
        <div class="mb-2">
          <h3 class="text-sm font-bold text-gray-700 mb-2">Payment History</h3>
          <div class="overflow-x-auto" v-if="viewPayments.length">
            <table class="w-full border-collapse text-sm">
              <thead>
                <tr class="bg-gray-100 border-b border-gray-300">
                  <th class="px-3 py-2 text-left font-semibold text-gray-700">Payment Date</th>
                  <th class="px-3 py-2 text-right font-semibold text-gray-700">Amount</th>
                  <th class="px-3 py-2 text-left font-semibold text-gray-700">Entry By</th>
                  <th class="px-3 py-2 text-left font-semibold text-gray-700">Entry Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in viewPayments"
                  :key="`${item.LoanID}-${item.PaymentDate}-${index}`"
                  class="border-b border-gray-200"
                >
                  <td class="px-3 py-2">{{ formatDate(item.PaymentDate) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatAmount(Number(item.Payment || 0)) }}</td>
                  <td class="px-3 py-2">{{ item.EntryBy }}</td>
                  <td class="px-3 py-2">{{ formatDate(item.EntryDate) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-gray-50 border-t-2 border-gray-300">
                  <td class="px-3 py-2 font-bold text-gray-700">Total Paid</td>
                  <td class="px-3 py-2 text-right font-bold text-green-600">{{ formatAmount(viewTotalPayment) }}</td>
                  <td colspan="2" class="px-3 py-2"></td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="px-3 py-2 font-bold text-gray-700">Remaining</td>
                  <td class="px-3 py-2 text-right font-bold text-red-500">{{ formatAmount(Number(viewLoanData.LoanAmount || 0) - viewTotalPayment) }}</td>
                  <td colspan="2" class="px-3 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div v-else class="text-sm text-gray-500">No payments yet.</div>
        </div>
      </div>

      <div v-else class="py-8 text-center text-gray-500">No loan details found.</div>

      <div v-if="viewLoanData" class="flex justify-end mt-4">
        <button
          type="button"
          @click="downloadLoanReport"
          class="px-4 py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Report
        </button>
      </div>
    </a-modal>

    <a-modal
      v-model:open="isPaymentModalVisible"
      title="Payment"
      @cancel="isPaymentModalVisible = false"
      :footer="null"
      width="500px"
    >
      <form @submit.prevent="submitPayment" v-if="selectedLoan">
        <div class="space-y-5 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Payment</label>
            <a-input
              class="w-full"
              placeholder="Enter Payment Amount"
              v-model:value="paymentFormData.Payment"
              type="number"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
            <a-date-picker
              class="w-full"
              placeholder="Payment Date"
              value-format="YYYY-MM-DD"
              v-model:value="paymentFormData.PaymentDate"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Entry By</label>
            <a-input class="w-full" placeholder="Entry By" v-model:value="paymentFormData.EntryBy" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Entry Date</label>
            <a-date-picker
              class="w-full"
              placeholder="Entry Date"
              value-format="YYYY-MM-DD"
              v-model:value="paymentFormData.EntryDate"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isPaymentModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            type="submit"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Save changes
          </button>
        </div>
      </form>
    </a-modal>

    <a-pagination
      class="mt-4"
      v-model:current="page"
      :page-size="per_page"
      :total="total"
      :show-size-changer="false"
      :show-total="(t) => `Total ${t} items`"
      @change="
        (pageNo) => {
          page = pageNo;
        }
      "
      v-if="total > per_page"
    />
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { getToken, showNotification } from "@/utilities/common";
import axios from "axios";
import { apiBase } from "@/config";
import dayjs from "dayjs";

const isCreateModalVisible = ref(false);
const isViewModalVisible = ref(false);
const isPaymentModalVisible = ref(false);
const selectedLoan = ref(null);

const paymentFormData = ref({
  Payment: "",
  PaymentDate: dayjs().format("YYYY-MM-DD"),
  EntryBy: "admin",
  EntryDate: dayjs().format("YYYY-MM-DD"),
});

const page = ref(1);
const per_page = ref(10);
const total = ref(10);

const formData = ref({
  LoanType: "",
  EmpCode: "",
  LoanDate: null,
  EffectivePeriod: "",
  LoanAmount: null,
  LastPayDay: "",
  NofInstallment: "",
  Installment: "",
  Reference: "",
  AMCode: "",
  Status: "A",
  Remarks: "",
  GlCompany: "01",
  Active: "Y",
  PrepareBy: "admin",
  PrepareDate: "",
  EditBy: null,
  EditDate: null,
});

watch(
  () => [formData.value.LoanAmount, formData.value.NofInstallment],
  ([loanAmount, nofInstallment]) => {
    const amount = Number(loanAmount);
    const count = Number(nofInstallment);

    if (amount > 0 && count > 0) {
      formData.value.Installment = Number((amount / count).toFixed(2));
      return;
    }

    formData.value.Installment = null;
  },
);

const loadDataloading = ref(false);
const loanData = ref([]);

const getLoadData = async () => {
  try {
    loadDataloading.value = true;
    const res = await axios.get(
      `${apiBase}/settings/pay-loan?search=&per_page=10`,
      getToken(),
    );
    if (res.data) {
      loanData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadDataloading.value = false;
  }
};

const loadTypeloading = ref(false);
const loanTypeData = ref([]);

const getLoadTypeData = async () => {
  try {
    loadTypeloading.value = true;
    const res = await axios.get(
      `${apiBase}/settings/pay-loan-type/all`,
      getToken(),
    );
    if (res.data) {
      loanTypeData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadTypeloading.value = false;
  }
};

const getCustomerloading = ref(false);
const customerData = ref([]);

const getCustomerData = async (q) => {
  try {
    getCustomerloading.value = true;
    const res = await axios.get(`${apiBase}/get_customer?q=${q}`, getToken());
    if (res.data) {
      customerData.value = Array.isArray(res.data?.data) ? res.data.data : res.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    getCustomerloading.value = false;
  }
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const downloadLoanReport = () => {
  if (!viewLoanData.value) return;

  const loan = viewLoanData.value;
  const loanAmount = Number(loan.LoanAmount || 0);
  const remaining = loanAmount - viewTotalPayment.value;

  let paymentRows = '';
  viewPayments.value.forEach((item, i) => {
    paymentRows += `
      <tr>
        <td style="padding:6px 10px;border:1px solid #ddd;text-align:center;">${i + 1}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;">${formatDate(item.PaymentDate)}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;text-align:right;">${formatAmount(Number(item.Payment || 0))}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;">${item.EntryBy}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;">${formatDate(item.EntryDate)}</td>
      </tr>`;
  });

  const html = `
    <html>
    <head>
      <title>Loan Report - ${loan.LoanId}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
        h2 { text-align: center; margin-bottom: 5px; }
        .subtitle { text-align: center; color: #666; margin-bottom: 25px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 30px; margin-bottom: 20px; }
        .info-item { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 4px 0; font-size: 13px; }
        .info-label { font-weight: bold; color: #555; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }
        th { background: #f3f4f6; padding: 8px 10px; border: 1px solid #ddd; text-align: left; font-weight: bold; }
        .total-row td { font-weight: bold; background: #f9fafb; border-top: 2px solid #999; }
        .remaining-row td { font-weight: bold; color: #dc2626; }
        .paid-row td { font-weight: bold; color: #16a34a; }
        @media print { body { padding: 10px; } }
      </style>
    </head>
    <body>
      <h2>Loan Details Report</h2>
      <p class="subtitle">Loan ID: ${loan.LoanId} | ${loan.type?.LoanTypeDetails || ''}</p>

      <div class="info-grid">
        <div class="info-item"><span class="info-label">Employee Code:</span><span>${loan.EmpCode}</span></div>
        <div class="info-item"><span class="info-label">Status:</span><span>${loan.Status === 'A' ? 'Active' : loan.Status}</span></div>
        <div class="info-item"><span class="info-label">Account:</span><span>${loan.account?.AMDetails || ''}</span></div>
        <div class="info-item"><span class="info-label">Loan Date:</span><span>${formatDate(loan.LoanDate)}</span></div>
        <div class="info-item"><span class="info-label">Loan Amount:</span><span>${formatAmount(loanAmount)}</span></div>
        <div class="info-item"><span class="info-label">Effective Period:</span><span>${loan.EffectivePeriod}</span></div>
        <div class="info-item"><span class="info-label">Installment:</span><span>${formatAmount(Number(loan.Installment || 0))} x ${loan.NofInstallment}</span></div>
        <div class="info-item"><span class="info-label">Reference:</span><span>${loan.Reference || ''}</span></div>
      </div>

      ${loan.Remarks ? `<p style="font-size:13px;"><strong>Remarks:</strong> ${loan.Remarks}</p>` : ''}

      <h3 style="font-size:14px;margin-top:20px;">Payment History</h3>
      ${viewPayments.value.length ? `
      <table>
        <thead>
          <tr>
            <th style="text-align:center;width:40px;">#</th>
            <th>Payment Date</th>
            <th style="text-align:right;">Amount</th>
            <th>Entry By</th>
            <th>Entry Date</th>
          </tr>
        </thead>
        <tbody>${paymentRows}</tbody>
        <tfoot>
          <tr class="total-row paid-row">
            <td colspan="2" style="padding:6px 10px;border:1px solid #ddd;">Total Paid</td>
            <td style="padding:6px 10px;border:1px solid #ddd;text-align:right;">${formatAmount(viewTotalPayment.value)}</td>
            <td colspan="2" style="padding:6px 10px;border:1px solid #ddd;"></td>
          </tr>
          <tr class="total-row remaining-row">
            <td colspan="2" style="padding:6px 10px;border:1px solid #ddd;">Remaining</td>
            <td style="padding:6px 10px;border:1px solid #ddd;text-align:right;">${formatAmount(remaining)}</td>
            <td colspan="2" style="padding:6px 10px;border:1px solid #ddd;"></td>
          </tr>
        </tfoot>
      </table>` : '<p style="color:#999;font-size:13px;">No payments yet.</p>'}

      <p style="text-align:center;margin-top:30px;font-size:11px;color:#999;">Generated on ${dayjs().format('YYYY-MM-DD HH:mm')}</p>
    </body>
    </html>
  `;

  let iframe = document.getElementById('loan-print-frame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'loan-print-frame';
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

const viewLoanData = ref(null);
const viewPayments = ref([]);
const viewTotalPayment = ref(0);
const isLoadingDetails = ref(false);

const viewLoan = async (id) => {
  try {
    isLoadingDetails.value = true;
    viewLoanData.value = null;
    viewPayments.value = [];
    viewTotalPayment.value = 0;
    const res = await axios.get(
      `${apiBase}/settings/pay-loan-payment?loanId=${id}`,
      getToken(),
    );
    if (res.data?.success) {
      viewLoanData.value = res.data.data.loan || null;
      viewPayments.value = Array.isArray(res.data.data.payments) ? res.data.data.payments : [];
      viewTotalPayment.value = Number(res.data.data.total_payment || 0);
      isViewModalVisible.value = true;
    }
  } catch (error) {
    viewLoanData.value = null;
    viewPayments.value = [];
    viewTotalPayment.value = 0;
    console.log(error);
    showNotification("error", "Failed to fetch loan details.");
  } finally {
    isLoadingDetails.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return "";
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : date;
};

const makePayment = (loan) => {
  selectedLoan.value = loan;
  const loanAmount = Number(loan.LoanAmount || 0);
  const installments = Number(loan.NofInstallment || 1);
  const installmentAmount = Number((loanAmount / installments).toFixed(2));
  paymentFormData.value = {
    Payment: installmentAmount,
    PaymentDate: dayjs().format("YYYY-MM-DD"),
    EntryBy: "admin",
    EntryDate: dayjs().format("YYYY-MM-DD"),
  };
  isPaymentModalVisible.value = true;
};

const submitPayment = async () => {
  try {
    if (!selectedLoan.value?.LoanId) {
      showNotification("error", "Loan ID not found.");
      return;
    }

    const payload = {
      Payment: Number(paymentFormData.value.Payment || 0),
      PaymentDate: paymentFormData.value.PaymentDate,
      EntryBy: paymentFormData.value.EntryBy || "admin",
      EntryDate:
        paymentFormData.value.EntryDate ||
        paymentFormData.value.PaymentDate ||
        dayjs().format("YYYY-MM-DD"),
    };

    const res = await axios.post(
      `${apiBase}/settings/pay-loan-payment?loanId=${selectedLoan.value.LoanId}`,
      payload,
      getToken(),
    );

    if (res.data?.success) {
      showNotification("success", "Payment submitted successfully!");
      isPaymentModalVisible.value = false;
      paymentFormData.value = {
        Payment: "",
        PaymentDate: dayjs().format("YYYY-MM-DD"),
        EntryBy: "admin",
        EntryDate: dayjs().format("YYYY-MM-DD"),
      };
      getLoadData();
      await viewLoan(selectedLoan.value.LoanId);
    }
  } catch (error) {
    console.log(error);
    showNotification("error", "Failed to submit payment.");
  }
};

const createLoan = async () => {
  try {
    const loanAmount = Number(formData.value.LoanAmount);
    if (!Number.isFinite(loanAmount) || loanAmount < 100000 || loanAmount > 9900000) {
      showNotification("error", "Loan Amount must be between 100000 and 9900000.");
      return;
    }

    const payload = {
      ...formData.value,
      LoanAmount: loanAmount,
      PrepareDate: dayjs().format("YYYY-MM-DD"),
      AMCode: formData.value.EmpCode,
      EffectivePeriod: formData.value.EffectivePeriod
        ? dayjs(formData.value.EffectivePeriod).format("YYYYMM")
        : "",
    };

    const res = await axios.post(
      `${apiBase}/settings/pay-loan`,
      payload,
      getToken(),
    );

    if (res.data) {
      showNotification("success", "Loan created successfully!");
      isCreateModalVisible.value = false;
      getLoadData();
    }
  } catch (error) {
    console.log(error);
    showNotification("error", "Failed to create loan.");
  }
};

onMounted(() => {
  total.value = loanData.value.length;
  getLoadData();
  getLoadTypeData();
});
</script>

<style scoped>
.ant-input-number-input {
  @apply !text-right;
}
</style>

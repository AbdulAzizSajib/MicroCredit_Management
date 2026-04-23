<template>
  <MainLayout>
    <div class="flex flex-wrap justify-end items-center gap-3">
      <div class="flex items-center gap-2">
        <a-range-picker
          v-model:value="dateRange"
          value-format="YYYY-MM-DD"
          format="DD-MMM-YYYY"
          @change="handleDateChange"
        />
      </div>
      <div>
        <button
          class="bg-primary text-white px-4 py-2 rounded"
          @click="isCreateModalVisible = true"
        >
          {{ $t('loan.newLoanAdd') }}
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4" data-aos="fade-right">
      {{ $t('loan.loanList') }}
    </h1>

    <table class="w-full border border-collapse text-left" data-aos="fade-up" data-aos-delay="150">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">{{ $t('loan.loanId') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('loan.loanType') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('loan.employee') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('loan.employeeName') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('loan.loanAmount') }}</th>
          <th class="border border-white px-4 py-2 text-right">{{ $t('loan.installment') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('common.action') }}</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(loan, index) in loanData" :key="loan.id || loan.LoanId">
          <td class="px-4 border">{{ loan?.LoanId }}</td>
          <td class="px-4 border">{{ loan?.type?.LoanTypeDetails }}</td>
          <td class="px-4 border">{{ loan?.EmpCode }}</td>
          <td class="px-4 border">{{ loan?.AMDetails }}</td>
          <td class="px-4 border text-right">{{ loan?.LoanAmount }}</td>
          <td class="px-4 border text-right">{{ loan?.NofInstallment }}</td>
          <td class="px-4 border text-center">
            <div class="flex justify-center items-center gap-1">
              <a-tooltip :title="$t('loan.loanDetails')">
                <button type="button" class="action-btn action-btn-info" @click="viewLoan(loan?.LoanId)">
                  <i class="bi bi-eye"></i>
                </button>
              </a-tooltip>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <a-modal
      v-model:open="isCreateModalVisible"
      title=""
      @cancel="isCreateModalVisible = false"
      :footer="null"
      width="600px"
    >
      <div class="mb-6">
        <h2 class="text-lg font-bold text-gray-800">{{ $t('loan.payLoanForm') }}</h2>
      </div>

      <form @submit.prevent="createLoan">
        <div class="space-y-4">
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">{{ $t('loan.loanType') }} <span class="text-red-500">*</span></label>
            <div class="col-span-3">
              <a-select class="w-full" placeholder="Select Loan Type" v-model:value="formData.LoanType" :status="fieldErrors.LoanType ? 'error' : ''">
                <a-select-option v-for="type in loanTypeData" :key="type.LoanType" :value="type.LoanType">
                  {{ type.LoanTypeDetails }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">{{ $t('loan.employeeCode') }} <span class="text-red-500">*</span></label>
            <div class="col-span-3">
              <a-select
                show-search
                class="w-full"
                placeholder="Select Employee"
                v-model:value="formData.EmpCode"
                :filter-option="false"
                :status="fieldErrors.EmpCode ? 'error' : ''"
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
            <label class="text-sm font-medium text-gray-700">{{ $t('loan.loanDate') }} <span class="text-red-500">*</span></label>
            <div class="col-span-3">
              <a-date-picker class="w-full" placeholder="Date" v-model:value="formData.LoanDate" :status="fieldErrors.LoanDate ? 'error' : ''" />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">{{ $t('loan.effectivePeriod') }} <span class="text-red-500">*</span></label>
            <div class="col-span-3">
              <a-date-picker
                class="w-full"
                placeholder="Effective Period"
                picker="month"
                format="YYYYMM"
                value-format="YYYYMM"
                v-model:value="formData.EffectivePeriod"
                :status="fieldErrors.EffectivePeriod ? 'error' : ''"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">{{ $t('loan.loanAmount') }} <span class="text-red-500">*</span></label>
            <div class="col-span-3">
              <a-input-number
                class="w-full"
                placeholder="Loan Amount"
                v-model:value="formData.LoanAmount"
                :precision="2"
                :status="fieldErrors.LoanAmount ? 'error' : ''"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">{{ $t('loan.noOfInstallment') }} <span class="text-red-500">*</span></label>
            <div class="col-span-3">
              <a-input-number
                class="w-full"
                placeholder="No of Installment"
                v-model:value="formData.NofInstallment"
                :min="1"
                :precision="0"
                :status="fieldErrors.NofInstallment ? 'error' : ''"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">{{ $t('loan.installmentAmount') }}</label>
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
            <label class="text-sm font-medium text-gray-700">{{ $t('loan.interestRate') }} <span class="text-red-500">*</span></label>
            <div class="col-span-3">
              <a-input-number
                class="w-full"
                placeholder="Interest Rate (%)"
                v-model:value="formData.InterestRate"
                :min="0"
                :precision="2"
                :status="fieldErrors.InterestRate ? 'error' : ''"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">{{ $t('loan.interestAmount') }} <span class="text-red-500">*</span></label>
            <div class="col-span-3">
              <a-input-number
                class="w-full"
                placeholder="Interest Amount"
                v-model:value="formData.InterestAmount"
                :precision="2"
                :status="fieldErrors.InterestAmount ? 'error' : ''"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">{{ $t('loan.referenceNo') }}</label>
            <div class="col-span-3">
              <a-input class="w-full" placeholder="Reference No" v-model:value="formData.Reference" />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 items-start">
            <label class="text-sm font-medium text-gray-700 mt-2">{{ $t('common.remarks') }}</label>
            <div class="col-span-3">
              <a-textarea class="w-full" placeholder="Remarks" v-model:value="formData.Remarks" :rows="4" :status="fieldErrors.Remarks ? 'error' : ''" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-start mt-6">
          <button
            type="submit"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            {{ $t('common.submit') }}
          </button>
        </div>
      </form>
    </a-modal>

    <a-modal
      v-model:open="isViewModalVisible"
      :title="$t('loan.loanDetails')"
      @cancel="isViewModalVisible = false"
      :footer="null"
      width="650px"
    >
      <div v-if="isLoadingDetails" class="py-8 text-center text-gray-500">{{ $t('loan.loadingDetails') }}</div>

      <div v-else-if="viewLoanData">
        <div class="grid grid-cols-2 gap-x-6 gap-y-2 mb-5">
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.loanId') }}:</span>
            <span class="text-sm">{{ viewLoanData.LoanId }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('common.status') }}:</span>
            <span class="text-sm">{{ viewLoanData.Status === 'A' ? 'Active' : viewLoanData.Status }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.loanType') }}:</span>
            <span class="text-sm">{{ viewLoanData.type?.LoanTypeDetails }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.employee') }}:</span>
            <span class="text-sm">{{ viewLoanData.EmpCode }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.account') }}:</span>
            <span class="text-sm">{{ viewLoanData.account?.AMDetails }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.loanDate') }}:</span>
            <span class="text-sm">{{ formatDate(viewLoanData.LoanDate) }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.loanAmount') }}:</span>
            <span class="text-sm font-medium">{{ formatAmount(Number(viewLoanData.LoanAmount || 0)) }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.installment') }}:</span>
            <span class="text-sm">{{ formatAmount(Number(viewLoanData.Installment || 0)) }} x {{ viewLoanData.NofInstallment }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.effectivePeriod') }}:</span>
            <span class="text-sm">{{ formatPeriod(viewLoanData.EffectivePeriod) }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.referenceNo') }}:</span>
            <span class="text-sm">{{ viewLoanData.Reference }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.interestRate') }}:</span>
            <span class="text-sm">{{ viewLoanData.InterestRate }}%</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">{{ $t('loan.interestAmount') }}:</span>
            <span class="text-sm font-medium">{{ formatAmount(Number(viewLoanData.InterestAmount || 0)) }}</span>
          </div>
        </div>

        <div v-if="viewLoanData.Remarks" class="mb-5">
          <span class="font-semibold text-sm text-gray-600">{{ $t('common.remarks') }}:</span>
          <span class="text-sm ml-2">{{ viewLoanData.Remarks }}</span>
        </div>

        <div class="mb-2">
          <h3 class="text-sm font-bold text-gray-700 mb-2">{{ $t('loan.paymentHistory') }}</h3>
          <div class="overflow-x-auto" v-if="viewPayments.length">
            <table class="w-full border-collapse text-sm">
              <thead>
                <tr class="bg-gray-100 border-b border-gray-300">
                  <th class="px-3 py-2 text-left font-semibold text-gray-700">{{ $t('loan.paymentDate') }}</th>
                  <th class="px-3 py-2 text-right font-semibold text-gray-700">{{ $t('common.amount') }}</th>
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
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-gray-50 border-t-2 border-gray-300">
                  <td class="px-3 py-2 font-bold text-gray-700">{{ $t('loan.totalPaid') }}</td>
                  <td class="px-3 py-2 text-right font-bold text-green-600">{{ formatAmount(viewTotalPayment) }}</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="px-3 py-2 font-bold text-gray-700">{{ $t('loan.remaining') }}</td>
                  <td class="px-3 py-2 text-right font-bold text-red-500">{{ formatAmount(Number(viewLoanData.InterestAmount || 0) - viewTotalPayment) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div v-else class="text-sm text-gray-500">{{ $t('loan.noPayments') }}</div>
        </div>
      </div>

      <div v-else class="py-8 text-center text-gray-500">{{ $t('loan.noDetails') }}</div>
    </a-modal>

    <a-pagination
      class="mt-4"
      v-model:current="page"
      :page-size="per_page"
      :total="total"
      :show-size-changer="false"
      :show-total="(t) => $t('common.totalItems', { total: t })"
      @change="(pageNo) => { page = pageNo; }"
      v-if="total > per_page"
    />
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { getToken, showNotification } from "@/utilities/common";
import axios from "axios";
import { apiBase } from "@/config";
import dayjs from "dayjs";

const toYmd = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const now = new Date();
const dateRange = ref(["2024-07-01", toYmd(now)]);

const handleDateChange = () => {
  getLoadData();
};

const isCreateModalVisible = ref(false);
const isViewModalVisible = ref(false);

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
  Status: "Y",
  Remarks: "",
  GlCompany: "01",
  Active: "Y",
  PrepareBy: "admin",
  PrepareDate: "",
  EditBy: null,
  EditDate: null,
  InterestRate: null,
  InterestAmount: null,
});

const fieldErrors = ref({});

const requiredFields = {
  LoanType: "Loan Type",
  EmpCode: "Employee Code",
  LoanDate: "Date",
  EffectivePeriod: "Effective Period",
  LoanAmount: "Loan Amount",
  NofInstallment: "No of Installment",
  InterestRate: "Interest Rate",
  InterestAmount: "Interest Amount",
};

const validateForm = () => {
  const errors = {};
  for (const key in requiredFields) {
    const v = formData.value[key];
    if (v === null || v === undefined || v === "") {
      errors[key] = `${requiredFields[key]} is required`;
    }
  }
  fieldErrors.value = errors;
  return errors;
};

watch(
  formData,
  () => {
    if (Object.keys(fieldErrors.value).length === 0) return;
    const errors = {};
    for (const key in requiredFields) {
      const v = formData.value[key];
      if (v === null || v === undefined || v === "") {
        errors[key] = `${requiredFields[key]} is required`;
      }
    }
    fieldErrors.value = errors;
  },
  { deep: true }
);

watch(
  () => [formData.value.InterestAmount, formData.value.NofInstallment],
  ([interestAmount, nofInstallment]) => {
    const total = Number(interestAmount);
    const count = Number(nofInstallment);

    if (total > 0 && count > 0) {
      formData.value.Installment = Number((total / count).toFixed(2));
      return;
    }

    formData.value.Installment = null;
  },
);

const isInterestUpdating = ref(false);

watch(
  () => [formData.value.LoanAmount, formData.value.InterestRate],
  ([loanAmount, interestRate]) => {
    if (isInterestUpdating.value) return;
    const amount = Number(loanAmount);
    const rate = Number(interestRate);

    isInterestUpdating.value = true;
    if (amount > 0 && rate > 0) {
      formData.value.InterestAmount = Number((amount + (amount * rate) / 100).toFixed(2));
    } else {
      formData.value.InterestAmount = null;
    }
    nextTick(() => { isInterestUpdating.value = false; });
  },
);

watch(
  () => formData.value.InterestAmount,
  (interestAmount) => {
    if (isInterestUpdating.value) return;
    const amount = Number(formData.value.LoanAmount);
    const interest = Number(interestAmount);

    isInterestUpdating.value = true;
    if (amount > 0 && interest > 0) {
      formData.value.InterestRate = Number((((interest - amount) / amount) * 100).toFixed(2));
    } else {
      formData.value.InterestRate = null;
    }
    nextTick(() => { isInterestUpdating.value = false; });
  },
);

const loadDataloading = ref(false);
const loanData = ref([]);

const getLoadData = async () => {
  try {
    loadDataloading.value = true;
    const params = new URLSearchParams({ search: "", per_page: 10 });
    if (dateRange.value?.[0]) params.append("from_date", dateRange.value[0]);
    if (dateRange.value?.[1]) params.append("to_date", dateRange.value[1]);
    const res = await axios.get(
      `${apiBase}/settings/pay-loan?${params.toString()}`,
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

const viewLoanData = ref(null);
const viewPayments = ref([]);
const viewTotalPayment = ref(0);
const isLoadingDetails = ref(false);

const viewLoan = (id) => {
  const loan = loanData.value.find((l) => l.LoanId === id);
  if (!loan) {
    showNotification("error", "Loan not found.");
    return;
  }
  viewLoanData.value = { ...loan, account: { AMDetails: loan.AMDetails } };
  viewPayments.value = Array.isArray(loan.payments) ? loan.payments : [];
  viewTotalPayment.value = viewPayments.value.reduce(
    (sum, p) => sum + Number(p.Payment || 0),
    0,
  );
  isViewModalVisible.value = true;
};

const formatPeriod = (period) => {
  if (!period) return "";
  const s = String(period);
  if (s.length !== 6) return s;
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[parseInt(s.slice(4, 6), 10) - 1] || ""} ${s.slice(0, 4)}`;
};

const formatDate = (date) => {
  if (!date) return "";
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : date;
};

const createLoan = async () => {
  try {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      showNotification("error", Object.values(errors)[0]);
      return;
    }
    const loanAmount = Number(formData.value.LoanAmount);
    if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
      showNotification("error", "Please enter a valid Loan Amount.");
      return;
    }

    const payload = {
      ...formData.value,
      LoanAmount: loanAmount,
      Remarks: formData.value.Remarks || "",
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
      fieldErrors.value = {};
      formData.value = {
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
        Status: "Y",
        Remarks: "",
        GlCompany: "01",
        Active: "Y",
        PrepareBy: "admin",
        PrepareDate: "",
        EditBy: null,
        EditDate: null,
        InterestRate: null,
        InterestAmount: null,
      };
      getLoadData();
    }
  } catch (error) {
    console.log(error);
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create loan.";
    showNotification("error", msg);
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

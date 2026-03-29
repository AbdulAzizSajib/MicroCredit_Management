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
    >
      <div v-if="isLoadingDetails" class="py-8 text-center text-gray-500">Loading details...</div>

      <div class="space-y-4" v-else-if="viewLoadDetails.length">
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">Loan ID:</span>
          <span>{{ viewLoadDetails[0]?.LoanID }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">Employee:</span>
          <span>{{ viewLoadDetails[0]?.EmpCode }}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100 border-b border-gray-300">
                <th class="px-3 py-2 text-left font-semibold text-gray-700">Payment Date</th>
                <th class="px-3 py-2 text-right font-semibold text-gray-700">Payment</th>
                <th class="px-3 py-2 text-left font-semibold text-gray-700">Entry By</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in viewLoadDetails"
                :key="`${item.LoanID}-${item.PaymentDate}-${index}`"
                class="border-b border-gray-200"
              >
                <td class="px-3 py-2">{{ formatDate(item.PaymentDate) }}</td>
                <td class="px-3 py-2 text-right">{{ formatAmount(Number(item.Payment || 0)) }}</td>
                <td class="px-3 py-2">{{ item.EntryBy }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="py-8 text-center text-gray-500">No payment details found.</div>
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

const viewLoadDetails = ref([]);
const isLoadingDetails = ref(false);

const viewLoan = async (id) => {
  try {
    isLoadingDetails.value = true;
    viewLoadDetails.value = [];
    const res = await axios.get(
      `${apiBase}/settings/pay-loan-payment?loanId=${id}`,
      getToken(),
    );
    if (res.data) {
      viewLoadDetails.value = Array.isArray(res.data.data) ? res.data.data : [];
      isViewModalVisible.value = true;
    }
  } catch (error) {
    viewLoadDetails.value = [];
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
  paymentFormData.value = {
    Payment: "",
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

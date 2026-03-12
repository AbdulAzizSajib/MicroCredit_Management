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

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 border-b-2 border-gray-300">
            <th
              class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              LOAN ID
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              LOAN TYPE
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              EMPLOYEE
            </th>
            <th
              class="px-6 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              LOAN AMOUNT
            </th>
            <th
              class="px-6 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              INSTALLMENT
            </th>
            <th
              class="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(loan, index) in loanData"
            :key="loan.id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
            class="border-b border-gray-200 hover:bg-blue-50 transition-colors"
          >
            <td class="px-6 py-4 text-sm text-gray-900">{{ loan.id }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ loan.loanType }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ loan.employee }}</td>
            <td class="px-6 py-4 text-sm text-gray-900 text-right">
              {{ formatAmount(loan.loanAmount) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 text-right">
              {{ formatAmount(loan.installment) }}
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center gap-2">
                <button
                  @click="viewLoan(loan)"
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

    <!-- Create Modal -->
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
          <!-- Loan Type -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">Loan Type</label>
            <div class="col-span-3">
              <a-select
                class="w-full"
                placeholder="Select Loan Type"
                v-model:value="formData.loanType"
              >
                <a-select-option value="Provident Fund"
                  >Provident Fund</a-select-option
                >
                <a-select-option value="Personal Loan"
                  >Personal Loan</a-select-option
                >
                <a-select-option value="Home Loan">Home Loan</a-select-option>
              </a-select>
            </div>
          </div>

          <!-- Employee Code -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700"
              >Employee Code</label
            >
            <div class="col-span-3">
              <a-input
                class="w-full"
                placeholder="Employee Code"
                v-model:value="formData.employeeCode"
              />
            </div>
          </div>

          <!-- Date -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">Date</label>
            <div class="col-span-3">
              <a-date-picker
                class="w-full"
                placeholder="Date"
                v-model:value="formData.date"
              />
            </div>
          </div>

          <!-- Effective Period -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700"
              >Effective Period</label
            >
            <div class="col-span-3">
              <a-input
                class="w-full"
                placeholder="Effective Period"
                v-model:value="formData.effectivePeriod"
              />
            </div>
          </div>

          <!-- Loan Amount -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">Loan Amount</label>
            <div class="col-span-3">
              <a-input
                class="w-full"
                placeholder="Loan Amount"
                v-model:value="formData.loanAmount"
                type="number"
              />
            </div>
          </div>

          <!-- No of Installment -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700"
              >No of Installment</label
            >
            <div class="col-span-3">
              <a-input
                class="w-full"
                placeholder="Installment"
                v-model:value="formData.noOfInstallment"
                type="number"
              />
            </div>
          </div>

          <!-- Installment Amount -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700"
              >Installment Amount</label
            >
            <div class="col-span-3">
              <a-input
                class="w-full"
                placeholder="Installment Amount"
                v-model:value="formData.installmentAmount"
                type="number"
              />
            </div>
          </div>

          <!-- Reference No -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700"
              >Reference No</label
            >
            <div class="col-span-3">
              <a-input
                class="w-full"
                placeholder="Reference No"
                v-model:value="formData.referenceNo"
              />
            </div>
          </div>

          <!-- Remarks -->
          <div class="grid grid-cols-4 gap-4 items-start">
            <label class="text-sm font-medium text-gray-700 mt-2"
              >Remarks</label
            >
            <div class="col-span-3">
              <a-textarea
                class="w-full"
                placeholder="Remarks"
                v-model:value="formData.remarks"
                :rows="4"
              />
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

    <!-- View Modal -->
    <a-modal
      v-model:open="isViewModalVisible"
      title="Loan Details"
      @cancel="isViewModalVisible = false"
      :footer="null"
    >
      <div class="space-y-3" v-if="selectedLoan">
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">Loan ID:</span>
          <span>{{ selectedLoan.id }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">Employee:</span>
          <span>{{ selectedLoan.employee }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">Loan Type:</span>
          <span>{{ selectedLoan.loanType }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">Loan Amount:</span>
          <span>{{ formatAmount(selectedLoan.loanAmount) }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="font-semibold">Installment:</span>
          <span>{{ formatAmount(selectedLoan.installment) }}</span>
        </div>
      </div>
    </a-modal>

    <!-- Payment Modal -->
    <a-modal
      v-model:open="isPaymentModalVisible"
      title="Payment"
      @cancel="isPaymentModalVisible = false"
      :footer="null"
      width="500px"
    >
      <form @submit.prevent="submitPayment" v-if="selectedLoan">
        <div class="space-y-5 mb-6">
          <!-- EmpCode -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >EmpCode</label
            >
            <a-input
              class="w-full bg-gray-100"
              :value="getEmployeeCode(selectedLoan.employee)"
              disabled
            />
          </div>

          <!-- Loan Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Loan Amount</label
            >
            <a-input
              class="w-full bg-gray-100"
              :value="selectedLoan.loanAmount"
              disabled
            />
          </div>

          <!-- Balance -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Balance</label
            >
            <a-input class="w-full bg-gray-100" value="0" disabled />
          </div>

          <!-- Payment -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Payment</label
            >
            <a-input
              class="w-full"
              placeholder="Enter Payment Amount"
              v-model:value="paymentAmount"
              type="number"
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
      :show-total="(total) => `Total ${total} items`"
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
import { onMounted, ref } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { showNotification } from "@/utilities/common";

const isCreateModalVisible = ref(false);
const isViewModalVisible = ref(false);
const isPaymentModalVisible = ref(false);
const selectedLoan = ref(null);
const paymentAmount = ref("");

const page = ref(1);
const per_page = ref(10);
const total = ref(10);

const formData = ref({
  loanType: "",
  employeeCode: "",
  date: null,
  effectivePeriod: "",
  loanAmount: "",
  noOfInstallment: "",
  installmentAmount: "",
  referenceNo: "",
  remarks: "",
});

// Demo loan data
const loanData = ref([
  {
    id: 744,
    loanType: "Provident Fund",
    employee: "24922 - Md. Rayhan",
    loanAmount: 9000.0,
    installment: 9000.0,
  },
  {
    id: 743,
    loanType: "Provident Fund",
    employee: "16562 - Rashida Yasmin",
    loanAmount: 147000.0,
    installment: 4000.0,
  },
  {
    id: 742,
    loanType: "Provident Fund",
    employee: "10690 - Md. Abdul Motaleb",
    loanAmount: 131000.0,
    installment: 8000.0,
  },
  {
    id: 741,
    loanType: "Provident Fund",
    employee: "13775 - Md. Tazul Islam",
    loanAmount: 134500.0,
    installment: 11200.0,
  },
  {
    id: 740,
    loanType: "Provident Fund",
    employee: "22516 - Jewel Rana",
    loanAmount: 76000.0,
    installment: 5000.0,
  },
  {
    id: 739,
    loanType: "Provident Fund",
    employee: "03185 - Md. Jakir Hossain Howlader",
    loanAmount: 281000.0,
    installment: 23000.0,
  },
  {
    id: 738,
    loanType: "Provident Fund",
    employee: "06597 - Md. Al-Amin",
    loanAmount: 229000.0,
    installment: 1000.0,
  },
  {
    id: 737,
    loanType: "Provident Fund",
    employee: "04049 - Md. Saiful Islam",
    loanAmount: 321500.0,
    installment: 2000.0,
  },
  {
    id: 736,
    loanType: "Provident Fund",
    employee: "01826 - Md. Asaduzzaman",
    loanAmount: 426000.0,
    installment: 6000.0,
  },
  {
    id: 735,
    loanType: "Provident Fund",
    employee: "04050 - Md. Jamal Uddin Prodhan",
    loanAmount: 293600.0,
    installment: 2000.0,
  },
]);

// Format amount with comma separators
const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Extract employee code from employee string
const getEmployeeCode = (employeeString) => {
  if (!employeeString) return "";
  // Extract the code before the dash (e.g., "24922 - Md. Rayhan" -> "24922")
  return employeeString.split(" - ")[0].trim();
};

// View loan details
const viewLoan = (loan) => {
  selectedLoan.value = loan;
  isViewModalVisible.value = true;
};

// Make payment
const makePayment = (loan) => {
  selectedLoan.value = loan;
  paymentAmount.value = loan.installment;
  isPaymentModalVisible.value = true;
};

// Submit payment
const submitPayment = () => {
  showNotification("success", "Payment submitted successfully!");
  isPaymentModalVisible.value = false;
  paymentAmount.value = 0;
};

// Create loan
const createLoan = () => {
  const newLoan = {
    id: loanData.value.length + 1,
    loanType: formData.value.loanType,
    employee: formData.value.employeeCode,
    loanAmount: parseFloat(formData.value.loanAmount) || 0,
    installment: parseFloat(formData.value.installmentAmount) || 0,
  };

  loanData.value.unshift(newLoan);
  total.value = loanData.value.length;

  showNotification("success", "Loan added successfully!");
  isCreateModalVisible.value = false;

  formData.value = {
    loanType: "",
    employeeCode: "",
    date: null,
    effectivePeriod: "",
    loanAmount: "",
    noOfInstallment: "",
    installmentAmount: "",
    referenceNo: "",
    remarks: "",
  };
};

onMounted(() => {
  total.value = loanData.value.length;
});
</script>

<style scoped>
.ant-input-number-input {
  @apply !text-right;
}
</style>

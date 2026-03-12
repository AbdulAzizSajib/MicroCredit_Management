<template>
  <PayrollLayout>


    <h1 class="text-2xl font-bold text-primary mb-4"> Report Head (0)</h1>



    <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Hellenic Sourcing Hong Kong Ltd.</h1>
        <h2 class="text-lg font-semibold text-gray-600 mt-2">Payslip For The Month of September 2025</h2>
      </div>

      <!-- Employee Information -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="space-y-2">
          <div class="flex border border-gray-400">
            <div class="w-1/3 bg-gray-100 px-3 py-2 font-medium border-r border-gray-400">Employee Name</div>
            <div class="w-2/3 px-3 py-2"></div>
          </div>
          <div class="flex border border-gray-400">
            <div class="w-1/3 bg-gray-100 px-3 py-2 font-medium border-r border-gray-400">Designation</div>
            <div class="w-2/3 px-3 py-2"></div>
          </div>
          <div class="flex border border-gray-400">
            <div class="w-1/3 bg-gray-100 px-3 py-2 font-medium border-r border-gray-400">EmployeeID</div>
            <div class="w-2/3 px-3 py-2"></div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex border border-gray-400">
            <div class="w-1/3 bg-gray-100 px-3 py-2 font-medium border-r border-gray-400">Bank Account No.</div>
            <div class="w-2/3 px-3 py-2"></div>
          </div>
          <div class="flex border border-gray-400">
            <div class="w-1/3 bg-gray-100 px-3 py-2 font-medium border-r border-gray-400">Bank Name</div>
            <div class="w-2/3 px-3 py-2"></div>
          </div>
          <div class="flex border border-gray-400">
            <div class="w-1/3 bg-gray-100 px-3 py-2 font-medium border-r border-gray-400">Branch Name</div>
            <div class="w-2/3 px-3 py-2"></div>
          </div>
        </div>
      </div>

      <!-- Earnings and Deductions Table -->
      <div class="grid grid-cols-2 gap-0 mb-6 border border-gray-400">
        <!-- Earnings Header -->
        <div class="bg-gray-200 px-4 py-3 font-bold text-center border-r border-gray-400">
          Earnings
        </div>
        <!-- Deductions Header -->
        <div class="bg-gray-200 px-4 py-3 font-bold text-center">
          Deduction
        </div>

        <!-- Earnings Subheader -->
        <div class="grid grid-cols-2 border-r border-gray-400">
          <div class="bg-gray-100 px-4 py-2 font-semibold border-r border-gray-400">Particular</div>
          <div class="bg-gray-100 px-4 py-2 font-semibold text-center">Amount In BDT</div>
        </div>
        <!-- Deductions Subheader -->
        <div class="grid grid-cols-2">
          <div class="bg-gray-100 px-4 py-2 font-semibold border-r border-gray-400">Particular</div>
          <div class="bg-gray-100 px-4 py-2 font-semibold text-center">Amount In BDT</div>
        </div>

        <!-- Earnings Rows -->
        <div class="border-r border-gray-400">
          <div class="grid grid-cols-2 border-t border-gray-400">
            <div class="px-4 py-2 border-r border-gray-400">Basic Salary</div>
            <div class="px-4 py-2 text-center">-</div>
          </div>
          <div class="grid grid-cols-2 border-t border-gray-400">
            <div class="px-4 py-2 border-r border-gray-400">House Rent</div>
            <div class="px-4 py-2 text-center">-</div>
          </div>
          <div class="grid grid-cols-2 border-t border-gray-400">
            <div class="px-4 py-2 border-r border-gray-400">Medical Allowance</div>
            <div class="px-4 py-2 text-center">-</div>
          </div>
          <div class="grid grid-cols-2 border-t border-gray-400">
            <div class="px-4 py-2 border-r border-gray-400">Conveyance</div>
            <div class="px-4 py-2 text-center">-</div>
          </div>
          <div class="grid grid-cols-2 border-t border-gray-400 bg-gray-50">
            <div class="px-4 py-2 border-r border-gray-400 font-semibold">Gross Salary</div>
            <div class="px-4 py-2 text-center font-semibold">-</div>
          </div>
        </div>

        <!-- Deductions Rows -->
        <div>
          <div class="grid grid-cols-2 border-t border-gray-400">
            <div class="px-4 py-2 border-r border-gray-400">Income Tax</div>
            <div class="px-4 py-2 text-center">-</div>
          </div>
          <div class="grid grid-cols-2 border-t border-gray-400">
            <div class="px-4 py-2 border-r border-gray-400">Employee PF</div>
            <div class="px-4 py-2 text-center">-</div>
          </div>
          <div class="grid grid-cols-2 border-t border-gray-400">
            <div class="px-4 py-2 border-r border-gray-400">Loan/Advance</div>
            <div class="px-4 py-2 text-center">-</div>
          </div>
          <div class="grid grid-cols-2 border-t border-gray-400">
            <div class="px-4 py-2 border-r border-gray-400">Others</div>
            <div class="px-4 py-2 text-center">-</div>
          </div>
          <div class="grid grid-cols-2 border-t border-gray-400 bg-gray-50">
            <div class="px-4 py-2 border-r border-gray-400 font-semibold">Total Deduction</div>
            <div class="px-4 py-2 text-center font-semibold">-</div>
          </div>
        </div>
      </div>

      <!-- Net Amount -->
      <div class="mb-6">
        <div class="text-lg font-semibold text-gray-800">Net Amount : 0</div>
        <div class="text-sm text-gray-600 mt-1">In Words : Zero taka only.</div>
      </div>

      <!-- Footer Signatures -->
      <div class="grid grid-cols-3 gap-8 mt-12 pt-8">
        <div class="text-center">
          <div class="border-t border-gray-400 pt-2 font-medium">Received By</div>
        </div>
        <div class="text-center">
          <div class="border-t border-gray-400 pt-2 font-medium">Accounts Department</div>
        </div>
        <div class="text-center">
          <div class="border-t border-gray-400 pt-2 font-medium">Authorized By</div>
        </div>
      </div>
    </div>

  </PayrollLayout>
</template>

<script setup>
import { ref } from 'vue';
import PayrollLayout from '@/components/layouts/PayrollLayout.vue';
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: 'overview' });
};
const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);

</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>
<template>
  <PayrollLayout>
 
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input placeholder="Search here..." />
      </div>
      <div class="mb-4">
        <button class="bg-primary text-white px-4 py-2 rounded" @click="isCreateModalVisible = true">
          Add Salary Adjustment
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4"> Salary Sheet & Report (0)</h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Employee Code</th>
          <th class="border border-white px-4 py-2">Name</th>
          <th class="border border-white px-4 py-2">Designation</th>
          <th class="border border-white px-4 py-2">Department</th>
          <th class="border border-white px-4 py-2">Income Tax</th>
          <th class="border border-white px-4 py-2">CPF</th>
          <th class="border border-white px-4 py-2">Loan / Advance</th>
          <th class="border border-white px-4 py-2">Others</th>
          <th class="border border-white px-4 py-2">Total Deduction</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr>
          <td class="px-4 border">EMP001</td>
          <td class="px-4 border">John Doe</td>
          <td class="px-4 border">Software Engineer</td>
          <td class="px-4 border">IT Department</td>
          <td class="px-4 border w-32 text-end">500</td>
          <td class="px-4 border w-32 text-end">200</td>
          <td class="px-4 border w-32 text-end">100</td>
          <td class="px-4 border w-32 text-end">50</td>
          <td class="px-4 border w-32 text-end">850</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button type="button" class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                @click="isEditModalVisible = true"><i class="bi bi-pencil"></i></button>
              <a-popconfirm title="Are you sure?" ok-text="Yes" cancel-text="No">
                <button type="button" class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark"><i
                    class="bi bi-trash3"></i></button>
              </a-popconfirm>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create Modal -->
    <a-modal v-model:open="isCreateModalVisible" title="Add Salary Adjustment" @cancel="isCreateModalVisible = false"
      width="1000px">
      <a-form>
        <div class="grid grid-cols-3 gap-x-4">
          <!-- Employee Code -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Employee Code</label>
            <a-input class="w-full" placeholder="Employee Code" />
          </div>

          <!-- Employee Name -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Employee Name</label>
            <a-input class="w-full" placeholder="Employee Name" />
          </div>

          <!-- Designation -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Designation</label>
            <a-input class="w-full" placeholder="Designation" />
          </div>

          <!-- Department -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Department</label>
            <a-input class="w-full" placeholder="Department" />
          </div>

          <!-- Salary Date -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Salary Date</label>
            <a-date-picker class="w-full" placeholder="Select Salary Date" />
          </div>

          <!-- Basic Salary -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Basic Salary</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- House Rent -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">House Rent</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Medical Allowance -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Medical Allowance</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Conveyance -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Conveyance</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Income Tax -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Income Tax</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- CPF -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">CPF</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Loan Advance -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Loan Advance</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Others -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Others</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Gross Salary (Read-only, calculated field) -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Gross Salary</label>
            <a-input-number class="w-full" placeholder="0" :min="0" disabled />
          </div>

          <!-- Total Deduction (Read-only, calculated field) -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Total Deduction</label>
            <a-input-number class="w-full" placeholder="0" :min="0" disabled />
          </div>
        </div>
      </a-form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal v-model:open="isEditModalVisible" title="Edit Salary Adjustment" @cancel="isEditModalVisible = false"
      width="1000px">
      <a-form>
        <div class="grid grid-cols-3 gap-x-4">
          <!-- Employee Code -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Employee Code</label>
            <a-input class="w-full" placeholder="Employee Code" />
          </div>

          <!-- Employee Name -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Employee Name</label>
            <a-input class="w-full" placeholder="Employee Name" />
          </div>

          <!-- Designation -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Designation</label>
            <a-input class="w-full" placeholder="Designation" />
          </div>

          <!-- Department -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Department</label>
            <a-input class="w-full" placeholder="Department" />
          </div>

          <!-- Salary Date -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Salary Date</label>
            <a-date-picker class="w-full" placeholder="Select Salary Date" />
          </div>

          <!-- Basic Salary -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Basic Salary</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- House Rent -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">House Rent</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Medical Allowance -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Medical Allowance</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Conveyance -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Conveyance</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Income Tax -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Income Tax</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- CPF -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">CPF</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Loan Advance -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Loan Advance</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Others -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Others</label>
            <a-input-number class="w-full" placeholder="0" :min="0" />
          </div>

          <!-- Gross Salary (Read-only, calculated field) -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Gross Salary</label>
            <a-input-number class="w-full" placeholder="0" :min="0" disabled />
          </div>

          <!-- Total Deduction (Read-only, calculated field) -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Total Deduction</label>
            <a-input-number class="w-full" placeholder="0" :min="0" disabled />
          </div>
        </div>
      </a-form>
    </a-modal>

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
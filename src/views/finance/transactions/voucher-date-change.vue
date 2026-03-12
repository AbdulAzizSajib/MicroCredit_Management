<template>
  <mainLayout>
    <div class="max-w-lg mx-auto p-6 bg-white border rounded-lg shadow-md custom-form">
      <a-form :model="formState" :rules="formRules" @submit="handleSubmit">
        <!-- Voucher No -->
        <a-form-item label="Voucher No" name="voucherNo"
          :rules="[{ required: true, message: 'Please input your voucher number!' }]">
          <a-input placeholder="Enter Voucher No" class="rounded-md border-gray-300 text-sm" />
        </a-form-item>

        <!-- New Date -->
        <a-form-item label="New Date" name="newDate"
          :rules="[{ required: true, message: 'Please select a new date!' }]">
          <a-date-picker format="DD/MM/YYYY" placeholder="Select New Date"
            class="rounded-md border-gray-300 text-sm w-full" />
        </a-form-item>

        <!-- Old Date -->
        <a-form-item label="Old Date" name="oldDate"
          :rules="[{ required: true, message: 'Please input the old date!' }]">
          <a-input placeholder="Enter Old Date" class="rounded-md border-gray-300 text-sm" />
        </a-form-item>

        <!-- Amount -->
        <a-form-item label="Amount" name="amount" :rules="[{ required: true, message: 'Please input the amount!' }]">
          <a-input placeholder="Enter Amount" class="rounded-md border-gray-300 text-sm" />
        </a-form-item>

        <!-- Action Buttons -->
        <div class="flex justify-end mt-4">
          <a-button type="primary" html-type="submit" class="w-24 py-2 text-sm rounded-md">
            Save
          </a-button>

        </div>
      </a-form>
    </div>


  </mainLayout>
</template>

<script setup>
import { ref } from 'vue';
import mainLayout from '@/components/layouts/mainLayout.vue';
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
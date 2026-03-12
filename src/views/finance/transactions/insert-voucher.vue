<template>
  <MainLayout>
    <!-- title -->
    <h1 class="text-2xl font-bold text-primary mb-4">Insert Voucher</h1>

    <div class="">
      <a-form>
        <!-- form top -->
        <div class="p-4 shadow rounded bg-gray-100">
          <div class="grid md:grid-cols-12 gap-4">
            <div class="col-span-2">
              <!-- Date and Voucher Type -->
              <div class="flex flex-col">
                <label for="date">Date</label>
                <a-date-picker format="DD/MM/YYYY" class="w-full" />
              </div>
            </div>
            <!--type -->
            <div class="col-span-2">
              <div class="flex flex-col">
                <label for="voucher-type">Voucher Type</label>
                <a-select class="w-full">
                  <a-select-option value="type1">Type 1</a-select-option>
                  <a-select-option value="type2">Type 2</a-select-option>
                </a-select>
              </div>
            </div>
            <!--  -->
            <div class="col-span-2">
              <div class="text-gray-100">.</div>
              <a-input disabled />
            </div>
            <!-- category -->
            <div class="col-span-2">
              <div class="flex flex-col">
                <label for="voucher-type">Category</label>
                <a-select class="w-full">
                  <a-select-option value="type1">Category 1</a-select-option>
                  <a-select-option value="type2">Category 2</a-select-option>
                </a-select>
              </div>
            </div>
            <!-- voucher number -->
            <div class="col-span-2">
              <div class="flex flex-col">
                <label for="voucher-number">Voucher Number</label>
                <a-input class="w-full" />
              </div>
            </div>
            <!-- sub ledger -->
            <div class="col-span-2">
              <div class="flex flex-col">
                <label for="sub-ledger">Sub Ledger</label>
                <a-input class="w-full" />
              </div>
            </div>
          </div>
        </div>

        <!-- account code  -->
        <div class="grid grid-cols-3 mt-4 gap-4">
          <div class="col-span-1">
            <div class="flex flex-col">
              <label for="account-code">Account Code</label>
              <a-input class="w-full" />
            </div>
          </div>
          <div class="col-span-2">
            <div class="flex flex-col">
              <div class="text-white">.</div>
              <a-input disabled class="w-full" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <!--Sub-Ledger -->
          <div class="flex flex-col space-y-2">
            <label for="sub-ledger">Sub-Ledger</label>
            <a-input class="w-full" />
          </div>
          <!-- name -->
          <div class="flex flex-col space-y-2">
            <label for="name">Name</label>
            <a-input class="w-full" />
          </div>

          <!--Sub-Ledger -->
          <div class="flex flex-col space-y-2">
            <label for="sub-ledger">Sub-Ledger</label>
            <a-input class="w-full" />
          </div>

          <!-- sub ledger disabled -->
          <div class="flex flex-col space-y-2">
            <div class="text-white">.</div>
            <a-input disabled class="w-full" />
          </div>

          <!-- Cheque No and Name -->
          <div class="flex flex-col space-y-2">
            <label for="cheque-no">Cheque No</label>
            <a-input class="w-full" />
          </div>
          <div class="flex flex-col space-y-2">
            <label for="cheque-name">Cheque Name</label>
            <a-input class="w-full" />
          </div>

          <!-- cheque number disabled -->
          <div class="flex flex-col space-y-2">
            <div class="text-white">.</div>
            <a-input disabled class="w-full" />
          </div>
          <!-- Narration and Vendor ID -->
          <div class="flex gap-x-2 items-center space-y-2">
            <div class="w-full">
              <label class="block" for="narration">Narration</label>
              <a-input class="w-full" />
            </div>
            <div class="w-32">
              <div class="mt-4">
                <a-checkbox checked>Lock</a-checkbox>
              </div>
            </div>
          </div>

          <!-- vendor id  -->
          <div class="flex flex-col space-y-2">
            <label for="vendor-id">Vendor ID</label>
            <a-input class="w-full" />
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-white">.</label>
            <a-input disabled class="w-full" />
          </div>

          <!-- Bill No, Bill Date, Debit, Credit -->
          <div class="flex flex-col space-y-2">
            <label for="bill-no">Bill No</label>
            <a-input class="w-full" />
          </div>

          <div class="flex flex-col space-y-2">
            <label for="bill-date">Bill Date</label>
            <a-date-picker format="DD/MM/YYYY" class="w-full" />
          </div>

          <div class="flex flex-col space-y-2">
            <label for="debit">Debit</label>
            <a-input-number class="w-full" />
          </div>

          <div class="flex flex-col space-y-2">
            <label for="credit">Credit</label>
            <a-input-number class="w-full" />
          </div>

          <!-- Deposit Category and VAT Cost -->
          <div class="flex flex-col space-y-2">
            <label for="deposit-categ">Deposit Category</label>
            <a-select value="category1" class="w-full">
              <a-select-option value="category1">Category 1</a-select-option>
              <a-select-option value="category2">Category 2</a-select-option>
            </a-select>
          </div>

          <div class="flex gap-x-2 space-y-2">
            <div class="w-full space-y-2">
              <label for="vat-cost">VAT Cost</label>
              <a-select value="no" class="w-full">
                <a-select-option value="yes">Yes</a-select-option>
                <a-select-option value="no">No</a-select-option>
              </a-select>
            </div>
            <div class="mt-6 w-32">
              <div class="mt-8">
                <a-checkbox>Edit</a-checkbox>
              </div>
            </div>
          </div>

          <!-- Ratio -->
          <div class="flex flex-col space-y-2">
            <label for="ratio">Ratio</label>
            <a-select value="ratio1" class="w-full">
              <a-select-option value="ratio1">Ratio 1</a-select-option>
              <a-select-option value="ratio2">Ratio 2</a-select-option>
            </a-select>
          </div>
          <!-- Bank Tran Date and Lock Checkbox -->
          <div class="flex flex-col space-y-2">
            <label for="bank-tran-date">Bank Tran. Date</label>
            <a-date-picker format="DD/MM/YYYY" class="w-full" />
          </div>
        </div>
      </a-form>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import router from "@/router";
import { ref } from "vue";

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

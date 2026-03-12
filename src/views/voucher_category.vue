<template>
  <MainLayout>
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input placeholder="Search here..." />
      </div>
      <div class="mb-4">
        <button
          class="bg-primary text-white px-4 py-2 rounded"
          @click="isCreateModalVisible = true"
        >
          Add New Voucher
        </button>
      </div>
    </div>
    <!-- title -->
    <h1 class="text-2xl font-bold text-primary mb-4">Voucher Category (0)</h1>

    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Voucher Code</th>
          <th class="border border-white px-4 py-2">Description</th>
          <th class="border border-white px-4 py-2">Account Code</th>
          <th class="border border-white px-4 py-2">Location</th>
          <th class="border border-white px-4 py-2">Cheque Format</th>
          <th class="border border-white px-4 py-2">Category</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr>
          <td class="px-4 border">BPV</td>
          <td class="px-4 border">Bills Payable</td>
          <td class="px-4 border">12-05-00-00-01-00-00-00</td>
          <td class="px-4 border">Dhaka</td>
          <td class="px-4 border">BRV</td>
          <td class="px-4 border">BILLS PAYABLE</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                @click="isEditModalVisible = true"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <a-popconfirm
                title="Are you sure?"
                ok-text="Yes"
                cancel-text="No"
              >
                <button
                  type="button"
                  class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark"
                >
                  <i class="bi bi-trash3"></i>
                </button>
              </a-popconfirm>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Create Modal for Adding New Voucher -->
    <a-modal
      v-model:open="isCreateModalVisible"
      width="1000px"
      title="Add New Voucher"
      @cancel="isCreateModalVisible = false"
    >
      <a-form :form="form" layout="vertical">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-bold mb-1">Company Name</label>
            <a-select class="w-full">
              <a-select-option value="company1">Company 1</a-select-option>
              <a-select-option value="company2">Company 2</a-select-option>
              <a-select-option value="company3">Company 3</a-select-option>
            </a-select>
          </div>
          <div>
            <label for="voucherCode" class="font-semibold mb-1"
              >Voucher Code</label
            >
            <a-input id="voucherCode" placeholder="Enter Voucher Code" />
          </div>
          <div>
            <label for="description" class="font-semibold mb-1"
              >Description</label
            >
            <a-input id="description" placeholder="Enter Description" />
          </div>
          <div>
            <label class="block font-bold mb-1">Multiple Code</label>
            <a-select class="w-full">
              <a-select-option value="yes">Yes</a-select-option>
              <a-select-option value="no">No</a-select-option>
            </a-select>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-full">
              <label for="accountCode" class="font-semibold mb-1"
                >Account Code</label
              >
              <a-input id="accountCode" placeholder="Enter Account Code" />
            </div>
            <div
              class="flex items-center gap-2 text-green-700 font-mono text-lg w-20 mt-7"
            >
              <a-button
                class="w-full"
                @click="open = true"
                type="primary"
                danger
                >Search</a-button
              >
            </div>
          </div>
          <div>
            <label for="location" class="font-semibold mb-1">Location</label>
            <a-input id="location" placeholder="Enter Location" />
          </div>
          <div>
            <label for="category" class="font-semibold mb-1 block"
              >Category</label
            >
            <a-select
              class="w-full"
              id="category"
              placeholder="Select Category"
            >
              <a-select-option value="BANK">BANK</a-select-option>
              <a-select-option value="JOURNAL">JOURNAL</a-select-option>
              <a-select-option value="BILLS PAYABLE"
                >BILLS PAYABLE</a-select-option
              >
            </a-select>
          </div>

          <div>
            <label for="chequeFormat" class="font-semibold mb-1"
              >Cheque Format</label
            >
            <a-select
              class="w-full"
              id="chequeFormat"
              placeholder="Select cheque format"
            >
              <a-select-option value="a">Ab bank</a-select-option>
              <a-select-option value="b">SCB</a-select-option>
            </a-select>
          </div>
          <div>
            <label for="accountCode" class="font-semibold mb-1">A/C No</label>
            <a-input id="accountCode" placeholder="Enter Account Format" />
          </div>
          <div>
            <label for="minChequeStock" class="font-semibold mb-1 block"
              >Min Cheque Stock</label
            >
            <a-input-number
              type="number"
              id="minChequeStock"
              class="w-full"
              placeholder="Enter Min Cheque Stock"
            />
          </div>
        </div>
      </a-form>
      <template #footer>
        <a-button key="back" @click="isCreateModalVisible = false"
          >Cancel</a-button
        >
        <a-button key="submit" type="primary"> Submit </a-button>
      </template>
    </a-modal>

    <!-- Edit Modal for Editing Voucher -->
    <a-modal
      v-model:open="isEditModalVisible"
      width="1000px"
      title="Edit Voucher"
      @cancel="isEditModalVisible = false"
    >
      <a-form :form="form" layout="vertical">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-bold mb-1">Company Name</label>
            <a-select class="w-full">
              <a-select-option value="company1">Company 1</a-select-option>
              <a-select-option value="company2">Company 2</a-select-option>
              <a-select-option value="company3">Company 3</a-select-option>
            </a-select>
          </div>
          <div>
            <label for="voucherCode" class="font-semibold mb-1"
              >Voucher Code</label
            >
            <a-input id="voucherCode" placeholder="Enter Voucher Code" />
          </div>
          <div>
            <label for="description" class="font-semibold mb-1"
              >Description</label
            >
            <a-input id="description" placeholder="Enter Description" />
          </div>
          <div>
            <label class="block font-bold mb-1">Multiple Code</label>
            <a-select class="w-full">
              <a-select-option value="yes">Yes</a-select-option>
              <a-select-option value="no">No</a-select-option>
            </a-select>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-full">
              <label for="accountCode" class="font-semibold mb-1"
                >Account Code</label
              >
              <a-input id="accountCode" placeholder="Enter Account Code" />
            </div>
            <div
              class="flex items-center gap-2 text-green-700 font-mono text-lg w-20 mt-7"
            >
              <a-button
                class="w-full"
                @click="open = true"
                type="primary"
                danger
                >Search</a-button
              >
            </div>
          </div>
          <div>
            <label for="location" class="font-semibold mb-1">Location</label>
            <a-input id="location" placeholder="Enter Location" />
          </div>
          <div>
            <label for="category" class="font-semibold mb-1 block"
              >Category</label
            >
            <a-select
              class="w-full"
              id="category"
              placeholder="Select Category"
            >
              <a-select-option value="BANK">BANK</a-select-option>
              <a-select-option value="JOURNAL">JOURNAL</a-select-option>
              <a-select-option value="BILLS PAYABLE"
                >BILLS PAYABLE</a-select-option
              >
            </a-select>
          </div>

          <div>
            <label for="chequeFormat" class="font-semibold mb-1"
              >Cheque Format</label
            >
            <a-select
              class="w-full"
              id="chequeFormat"
              placeholder="Select cheque format"
            >
              <a-select-option value="a">Ab bank</a-select-option>
              <a-select-option value="b">SCB</a-select-option>
            </a-select>
          </div>
          <div>
            <label for="accountCode" class="font-semibold mb-1">A/C No</label>
            <a-input id="accountCode" placeholder="Enter Account Format" />
          </div>
          <div>
            <label for="minChequeStock" class="font-semibold mb-1 block"
              >Min Cheque Stock</label
            >
            <a-input-number
              type="number"
              id="minChequeStock"
              class="w-full"
              placeholder="Enter Min Cheque Stock"
            />
          </div>
        </div>
      </a-form>
      <template #footer>
        <a-button key="back" @click="isEditModalVisible = false"
          >Cancel</a-button
        >
        <a-button key="submit" type="primary" :loading="isEditing">
          Submit
        </a-button>
      </template>
    </a-modal>

    <!-- search modal -->
    <a-modal
      width="1000px"
      v-model:open="open"
      centered
      title="Search Chart of Accounts"
      @ok="open = false"
    >
      <div class="grid grid-cols-2 mb-4 gap-8">
        <a-input placeholder="Search" class="w-full" />
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto border-collapse">
          <thead>
            <tr class="bg-gray-100 border-b">
              <th class="py-2 px-4 text-left">Account Details</th>
              <th class="py-2 px-4 text-left">Account Code</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-2 px-4">Abcd</td>
              <td class="py-2 px-4">01-03</td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-2 px-4">Abcd</td>
              <td class="py-2 px-4">01-03</td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const open = ref(false);
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

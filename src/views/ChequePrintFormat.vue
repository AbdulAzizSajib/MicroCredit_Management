<template>
  <MainLayout>

    <!-- title -->
    <h1 class="text-2xl font-bold text-primary mb-4 text-center">Cheque Print Format</h1>
    <div class="">
      <div class="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b border-gray-300 bg-gray-100">
          <div class="flex items-center space-x-4">
            <label class="font-medium text-gray-700">Cheque Id:</label>
            <a-input class="w-32" size="small" />
            <label class="font-medium text-gray-700 ml-4">Cheque Details:</label>
            <a-input class="w-48" size="small" />
          </div>
          <div class="text-right">
            <div class="text-blue-600 font-semibold">All Measures</div>
            <div class="text-blue-600 font-semibold">are in Inch.</div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="p-4">
          <div class="grid grid-cols-2 gap-6">
            <!-- Left Panel -->
            <div class="space-y-4">
              <!-- Left Part Section -->
              <div class="border border-gray-300 rounded p-3">
                <h3 class="font-semibold text-gray-800 mb-3 bg-gray-100 p-2 rounded">Left Part</h3>


                <div class="mb-4">
                  <div class="grid grid-cols-2 gap-2">
                    <!-- Date Position -->
                    <div class="space-y-2">
                      <h4 class="font-medium text-gray-700 mb-2">Date Position</h4>
                      <div class="flex items-center space-x-2">
                        <label class="text-sm w-8">Top:</label>
                        <a-input class="w-16" size="small" value="0.000" />
                      </div>
                      <div class="flex items-center space-x-2">
                        <label class="text-sm w-8">Left:</label>
                        <a-input class="w-16" size="small" value="0.000" />
                      </div>
                      <div class="mt-2">
                        <a-checkbox>Visible</a-checkbox>
                      </div>
                    </div>
                    <!-- Name Position -->
                    <div class="space-y-2">
                      <h4 class="font-medium text-gray-700 mb-2">Name Position</h4>
                      <div class="flex items-center space-x-2">
                        <label class="text-sm w-8">Top:</label>
                        <a-input class="w-16" size="small" value="0.000" />
                      </div>
                      <div class="flex items-center space-x-2">
                        <label class="text-sm w-8">Left:</label>
                        <a-input class="w-16" size="small" value="0.000" />
                      </div>
                      <div class="mt-2">
                        <a-checkbox>Visible</a-checkbox>
                      </div>
                    </div>
                    <!-- Amount Position -->
                    <div class="space-y-2">
                      <h4 class="font-medium text-gray-700 mb-2">Amount Position</h4>
                      <div class="flex items-center space-x-2">
                        <label class="text-sm w-8">Top:</label>
                        <a-input class="w-16" size="small" value="0.000" />
                      </div>
                      <div class="flex items-center space-x-2">
                        <label class="text-sm w-8">Left:</label>
                        <a-input class="w-16" size="small" value="0.000" />
                      </div>
                      <div class="mt-2">
                        <a-checkbox>Visible</a-checkbox>
                      </div>
                    </div>
                    <!-- Voucher No Position -->
                    <div class="space-y-2">
                      <h4 class="font-medium text-gray-700 mb-2">Voucher No Position</h4>
                      <div class="flex items-center space-x-2">
                        <label class="text-sm w-8">Top:</label>
                        <a-input class="w-16" size="small" value="0.000" />
                      </div>
                      <div class="flex items-center space-x-2">
                        <label class="text-sm w-8">Left:</label>
                        <a-input class="w-16" size="small" value="0.000" />
                      </div>
                      <div class="mt-2">
                        <a-checkbox>Visible</a-checkbox>
                      </div>
                    </div>
                    <!-- Order Cheque -->
                    <div class="space-y-2">
                      <h4 class="font-medium text-gray-700 mb-2">Order Cheque</h4>
                      <div class="flex items-center space-x-2">
                        <label class="text-sm w-8">Top:</label>
                        <a-input class="w-16" size="small" value="0.000" />
                      </div>
                      <div class="flex items-center space-x-2">
                        <label class="text-sm w-8">Left:</label>
                        <a-input class="w-16" size="small" value="0.000" />
                      </div>
                      <div class="mt-2">
                        <a-checkbox>Visible</a-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Panel -->
            <div class="space-y-4">
              <!-- Cheque Body Section -->
              <div class="border border-gray-300 rounded p-3">
                <h3 class="font-semibold text-gray-800 mb-3 bg-gray-100 p-2 rounded">Cheque Body</h3>


                <div class="grid grid-cols-3 gap-x-1 gap-y-2">
                  <!-- Date Position -->
                  <div class="space-y-2">
                    <h4 class="font-medium text-gray-700 mb-2">Date Position</h4>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Top:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Left:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="mt-2">
                      <a-checkbox>Visible</a-checkbox>
                    </div>
                  </div>
                  <!-- Name Position -->
                  <div class="space-y-2">
                    <h4 class="font-medium text-gray-700 mb-2">Name Position</h4>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Top:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Left:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="mt-2">
                      <a-checkbox>Visible</a-checkbox>
                    </div>
                  </div>
                  <!-- Amount Position -->
                  <div class="space-y-2">
                    <h4 class="font-medium text-gray-700 mb-2">Amount Position</h4>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Top:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Left:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="mt-2">
                      <a-checkbox>Visible</a-checkbox>
                    </div>
                  </div>
                  <!-- In Words Position -->
                  <div class="space-y-2">
                    <h4 class="font-medium text-gray-700 mb-2">In Words Position</h4>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Top:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Left:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="mt-2">
                      <a-checkbox>Visible</a-checkbox>
                    </div>
                  </div>

                  <!-- A/C Payee Position -->
                  <div class="space-y-2">
                    <h4 class="font-medium text-gray-700 mb-2">A/C Payee Position</h4>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Top:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Left:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="mt-2">
                      <a-checkbox>Visible</a-checkbox>
                    </div>
                  </div>
                  <!-- Auth Signature Position -->
                  <div class="space-y-2">
                    <h4 class="font-medium text-gray-700 mb-2">Auth Signature Position</h4>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Top:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Left:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="mt-2">
                      <a-checkbox>Visible</a-checkbox>
                    </div>
                  </div>
                  <!-- Order Cheque Position -->
                  <div class="space-y-2 mb-3">
                    <h4 class="font-medium text-gray-700 mb-2">Order Cheque Position</h4>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Top:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label class="text-sm w-8">Left:</label>
                      <a-input class="w-16" size="small" value="0.000" />
                    </div>
                    <div class="mt-2">
                      <a-checkbox>Visible</a-checkbox>
                    </div>
                  </div>

                </div>


                <!-- Auth Signature Position -->


                <!-- Order Cheque -->

              </div>
            </div>
          </div>

          <!-- Footer Buttons -->
          <div class="flex justify-end space-x-3 mt-6 border-gray-300">
            <a-button type="primary" size="large" class="px-8">Save</a-button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref } from "vue";

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}

.ant-checkbox-wrapper {
  @apply text-sm text-gray-700;
}
</style>

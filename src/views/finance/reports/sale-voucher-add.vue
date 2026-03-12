<template>
  <MainLayout>
    <div class="">
      <div class="my-1">
        <a-form>
          <!-- form top -->
          <div class="px-2 bg-gray-100">
            <div class="flex items-center gap-2">
              <!-- Date -->
              <div class="flex items-center gap-1 flex-shrink-0">
                <label for="date" class="text-lg">Date:</label>
                <a-date-picker
                  suffix-icon=""
                  format="DD/MM/YYYY"
                  class="w-28"
                  ref="date_ref"
                />
              </div>

              <!-- Voucher Type -->
              <div class="flex items-center flex-shrink-0">
                <label for="voucher-type" class="text-lg mr-1"
                  >Voucher Type: <span class="text-red-500">*</span></label
                >
                <a-select
                  show-search
                  :allowClear="true"
                  
                  :filter-option="false"
                 
                  ref="voucher_type_ref"
                  class="w-[80px]"
                  placeholder=""
                  option-label-prop="label"
                  
                </a-select>
              </div>

              <!-- Details -->
              <div
                class="px-2 py-4 h-[60px] flex-1 min-w-[100px] bg-[#006dc1] flex items-center"
              >
                <h2 class="text-white leading-5">
             
                </h2>
              </div>

              <!-- Category -->
              <div class="flex items-center flex-shrink-0">
                <label for="voucher-type" class="text-lg mr-1"
                  >Category: <span class="text-red-500">*</span></label
                >
                <a-select
                  ref="category_ref"
                  class="w-[100px]"
                  placeholder="Select"
                
                >

                 

                </a-select>
              </div>

              <!-- Voucher Number -->
              <div class="flex items-center flex-shrink-0">
                <label for="voucher-number" class="text-lg mr-1">Voucher:</label>
                <a-input
                 
                  class="w-12 text-center bg-[#006dc1] text-white"
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <!-- Group -->
            </div>
</div>
        
        </a-form>
      </div>

      <!-- insert voucher end-->
    </div>
    <div class="shadow rounded-lg my-4 p-4 border border-gray-300">
      <!-- title -->
      <h1 class="text-2xl font-bold text-primary mb-4">

      </h1>

      <table class="w-full text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">Account Code</th>
            <th class="border border-white px-4 py-2">Account Details</th>
            <th class="border border-white px-4 py-2">Sub Ledger</th>
            <th class="border border-white px-4 py-2 w-[8%] text-center">Debit</th>
            <th class="border border-white px-4 py-2 w-[8%] text-center">Credit</th>
            <th class="border border-white px-4 py-2 w-[8%]">Cheque No</th>
            <th class="border border-white px-4 py-2">Cheque Name</th>
            <th class="border border-white px-4 py-2">Narration</th>
            <th class="border border-white px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr
  
       
            class="bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
          >
            <!-- Account Code -->
            <td class="px-4 border">
              
            </td>

            <!-- Account Details -->
            <td class="px-4 border">
           
            </td>


          </tr>
        </tbody>

      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}

input:focus,
.ant-input:focus,
.ant-select-focused .ant-select-selector,
.ant-input-number-focused .ant-input-number-input > input {
  background-color: #fff8c4 !important;
  /* light yellow */
  transition: background-color 0.2s ease;
}

/* Auto-selection visual feedback */
.auto-selecting .ant-select-selector {
  background-color: #f3a7a7 !important; /* Light green */
  border-color: #b91010 !important; /* Green border */
  box-shadow: 0 0 0 2px rgba(185, 16, 16, 0.2) !important;
  transition: all 0.3s ease;
}

.auto-selecting .ant-select-selector:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
  animation: shimmer 1s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>

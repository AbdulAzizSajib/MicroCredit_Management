<template>
  <MainLayout>
    <!-- voucher edit -->
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
                  v-model:value="form.date"
                  format="DD/MM/YYYY"
                  class="w-28"
                  ref="date_ref"
                  @keydown.enter.stop="onDateEnter"
                  @pressEnter="voucher_type_ref.focus()"
                />
              </div>

              <!-- Voucher Type -->
              <div class="flex items-center flex-shrink-0">
                <label for="voucher-type" class="text-lg mr-1"
                  >Voucher Type: <span class="text-red-500">*</span></label
                >
                <a-select
                  show-search
                  allowClear
                  :filter-option="false"
                  v-model:value="form.voucherType"
                  ref="voucher_type_ref"
                  class="w-[80px]"
                  placeholder=""
                  :disabled="voucherEntries.length > 0"
                  option-label-prop="label"
                  @select="onVoucherTypeSelect"
                  @keydown.native.enter.stop="onVoucherTypeEnter"
                  @keydown.native.esc="onVoucherTypeEsc"
                  @search="
                    (event) => {
                      voucherTypes = all_voucherTypes.filter(
                        (item) =>
                          item?.JVType?.toLowerCase().includes(
                            event.toLowerCase()
                          ) ||
                          item?.JVDetails?.toLowerCase().includes(
                            event.toLowerCase()
                          ) ||
                          item?.Location?.toLowerCase().includes(
                            event.toLowerCase()
                          ) ||
                          item?.AMCode?.toLowerCase().includes(
                            event.toLowerCase()
                          )
                      );
                    }
                  "
                  :loading="voucherTypesLoading"
                  :dropdown-style="{ minWidth: '700px', maxWidth: '900px' }"
                  :get-popup-container="(trigger) => trigger.parentNode"
                >
                  <a-select-option
                    v-for="item in voucherTypes"
                    :key="item.JVType"
                    :value="item.JVType"
                    :label="item.JVType"
                    class="!whitespace-normal"
                  >
                    {{ item.JVType }} - {{ item.JVDetails }} -
                    {{ item.Location }} -
                    {{ item.AMCode }}
                  </a-select-option>
                </a-select>
              </div>

              <!-- Details -->
              <div
                class="px-2 py-4 h-[60px] flex-1 min-w-[100px] bg-[#006dc1] flex items-center"
              >
                <h2 class="text-white leading-5">
                  {{ selectedVoucherDetails }}
                </h2>
              </div>

              <!-- Category -->
              <div class="flex items-center flex-shrink-0">
                <label for="voucher-type" class="text-lg mr-1"
                  >Category: <span class="text-red-500">*</span></label
                >
                <a-select
                  v-model:value="form.category"
                  ref="category_ref"
                  class="w-[100px]"
                  placeholder="Select"
                  @select="group_code_ref?.focus()"
                  :disabled="
                    form.voucherType === 'JVR' || voucherEntries.length > 0
                  "
                  @keydown.native.enter.stop="onCategoryEnter"
                  @keydown.native.esc="onCategoryEsc"
                >
                  <a-select-option
                    v-for="cat in categories"
                    :key="cat.Short"
                    :value="cat.Short"
                  >
                    {{ cat.Category }}
                  </a-select-option>
                </a-select>
              </div>

              <!-- Voucher Number -->
              <div class="flex items-center flex-shrink-0">
                <label for="voucher-number" class="text-lg mr-1"
                  >Voucher:</label
                >
                <a-input
                  v-model:value="form.voucherNumber"
                  class="w-12 text-center bg-[#006dc1] text-white"
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <!-- Group -->
              <div>
                <div class="flex items-center">
                  <label for="account-code" class="w-36"
                    >Group: <span class="text-red-500">*</span></label
                  >

                  <a-select
                    show-search
                    allowClear
                    :filter-option="false"
                    v-model:value="form.group"
                    placeholder=""
                    ref="group_code_ref"
                    @keydown.native.enter.stop="onGroupEnter"
                    @keydown.native.esc="onGroupEsc"
                    class="flex-1 cursor-pointer"
                    @select="handleGroupSelect"
                    @search="
                      (event) => {
                        group = all_group.filter(
                          (item) =>
                            item?.GroupCode?.toLowerCase().includes(
                              event.toLowerCase()
                            ) ||
                            item?.GroupDetails?.toLowerCase().includes(
                              event.toLowerCase()
                            )
                        );
                      }
                    "
                  >
                    <a-select-option
                      v-for="cat in group"
                      :key="cat.GroupCode"
                      :value="cat.GroupCode"
                    >
                      {{ cat.GroupDetails }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>

              <!-- Type -->
              <div class="flex items-center">
                <label for="account-code" class="w-36"
                  >Type: <span class="text-red-500">*</span></label
                >

                <a-select
                  show-search
                  allowClear
                  :filter-option="false"
                  v-model:value="form.type"
                  class="flex-1 text-white"
                  ref="type_ref"
                  @select="handleTypeSelect"
                  @search="
                    (event) => {
                      Type = all_Type.filter(
                        (item) =>
                          item?.ACType1?.toLowerCase().includes(
                            event.toLowerCase()
                          ) ||
                          item?.ACType1Details?.toLowerCase().includes(
                            event.toLowerCase()
                          )
                      );
                    }
                  "
                >
                  <a-select-option
                    v-for="cat in Type"
                    :key="cat.ACType1"
                    :value="cat.ACType1"
                  >
                    {{ cat.ACType1Details }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <!--Account Head -->
            <div class="flex items-center mt-2">
              <label for="account-head" class="w-36"
                >Account Head: <span class="text-red-500">*</span></label
              >

              <a-select
                show-search
                allowClear
                :filter-option="false"
                allow-clear
                v-model:value="form.account_head"
                placeholder=""
                class="flex-1"
                ref="account_head_ref"
                @select="handleAccHeadSelect"
                @keydown.enter="handleAccHeadEnter"
                @search="
                  (event) => {
                    account_head = all_account_head.filter(
                      (item) =>
                        item?.AMCode?.toLowerCase().includes(
                          event.toLowerCase()
                        ) ||
                        item?.AMDetails?.toLowerCase().includes(
                          event.toLowerCase()
                        )
                    );
                  }
                "
              >
                <a-select-option
                  v-for="cat in account_head"
                  :key="cat.AMCode"
                  :value="cat.AMCode"
                >
                  {{ cat.AMDetails }} - {{ cat.AMCode }}
                </a-select-option>
              </a-select>
            </div>
            <div
              class="grid grid-cols-1 lg:grid-cols-2 items-center gap-x-4 mt-2"
            >
              <div class="flex items-center">
                <label class="w-36">Sub-Ledger:</label>

                <a-select
                  show-search
                  allowClear
                  :disabled="all_subLedgerList.length === 0"
                  :filter-option="false"
                  allow-clear
                  v-model:value="form.subLedger"
                  placeholder=""
                  class="flex-1"
                  ref="sub_ledger_ref"
                  @select="person_ref?.focus()"
                  @keydown.enter="handleSubLedgerEnter"
                  @search="
                    (event) => {
                      subLedgerList = all_subLedgerList.filter(
                        (item) =>
                          item?.ASCode?.toLowerCase().includes(
                            event.toLowerCase()
                          ) ||
                          item?.ASDetails?.toLowerCase().includes(
                            event.toLowerCase()
                          ) ||
                          item?.SiteCode?.toLowerCase().includes(
                            event.toLowerCase()
                          )
                      );
                    }
                  "
                >
                  <a-select-option
                    v-for="cat in subLedgerList"
                    :key="cat.ASType"
                    :value="cat.ASType"
                  >
                    {{ cat.ASType }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="flex items-center">
                <label class="w-36">Person: </label>
                <a-input
                  class="ml-6"
                  @keydown.esc="handleBackToPersonToAccHead"
                  v-model:value="form.person"
                  ref="person_ref"
                  @keydown.enter="handlePersonToChequeNo"
                />
              </div>
            </div>
            <div
              class="grid grid-cols-1 lg:grid-cols-2 items-center gap-x-4 mt-2"
            >
              <div class="flex items-center">
                <label class="w-36"
                  >Cheque No: <span class="text-red-600">*</span></label
                >
                <a-select
                  show-search
                  allowClear
                  :filter-option="false"
                  v-model:value="form.chequeNo"
                  placeholder="Select Cheque No"
                  class="flex-1"
                  :disabled="form.voucherType === 'JVR' || isCategoryReceipt"
                  ref="cheque_no_ref"
                  @keydown.enter="handleChequeNoToVendorId"
                  @select="handleChequeNoToVendorId"
                  @search="
                    (event) => {
                      chequeRegisterList = all_chequeRegisterList.filter(
                        (item) =>
                          item?.ChequeNo?.toLowerCase().includes(
                            event.toLowerCase()
                          ) ||
                          item?.ChequeBookNo?.toLowerCase().includes(
                            event.toLowerCase()
                          )
                      );
                    }
                  "
                >
                  <a-select-option
                    v-for="cheque in chequeRegisterList"
                    :key="cheque.ChequeNo"
                    :value="cheque.ChequeNo"
                  >
                    {{ cheque.ChequeNo }}
                  </a-select-option>
                </a-select>
              </div>
              <!-- Vendor Select -->
              <div class="flex items-center">
                <label class="w-36">Vendor ID:</label>
                <!-- {{ form.vendorId }} -->
                <a-select
                  v-model:value="form.vendorId"
                  show-search
                  placeholder="Select Vendor"
                  class="flex-1"
                  allow-clear
                  ref="vendor_id_ref"
                  @select="handleVendorSelect"
                  @keydown.esc.stop="vendorIdToChequeNo"
                >
                  <a-select-option :value="' '">-</a-select-option>
                  <a-select-option
                    v-for="vendor in vendorList"
                    :key="vendor.VendorId"
                    :value="vendor.VendorId"
                  >
                    {{ vendor.VendorId }} - {{ vendor.VendorName }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="flex items-center mt-2">
              <label class="w-36">Cheque Name:</label>
              <!-- @keydown.esc="handleChequeNameToVendorId" -->
              <a-input
                class="flex-1"
                v-model:value="form.chequeName"
                ref="cheque_name_ref"
                @keydown.enter="bill_no_ref?.focus()"
                @keydown.esc.stop="handlecheckNameToVendorId"
              />
            </div>
            <div
              class="grid grid-cols-1 lg:grid-cols-2 items-center gap-x-4 mt-2"
            >
              <div class="flex items-center">
                <label class="w-36">Bill No</label>

                <a-input
                  class="flex-1"
                  v-model:value="form.billNo"
                  ref="bill_no_ref"
                  @keydown.enter="bill_date_ref?.focus()"
                />
              </div>
              <div class="flex items-center">
                <label class="w-36">Bill Date</label>
                <input
                  type="date"
                  v-model="form.billDate"
                  class="flex-1 border p-1 rounded-lg"
                  ref="bill_date_ref"
                  @keydown.enter.stop="onBillDateEnter"
                  @keydown.esc.stop="bill_no_ref?.focus()"
                />
              </div>
            </div>

            <div class="flex items-center mt-2">
              <label class="w-36"
                >Narration <span class="text-red-500">*</span></label
              >

              <a-input
                class="flex-1"
                v-model:value="form.narration"
                ref="narration_ref"
                @keydown.enter="handleNarrationToDebit"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div class="flex items-center">
                <label class="w-36">Debit:</label>

                <a-input-number
                  v-model:value="form.debit"
                  class="flex-1"
                  ref="debit_ref"
                  :class="{ '!bg-green-200 !text-white': isBankPayment }"
                  @focus="handleNumberFocus('debit')"
                  @blur="handleNumberBlur('debit')"
                  @keydown.enter="credit_ref?.focus()"
                />
              </div>
              <div class="flex items-center">
                <label class="w-36">Credit:</label>
                <a-input-number
                  v-model:value="form.credit"
                  class="flex-1"
                  ref="credit_ref"
                  :class="{ '!bg-green-200 !text-white': isBankReceipt }"
                  @focus="handleNumberFocus('credit')"
                  @blur="handleNumberBlur('credit')"
                  @keydown.enter="add_button_ref?.$el?.focus()"
                />
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center space-x-4">
            <a-button
              type="primary"
              class="px-6 bg-primary text-white"
              @click="updateVoucher"
              :loading="creating"
              :disabled="!canSaveVoucher"
              ref="save_button_ref"
              >Update</a-button
            >
            <!-- :disabled="!canAddEntry" -->
            <a-button
              type="primary"
              class="px-6 bg-blue-500 text-white"
              @click="addEntry"
              ref="add_button_ref"
              >Add</a-button
            >
            <label class="flex items-center space-x-2">
              <a-checkbox v-model:checked="isContra" />
              <span>Contra</span>
            </label>
          </div>
        </a-form>
      </div>

      <!-- insert voucher end-->
    </div>
    <div class="shadow rounded-lg my-4 p-4 border border-gray-300">
      <!-- title -->
      <h1 class="text-2xl font-bold text-primary mb-4">
        Voucher ({{ voucherEntries.length }})
      </h1>

      <table class="w-full text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">Account Code</th>
            <th class="border border-white px-4 py-2">Account Details</th>
            <th class="border border-white px-4 py-2">Sub Ledger</th>
            <th class="border border-white px-4 py-2 w-[8%] text-center">
              Debit
            </th>
            <th class="border border-white px-4 py-2 w-[8%] text-center">
              Credit
            </th>
            <th class="border border-white px-4 py-2 w-[8%]">Cheque No</th>
            <th class="border border-white px-4 py-2">Cheque Name</th>
            <th class="border border-white px-4 py-2">Narration</th>
            <th class="border border-white px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr
            v-for="(entry, index) in voucherEntries"
            :key="index"
            class="bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
          >
            <!-- Account Code -->
            <td class="px-4 border">
              <span>{{ entry?.account_head || "_" }}</span>
            </td>

            <!-- Account Details -->
            <td class="px-4 border">
              <span>{{ entry?.accountDetails || "_" }}</span>
            </td>

            <!-- Sub Ledger -->
            <td class="px-4 border">
              <span>{{ entry?.subLedger || "_" }}</span>
            </td>

            <!-- Debit -->
            <td class="px-4 border text-right w-40">
              <span>{{ entry?.debit || 0 }}</span>
            </td>

            <!-- Credit -->
            <td class="px-4 border text-right w-40">
              <span>{{ entry?.credit || 0 }}</span>
            </td>

            <!-- Cheque No -->
            <td class="px-4 border w-40">
              <span>{{ entry?.chequeNo || "_" }}</span>
            </td>

            <!-- Cheque Name -->
            <td class="px-4 border">
              <span>{{ entry?.chequeName || "_" }}</span>
            </td>

            <!-- Narration -->
            <td class="px-4 border">
              <span>{{ entry?.narration || "_" }}</span>
            </td>

            <!-- Actions -->
            <!-- <td class="px-4 border text-center w-8">
              <div class="flex justify-center gap-x-3">
                <button
                  @click="populateFormFromEntry(entry, index)"
                  class="px-2 py-1 bg-primary text-white rounded-md"
                >
                  Edit
                </button>
              </div>
            </td>  -->

            <td class="px-4 border text-center w-8">
              <div class="flex justify-center gap-x-3">
                <button
                  @click="populateFormFromEntry(entry, index)"
                  class="px-2"
                  :disabled="editingIndex !== null || entry.isBankContra"
                  :class="[
                    editingIndex !== null || entry.isBankContra
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-50 '
                      : 'bg-primary text-white hover:bg-primary-dark cursor-pointer',
                  ]"
                >
                  Edit
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tr class="mt-8 justify-center">
          <td colspan="2"></td>
          <td class="font-bold">Total:</td>
          <td>
            <div
              class="w-full h-8 bg-teal-500 text-white flex justify-center items-center rounded"
            >
              <h2 class="text-right w-full pr-2">
                {{ debitTotal.toFixed(2) }}
              </h2>
            </div>
          </td>
          <td>
            <div
              class="w-full h-8 bg-blue-700 text-white text-center flex justify-center items-center rounded"
            >
              <h2 class="text-right w-full pr-2">
                {{ creditTotal.toFixed(2) }}
              </h2>
            </div>
          </td>
          <td>
            <div
              class="w-full h-8 bg-teal-500 text-white text-center flex justify-center items-center rounded"
            >
              <h2 class="text-right w-full pr-2">
                {{
                  Number(debitTotal) - Number(creditTotal) <= 0
                    ? "0.00"
                    : Number(Number(debitTotal) - Number(creditTotal)).toFixed(
                        2
                      )
                }}
              </h2>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import dayjs from "dayjs";
import axios from "axios";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
// const route = useRoute();
const JVNo_from_params = useRoute().query.JVNo || null;
console.log(JVNo_from_params);

const onVoucherTypeSelect = async (value) => {
  // Find the selected voucher and store its AMCode
  const selectedVoucher = voucherTypes.value.find(
    (item) => item.JVType === value
  );
  if (selectedVoucher) {
    selectedAMCode.value = selectedVoucher.AMCode || "";
  }

  // Fetch cheque register list first
  await fetchChequeRegisterList(value);

  if (value === "JVR") {
    // Focus on Group if Category is disabled
    form.value.category = "J"; // optionally prefill

    // Auto-select first cheque number
    if (chequeRegisterList.value.length > 0) {
      form.value.chequeNo = chequeRegisterList.value[0].ChequeNo;
    }

    // Auto-select first group
    await fetchgroup();
    if (all_group.value.length > 0) {
      form.value.group = all_group.value[0].GroupCode;

      // Auto-select first type
      await fetchType(form.value.group, true);
      if (all_Type.value.length > 0) {
        // Auto-select first account head
        await fetchAccount_head(form.value.type, true);
      }
    }

    group_code_ref.value?.focus();
  } else {
    category_ref.value?.focus();

    // Auto-select first cheque number for Receipt category
    if (form.value.category === "R" && chequeRegisterList.value.length > 0) {
      form.value.chequeNo = chequeRegisterList.value[0].ChequeNo;
    }

    // Auto-select first group
    await fetchgroup();
    if (all_group.value.length > 0) {
      form.value.group = all_group.value[0].GroupCode;

      // Auto-select first type
      await fetchType(form.value.group, true);
      if (all_Type.value.length > 0) {
        // Auto-select first account head
        await fetchAccount_head(form.value.type, true);
      }
    }
  }
};

const onVoucherTypeEnter = () => {
  if (form.voucherType === "JVR") {
    group_code_ref.value?.focus();
  } else {
    category_ref.value?.focus();
  }
};

const onVoucherTypeEsc = () => {
  form.voucherType = null;
  voucher_type_ref.value?.focus();
};

const onCategoryEnter = () => {
  group_code_ref.value?.focus();
};
const onCategoryEsc = () => {
  voucher_type_ref.value?.focus();
};

const onGroupEnter = () => {
  type_ref.value?.focus(); // move to next field
};
const onGroupEsc = () => {
  voucher_type_ref.value?.focus();
};

const editingIndex = ref(null);

// Add this new function
// const populateFormFromEntry = (entry, index) => {
//   // Set editing index FIRST
//   editingIndex.value = index;

//   form.value.account_head = entry.account_head;
//   form.value.subLedger = entry.subLedger;
//   form.value.type = entry.type;
//   form.value.person = entry.person || "";
//   form.value.chequeNo = entry.chequeNo || null;
//   form.value.chequeName = entry.chequeName || null;
//   form.value.billNo = entry.billNo || null;
//   form.value.billDate = entry.billDate ? dayjs(entry.billDate) : null;
//   form.value.narration = entry.narration || null;
//   form.value.debit = entry.debit || 0;
//   form.value.credit = entry.credit || 0;
//   form.value.accountDetails = entry.accountDetails || "";

//   // Store the index being edited
//   form.value.editingEntryIndex = index;

//   // Remove the entry from the table
//   voucherEntries.value.splice(index, 1);
// };

const populateFormFromEntry = async (entry, index) => {
  // Don't allow editing of bank contra entries
  if (entry.isBankContra) {
    return;
  }

  // Set editing index FIRST
  editingIndex.value = index;

  // Extract group and type from account_head
  // Format: XXX-XXXXX where first 2 digits are group, first 3 digits are type
  const accountCode = entry.account_head;

  if (accountCode) {
    const [codeBeforeHyphen] = accountCode.split("-");

    // Extract group (first 2 digits of the code before hyphen)
    const groupCode = codeBeforeHyphen.substring(0, 2);

    // Extract type (all 3 digits before hyphen)
    const typeCode = codeBeforeHyphen; // e.g., "022"

    // Set group first
    form.value.group = groupCode;

    // Fetch type options for the selected group and wait
    await fetchType(groupCode);

    // Set type after types are loaded
    form.value.type = typeCode;

    // Fetch account heads for the selected type and wait
    await fetchAccount_head(typeCode);

    // Set account head after account heads are loaded
    form.value.account_head = entry.account_head;

    // Fetch sub-ledger if account head exists
    if (entry.account_head) {
      await fetchSubLedgerList(entry.account_head);
    }
  }

  // Populate other form fields
  form.value.subLedger = entry.subLedger;
  form.value.person = entry.person || "";
  form.value.chequeNo = entry.chequeNo || null;
  form.value.chequeName = entry.chequeName || null;
  form.value.billNo = entry.billNo || null;
  form.value.billDate = entry.billDate ? dayjs(entry.billDate) : null;
  form.value.narration = entry.narration || null;
  form.value.debit = entry.debit || 0;
  form.value.credit = entry.credit || 0;
  form.value.accountDetails = entry.accountDetails || "";
  form.value.vendorId = entry.vendorId || null;

  // Store the index being edited and original debit/credit for bank contra adjustment
  editingEntryIndex.value = index;
  originalDebit.value = entry.debit || 0;
  originalCredit.value = entry.credit || 0;

  // Remove the entry from the table
  voucherEntries.value.splice(index, 1);

  // Focus on the first editable field after populating
  setTimeout(() => {
    account_head_ref.value?.focus();
  }, 200);
};

const form = ref({
  date: dayjs(),
  voucherType: null,
  category: "",
  account_head: "",
  type: "",
  accountDetails: "",
  voucherNumber: 0,
  group: "",
  person: "",
  subLedger: null,
  narration: "",
  billNo: null,
  billDate: null,
  debit: 0,
  credit: 0,
  chequeNo: null,
  chequeName: null,
  vendorId: null,
});

// Separate refs for tracking edits (not part of form data)
const editingEntryIndex = ref(null);
const originalDebit = ref(0);
const originalCredit = ref(0);

const canAddEntry = computed(() => {
  const f = form.value;
  return (
    f.voucherType &&
    f.account_head &&
    f.category &&
    (f.debit > 0 || f.credit > 0)
  );
});

const canSaveVoucher = computed(() => voucherEntries.value.length > 0);

const voucherEntries = ref([]);
const voucherTypes = ref([]);

// Refs for focus management
const date_ref = ref();
const voucher_type_ref = ref(null);
const category_ref = ref(null);
const group_code_ref = ref(null);
const type_ref = ref();
const account_head_ref = ref();
const sub_ledger_ref = ref();
const person_ref = ref();
const cheque_no_ref = ref();
const cheque_name_ref = ref();
const vendor_id_ref = ref();
const bill_no_ref = ref();
const bill_date_ref = ref();
const narration_ref = ref();
const debit_ref = ref();
const credit_ref = ref();
const add_button_ref = ref();
const isContra = ref(false);
const categories = ref([]);
const group = ref([]);
const all_group = ref([]);
const Type = ref([]);
const all_Type = ref([]);
const account_head = ref([]);
const all_account_head = ref([]);
const subLedgerList = ref([]);
const all_subLedgerList = ref([]);
const chequeRegisterList = ref([]);
const all_chequeRegisterList = ref([]);
const creating = ref(false);
const save_button_ref = ref(false);
const selectedAMCode = ref("");
const fetchAccount_head = async (value, autoSelect = false) => {
  if (!autoSelect) {
    form.value.account_head = "";
  }
  try {
    const { data } = await axios.get(
      `${apiBase}/journal/account-head?ACType1=${value || ""}&JVType=${
        form.value.voucherType
      }&JVCode=${selectedAMCode.value || ""}`,
      getToken()
    );

    if (Array.isArray(data)) {
      account_head.value = data;
      // set first index[0] to account_head
      form.value.account_head = data[0].AMCode;
      all_account_head.value = data;
      // Auto-select first account head if requested and not already set
      if (autoSelect && data.length > 0 && !form.value.account_head) {
        form.value.account_head = data[0].AMCode;
      }
    }
    // if (account_head.length === 0) {
    //   subLedgerList.value = [];
    //   all_subLedgerList.value = [];
    //   form.value.subLedger = "";
    // }
  } catch (err) {
    console.error("Error fetching account heads:", err);
    account_head.value = [];
    all_account_head.value = [];
  }
};

const isBankPayment = computed(() => {
  const selectedVoucher = voucherTypes.value.find(
    (v) => v.JVType === form.value.voucherType
  );
  return (
    selectedVoucher?.Category?.toUpperCase() === "BANK" &&
    form.value.category === "P"
  ); // Assuming 'P' is short for Payment
});

const isBankReceipt = computed(() => {
  const selectedVoucher = voucherTypes.value.find(
    (v) => v.JVType === form.value.voucherType
  );
  return (
    selectedVoucher?.Category?.toUpperCase() === "BANK" &&
    form.value.category === "R"
  ); // Assuming 'R' is short for Receipt
});

const handleNumberFocus = (field) => {
  lastFocusedField.value = field; // Keep your existing logic
  if (form.value[field] === 0) {
    form.value[field] = null; // Clear the field when it's 0
  }
};

const handleNumberBlur = (field) => {
  if (form.value[field] === null || form.value[field] === "") {
    form.value[field] = 0; // Reset to 0 if empty
  }
};

const handlePersonToChequeNo = () => {
  if (form.value.voucherType === "JVR" || form.value.category === "R") {
    vendor_id_ref.value.focus();
    form.value.chequeName = form.value.person;
  } else {
    cheque_no_ref.value?.focus();
    // form.value.chequeName = form.value.person;
  }
};

const handlecheckNameToVendorId = () => {
  vendor_id_ref.value?.focus();
};

const handleNarrationToDebit = () => {
  if (!form.value.narration) {
    showNotification("warning", "Please input narration");
    return;
  } else {
    debit_ref.value.focus();
  }
};
const handleChequeNoToVendorId = () => {
  if (!form.value.chequeNo) {
    showNotification("warning", "Please Insert cheque number");
    return;
  } else if (form.value.person && form.value.chequeNo) {
    form.value.chequeName = form.value.person;
    vendor_id_ref.value.focus();
  } else {
    vendor_id_ref.value.focus();
  }
};

const vendorIdToChequeNo = () => {
  if (form.value.voucherType === "JVR") {
    person_ref.value.focus();
  } else {
    cheque_no_ref.value?.focus();
  }
};

// const handleAccHeadSelect = (value) => {
//   sub_ledger_ref.value?.focus();
//   form.value.subLedger = "";
//   fetchSubLedgerList(value);
// };

const handleAccHeadSelect = async (value) => {
  form.value.subLedger = "";
  await fetchSubLedgerList(value);

  // Wait for next tick to ensure DOM updates
  setTimeout(() => {
    if (all_subLedgerList.value.length === 0) {
      person_ref.value?.focus();
    } else {
      sub_ledger_ref.value?.focus();
    }
  }, 100);
};

// const handleAccHeadEnter = () => {
//   setTimeout(() => {
//     if (subLedgerList.value.length === 0) {
//       form.value.subLedger = null;
//       person_ref.value?.focus();
//     } else {
//       sub_ledger_ref.value?.focus();
//     }
//   }, 500);
// };

const handleAccHeadEnter = () => {
  setTimeout(() => {
    if (all_subLedgerList.value.length === 0) {
      form.value.subLedger = null;
      person_ref.value?.focus();
    } else {
      sub_ledger_ref.value?.focus();
    }
  }, 150);
};

const handleTypeSelect = async (value) => {
  account_head_ref.value?.focus();
  // console.log("value----->", value);
  await fetchAccount_head(value);

  // Auto-select first account head if data exists
  if (all_account_head.value.length > 0) {
    form.value.account_head = all_account_head.value[0].AMCode;

    // Fetch and auto-select sub-ledger if exists
    await fetchSubLedgerList(form.value.account_head);
    if (all_subLedgerList.value.length > 0) {
      form.value.subLedger = all_subLedgerList.value[0].ASType;
    }
  }
};

const handleGroupSelect = async (value) => {
  type_ref.value?.focus();
  await fetchType(value);

  // Auto-select first type if data exists
  if (all_Type.value.length > 0) {
    form.value.type = all_Type.value[0].ACType1;

    // Fetch and auto-select first account head if exists
    await fetchAccount_head(form.value.type);
    if (all_account_head.value.length > 0) {
      form.value.account_head = all_account_head.value[0].AMCode;

      // Fetch and auto-select sub-ledger if exists
      await fetchSubLedgerList(form.value.account_head);
      if (all_subLedgerList.value.length > 0) {
        form.value.subLedger = all_subLedgerList.value[0].ASType;
      }
    }
  }
};

const fetchType = async (group, autoSelect = false) => {
  if (!autoSelect) {
    form.value.type = "";
    form.value.account_head = "";
  }
  try {
    const { data } = await axios.get(
      `${apiBase}/journal/type?GroupCode=${group}&JVType=${form.value.voucherType}`,
      getToken()
    );
    if (Array.isArray(data)) {
      Type.value = data;
      // add default index[0] to type
      form.value.type = data[0].ACType1;
      all_Type.value = data;
      // Auto-select first type if requested and not already set
      if (autoSelect && data.length > 0 && !form.value.type) {
        form.value.type = data[0].ACType1;
      }
    }
  } catch (err) {
    console.error("Error fetching types:", err);
    Type.value = [];
    all_Type.value = [];
  }
};

const fetchgroup = async () => {
  try {
    const { data } = await axios.get(`${apiBase}/journal/group`, getToken());

    if (Array.isArray(data)) {
      group.value = data;
      all_group.value = data;
    }
  } catch (err) {
    console.error("Error fetching groups:", err);
    group.value = [];
    all_group.value = [];
  }
};

// const fetchCategories = async (jvType) => {
//   if (!jvType) {
//     categories.value = [];
//     return;
//   }
//   form.value.category = "";
//   try {
//     const { data } = await axios.get(
//       `${apiBase}/voucher-type/category?JVType=${jvType || " "}`,
//       getToken()
//     );
//     if (Array.isArray(data)) {
//       categories.value = data;
//     }
//   } catch (err) {
//     console.error("Error fetching categories:", err);
//     categories.value = [];
//   }
// };
const fetchCategories = async (jvType) => {
  if (!jvType) {
    categories.value = [];
    return;
  }
  form.value.category = "";
  try {
    const { data } = await axios.get(
      `${apiBase}/voucher-type/category?JVType=${jvType || " "}`,
      getToken()
    );
    if (Array.isArray(data) && data.length > 0) {
      categories.value = data;
      // Auto-select first category if not JVR
      if (jvType !== "JVR") {
        form.value.category = data[0].Short;
      }
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
    categories.value = [];
  }
};
const selectedVoucher = computed(() =>
  voucherTypes.value.find((v) => v.JVType === form.value.voucherType)
);

const selectedVoucherDetails = computed(() => {
  if (!selectedVoucher.value) return "";
  const { JVDetails, Address1, Address2, AMCode } = selectedVoucher.value;
  return `${JVDetails || ""} - ${Address1 || ""} - ${Address2 || ""} - ${
    AMCode || ""
  }`;
});

const getAccountDetails = (code) => {
  const found = account_head.value.find((c) => c.AMCode === code);
  return found ? found.AMDetails : "";
};

const debitTotal = computed(() =>
  voucherEntries.value.reduce((sum, e) => sum + (Number(e.debit) || 0), 0)
);
const creditTotal = computed(() =>
  voucherEntries.value.reduce((sum, e) => sum + (Number(e.credit) || 0), 0)
);
const contraTotal = computed(() => debitTotal.value - creditTotal.value);

const voucherTypesLoading = ref(false);
const all_voucherTypes = ref([]);
const fetchVoucherTypes = async () => {
  voucherTypesLoading.value = true;
  try {
    const { data } = await axios.get(`${apiBase}/voucher/type`, getToken());
    voucherTypes.value = data;
    all_voucherTypes.value = data; // Store all voucher types
    voucherTypesLoading.value = false;
  } catch (err) {
    console.error("Error fetching voucher types:", err);
    voucherTypesLoading.value = false;
  }
};

const lastFocusedField = ref(null);

const addEntry = () => {
  // Check required fields and show specific notifications
  if (!form.value.voucherType) {
    showNotification("warning", "Please select Voucher Type");
    voucher_type_ref.value?.focus();
    return;
  }

  if (!form.value.category) {
    showNotification("warning", "Please select Category");
    category_ref.value?.focus();
    return;
  }
  if (!form.value.group) {
    showNotification("warning", "Please select group");
    group_code_ref.value?.focus();
    return;
  }
  if (!form.value.type) {
    showNotification("warning", "Please select type");
    type_ref.value?.focus();
    return;
  }

  if (!form.value.account_head) {
    showNotification("warning", "Please select Account Head");
    account_head_ref.value?.focus();
    return;
  }

  if (!form.value.narration) {
    showNotification("warning", "Please enter Narration");
    narration_ref.value?.focus();
    return;
  }

  if (form.value.debit === 0 && form.value.credit === 0) {
    showNotification("warning", "Please enter either Debit or Credit amount");
    debit_ref.value?.focus();
    return;
  }

  const f = form.value;
  if (
    f.vendorId &&
    f.vendorId.trim() !== "" &&
    !vendorList.value.some((v) => v.VendorId === f.vendorId)
  ) {
    showNotification(
      "error",
      `Vendor ID "${f.vendorId}" not found in vendor list.`
    );
    return;
  }

  if (f.debit > 0 && f.credit === 0) {
    f.credit = 0;
  } else if (f.debit === 0 && f.credit > 0) {
    f.debit = 0;
  } else if (f.debit > 0 && f.credit > 0) {
    if (lastFocusedField.value === "debit") f.credit = 0;
    else if (lastFocusedField.value === "credit") f.debit = 0;
    else f.credit = 0;
  }

  // Construct entry
  const entry = {
    ...JSON.parse(JSON.stringify(f)),
    accountDetails: getAccountDetails(f.account_head),
    vendorInfo: vendorList.value.find((v) => v.VendorId === f.vendorId) || null,
    isEditing: false,
  };

  // Check if Voucher Type is Bank and Category is Payment or Receipt
  const selectedVoucher = voucherTypes.value.find(
    (v) => v.JVType === f.voucherType
  );
  const isBankVoucher = selectedVoucher?.Category?.toUpperCase() === "BANK";
  const isPaymentCategory = f.category === "P";
  const isReceiptCategory = f.category === "R";
  const isEditing =
    editingEntryIndex.value !== null && editingEntryIndex.value !== undefined;

  if (isBankVoucher && isPaymentCategory) {
    // Check if bank contra entry already exists (should be at index 0)
    const existingBankEntry = voucherEntries.value.find(
      (e) => e.account_head === selectedVoucher.AMCode && e.isBankContra
    );

    if (f.debit > 0) {
      // User entered debit - add to bank credit
      // Add user entry before any bank contra entries
      const bankContraIndex = voucherEntries.value.findIndex(
        (e) => e.isBankContra
      );
      if (bankContraIndex !== -1) {
        voucherEntries.value.splice(bankContraIndex, 0, entry);
      } else {
        voucherEntries.value.push(entry);
      }

      if (existingBankEntry) {
        // If editing, subtract the original debit first, then add the new debit
        if (isEditing) {
          existingBankEntry.credit =
            Number(existingBankEntry.credit) -
            Number(originalDebit.value) +
            Number(f.debit);
        } else {
          // Not editing, just add the new debit
          existingBankEntry.credit =
            Number(existingBankEntry.credit) + Number(f.debit);
        }
      } else {
        // Create new bank contra entry at the bottom
        const bankContraEntry = {
          date: f.date,
          voucherType: f.voucherType,
          category: f.category,
          voucherNumber: f.voucherNumber,
          account_head: selectedVoucher.AMCode,
          type: f.type,
          group: f.group,
          accountDetails: selectedVoucher.JVDetails,
          subLedger: null,
          person: "",
          chequeNo: null,
          chequeName: null,
          billNo: null,
          billDate: null,
          narration: f.narration,
          debit: 0,
          credit: Number(f.debit),
          vendorId: null,
          vendorInfo: null,
          isEditing: false,
          isBankContra: true, // Flag to identify this as a bank contra entry
        };

        voucherEntries.value.push(bankContraEntry); // Add at the bottom
      }
    } else if (f.credit > 0) {
      // Add user entry before any bank contra entries
      const bankContraIndex = voucherEntries.value.findIndex(
        (e) => e.isBankContra
      );
      if (bankContraIndex !== -1) {
        voucherEntries.value.splice(bankContraIndex, 0, entry);
      } else {
        voucherEntries.value.push(entry);
      }

      // User entered credit - subtract from bank credit (rare case)
      if (existingBankEntry) {
        // If editing, add back the original credit first, then subtract the new credit
        if (isEditing) {
          existingBankEntry.credit =
            Number(existingBankEntry.credit) +
            Number(originalCredit.value) -
            Number(f.credit);
        } else {
          existingBankEntry.credit =
            Number(existingBankEntry.credit) - Number(f.credit);
        }

        // Remove bank entry if credit becomes 0 or negative
        if (existingBankEntry.credit <= 0) {
          const index = voucherEntries.value.findIndex(
            (e) => e.isBankContra && e.account_head === selectedVoucher.AMCode
          );
          if (index !== -1) {
            voucherEntries.value.splice(index, 1);
          }
        }
      }
    }
  } else if (isBankVoucher && isReceiptCategory) {
    // Check if bank contra entry already exists for Receipt (should be at index 0)
    const existingBankEntry = voucherEntries.value.find(
      (e) => e.account_head === selectedVoucher.AMCode && e.isBankContra
    );

    if (f.credit > 0) {
      // User entered credit - add to bank debit
      // Add user entry before any bank contra entries
      const bankContraIndex = voucherEntries.value.findIndex(
        (e) => e.isBankContra
      );
      if (bankContraIndex !== -1) {
        voucherEntries.value.splice(bankContraIndex, 0, entry);
      } else {
        voucherEntries.value.push(entry);
      }

      if (existingBankEntry) {
        // If editing, subtract the original credit first, then add the new credit
        if (isEditing) {
          existingBankEntry.debit =
            Number(existingBankEntry.debit) -
            Number(originalCredit.value) +
            Number(f.credit);
        } else {
          // Not editing, just add the new credit
          existingBankEntry.debit =
            Number(existingBankEntry.debit) + Number(f.credit);
        }
      } else {
        // Create new bank contra entry at the bottom
        const bankContraEntry = {
          date: f.date,
          voucherType: f.voucherType,
          category: f.category,
          voucherNumber: f.voucherNumber,
          account_head: selectedVoucher.AMCode,
          type: f.type,
          group: f.group,
          accountDetails: selectedVoucher.JVDetails,
          subLedger: null,
          person: "",
          chequeNo: null,
          chequeName: null,
          billNo: null,
          billDate: null,
          narration: f.narration,
          debit: Number(f.credit),
          credit: 0,
          vendorId: null,
          vendorInfo: null,
          isEditing: false,
          isBankContra: true, // Flag to identify this as a bank contra entry
        };

        voucherEntries.value.push(bankContraEntry); // Add at the bottom
      }
    } else if (f.debit > 0) {
      // Add user entry before any bank contra entries
      const bankContraIndex = voucherEntries.value.findIndex(
        (e) => e.isBankContra
      );
      if (bankContraIndex !== -1) {
        voucherEntries.value.splice(bankContraIndex, 0, entry);
      } else {
        voucherEntries.value.push(entry);
      }

      // User entered debit - subtract from bank debit (rare case)
      if (existingBankEntry) {
        // If editing, add back the original debit first, then subtract the new debit
        if (isEditing) {
          existingBankEntry.debit =
            Number(existingBankEntry.debit) +
            Number(originalDebit.value) -
            Number(f.debit);
        } else {
          existingBankEntry.debit =
            Number(existingBankEntry.debit) - Number(f.debit);
        }

        // Remove bank entry if debit becomes 0 or negative
        if (existingBankEntry.debit <= 0) {
          const index = voucherEntries.value.findIndex(
            (e) => e.isBankContra && e.account_head === selectedVoucher.AMCode
          );
          if (index !== -1) {
            voucherEntries.value.splice(index, 1);
          }
        }
      }
    }
  } else {
    // Not a bank voucher, just add the entry normally
    voucherEntries.value.push(entry);
  }

  // Clear the editing index when a new entry is added
  editingIndex.value = null; // Reset
  resetForm();
  // showNotification("success", "Entry added successfully");
};

const resetForm = () => {
  const date = form.value.date; // keep same date
  const group = form.value.group; // keep group
  const type = form.value.type; // keep type
  const narration = form.value.narration; // keep narration
  const voucherType = form.value.voucherType;
  const category = form.value.category;
  const voucherNumber = form.value.voucherNumber;
  const isJVR = form.value.voucherType === "JVR";
  const savedChequeNo = form.value.chequeNo;

  form.value = {
    date,
    voucherType,
    category,
    voucherNumber,
    account_head: "",
    type,
    group,
    accountDetails: "",
    subLedger: null,
    person: "",
    chequeNo: isJVR ? savedChequeNo : null,
    chequeName: null,
    billNo: null,
    billDate: null,
    narration,
    debit: 0,
    credit: 0,
    vendorId: null,
  };

  // Clear editing state
  editingIndex.value = null;
  editingEntryIndex.value = null;
  originalDebit.value = 0;
  originalCredit.value = 0;
  // Focus again on first input
  account_head_ref.value?.focus();
};

const saveEntryEdit = (entry) => {
  entry.isEditing = false;
  showNotification("success", "Entry updated successfully");
};

const deleteEntry = (index) => {
  voucherEntries.value.splice(index, 1);
  showNotification("success", "Entry deleted successfully");
};

const updateVoucher = async () => {
  if (["JVR", "BPV"].includes(form.value.voucherType)) {
    if (debitTotal.value !== creditTotal.value) {
      showNotification("error", "Debit balance is not equal to Credit balance");
      return;
    }
  }

  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const payload = {
    SiteCode: "01",
    JVNo: JVNo_from_params,
    Period: dayjs(form.value.date).format("YYYYMM"),
    JVType: form.value.voucherType,
    JVCat: form.value.category || "",
    JVDate: form.value.date.format("YYYY-MM-DD HH:mm:ss.SSS"),
    TransDate: dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
    Posted: 0,
    UserId: userInfo?.UserId,
    EditUserID: userInfo?.UserId,
    EditDate: dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
    details: voucherEntries.value.map((e) => ({
      AMCode: e?.account_head,
      ASCode: e?.type || "0",
      Person: e?.person || "",
      ChequeNo: e?.chequeNo || "-",
      ChequeName: e?.chequeName || "",
      Narration: e?.narration || "",
      Debit: Number(e?.debit) || 0,
      Credit: Number(e?.credit) || 0,
      AntiCode: e?.account_head,
      AntiSCode: "0",
      ChequePayDate: dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
      ChequeStatus: "Pending",
      VendorId: e?.vendorId || null,
      BillNo: e?.billNo || "",
      BillDate: e?.billDate
        ? dayjs(e.billDate).format("YYYY-MM-DD HH:mm:ss.SSS")
        : null,
      TransType: "pu",
      ChallanNo: null,
      ChallanDate: null,
      CertificateNo: null,
      CertificateIssueDate: null,
      VATAmount: 0,
      TaxPerc: 0,
      TaxPercStd: 0,
    })),
  };

  creating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/journal-master`,
      payload,
      getToken()
    );
    showNotification("success", res.data.message);
    voucherEntries.value = [];
    creating.value = false;
    await fetchVoucherNumber();
    await fetchChequeRegisterList(form.value.voucherType);
  } catch (err) {
    console.error("Error saving voucher:", err.response?.data || err);
    showNotification("error", err.response?.data?.message || err);
    creating.value = false;
  }
};

const isloading = ref(false);
const fetchSubLedgerList = async (value) => {
  isloading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/journal/subledger/check?AMCode=${value}`,
      getToken()
    );
    isloading.value = false;
    if (res.data) {
      subLedgerList.value = res.data.sub_ledger;
      // fist index[0] to subLedger
      form.value.subLedger = res.data.sub_ledger[0]?.ASType;

      all_subLedgerList.value = res.data.sub_ledger;
    }
  } catch (err) {
    console.error("Error fetching sub-ledgers:", err);
    isloading.value = false;
  }
};

const handleVendorSelect = (vendorId) => {
  const vendor = vendorList.value.find((v) => v.VendorId === vendorId);
  if (vendor) {
    form.value.chequeName = vendor.VendorName || "";
    cheque_name_ref.value?.focus();
  } else if (!vendor) {
    cheque_name_ref.value?.focus();
    // form.value.chequeName = "";
  }
};

const handleBackToPersonToAccHead = () => {
  setTimeout(() => {
    if (subLedgerList.value.length !== 0) {
      sub_ledger_ref.value?.focus();
    } else {
      account_head_ref.value?.focus();
    }
  }, 500);
};

// const handleChequeNameToVendorId = () => {
//   setTimeout
//   vendor_id_ref.value?.focus();
// };

const handleSubLedgerEnter = () => {
  // When pressing Enter on sub-ledger, move to person field
  person_ref.value?.focus();
};

const fetchChequeRegisterList = async (value, searchValue) => {
  form.value.chequeNo = " ";
  try {
    const res = await axios.get(
      `${apiBase}/settings/cheque-register-details/allCheque?jvtype=${
        value || " "
      }&search=${searchValue || " "}`,
      getToken()
    );
    if (res.data) {
      const activeAndNullCheques = res.data.data.filter(
        (c) => c.Status === "ACTIVE" || c.Status === null
      );
      chequeRegisterList.value = activeAndNullCheques;
      form.value.chequeNo =
        activeAndNullCheques.length > 0
          ? activeAndNullCheques[0].ChequeNo
          : " ";
      all_chequeRegisterList.value = activeAndNullCheques;
    }
  } catch (err) {
    console.error("Error fetching cheque register list:", err);
  }
};

const vendorList = ref([]);

const fetchVendors = async () => {
  try {
    const res = await axios.get(
      `${apiBase}/settings/vendor-list/all`,
      getToken()
    );
    console.log("res", res);
    if (res.data.success) {
      console.log("res.data", res.data);
      vendorList.value = res.data.data.filter((v) => v.Active === "1");
    } else {
      showNotification("error", "Failed to fetch vendor list");
    }
  } catch (err) {
    console.error(err);
    showNotification("error", "Error fetching vendor list");
  }
};

const filterVendor = (input, option) => {
  const text = input.toLowerCase();
  const vendor = vendorList.value.find((v) => v.VendorId === option.value);
  if (!vendor) return false;
  return (
    vendor.VendorId.toLowerCase().includes(text) ||
    vendor.VendorName.toLowerCase().includes(text)
  );
};

const onDateEnter = (e) => {
  const picker = date_ref.value;
  if (!picker.open) {
    e.preventDefault();
    voucher_type_ref.value?.focus();
  }
};

const onBillDateEnter = (e) => {
  const picker = bill_date_ref.value;
  if (!picker.open) {
    e.preventDefault();
    narration_ref.value?.focus();
  }
};

const isCategoryReceipt = computed(() => form.value.category === "R");

// Get the route parameters
const route = useRoute();
const period = ref(route.query.Period);
const siteCode = ref(route.query.SiteCode);
const jvNo = ref(route.query.JVNo);

const voucher_idwise_data = ref();
const isEditingExistingVoucher = ref(false);
const voucher_idwise = async () => {
  try {
    const res = await axios.get(
      `${apiBase}/journal-master/show?Period=${period.value}&JVNo=${jvNo.value}&SiteCode=${siteCode.value}`,
      getToken()
    );
    if (res.data) {
      isEditingExistingVoucher.value = true;
      voucher_idwise_data.value = res.data;
      // Populate form after data is loaded
      populateFormFromResponse();
      // After population is complete, allow fetching new voucher numbers for new entries
      setTimeout(() => {
        isEditingExistingVoucher.value = false;
      }, 500);
    }
  } catch (error) {
    console.error("Error fetching voucher:", error);
    showNotification("error", "Failed to load voucher data");
  }
};

// Populate form from API response
const populateFormFromResponse = async () => {
  if (!voucher_idwise_data.value) return;

  const data = voucher_idwise_data.value;

  // Populate master form fields
  form.value.date = data.JVDate ? dayjs(data.JVDate) : dayjs();
  form.value.voucherType = data.JVType;
  form.value.category = data.JVCat;
  form.value.voucherNumber = data.JVSerial || data.JVNo;

  // Fetch all account heads first to ensure we have the data
  try {
    const { data: accountHeadsData } = await axios.get(
      `${apiBase}/journal/account-head?JVType=${form.value.voucherType}`,
      getToken()
    );
    if (Array.isArray(accountHeadsData)) {
      account_head.value = accountHeadsData;
      all_account_head.value = accountHeadsData;
    }
  } catch (err) {
    console.error("Error fetching account heads:", err);
  }

  // Populate voucher entries from details
  if (Array.isArray(data.details) && data.details.length > 0) {
    voucherEntries.value = data.details.map((detail) => {
      const accountDetails = getAccountDetails(detail.AMCode);

      return {
        account_head: detail.AMCode,
        accountDetails: accountDetails || detail.AMCode, // Fallback to AMCode if not found
        // type: detail.ASCode,
        subLedger: detail.ASCode,
        person: detail.Person || "",
        chequeNo: detail.ChequeNo || "",
        chequeName: detail.ChequeName || "",
        narration: detail.Narration || "",
        debit: parseFloat(detail.Debit) || 0,
        credit: parseFloat(detail.Credit) || 0,
        billNo: detail.BillNo || "",
        billDate: detail.BillDate ? dayjs(detail.BillDate) : dayjs(),
        group: "",
        voucherType: data.JVType,
        category: data.JVCat,
        date: data.JVDate ? dayjs(data.JVDate) : dayjs(),
        isEditing: false,
        RecNo: detail.RecNo,
        AMCode: detail.AMCode,
        ASCode: detail.ASCode,
      };
    });
  }
};

watch(
  () => form.value.voucherType,
  (newVal) => {
    fetchCategories(newVal);
    // Auto-disable category for JVR
    if (newVal === "JVR") {
      form.value.category = "J";
      form.value.chequeNo = "-";
    }
    // Auto-check Contra if voucher type includes "Bank"
    const selected = voucherTypes.value.find((v) => v.JVType === newVal);
    if (selected && /bank/i.test(selected.JVDetails || selected.JVType)) {
      isContra.value = true;
    } else {
      isContra.value = false;
    }
  },
  { immediate: true }
);

// watch(
//   () => form.value.group,
//   (newVal) => {
//     if (newVal) {
//       fetchType(newVal);
//     }
//   }
// );

watch(
  () => form.value.vendorId,
  (newVal) => {
    if (!newVal) return;
    const vendor = vendorList.value.find((v) => v.VendorId === newVal);
    if (vendor) {
      form.value.vendorName = vendor.VendorName;
      form.value.TINNo = vendor.TINNo;
      form.value.BankName = vendor.BankName;
      form.value.AccountNo = vendor.AccountNo;
      form.value.BranchName = vendor.BranchName;
    }
  }
);

watch(
  () => form.value.category,
  (newVal) => {
    if (newVal === "R") {
      // If category is Receipt, auto-select first cheque number
      if (chequeRegisterList.value.length > 0) {
        form.value.chequeNo = chequeRegisterList.value[0].ChequeNo;
      }
    }
  }
);

const fetchVoucherNumber = async () => {
  const { voucherType, category, date } = form.value;

  if (!voucherType || !category || !date) {
    form.value.voucherNumber = 0;
    return;
  }

  try {
    const period = dayjs(date).format("YYYYMM");

    const { data } = await axios.get(
      `${apiBase}/voucher-no?JVType=${voucherType}&Period=${period}&JVCat=${category}`,
      getToken()
    );

    if (data && data.JVSerial !== undefined) {
      form.value.voucherNumber = data.JVSerial;
    } else {
      console.warn("Unexpected response from /voucher-no:", data);
      form.value.voucherNumber = 0;
    }
  } catch (err) {
    console.error("Error fetching voucher number:", err);
    form.value.voucherNumber = 0;
  }
};

watch(
  [
    () => form.value.voucherType,
    () => form.value.category,
    () => form.value.date,
  ],
  ([newType, newCat, newDate]) => {
    if (newType && newCat && newDate && !isEditingExistingVoucher.value) {
      fetchVoucherNumber();
    }
  }
);

const inputRefs = [
  date_ref,
  voucher_type_ref,
  category_ref,
  group_code_ref,
  type_ref,
  account_head_ref,
  sub_ledger_ref,
  person_ref,
  cheque_no_ref,
  cheque_name_ref,
  bill_no_ref,
  bill_date_ref,
  narration_ref,
  debit_ref,
  credit_ref,
];
let currentIndex = -1;

// Update currentIndex on focus
inputRefs.forEach((refEl, index) => {
  watch(refEl, () => {
    if (refEl.value) {
      refEl.value?.$el?.addEventListener("focusin", () => {
        currentIndex = index;
      });
    }
  });
});

// Handle ESC key (go back)
const handleKeydown = (e) => {
  if (e.key === "Escape" && currentIndex > 0) {
    e.preventDefault();
    const prevRef = inputRefs[currentIndex - 1];
    if (prevRef?.value?.focus) {
      prevRef.value.focus();
    } else if (prevRef?.value?.$el?.focus) {
      prevRef.value.$el.focus();
    }
  }
};

onMounted(() => {
  fetchVoucherTypes();
  // fetchSubLedgerList();
  voucher_idwise();
  fetchChequeRegisterList();
  fetchCategories();
  fetchgroup();
  // fetchAccount_head();
  fetchVendors();
  window.addEventListener("keydown", handleKeydown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
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
</style>

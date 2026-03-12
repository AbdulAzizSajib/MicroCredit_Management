<template>
  <MainLayout>
   
    <div class="bg-white rounded-xl py-6 space-y-8">
      <!-- Company & Tabs -->
      <div>
        <label class="block font-bold mb-1">Company Name</label>
        <a-input class="w-full" v-model:value="companyName" readonly />
      </div>
      <!-- Account Code Row: Section from Image 2 -->
      <div class="bg-gray-50 rounded-lg shadow p-4 my-4">
        <label class="font-semibold mb-2 block">Account Code :</label>
        <div class="grid grid-cols-8 gap-3 items-center">
          <div class="flex flex-col items-center">
            <span class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full">
              Category of accounts
            </span>
            <a-input size="small" class="w-40 text-center" type="number" v-model:value="categoryCode"
              ref="categoryCode_ref" placeholder="Enter Category code"
              @input="(e) => restrictTwoDigits(e, 'categoryCode', headCode_ref)"
              @pressEnter="restrictEnter($event, headCode_ref)" />
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full">
              Head of accounts
            </span>
            <a-input size="small" class="w-40 text-center" type="number" v-model:value="headCode" ref="headCode_ref"
              placeholder="Enter Head code" @input="(e) => restrictTwoDigits(e, 'headCode', subHeadCode_ref)"
              @pressEnter="restrictEnter($event, subHeadCode_ref)" />
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full">
              Sub-head of accounts
            </span>
            <a-input size="small" class="w-40 text-center" type="number" v-model:value="subHeadCode"
              ref="subHeadCode_ref" placeholder="Enter Sub-head code"
              @input="(e) => restrictTwoDigits(e, 'subHeadCode', deptCode_ref)"
              @pressEnter="restrictEnter($event, deptCode_ref)" />
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full">
              Department / Cost centre
            </span>
            <a-input size="small" class="w-40 text-center" type="number" v-model:value="deptCode" ref="deptCode_ref"
              placeholder="Enter Dept code" @input="(e) => restrictTwoDigits(e, 'deptCode', businessCode_ref)"
              @pressEnter="restrictEnter($event, businessCode_ref)" />
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full">
              Business
            </span>
            <a-input size="small" class="w-40 text-center" type="number" v-model:value="businessCode"
              ref="businessCode_ref" placeholder="Enter Business code" @input="
                (e) => restrictTwoDigits(e, 'businessCode', subBusinessCode_ref)
              " @pressEnter="restrictEnter($event, subBusinessCode_ref)" />
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full">
              Sub. Business
            </span>
            <a-input size="small" class="w-40 text-center" type="number" v-model:value="subBusinessCode"
              ref="subBusinessCode_ref" placeholder="Enter Sub-business code" @input="
                (e) => restrictTwoDigits(e, 'subBusinessCode', subDeptCode_ref)
              " @pressEnter="restrictEnter($event, subDeptCode_ref)" />
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full">
              Sub Department
            </span>
            <a-input size="small" class="w-40 text-center" type="number" v-model:value="subDeptCode"
              ref="subDeptCode_ref" placeholder="Enter Sub-dept code"
              @input="(e) => restrictTwoDigits(e, 'subDeptCode', location_ref)"
              @pressEnter="restrictEnter($event, location_ref)" />
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full">
              Location
            </span>
            <!--            <a-input-->
            <!--              size="small"-->
            <!--              class="w-full text-center"-->
            <!--              type="number"-->
            <!--              v-model:value="location"-->
            <!--              ref="location_ref"-->
            <!--              placeholder="Enter Location"-->
            <!--              @input="(e) => restrictTwoDigits(e, 'location')"-->
            <!--              @keydown.enter.prevent="focusAccountDetails"-->
            <!--            />-->
            <a-input size="small" class="w-full text-center" type="number" v-model:value="location" ref="location_ref"
              placeholder="Enter Location" @input="(e) => restrictTwoDigits(e, 'location')"
              @pressEnter="cashflow_id_ref.focus()" />
          </div>
        </div>
        <div class="flex items-center gap-2 text-green-700 font-mono text-lg mt-4">
          <a-button @click="open = true" type="primary" danger>Search</a-button>
        </div>
        <div class="mt-4">
          <label class="block font-bold">Account Details</label>
          <a-input v-model:value="accountDetails" placeholder="Account Details" readonly />
        </div>
      </div>
      <!-- Account Fields -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div>
          <label class="block font-bold">Cash Flow ID</label>
          <a-select v-model:value="cashFlowId" class="w-full" placeholder="Select Cash Flow" ref="cashflow_id_ref"
            @select="cheque_name_ref?.focus()">
            <a-select-option v-for="cf in cashFlows" :key="cf.CashFlowId" :value="cf.CashFlowId">
              {{ cf.Details }} --- {{ cf.CashFlowId }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <label class="block font-bold">Cheque Name</label>
          <a-input v-model:value="chequeName" placeholder="Cheque Name" ref="cheque_name_ref"
            @pressEnter="account_type_ref?.focus" />
        </div>
        <div>
          <label class="block font-bold">Account Type</label>
          <a-select v-model:value="accountType" class="w-full" placeholder="Account Type" ref="account_type_ref"
            @select="
              () => {
                if (accountType === 'PL') {
                  subledger_ref?.focus();
                } else {
                  groupcode_ref?.focus();
                }
              }
            ">
            <a-select-option value="PL">PL</a-select-option>
            <a-select-option value="BL">BL</a-select-option>
          </a-select>
        </div>
        <div>
          <label class="block font-bold">Group Code</label>
          <a-select v-model:value="selectedGroup" class="w-full" placeholder="Group Code"
            :disabled="accountType === 'PL'" ref="groupcode_ref" @select="subledger_ref?.focus">
            <a-select-option v-for="grp in groupCodes" :key="grp.GroupCode" :value="grp.GroupCode">
              {{ grp.GroupName }} --- {{ grp.GroupCode }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <label class="block font-bold">Sub-Ledger</label>
          <a-select v-model:value="subLedger" class="w-full" placeholder="Sub-Ledger" ref="subledger_ref" @select="
              () => {
                if (subLedger === 1) {
                  category_ref?.focus();
                } else {
                  secondary_db_ref?.focus();
                }
              }
            ">
            <a-select-option :value="0">No</a-select-option>
            <a-select-option :value="1">Yes</a-select-option>
          </a-select>
        </div>
        <div class="mt-5">
          <div class="flex items-center space-x-2">
            <input type="checkbox" class="checkbox-size" id="vendor" v-model="slVendor" />
            <label for="vendor" class="cursor-pointer flex items-center">
              <span class="ml-2 text-gray-700">Vendor</span>
            </label>
          </div>
        </div>
      </div>
      <!-- Sub-Ledger Range Table -->

      <div class="bg-gray-50 rounded-lg p-4 space-y-4 shadow">
        <div class="font-semibold mb-2">Sub-Ledger Range:</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <a-select placeholder="Category" class="w-full" v-model:value="selectedCategory" :disabled="!subLedger"
            ref="category_ref" @select="start_id_ref.focus()">
            <a-select-option v-for="cat in categories" :key="cat.ASType" :value="cat.ASType">
              {{ cat.ASDetails }}
            </a-select-option>
          </a-select>

          <a-input-number v-model:value="startId" addonBefore="Start ID" class="w-full" :disabled="!subLedger"
            ref="start_id_ref" @pressEnter="end_id_ref.focus()" @focus="$event.target.select()" />
          <a-input-number v-model:value="endId" addonBefore="End ID" class="w-full" :disabled="!subLedger"
            ref="end_id_ref" @pressEnter="
              () => {
                category_ref.focus();
                handleSubLedgerEnter();
              }
            " @focus="$event.target.select()" />
        </div>
        <div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-blue-100">
                <th class="py-2 px-4 rounded-tl-lg">Category</th>
                <th class="py-2 px-4">Start ID</th>
                <th class="py-2 px-4 rounded-tr-lg">End ID</th>
              </tr>
            </thead>
            <tbody>
              <!--              <tr class="hover:bg-blue-50 transition">-->
              <!--                <td class="py-2 px-4">{{ selectedCategory }}</td>-->
              <!--                <td class="py-2 px-4">{{ startId }}</td>-->
              <!--                <td class="py-2 px-4">{{ endId }}</td>-->
              <!--              </tr>-->
              <tr v-for="(item, index) in subLedgerRanges" :key="index">
                <td class="px-4 py-2 border">{{ item.category }}</td>
                <td class="px-4 py-2 border">{{ item.startId }}</td>
                <td class="px-4 py-2 border flex justify-between items-center">
                  <span>{{ item.endId }}</span>
                  <!--                  <button-->
                  <!--                      @click="removeSubLedger(index)"-->
                  <!--                      class="text-red-800 hover:text-red-700"-->
                  <!--                  >-->
                  <!--                    🗑-->
                  <!--                  </button>-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Subsidiary Ledger -->
      <!--      <div class="bg-gray-50 rounded-lg p-4 space-y-4 shadow" :class="{ 'opacity-50 pointer-events-none': !subLedger }">-->
      <div class="bg-gray-50 rounded-lg p-4 space-y-4 shadow">
        <div class="font-semibold mb-2">Subsidiary Ledger:</div>
        <div class="flex flex-wrap gap-3">
          <a-checkbox v-model:checked="slOrganization" :disabled="!subLedger">Organization</a-checkbox>
          <a-checkbox v-model:checked="slEmployee" :disabled="!subLedger">Employee</a-checkbox>
          <a-checkbox v-model:checked="slProduct" :disabled="!subLedger">Product</a-checkbox>
          <a-checkbox v-model:checked="slBrand" :disabled="!subLedger">Brand</a-checkbox>
          <a-checkbox v-model:checked="slProductGroup" :disabled="!subLedger">Product Group</a-checkbox>
          <a-checkbox v-model:checked="slVehicle" :disabled="!subLedger">Vehicle</a-checkbox>
        </div>
      </div>
      <!-- Secondary DB & GL -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="font-bold block">Secondary DB</label>
          <a-select v-model:value="secondaryDB" class="w-full" placeholder="Secondary DB" ref="secondary_db_ref"
            @select="
              () => {
                if (secondaryDB === 1) {
                  status_ref?.focus();
                } else {
                  status_ref?.focus();
                }
              }
            ">
            <a-select-option value="N">No</a-select-option>
            <a-select-option value="Y">Yes</a-select-option>
          </a-select>
        </div>
        <div>
          <label class="font-bold block">Status</label>
          <a-select v-model:value="status" class="w-full" placeholder="Active" ref="status_ref" @select="
              () => {
                if (status === 1) {
                  save_ref?.focus();
                } else {
                  save_ref?.focus();
                }
              }
            ">
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
      </div>
      <!--      <div class="bg-gray-50 rounded-lg p-4 space-y-4 shadow w-full" :class="{ 'opacity-50 pointer-events-none': secondaryDB === 'N' }">-->
      <div class="bg-gray-50 rounded-lg p-4 space-y-4 shadow w-full">
        <div class="font-semibold mt-2">Secondary GL:</div>
        <div class="flex flex-wrap items-center gap-3">
          <a-checkbox v-model:checked="sdbCustomer" :disabled="secondaryDB === 'N'">Customer</a-checkbox>
          <a-checkbox v-model:checked="sdbEmployee" :disabled="secondaryDB === 'N'">Employee</a-checkbox>
          <a-checkbox v-model:checked="sdbProduct" :disabled="secondaryDB === 'N'">Product</a-checkbox>
        </div>
      </div>
      <!-- Actions -->
      <div class="flex justify-end gap-4 mt-6">
        <a-button type="primary" class="px-8 py-2" @click="saveAccount" :loading="creating" ref="save_ref">
          Save
        </a-button>
      </div>
    </div>

    <!-- search  -->
    <a-modal width="1000px" v-model:open="open" centered title="Account Search" @ok="open = false">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="font-bold block">Code</label>
          <a-input v-model:value="filterTextCode" placeholder="Search by Code" class="w-full"
            @pressEnter="() => fetchSearchResults(true)" />
        </div>

        <div>
          <label class="font-bold block">Find On Account Name</label>
          <a-input v-model:value="filterText" placeholder="Search by Name" class="w-full"
            @pressEnter="() => fetchSearchResults(true)" />
        </div>
      </div>
      <div v-if="isSelecting" class="text-center py-4">
        <span> <a-spin /> please wait...</span>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto h-[500px]">
        <table class="min-w-full table-auto border-collapse">
          <thead class="sticky top-0 z-10">
            <tr class="bg-gray-100 border-b">
              <th class="py-2 px-4 text-left">Account Details</th>
              <th class="py-2 px-4 text-left">Account Code</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in searchResults" :key="item.AMCode" class="border-b hover:bg-gray-50 cursor-pointer"
              @click="selectAccount(item)">
              <td class="py-2 px-4">{{ item.AMDetails }}</td>
              <td class="py-2 px-4">{{ item.AMCode }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="isLoadingMore" class="bottom-0 w-full text-center py-2 bg-white">
          <a-spin /> Loading...
        </div>
        <div v-if="searchResults.length < totalResults" class="text-center mt-8">
          <a-button type="dashed" @click="loadMoreResults">Load More</a-button>
        </div>
      </div>
    </a-modal>
    <!-- Not found modal -->
    <a-modal v-model:open="notFoundModal" title="Account Code Not Found" @ok="notFoundModal = false" :footer="null"
      :width="320" centered>
      <div class="text-right mt-5">
        <button type="button"
          class="bg-white text-danger border border-danger hover:bg-danger hover:text-white focus:bg-danger focus:text-white px-5 py-1 rounded-md"
          ref="ok_button_ref" @click="
            () => {
              notFoundModal = false;
              focusTriggeredInput();
            }
          ">
          OK
        </button>
      </div>
    </a-modal>
  </MainLayout>
</template>

<style>
.checkbox-size {
  width: 16px;
  height: 16px;
}
</style>

<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";
import axios from "axios";

import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: 'search-chart-of-accounts' });
};

const open = ref(false);

const searchResults = ref([]);
const filterText = ref("");
const filterTextCode = ref("");
const categories = ref([]);
const groupCodes = ref([]);
const selectedCategory = ref(null);
const selectedGroup = ref("");
const startId = ref(0);
const endId = ref(0);
const detailsData = ref([]);
const companyCode = localStorage.getItem("company_code") || "";
// const companyCode = '28';
// const companyName = ref(localStorage.getItem("company_name") || "");
// states
const categoryCode = ref("");
const accountDetails = ref("");
const accountDetailsPart = ref("");
const rtType = ref("");
const discretionary = ref("");
const headCode = ref("");
const headDetails = ref("");

const subHeadCode = ref("");
const subHeadDetails = ref("");

const deptCode = ref("");
const deptDetails = ref("");

const businessCode = ref("");
const businessDetails = ref("");

const subBusinessCode = ref("");
const subBusinessDetails = ref("");

const subDeptCode = ref("");
const subDeptDetails = ref("");

const location = ref("");
const notFoundModal = ref(false);

const cashFlows = ref([]);
const cashFlowId = ref(null);
const chequeName = ref("");
const accountType = ref("PL");
const subLedger = ref(0);
const slVendor = ref(false);
const slOrganization = ref(false);
const slEmployee = ref(false);
const slProduct = ref(false);
const slBrand = ref(false);
const slProductGroup = ref(false);
const slVehicle = ref(false);
const secondaryDB = ref("N");
const status = ref("Y");
const sdbCustomer = ref(false);
const sdbEmployee = ref(false);
const sdbProduct = ref(false);
// handleCategory
const categoryCode_ref = ref();
const headCode_ref = ref();
const subHeadCode_ref = ref();
const deptCode_ref = ref();
const businessCode_ref = ref();
const subBusinessCode_ref = ref();
const subDeptCode_ref = ref();
const location_ref = ref();
const ok_button_ref = ref();
const triggered_input_ref = ref();
const skipErrors = ref(false);
const cashflow_id_ref = ref();
const cheque_name_ref = ref();
const account_type_ref = ref();
const subledger_ref = ref();
const groupcode_ref = ref();
const category_ref = ref();
const secondary_db_ref = ref();
const start_id_ref = ref();
const end_id_ref = ref();
const status_ref = ref();
const save_ref = ref();
// helper: restrict input

// watch(accountType, (newVal) => {
//   if (newVal === 'PL') selectedGroup.value = "";
// });
// const focusAccountDetails = () => {
//   cashflow_id_ref.value?.focus();
//   cashflow_id_ref.value?.select();
// };
const restrictEnter = (e, ref_code) => {
  if (!e?.target?.value) {
    ref_code?.focus();
    ref_code?.select();
    return 0;
  }
  if (e?.target?.value?.length === 1) {
    triggered_input_ref.value = e?.target;
    notFoundModal.value = true;
    setTimeout(() => {
      ok_button_ref.value?.focus();
    }, 200);
  }
};

const restrictTwoDigits = (e, field, ref_code) => {
  if (e?.target?.value === "00") {
    ref_code?.focus();
    ref_code?.select();
    return 0;
  }

  let val = e.target.value.replace(/\D/g, "");
  if (val.length > 2) {
    val = val.slice(0, 2);
    ref_code?.focus();
    ref_code?.select();
  }

  switch (field) {
    case "categoryCode":
      categoryCode.value = val;
      fetchCategory(e);
      if (e?.target?.value?.length === 2) {
        ref_code?.focus();
        ref_code?.select();
      }
      break;
    case "headCode":
      headCode.value = val;
      fetchHead(e);
      if (e?.target?.value?.length === 2) {
        ref_code?.focus();
        ref_code?.select();
      }
      break;
    case "subHeadCode":
      subHeadCode.value = val;
      fetchSubHead(e);
      if (e?.target?.value?.length === 2) {
        ref_code?.focus();
        ref_code?.select();
      }
      break;
    case "deptCode":
      deptCode.value = val;
      fetchDept(e);
      if (e?.target?.value?.length === 2) {
        ref_code?.focus();
        ref_code?.select();
      }
      break;
    case "businessCode":
      businessCode.value = val;
      fetchBusiness(e);
      if (e?.target?.value?.length === 2) {
        ref_code?.focus();
        ref_code?.select();
      }
      break;
    case "subBusinessCode":
      subBusinessCode.value = val;
      fetchSubBusiness(e);
      if (e?.target?.value?.length === 2) {
        ref_code?.focus();
        ref_code?.select();
      }
      break;
    case "subDeptCode":
      subDeptCode.value = val;
      fetchSubDept(e);
      if (e?.target?.value?.length === 2) {
        ref_code?.focus();
        ref_code?.select();
      }
      break;
    case "location":
      location.value = val;
      if (e?.inputType === "insertLineBreak" || e?.key === "Enter") {
        cashflow_id_ref.value?.focus();
        cashflow_id_ref.value?.select();
      }
      break;
  }
};
const focusTriggeredInput = () => {
  if (triggered_input_ref.value) {
    triggered_input_ref.value.focus();
    triggered_input_ref.value.select(); // optional: highlight the text
  }
};
// API calls

const categoryDetails = ref("");
const fetchCategory = async (e) => {
  if (!categoryCode.value || categoryCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/accontrol?ACType1=${categoryCode.value}`,
      getToken()
    );
    const data = await res.json();
    if (data?.ControlDetail) {
      categoryDetails.value = data.ControlDetail;
    } else {
      categoryDetails.value = "";
      if (!skipErrors.value) {
        triggered_input_ref.value = e?.target;
        notFoundModal.value = true;
        setTimeout(() => {
          ok_button_ref.value?.focus();
        }, 200);
      }
    }
    updateAccountDetails();
  } catch {
    categoryDetails.value = "";
    if (!skipErrors.value) {
      triggered_input_ref.value = e?.target;
      notFoundModal.value = true;
      setTimeout(() => {
        ok_button_ref.value?.focus();
      }, 200);
    }
    updateAccountDetails();
  }
};
const fetchHead = async (e) => {
  if (!headCode.value || headCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/actype?ACType1=${categoryCode.value}&ACType2=${headCode.value}`,
      getToken()
    );
    const data = await res.json();
    if (data?.TypeDetail) {
      headDetails.value = data.TypeDetail;
    } else {
      headDetails.value = "";
      if (!skipErrors.value) {
        triggered_input_ref.value = e?.target;
        notFoundModal.value = true;
        setTimeout(() => {
          ok_button_ref.value?.focus();
        }, 200);
      }
    }
    updateAccountDetails();
  } catch {
    headDetails.value = "";
    if (!skipErrors.value) {
      triggered_input_ref.value = e?.target;
      notFoundModal.value = true;
      setTimeout(() => {
        ok_button_ref.value?.focus();
      }, 200);
    }
    updateAccountDetails();
  }
};

const fetchSubHead = async (e) => {
  if (!subHeadCode.value || subHeadCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/actypesub?ACType1=${categoryCode.value}&ACType2=${headCode.value}&ACType3=${subHeadCode.value}`,
      getToken()
    );
    const data = await res.json();
    subHeadDetails.value = data?.SubTypeDetail || "";
    if (!subHeadDetails.value) {
      if (!skipErrors.value) {
        triggered_input_ref.value = e?.target;
        notFoundModal.value = true;
        setTimeout(() => {
          ok_button_ref.value?.focus();
        }, 200);
      }
    }
    updateAccountDetails();
  } catch {
    subHeadDetails.value = "";
    if (!skipErrors.value) {
      triggered_input_ref.value = e?.target;
      notFoundModal.value = true;
      setTimeout(() => {
        ok_button_ref.value?.focus();
      }, 200);
    }
    updateAccountDetails();
  }
};

const fetchDept = async (e) => {
  if (!deptCode.value || deptCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/department?Dept=${deptCode.value}`,
      getToken()
    );
    const data = await res.json();
    deptDetails.value = data?.DeptDetail || "";
    if (!deptDetails.value) {
      if (!skipErrors.value) {
        triggered_input_ref.value = e?.target;
        notFoundModal.value = true;
        setTimeout(() => {
          ok_button_ref.value?.focus();
        }, 200);
      }
    }
    updateAccountDetails();
  } catch {
    deptDetails.value = "";
    if (!skipErrors.value) {
      triggered_input_ref.value = e?.target;
      notFoundModal.value = true;
      setTimeout(() => {
        ok_button_ref.value?.focus();
      }, 200);
    }
    updateAccountDetails();
  }
};

const fetchBusiness = async (e) => {
  if (!businessCode.value || businessCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/business?BusiNo=${businessCode.value}`,
      getToken()
    );
    const data = await res.json();
    businessDetails.value = data?.Business || "";
    if (!businessDetails.value) {
      if (!skipErrors.value) {
        triggered_input_ref.value = e?.target;
        notFoundModal.value = true;
        setTimeout(() => {
          ok_button_ref.value?.focus();
        }, 200);
      }
    }
    updateAccountDetails();
  } catch {
    businessDetails.value = "";
    if (!skipErrors.value) {
      triggered_input_ref.value = e?.target;
      notFoundModal.value = true;
      setTimeout(() => {
        ok_button_ref.value?.focus();
      }, 200);
    }
    updateAccountDetails();
  }
};

const fetchSubBusiness = async (e) => {
  if (!subBusinessCode.value || subBusinessCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/business/sub?CompanyCode=${companyCode}&BusiNo=${businessCode.value}&SubBusiNo=${subBusinessCode.value}`,
      getToken()
    );
    const data = await res.json();
    subBusinessDetails.value = data?.SubBusinessName || "";
    if (!subBusinessDetails.value) {
      if (!skipErrors.value) {
        triggered_input_ref.value = e?.target;
        notFoundModal.value = true;
        setTimeout(() => {
          ok_button_ref.value?.focus();
        }, 200);
      }
    }
    updateAccountDetails();
  } catch {
    subBusinessDetails.value = "";
    if (!skipErrors.value) {
      triggered_input_ref.value = e?.target;
      notFoundModal.value = true;
      setTimeout(() => {
        ok_button_ref.value?.focus();
      }, 200);
    }
    updateAccountDetails();
  }
};

const fetchSubDept = async (e) => {
  if (!subDeptCode.value || subDeptCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/department/sub?CompanyCode=${companyCode}&DeptNo=${deptCode.value}&SubDept=${subDeptCode.value}`,
      getToken()
    );
    const data = await res.json();
    subDeptDetails.value = data?.SubDeptName || "";
    if (!subDeptDetails.value) {
      if (!skipErrors.value) {
        triggered_input_ref.value = e?.target;
        notFoundModal.value = true;
        setTimeout(() => {
          ok_button_ref.value?.focus();
        }, 200);
      }
    }
    updateAccountDetails();
  } catch {
    subDeptDetails.value = "";
    if (!skipErrors.value) {
      triggered_input_ref.value = e?.target;
      notFoundModal.value = true;
      setTimeout(() => {
        ok_button_ref.value?.focus();
      }, 200);
    }
    updateAccountDetails();
  }
};

const updateAccountDetails = () => {
  accountDetails.value = [
    categoryDetails.value,
    headDetails.value,
    subHeadDetails.value,
    deptDetails.value,
    businessDetails.value,
    subBusinessDetails.value,
    subDeptDetails.value,
  ]
    .filter(Boolean)
    .join(" - ");
};

// Search API

const currentPage = ref(1);
const perPage = ref(10);
const totalResults = ref(0);
const isLoadingMore = ref(false);

const fetchSearchResults = async (reset = true) => {
  if (reset) {
    currentPage.value = 1;
    searchResults.value = [];
  }

  const nameQuery = filterText.value?.trim() || "";
  const codeQuery = filterTextCode.value?.trim() || "";

  // Build URL
  const params = new URLSearchParams();
  params.append("CompanyCode", companyCode);
  if (nameQuery) params.append("query", nameQuery);
  if (codeQuery) params.append("Code", codeQuery);
  params.append("page", currentPage.value);
  params.append("per_page", perPage.value);

  const url = `${apiBase}/accounting/search?${params.toString()}`;

  try {
    if (!reset) isLoadingMore.value = true;

    const res = await fetch(url, {
      headers: {
        Authorization: getToken().headers.Authorization,
      },
    });
    const data = await res.json();

    searchResults.value = reset
      ? data.data || []
      : [...searchResults.value, ...(data.data || [])];

    totalResults.value = data.total || searchResults.value.length;
  } catch (err) {
    console.error("Search API error:", err);
    if (reset) searchResults.value = [];
  } finally {
    isLoadingMore.value = false;
  }
};

// Watch filter text with debounce
let filterTimeout;
watch(
  filterText,
  () => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      fetchSearchResults(true);
    }, 300);
  },
  { immediate: true }
);

watch(filterTextCode, () => {
  clearTimeout(filterTimeout);
  filterTimeout = setTimeout(() => {
    fetchSearchResults(true);
  }, 300);
});
// Load more for pagination (call on scroll or button click)
const loadMoreResults = async () => {
  if (searchResults.value.length >= totalResults.value) return;
  currentPage.value += 1;
  await fetchSearchResults(false);
};

// watch(filterText, fetchSearchResults, { immediate: true });

const isSelecting = ref(false);
// Select account from modal
const selectAccount = async (item) => {
  isSelecting.value = true;
  skipErrors.value = true;
  categoryCode.value = item.ACType1 || "";
  headCode.value = item.ACType2 || "";
  subHeadCode.value = item.ACType3 || "";
  deptCode.value = item.Dept || "";
  businessCode.value = item.BusiNo || "";
  subBusinessCode.value = item.SubBusiNo || "";
  subDeptCode.value = item.SubDept || "";
  location.value = item.Location || "";

  try {
    // Fetch all details in parallel
    await Promise.all([
      fetchCategory(),
      fetchHead(),
      fetchSubHead(),
      fetchDept(),
      fetchBusiness(),
      fetchSubBusiness(),
      fetchSubDept(),
    ]);
  } finally {
    skipErrors.value = false;
    isSelecting.value = false; // stop loader
    open.value = false; // close modal
  }
};
const userInfo = JSON.parse(localStorage.getItem("user_info"));
onMounted(async () => {
  const catRes = await fetch(`${apiBase}/acsubcategory`, getToken());
  categories.value = await catRes.json();

  const grpRes = await fetch(`${apiBase}/acgroup`, getToken());
  groupCodes.value = await grpRes.json();

  const cashRes = await fetch(`${apiBase}/cashflow`, getToken());
  const data = await cashRes.json();
  console.log("CashFlows fetched:", data);
  cashFlows.value = data;
});
const creating = ref(false);
const saveAccount = async () => {
  const detailData = detailsData.value?.map(d => ({
    ASType: d.ASType,
    StartID: String(d.StartID),
    EndID: String(d.EndID)
  })) || []
  const payload = {
    AMCode: `${categoryCode.value}-${headCode.value}-${subHeadCode.value}-${deptCode.value}-${businessCode.value}-${subBusinessCode.value}-${subDeptCode.value}-${location.value}`,
    CompanyCode: companyCode,
    AMDetails: accountDetails.value,
    AMDetailsPart: accountDetailsPart.value || "Part Details",
    ACType1: categoryCode.value,
    ACType2: headCode.value,
    ACType3: subHeadCode.value,
    Dept: deptCode.value,
    BusiNo: businessCode.value,
    SubBusiNo: subBusinessCode.value,
    SubDept: subDeptCode.value,
    Location: location.value,
    PLBL: accountType.value,
    GroupCode: selectedGroup.value,
    CashFlowId: cashFlowId.value ? Number(cashFlowId.value) : 0,
    Subledger: !!subLedger.value,
    // ASType: selectedCategory.value,
    // StartID: startId.value,
    // EndID: endId.value,
    ChequeName: chequeName.value,
    Active: status.value ? "Y" : "N",
    SL_Vendor: slVendor.value ? "Y" : "N",
    SL_Organization: slOrganization.value ? "Y" : "N",
    SL_Employee: slEmployee.value ? "Y" : "N",
    SL_Product: slProduct.value ? "Y" : "N",
    SL_Brand: slBrand.value ? "Y" : "N",
    SL_ProductGroup: slProductGroup.value ? "Y" : "N",
    SL_Vehicle: slVehicle.value ? "Y" : "N",
    SeconderyDB: secondaryDB.value,
    SDB_Customer: sdbCustomer.value ? "Y" : "N",
    SDB_Employee: sdbEmployee.value ? "Y" : "N",
    SDB_Product: sdbProduct.value ? "Y" : "N",
    DetailsData: detailData,
    UserId: userInfo?.UserId,
    RTType: rtType.value || "M",
    Discretionary: discretionary.value ? "Y" : "N",
  };
  creating.value = true;
  try {
    const res = await axios.post(`${apiBase}/acmaster`, payload, getToken());
    showNotification("success", res.data.message);
    console.log("Created account:", res.data);
    creating.value = false;
  } catch (err) {
    console.error("Error saving account:", err.response?.data || err);
    showNotification("error", "Failed to save account. See console.");
    creating.value = false;
  }
};

const subLedgerRanges = ref([]);

watch(subLedgerRanges, () => {
  detailsData.value = subLedgerRanges.value.map(r => ({
    ASType: r.category,
    StartID: r.startId,
    EndID: r.endId
  }));
}, { deep: true });
// Handle Enter Key
const handleSubLedgerEnter = (event) => {
  if (selectedCategory.value && startId.value !== " " && endId.value !== " ") {
    subLedgerRanges.value.push({
      category: selectedCategory.value,
      startId: startId.value,
      endId: endId.value,
    });
    // selectedCategory.value = "";
    startId.value = 0;
    endId.value = 0;
  }
};
// const removeSubLedger = (index) => {
//   subLedgerRanges.value.splice(index, 1);
// };
</script>

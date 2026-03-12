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
            <span
              class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full"
            >
              Category of accounts
            </span>
            <a-input
              size="small"
              class="w-40"
              type="number"
              v-model:value="categoryCode"
              ref="categoryCode_ref"
              placeholder="Enter Category code"
              @input="(e) => restrictTwoDigits(e, 'categoryCode', headCode_ref)"
              @pressEnter="
                handleEnter($event, categoryCode, headCode_ref, 'categoryCode')
              "
              @change="fetchCategory"
            />
          </div>

          <div class="flex flex-col items-center">
            <span
              class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full"
            >
              Head of accounts
            </span>
            <a-input
              size="small"
              class="w-40"
              type="number"
              v-model:value="headCode"
              placeholder="Enter Head code"
              ref="headCode_ref"
              @input="(e) => restrictTwoDigits(e, 'headCode', subHeadCode_ref)"
              @change="fetchHead"
              @pressEnter="fetchHead"
            />
          </div>
          <div class="flex flex-col items-center">
            <span
              class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full"
            >
              Sub-head of accounts
            </span>
            <a-input
              size="small"
              class="w-40"
              type="number"
              v-model:value="subHeadCode"
              ref="subHeadCode_ref"
              placeholder="Enter Sub-head code"
              @input="(e) => restrictTwoDigits(e, 'subHeadCode', deptCode_ref)"
              @change="fetchSubHead"
              @pressEnter="fetchSubHead"
            />
          </div>
          <div class="flex flex-col items-center">
            <span
              class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full"
            >
              Department / Cost centre
            </span>
            <a-input
              size="small"
              class="w-40"
              type="number"
              v-model:value="deptCode"
              ref="deptCode_ref"
              placeholder="Enter Dept code"
              @input="(e) => restrictTwoDigits(e, 'deptCode', businessCode_ref)"
              @change="fetchDept"
              @pressEnter="fetchDept"
            />
          </div>
          <div class="flex flex-col items-center">
            <span
              class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full"
            >
              Business
            </span>
            <a-input
              size="small"
              class="w-40"
              type="number"
              v-model:value="businessCode"
              ref="businessCode_ref"
              placeholder="Enter Business code"
              @input="
                (e) => restrictTwoDigits(e, 'businessCode', subBusinessCode_ref)
              "
              @change="fetchBusiness"
              @pressEnter="fetchBusiness"
            />
          </div>
          <div class="flex flex-col items-center">
            <span
              class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full"
            >
              Sub. Business
            </span>
            <a-input
              size="small"
              class="w-40"
              type="number"
              v-model:value="subBusinessCode"
              ref="subBusinessCode_ref"
              placeholder="Enter Sub-business code"
              @input="
                (e) => restrictTwoDigits(e, 'subBusinessCode', subDeptCode_ref)
              "
              @change="fetchSubBusiness"
              @pressEnter="fetchSubBusiness"
            />
          </div>
          <div class="flex flex-col items-center">
            <span
              class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full"
            >
              Sub Department
            </span>
            <a-input
              size="small"
              class="w-40"
              type="number"
              v-model:value="subDeptCode"
              ref="subDeptCode_ref"
              placeholder="Enter Sub-dept code"
              @input="(e) => restrictTwoDigits(e, 'subDeptCode', location_ref)"
              @change="fetchSubDept"
              @pressEnter="fetchSubDept"
            />
          </div>
          <div class="flex flex-col items-center">
            <span
              class="text-[12px] py-1 font-bold text-blue-900 mb-1 px-2 text-center bg-gray-100 rounded w-full"
            >
              Location
            </span>
            <a-input
              size="small"
              class="w-full"
              type="number"
              placeholder="Enter Location"
              v-model:value="location"
              ref="location_ref"
              @input="(e) => restrictTwoDigits(e, 'location', location_ref)"
            />
          </div>
        </div>
        <div
          class="flex items-center gap-2 text-green-700 font-mono text-lg mt-4"
        >
          <a-button @click="open = true" type="primary" danger>Search</a-button>
        </div>
        <div class="mt-4">
          <label class="block font-bold">Account Details</label>
          <a-input
            v-model:value="accountDetails"
            placeholder="Account Details"
            readonly
          />
        </div>
      </div>
      <!-- Account Fields -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div>
          <label class="block font-bold">Cash Flow ID</label>
          <a-select
            v-model:value="cashFlowId"
            class="w-full"
            placeholder="Select Cash Flow"
          >
            <a-select-option
              v-for="cf in cashFlows"
              :key="cf.CashFlowId"
              :value="cf.CashFlowId"
            >
              {{ cf.Details }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <label class="block font-bold">Cheque Name</label>
          <a-input v-model:value="chequeName" placeholder="Cheque Name" />
        </div>
        <div>
          <label class="block font-bold">Account Type</label>
          <a-select
            v-model:value="accountType"
            class="w-full"
            placeholder="Account Type"
          >
            <a-select-option value="PL">PL</a-select-option>
            <a-select-option value="BS">BS</a-select-option>
          </a-select>
        </div>
        <div>
          <label class="block font-bold">Group Code</label>
          <a-select
            v-model:value="selectedGroup"
            class="w-full"
            placeholder="Group Code"
          >
            <a-select-option
              v-for="grp in groupCodes"
              :key="grp.GroupCode"
              :value="grp.GroupCode"
            >
              {{ grp.GroupCode }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <label class="block font-bold">Sub-Ledger</label>
          <a-select
            v-model:value="subLedger"
            class="w-full"
            placeholder="Sub-Ledger"
          >
            <a-select-option :value="0">No</a-select-option>
            <a-select-option :value="1">Yes</a-select-option>
          </a-select>
        </div>
        <div class="mt-5">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              class="checkbox-size"
              id="vendor"
              v-model="slVendor"
            />
            <label for="vendor" class="cursor-pointer flex items-center">
              <span class="ml-2 text-gray-700">Vendor</span>
            </label>
          </div>
        </div>
      </div>
      <!-- Sub-Ledger Range Table -->
      <div class="bg-gray-50 rounded-lg p-4 space-y-4 shadow">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <a-select
            placeholder="Category"
            class="w-full"
            v-model:value="selectedCategory"
          >
            <a-select-option
              v-for="cat in categories"
              :key="cat.ASType"
              :value="cat.ASType"
            >
              {{ cat.ASDetails }}
            </a-select-option>
          </a-select>

          <a-input-number
            v-model:value="startId"
            addonBefore="Start ID"
            class="w-full"
          />
          <a-input-number
            v-model:value="endId"
            addonBefore="End ID"
            class="w-full"
          />
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
              <tr class="hover:bg-blue-50 transition">
                <td class="py-2 px-4">{{ selectedCategory }}</td>
                <td class="py-2 px-4">{{ startId }}</td>
                <td class="py-2 px-4">{{ endId }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Subsidiary Ledger -->
      <div>
        <div class="font-semibold mb-2">Subsidiary Ledger:</div>
        <div class="flex flex-wrap gap-3">
          <a-checkbox v-model:checked="slOrganization">Organization</a-checkbox>
          <a-checkbox v-model:checked="slEmployee">Employee</a-checkbox>
          <a-checkbox v-model:checked="slProduct">Product</a-checkbox>
          <a-checkbox v-model:checked="slBrand">Brand</a-checkbox>
          <a-checkbox v-model:checked="slProductGroup"
            >Product Group</a-checkbox
          >
          <a-checkbox v-model:checked="slVehicle">Vehicle</a-checkbox>
        </div>
      </div>
      <!-- Secondary DB & GL -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="font-bold block">Secondary DB:</label>
          <a-select
            v-model:value="secondaryDB"
            class="w-full"
            placeholder="Secondary DB"
          >
            <a-select-option value="N">No</a-select-option>
            <a-select-option value="Y">Yes</a-select-option>
          </a-select>
        </div>
        <div>
          <label class="font-bold block">Status</label>
          <a-select v-model:value="status" class="w-full" placeholder="Active">
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
        <div class="font-semibold mt-2">Secondary GL:</div>
        <div class="flex flex-wrap items-center gap-3">
          <a-checkbox v-model:checked="sdbCustomer">Customer</a-checkbox>
          <a-checkbox v-model:checked="sdbEmployee">Employee</a-checkbox>
          <a-checkbox v-model:checked="sdbProduct">Product</a-checkbox>
        </div>
      </div>
      <!-- Actions -->
      <div class="flex justify-end gap-4 mt-6">
        <a-button type="primary" class="px-8 py-2" @click="saveAccount">
          Save
        </a-button>
      </div>
    </div>

    <!-- search  -->
    <a-modal
      width="1000px"
      v-model:open="open"
      centered
      title="Search Chart of Accounts"
      @ok="open = false"
    >
      <div v-if="isSelecting" class="text-center py-4">
        <span> <a-spin /> please wait...</span>
      </div>
      <div class="grid grid-cols-2 mb-4 gap-8">
        <a-input
          v-model:value="filterText"
          placeholder="Search"
          class="w-full"
          @pressEnter="fetchSearchResults"
        />
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
            <tr
              v-for="item in searchResults"
              :key="item.AMCode"
              class="border-b hover:bg-gray-50 cursor-pointer"
              @click="selectAccount(item)"
            >
              <td class="py-2 px-4">{{ item.AMDetails }}</td>
              <td class="py-2 px-4">{{ item.AMCode }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-modal>
    <!-- Not found modal -->
    <a-modal
      v-model:open="notFoundModal"
      title="Sorry !"
      :footer="null"
      @ok="notFoundModal = false"
      centered
    >
      <p>Account code not found</p>
      <div class="text-right">
        <button
          ref="ok_button_ref"
          type="button"
          class="bg-red-600 text-white px-8 py-1 rounded-md focus:bg-secondary"
          @click="
            notFoundModal = false;
            categoryCode_ref?.focus();
            categoryCode_ref?.select();
          "
        >
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

const open = ref(false);

const searchResults = ref([]);
const filterText = ref("");
const categories = ref([]);
const groupCodes = ref([]);
const selectedCategory = ref("");
const selectedGroup = ref("");
const startId = ref(0);
const endId = ref(0);

const companyCode = localStorage.getItem("company_code") || "";
// const companyCode = '21';
const companyName = ref(localStorage.getItem("company_name") || "");
// states
const categoryCode = ref("");
const accountDetails = ref("");

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
const accountType = ref(null);
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

const handleEnter = (event, data_value, ref_code, field) => {
  if (event?.key == "Enter") {
    if (!data_value?.length) {
      ref_code?.focus();
      return 0;
    }
    if (data_value?.length < 2) {
      notFoundModal.value = true;
      setTimeout(() => {
        ok_button_ref.value?.focus();
      }, 100);
      return;
    }
  }

  ref_code?.focus();
  switch (field) {
    case "categoryCode":
      fetchCategory();
      break;
    case "headCode":
      break;
    case "subHeadCode":
      break;
    case "deptCode":
      break;
    case "businessCode":
      break;
    case "subBusinessCode":
      break;
    case "subDeptCode":
      break;
    case "location":
      break;
  }
};
// helper: restrict input
const restrictTwoDigits = (e, field, ref_code) => {
  if (e?.target?.value == "00") {
    ref_code?.focus();
    ref_code?.select();
    return 0;
  }
  let val = e.target.value.replace(/\D/g, "");
  // if (val.length >= 2) {
  //   val = val.slice(0, 2);
  //   ref_code?.focus();
  //   ref_code?.select();
  // }

  switch (field) {
    case "categoryCode":
      categoryCode.value = val;
      break;
    case "headCode":
      headCode.value = val;
      ref_code?.focus();
      break;
    case "subHeadCode":
      subHeadCode.value = val;
      break;
    case "deptCode":
      deptCode.value = val;
      break;
    case "businessCode":
      businessCode.value = val;
      break;
    case "subBusinessCode":
      subBusinessCode.value = val;
      break;
    case "subDeptCode":
      subDeptCode.value = val;
      break;
    case "location":
      location.value = val;
      break;
  }
};

// API calls

const categoryDetails = ref("");
const fetchCategory = async () => {
  if (!categoryCode.value || categoryCode.value.length !== 2) return;
  if (categoryCode.value == "00") {
    headCode_ref.value?.focus();
    headCode_ref.value?.select();
    return 0;
  }

  try {
    const res = await fetch(
      `${apiBase}/accontrol?ACType1=${categoryCode.value}`,
      getToken()
    );
    const data = await res.json();
    if (data?.ControlDetail) {
      categoryDetails.value = data.ControlDetail;
      updateAccountDetails();
    } else {
      notFoundModal.value = true;
      ok_button_ref.value?.focus();
      categoryDetails.value = "";
      updateAccountDetails();
    }
  } catch {
    notFoundModal.value = true;
    ok_button_ref.value?.focus();
    categoryDetails.value = "";
    updateAccountDetails();
  }
};

const fetchHead = async () => {
  if (!headCode.value || headCode.value.length !== 2) return;
  if (!headCode.value || headCode.value.length !== 2) return;
  if (headCode.value == "00") {
    subHeadCode_ref.value?.focus();
    subHeadCode_ref.value?.select();
    return 0;
  }
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
      notFoundModal.value = true;
    }
    updateAccountDetails();
  } catch {
    headDetails.value = "";
    notFoundModal.value = true;
    updateAccountDetails();
  }
};

const fetchSubHead = async () => {
  if (!subHeadCode.value || subHeadCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/actypesub?ACType1=${categoryCode.value}&ACType2=${headCode.value}&ACType3=${subHeadCode.value}`,
      getToken()
    );
    const data = await res.json();
    subHeadDetails.value = data?.SubTypeDetail || "";
    if (!subHeadDetails.value) notFoundModal.value = true;
    updateAccountDetails();
  } catch {
    subHeadDetails.value = "";
    notFoundModal.value = true;
    updateAccountDetails();
  }
};
const fetchDept = async () => {
  if (!deptCode.value || deptCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/department?Dept=${deptCode.value}`,
      getToken()
    );
    const data = await res.json();
    deptDetails.value = data?.DeptDetail || "";
    if (!deptDetails.value) notFoundModal.value = true;
    updateAccountDetails();
  } catch {
    deptDetails.value = "";
    notFoundModal.value = true;
    updateAccountDetails();
  }
};

const fetchBusiness = async () => {
  if (!businessCode.value || businessCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/business?BusiNo=${businessCode.value}`,
      getToken()
    );
    const data = await res.json();
    businessDetails.value = data?.Business || "";
    if (!businessDetails.value) notFoundModal.value = true;
    updateAccountDetails();
  } catch {
    businessDetails.value = "";
    notFoundModal.value = true;
    updateAccountDetails();
  }
};

const fetchSubBusiness = async () => {
  if (!subBusinessCode.value || subBusinessCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/business/sub?CompanyCode=${companyCode}&BusiNo=${businessCode.value}&SubBusiNo=${subBusinessCode.value}`,
      getToken()
    );
    const data = await res.json();
    subBusinessDetails.value = data?.SubBusinessName || "";
    if (!subBusinessDetails.value) notFoundModal.value = true;
    updateAccountDetails();
  } catch {
    subBusinessDetails.value = "";
    notFoundModal.value = true;
    updateAccountDetails();
  }
};

const fetchSubDept = async () => {
  if (!subDeptCode.value || subDeptCode.value.length !== 2) return;
  try {
    const res = await fetch(
      `${apiBase}/department/sub?CompanyCode=${companyCode}&DeptNo=${deptCode.value}&SubDept=${subDeptCode.value}`,
      getToken()
    );
    const data = await res.json();
    subDeptDetails.value = data?.SubDeptName || "";
    if (!subDeptDetails.value) notFoundModal.value = true;
    updateAccountDetails();
  } catch {
    subDeptDetails.value = "";
    notFoundModal.value = true;
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
const fetchSearchResults = async () => {
  try {
    const res = await fetch(
      `${apiBase}/accounting/search?query=${filterText.value}`,
      getToken()
    );
    const data = await res.json();
    searchResults.value = data;
  } catch (err) {
    searchResults.value = [];
  }
};

watch(filterText, fetchSearchResults, { immediate: true });

const isSelecting = ref(false);
// Select account from modal
const selectAccount = async (item) => {
  isSelecting.value = true;
  categoryCode.value = item.ACType1 || "";
  headCode.value = item.ACType2 || "";
  subHeadCode.value = item.ACType3 || "";
  deptCode.value = item.Dept || "";
  businessCode.value = item.BusiNo || "";
  subBusinessCode.value = item.SubBusiNo || "";
  subDeptCode.value = item.SubDept || "";

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
    isSelecting.value = false; // stop loader
    open.value = false; // close modal
  }
};

onMounted(async () => {
  const catRes = await fetch(`${apiBase}/acsubcategory`, getToken());
  categories.value = await catRes.json();

  const grpRes = await fetch(`${apiBase}/acgroup`, getToken());
  groupCodes.value = await grpRes.json();

  const cashRes = await fetch(`${apiBase}/cashflow`, getToken());
  const data = await cashRes.json();
  // console.log("CashFlows fetched:", data);
  cashFlows.value = data;
});

const saveAccount = async () => {
  const payload = {
    AMCode: `${categoryCode.value}-${headCode.value}-${subHeadCode.value}-${deptCode.value}-${businessCode.value}-${subBusinessCode.value}-${subDeptCode.value}-${location.value}`,
    CompanyCode: companyCode,
    AMDetails: accountDetails.value,
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
    Subledger: subLedger.value ? 1 : 0,
    ASType: selectedCategory.value,
    StartID: startId.value,
    EndID: endId.value,
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
  };
  try {
    const res = await axios.post(`${apiBase}/acmaster`, payload, getToken());
    showNotification("success", "Account saved successfully!");
    console.log("Created account:", res.data);
  } catch (err) {
    console.error("Error saving account:", err.response?.data || err);
    showNotification("error", "Failed to save account. See console.");
  }
};
</script>

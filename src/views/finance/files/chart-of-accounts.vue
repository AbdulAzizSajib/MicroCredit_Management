<template>
  <MainLayout>
    <div class="bg-white rounded-xl py-6 space-y-8 max-w-6xl mx-auto">
      <div class="bg-gray-50 rounded-lg shadow p-4 my-4">
        <!-- <div class="flex items-center mb-2">
          <label for="" class="w-32 font-semibold"
            ><span class="text-red-500">* </span>Type :</label
          >
          <a-select
            v-model:value="type"
            class="w-60"
            placeholder="Select Type"
            default="others"
            @change="typeValuehandler"
          >
            <a-select-option value="others">Others</a-select-option>
            <a-select-option value="customer">Customer</a-select-option>
            <a-select-option value="supplier">Supplier</a-select-option>
          </a-select>
        </div> -->
        <div class="flex items-center gap-4 relative">
          <div class="flex items-center mb-2">
            <label for="" class="w-32 font-semibold"
              ><span class="text-red-500">* </span>Type :</label
            >
            <a-select
              v-model:value="type"
              class="w-60"
              placeholder="Select Type"
              @change="typeValuehandler"
            >
              <a-select-option value="others">Others</a-select-option>
              <a-select-option value="customer">Customer</a-select-option>
              <a-select-option value="supplier">Supplier</a-select-option>
            </a-select>
          </div>
          <div class="flex items-center gap-2 w-11/12 relative">
            <!-- <h2 class="absolute -top-10 left-[30%] text-white bg-indigo-500 border px-16">
              Type
            </h2> -->
            <label class="font-semibold block w-48"
              ><span class="text-red-500">* </span>Account Head :
            </label>

            <a-select
              v-model:value="AMCode"
              class="w-full"
              placeholder="Select Account Type"
              show-search
              allowClear
              :filter-option="false"
              ref="AMCode_ref"
              @keydown.enter="AMCodeOther_Digit_ref?.focus()"
              @focus="focusedField = 'AMCode'"
              :class="{ 'bg-yellow-100': focusedField === 'AMCode' }"
              @search="get_ACType"
            >
              <a-select-option
                v-for="ac in glAcType"
                :value="ac?.ACType1"
                :key="ac?.ACType1"
              >
                {{ ac?.ACType1 }} - {{ ac?.ACType1Details }}
              </a-select-option>
            </a-select>
          </div>
          <!-- <h2 class="absolute -top-10 left-[44%] text-white bg-indigo-500 border px-16">
            Item
          </h2> -->
          <a-input
            v-show="false"
            @input="handle_fixed_five_digit(AMCodeOther_Digit)"
            v-model:value="AMCodeOther_Digit"
            type="number"
            placeholder="Item"
            ref="AMCodeOther_Digit_ref"
            @keydown.enter="cashflow_ref?.focus()"
            @keydown.esc="AMCode_ref?.focus()"
            @focus="focusedField = 'AMCodeOther_Digit'"
            :class="{ 'bg-yellow-100': focusedField === 'AMCodeOther_Digit' }"
          />
          <button class="border px-6 py-1 rounded" @click="open = true">
            <Icon class="text-2xl" icon="fa6-solid:binoculars" />
          </button>
        </div>

        <div class="flex items-center gap-4 mt-4">
          <label class="block font-bold w-36"
            ><span class="text-red-500">* </span>Account Details</label
          >
          <div class="w-full" v-if="type === 'others'">
            <a-input
              class="w-full"
              v-model:value="AMDetails"
              placeholder="Account Details"
            />
          </div>
          <div class="w-full" v-else-if="type === 'customer'">
            <a-select
              v-model:value="AMDetails"
              class="w-full"
              placeholder="Select Customer"
              show-search
              allowClear
              :filter-option="false"
              @search="fetchTypeCustomer"
            >
              <a-select-option
                v-for="customer in customertypeData"
                :key="customer.CustomerCode"
                :value="customer.CustomerCode"
              >
                {{ customer.CustomerName }} - {{ customer.CustomerCode }}
              </a-select-option>
            </a-select>
          </div>

          <div class="w-full" v-else="type === 'supplier'">
            <a-select
              v-model:value="AMDetails"
              class="w-full"
              placeholder="Select Supplier"
              show-search
              allowClear
              :filter-option="false"
              @search="fetchSupplier"
            >
              <a-select-option
                v-for="supplier in suppliertypeData"
                :key="supplier.SupplierCode"
                :value="supplier.SupplierCode"
              >
                {{ supplier.SupplierName }} - {{ supplier.SupplierCode }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <div
        class="grid grid-cols-2 gap-8 p-3 bg-gray-50 rounded-lg shadow-sm hidden"
      >
        <div class="flex items-center">
          <label for="" class="w-36">Account Type : </label>

          <h2 class="border w-full px-4 py-2 bg-slate-200 rounded">
            {{ AM_code_info?.ACType1 }} - {{ AM_code_info?.ACType1Details }}
          </h2>
        </div>

        <div class="flex items-center">
          <label for="" class="w-32">Group Code :</label>
          <a-select
            disabled
            v-model:value="GroupCode"
            class="w-full"
            placeholder="Select Group Type"
            @search="fetchTypeCustomer"
            :filter-option="false"
          >
            <a-select-option
              v-for="item in groupcodeList"
              :value="item?.GroupCode"
              :key="item?.GroupCode"
            >
              {{ item?.GroupCode }} - {{ item?.GroupDetails }}
            </a-select-option>
          </a-select>
        </div>
      </div>

      <!-- Account Fields -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div class="flex items-center gap-2">
          <label class="block w-36">Cash Flow</label>
          <div
            class="w-full"
            :class="{ 'select-focused ': focusedField === 'cashflow' }"
            @keydown.esc="AMCodeOther_Digit_ref?.focus()"
          >
            <a-select
              allowClear
              show-search
              v-model:value="cashflow"
              class="w-full"
              placeholder=""
              ref="cashflow_ref"
              @keydown.enter="subledger_ref?.focus()"
              :filterOption="false"
              :loading="searchLoading"
              @input="getCashFlow($event?.target?.value)"
              @focus="focusedField = 'cashflow'"
              :class="{ 'bg-yellow-100': focusedField === 'cashflow' }"
            >
              <template #suffixIcon>
                <Icon
                  v-if="!searchLoading"
                  icon="mingcute:search-line"
                  class="text-gray-400 size-5"
                />
                <Icon
                  v-if="searchLoading"
                  icon="ep:loading"
                  class="text-gray-400 size-5 animate-spin"
                />
              </template>
              <a-select-option
                v-for="item in cashFlowData"
                :value="item.CashFlowId"
                :key="item.CashFlowId"
              >
                {{ item?.Details }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label class="block w-36">Sub-Ledger</label>
          <div
            class="w-full"
            :class="{ 'select-focused ': focusedField === 'Subledger' }"
            @keydown.esc="cashflow_ref?.focus()"
            @keydown.enter="selectedCategory_ref?.focus()"
          >
            <a-select
              v-model:value="Subledger"
              class="w-full"
              placeholder=""
              ref="subledger_ref"
              @focus="focusedField = 'Subledger'"
              :class="{ 'bg-yellow-100': focusedField === 'Subledger' }"
            >
              <a-select-option :value="1">Yes</a-select-option>
              <a-select-option :value="0">No</a-select-option>
            </a-select>
          </div>
        </div>
      </div>

      <!-- Sub-Ledger Range Table -->

      <div class="pt-10">
        <div class="bg-gray-50 rounded-lg p-4 space-y-4 shadow relative">
          <div class="font-semibold mb-2 absolute top-[-10px]">
            Sub-Ledger Range:
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end py-6">
            <div class="flex items-center">
              <label for="" class="block font-bold w-36">Category: </label>
              <div
                class="w-full"
                :class="{
                  'select-focused ': focusedField === 'selectedCategory',
                }"
                @keydown.esc="subledger_ref?.focus()"
              >
                <a-select
                  allow-clear
                  class="w-full"
                  ref="selectedCategory_ref"
                  :disabled="!Subledger"
                  v-model:value="selectedCategory"
                  @keydown.enter="start_id_ref?.focus()"
                  @focus="focusedField = 'selectedCategory'"
                  :class="{
                    'bg-yellow-100': focusedField === 'selectedCategory',
                  }"
                >
                  <a-select-option
                    v-for="cat in categories"
                    :key="cat.ASType"
                    :value="cat.ASType"
                  >
                    {{ cat.ASDetails }}
                  </a-select-option>
                </a-select>
              </div>
            </div>

            <a-input-number
              v-model:value="startId"
              addonBefore="Start ID"
              class="w-full"
              :disabled="!Subledger"
              ref="start_id_ref"
              @keydown.enter="end_id_ref?.focus()"
              @keydown.esc="selectedCategory_ref?.focus()"
              @pressEnter="end_id_ref.focus()"
              @focus="handleStartFocus"
              :class="{ 'bg-yellow-100': focusedField === 'startId' }"
            />
            <a-input-number
              v-model:value="endId"
              addonBefore="End ID"
              class="w-full"
              :disabled="!Subledger"
              ref="end_id_ref"
              @blur="validateIdRange"
              @pressEnter="handleSubLedgerEnter"
              @keydown.esc="start_id_ref?.focus()"
              @focus="handleEndFocus"
              :class="{ 'bg-yellow-100': focusedField === 'endId' }"
            />
          </div>
          <div>
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-blue-200">
                  <th class="py-2 px-4">Category</th>
                  <th class="py-2 px-4 text-end">Start ID</th>
                  <th class="py-2 px-4 text-end">End ID</th>
                  <th class="py-2 px-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in subLedgerRanges" :key="index">
                  <td class="px-4 py-2 border">
                    {{ item.category }} - {{ item.categoryDetails }}
                  </td>
                  <td class="px-4 py-2 border text-end">{{ item.startId }}</td>
                  <td class="px-4 py-2 border text-end">{{ item.endId }}</td>
                  <td class="px-4 py-2 border text-end">
                    <button @click="handleDelete(index)">
                      <Icon class="text-xl" icon="mingcute:delete-line" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4 mt-6">
        <a-button
          type="primary"
          class="px-8 py-2"
          @click="saveAccount"
          :loading="isSaveAccount"
          ref="save_ref"
        >
          Save
        </a-button>
      </div>
    </div>

    <!-- search  -->
    <a-modal
      width="1000px"
      v-model:open="open"
      centered
      title="Account Search"
      @ok="open = false"
    >
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="font-bold block">Code</label>
          <a-input
            v-model:value="filterTextCode"
            placeholder="Search by Code"
            class="w-full"
            @pressEnter="() => fetchSearchResults(true)"
          />
        </div>

        <div>
          <label class="font-bold block">Find On Account Name</label>
          <a-input
            v-model:value="filterText"
            placeholder="Search by Name"
            class="w-full"
            @pressEnter="() => fetchSearchResults(true)"
          />
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
            <!-- @click="selectAccount(item)" -->
            <tr
              v-for="item in searchResults"
              :key="item.AMCode"
              @click="handlesubLedger(item)"
              class="border-b hover:bg-gray-50 cursor-pointer"
            >
              <td class="py-2 px-4">{{ item.AMDetails }}</td>
              <td class="py-2 px-4">{{ item.AMCode }}</td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="isLoadingMore"
          class="bottom-0 w-full text-center py-2 bg-white"
        >
          <a-spin /> Loading...
        </div>
        <div
          v-if="searchResults.length < totalResults"
          class="text-center mt-8"
        >
          <a-button type="dashed" @click="loadMoreResults">Load More</a-button>
        </div>
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
import { Icon } from "@iconify/vue";
import { nextTick, onMounted, ref, watch } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";
import axios from "axios";

import { useRouter } from "vue-router";
import debounce from "debounce";
import AcType from "./ac-type.vue";
const router = useRouter();
const goBack = () => {
  router.push({ name: "search-chart-of-accounts" });
};

const open = ref(false);

const searchResults = ref([]);
const filterText = ref("");
const filterTextCode = ref("");

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

// need
const loadMoreResults = async () => {
  if (searchResults.value.length >= totalResults.value) return;
  currentPage.value += 1;
  await fetchSearchResults(false);
};

const userInfo = JSON.parse(localStorage.getItem("user_info"));

// ------ SAJIB --------//
const focusedField = ref(null);
// all ref
const AMCodeOther_Digit_ref = ref();
const start_id_ref = ref();
const end_id_ref = ref();
const AMCode_ref = ref();
const subledger_ref = ref();
const selectedCategory_ref = ref();

//
const AMCode = ref("");
const AMCodeOther_Digit = ref("");
const AMDetails = ref("");
const Subledger = ref(0);
const selectedCategory = ref("");
const startId = ref(0);
const endId = ref(0);

//account code fetch from GL_ACType
const glAcType = ref([]);
const get_ACType = async (search = "") => {
  try {
    const res = await axios.get(
      `${apiBase}/settings/ac-types?search=${search}`,
      getToken()
    );
    glAcType.value = res?.data?.data?.data;
    console.log(res.data?.data?.data);
  } catch (error) {}
};

const categories = ref([]);

const get_AC_subcategory = async () => {
  try {
    const res = await axios.get(`${apiBase}/acsubcategory`, getToken());
    if (res.data) {
      categories.value = res?.data;
    }
  } catch (error) {
    console.log(error);
  }
};

const handlesubLedger = (item) => {
  AMCode.value = item?.AMCode.slice(0, 3);
  AMCodeOther_Digit.value = item?.AMCode.slice(-5);
  if (AMCode.value) {
    get_AM_Code();
    open.value = false;
  }
};

const GroupCode = ref();
const AM_code_info = ref();
const get_AM_Code = async () => {
  try {
    const res = await axios.get(
      `${apiBase}/actype?ACType1=${AMCode.value}`,
      getToken()
    );
    if (res.data) {
      AM_code_info.value = res?.data;

      GroupCode.value = res?.data?.GroupCode;
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

const subLedgerRanges = ref([]);

const handleSubLedgerEnter = () => {
  if (!validateIdRange()) {
    return; // Stop if validation fails
  }
  if (selectedCategory.value && startId.value !== " " && endId.value !== " ") {
    const categoryExists = subLedgerRanges.value.some(
      (item) => item.category === selectedCategory.value
    );
    if (categoryExists) {
      showNotification(
        "warning",
        `Category "${selectedCategory.value}" already exists. Please select a different category.`
      );
      return;
    }

    // Find the full category object to get ASDetails
    const selectedCategoryObj = categories.value.find(
      (cat) => cat.ASType === selectedCategory.value
    );

    subLedgerRanges.value.push({
      category: selectedCategory.value,
      categoryDetails: selectedCategoryObj?.ASDetails || "",
      startId: startId.value,
      endId: endId.value,
    });
    // selectedCategory.value = "";
    startId.value = 0;
    endId.value = 0;
    nextTick(() => {
      selectedCategory_ref.value?.focus();
    });
  }
};

// fetch type customer and supplier
const customertypeData = ref([]);
const fetchTypeCustomer = async (search = "") => {
  try {
    const res = await axios.get(
      `${apiBase}/get_customer_all?q=${search}`,
      getToken()
    );
    customertypeData.value = res?.data;
    console.log(customertypeData.value);
  } catch (error) {}
};

const suppliertypeData = ref([]);
const fetchSupplier = async (search = "") => {
  try {
    const res = await axios.get(
      `${apiBase}/get_customer_all_purchase?q=${search}`,
      getToken()
    );
    suppliertypeData.value = res?.data;
    // console.log(customertypeData.value);
  } catch (error) {}
};

const typeValuehandler = async (value) => {
  AMDetails.value = "";
  if (value === "customer") {
    await fetchTypeCustomer();
  } else if (value === "supplier") {
    await fetchSupplier();
  }
};

const type = ref("others");
const isSaveAccount = ref(false);
const saveAccount = async () => {
  if (!AMCode.value) {
    return showNotification("error", "Account code required");
  }

  try {
    isSaveAccount.value = true;
    const res = await axios.post(
      `${apiBase}/acmaster`,
      {
        AMCode: `${AMCode.value}-${AMCodeOther_Digit.value}`,
        AMDetails: AMDetails.value,
        type: type.value,
        Subledger: Subledger.value,
        ACType1: AMCode.value,
        UserId: userInfo.name,
        BalanceForward: 1,
        InExType: "31",
        CashflowID: cashflow.value,
        DetailsData: subLedgerRanges.value.map((item) => ({
          AMCode: `${AMCode.value}-${AMCodeOther_Digit.value}`,
          ASType: item?.category,
          StartID: item?.startId,
          EndID: item?.endId,
        })),
      },
      getToken()
    );

    isSaveAccount.value = false;

    if (res?.data) {
      showNotification("success", res?.data?.message);
      setTimeout(() => {
        window.location.reload();
        // goBack();
      }, 500);
    }

    // reset form
  } catch (error) {
    console.log(error);
    isSaveAccount.value = false;

    showNotification("error", error?.response.data.message);
  }
};

//watcher for account type and account details
watch(AMCode, (newType, oldType) => {
  if (newType !== oldType) {
    AMDetails.value = "";
  }
});

//watch type change
watch(type, (newType, oldType) => {
  if (newType !== oldType) {
    AMDetails.value = "";
    AMCode.value = "";
  }
});

const handle_fixed_three_digit = (digit) => {
  if (digit && digit.length > 3) {
    showNotification("warning", "Max 3 digits allowed");
    AMCode.value = digit.slice(0, 3);
  }
};
const handle_fixed_five_digit = (digit) => {
  if (digit && digit.length > 5) {
    showNotification("warning", "Max 5 digits allowed");
    AMCodeOther_Digit.value = digit.slice(0, 5);
  }
};

const handleDelete = (index) => {
  subLedgerRanges.value.splice(index, 1);
};

const validateIdRange = () => {
  if (startId.value && endId.value) {
    if (endId.value <= startId.value) {
      showNotification(
        "error",
        `End ID must be greater than Start ID. Please enter a value greater than ${startId.value}`
      );
      endId.value = null;
      return false;
    }
  }
  return true;
};

const cashflow = ref();
const cashflow_ref = ref();

const cashFlowData = ref([]);
const searchLoading = ref(false);
const getCashFlow = debounce(async (event) => {
  searchLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/settings/cashflow/all?search=${event || " "}`,
      getToken()
    );
    searchLoading.value = false;
    if (res?.data?.success === true) {
      cashFlowData.value = res?.data?.data;
    }
  } catch (error) {
    searchLoading.value = false;
    console.log(error);
  }
}, 500);

// group code

const groupcodeList = ref([]);
const getGroupCode = debounce(async (event) => {
  searchLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/settings/ac-groups/all?search=${event || " "}`,
      getToken()
    );
    searchLoading.value = false;
    if (res?.data) {
      groupcodeList.value = res?.data?.data;
      // console.log(groupcodeList.value);
    }
  } catch (error) {
    console.log(error.message);
    searchLoading.value = false;
  }
}, 500);

// input focus handlers
const handleStartFocus = () => {
  focusedField.value = "startId";
  if (startId.value === 0) {
    startId.value = null;
  }
};

const handleEndFocus = () => {
  focusedField.value = "endId";
  if (endId.value === 0) {
    endId.value = null;
  }
};

// const ACType1 = ref();
// const TypeInfo = ref([]);
// const fetchType = async (group) => {
//   try {
//     const res = await axios.get(
//       `${apiBase}/journal/type?GroupCode=${group}`,
//       getToken()
//     );

//     if (res?.data) {
//       TypeInfo.value = res?.data;
//       console.log("ACType1", TypeInfo.value);
//       ACType1.value = TypeInfo.value[0]?.ACType1;
//     }
//   } catch (err) {
//     console.error("Error fetching types:", err);
//     TypeInfo.value = [];
//   }
// };

//

onMounted(() => {
  get_AC_subcategory();
  getCashFlow();
  getGroupCode();
  get_ACType();
});
</script>
<style scoped>
.select-focused :deep(.ant-select-selector) {
  background-color: #fef3c7 !important;
  /* yellow-100 */
}
</style>

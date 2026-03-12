<template>
  <MainLayout>

    <div class="bg-white rounded-xl py-6 space-y-8">

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="flex items-center gap-8">
          <label class="font-bold block">Code:</label>
          <a-input v-model:value="filterTextCode" placeholder="Search by Code" class="w-full"
            @pressEnter="() => fetchSearchResults(true)" />
        </div>

        <div class="flex items-center">
          <label class="font-bold block w-64">Find On Account Name:</label>
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


    </div>


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

const ok_button_ref = ref();
const triggered_input_ref = ref();
const skipErrors = ref(false);
const cashflow_id_ref = ref();




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

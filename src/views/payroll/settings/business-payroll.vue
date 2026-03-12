<template>
  <PayrollLayout>
    <div class="flex justify-between">
      <!-- Back Button -->

      <div class="mb-4">
        <a-input
          placeholder="Search here..."
          v-model:value="search"
          @input="
            async () => {
              page = 1;
              await fetchAllData();
            }
          "
          class="w-64"
        />
      </div>
      <div class="mb-4">
        <button
          class="bg-primary text-white px-4 py-2 rounded"
          @click="
            () => {
              closeModal();
              isCreateModalVisible = true;
            }
          "
        >
          Add Business
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4">Business ({{ total }})</h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2 text-center w-44">Business Code</th>
          <th class="border border-white px-4 py-2 text-center">Business Name</th>
          <th class="border border-white px-4 py-2 text-center">Company Name</th>
          <th class="border border-white px-4 py-2 text-center">Company Code</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border text-center">{{ data?.BusinessCode || "-" }}</td>
          <td class="px-4 border">{{ data?.BusinessName || "-" }}</td>
          <td class="px-4 border text-center">{{ data?.CompanyName || "-" }}</td>
          <td class="px-4 border text-center">{{ data?.CompanyCode || "-" }}</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                @click="allData_idwise(data?.BusinessCode)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <a-popconfirm
                @confirm="deleteData(data?.BusinessCode)"
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

    <div
      v-if="loading"
      class="mt-2 text-center text-gray-500 flex justify-center items-center gap-2"
    >
      <span><a-spin></a-spin></span>
    </div>

    <a-pagination
      class="mt-4"
      v-model:current="page"
      :page-size="per_page"
      :total="total"
      :show-size-changer="false"
      :show-total="(total) => `Total ${total} items`"
      @change="
        (pageNo) => {
          page = pageNo;
          fetchAllData();
        }
      "
      v-if="total > per_page"
    />

    <!-- Create Modal -->
    <a-modal
      v-model:open="isCreateModalVisible"
      :footer="null"
      title="Business"
      @cancel="closeModal"
    >
      <form>
        <div
          class="grid grid-cols-2 gap-y-4 items-center border rounded p-4 bg-slate-100"
        >
          <label class="font-semibold">Business Name:</label>
          <a-input class="w-full" v-model:value="formData.BusinessName" />

          <label class="font-semibold">Company name :</label>
          <a-select
            show-search
            v-model:value="formData.CompanyCode"
            class="w-full"
            :filter-option="false"
            @search="
              (event) => {
                companyName = all_companyName.filter((cname) =>
                  cname?.CompanyName?.toLowerCase().includes(event.toLowerCase())
                );
              }
            "
            @change="handleCompanyChange"
            :loading="companyLoading"
          >
            <a-select-option
              v-for="cname in companyName"
              :key="cname.CompanyCode"
              :value="cname.CompanyCode"
            >
              {{ cname.CompanyName }}
            </a-select-option>
          </a-select>
        </div>
        <div class="flex gap-5 items-end justify- mt-4">
          <a-button
            :disabled="isCreating"
            class="rounded flex items-center justify-center px-6 pb-2 pt-2.5 gap-2 text-white bg-primary"
            @click="createallData"
            type="submit"
          >
            save
            <Icon
              v-if="isCreating"
              class="size-7 animate-spin"
              icon="system-uicons:loader"
            />
          </a-button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal
      v-model:open="isEditModalVisible"
      :footer="null"
      title="Edit Report Head"
      @cancel="isEditModalVisible = false"
    >
      <form @submit.prevent="updateallData(formData.BusinessCode)">
        <div
          class="grid grid-cols-2 gap-y-4 items-center border rounded p-4 bg-slate-100"
        >
          <label class="font-semibold">Business Name:</label>
          <a-input class="w-full" v-model:value="formData.BusinessName" />

          <label class="font-semibold">Company name :</label>
          <a-select
            show-search
            v-model:value="formData.CompanyCode"
            class="w-full"
            :filter-option="false"
            @search="
              (event) => {
                companyName = all_companyName.filter((cname) =>
                  cname?.CompanyName?.toLowerCase().includes(event.toLowerCase())
                );
              }
            "
            @change="handleCompanyChange"
            :loading="companyLoading"
          >
            <a-select-option
              v-for="cname in companyName"
              :key="cname.CompanyCode"
              :value="cname.CompanyCode"
            >
              {{ cname.CompanyName }}
            </a-select-option>
          </a-select>
        </div>
        <div class="flex gap-5 items-end justify- mt-4">
          <a-button
            :disabled="isUpdating"
            class="rounded flex items-center justify-center px-6 pb-2 pt-2.5 gap-2 text-white bg-primary"
            html-type="submit"
          >
            Update
            <Icon
              v-if="isUpdating"
              class="size-7 animate-spin"
              icon="system-uicons:loader"
            />
          </a-button>
        </div>
      </form>
    </a-modal>
  </PayrollLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import PayrollLayout from "@/components/layouts/PayrollLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";

import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
// import { data } from "autoprefixer";
const router = useRouter();
const goBack = () => {
  router.push({ name: "overview" });
};

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);

// search company
const companyName = ref([]);
const all_companyName = ref([]);
const companyLoading = ref(false);

const formData = ref({
  BusinessName: "",
  CompanyName: "",
  CompanyCode: "",
});

const handleCompanyChange = (selectedCompanyCode) => {
  // Find the selected company object
  const selectedCompany = companyName.value.find(
    (company) => company.CompanyCode === selectedCompanyCode
  );

  if (selectedCompany) {
    // Update formData with both code and name if needed
    formData.value.CompanyCode = selectedCompany.CompanyCode;
    formData.value.CompanyName = selectedCompany.CompanyName;
  }
};

// create
const createallData = async () => {
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/payroll/setting/business`,
      formData.value,
      getToken()
    );
    isCreating.value = false;

    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
    await fetchAllData();
    formData.value = {
      GroupHead: "",
      ReportOrder: null,
      FundType: null,
    };

    isCreateModalVisible.value = false;
  } catch (error) {
    isCreating.value = false;
    isCreateModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const allData_idwise = async (BusinessCode) => {
  try {
    const res = await axios.get(
      `${apiBase}/payroll/setting/business/${BusinessCode}`,
      getToken()
    );

    const responseData = res?.data;
    let itemData = null;

    if (responseData?.data?.data?.[0]) {
      itemData = responseData.data.data[0];
    } else if (responseData?.data) {
      itemData = responseData.data;
    } else if (responseData) {
      itemData = responseData;
    }

    if (itemData && itemData.BusinessCode) {
      formData.value = {
        BusinessCode: itemData.BusinessCode,
        BusinessName: itemData.BusinessName || "",
        CompanyName: itemData.CompanyName || "",
        CompanyCode: itemData.CompanyCode || "",
      };
      isEditModalVisible.value = true;
    } else {
      showNotification("error", "Invalid data format received");
    }
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};
// update
const updateallData = async (BusinessCode) => {
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/payroll/setting/business/${BusinessCode}`,
      formData.value,
      getToken()
    );
    isUpdating.value = false;
    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
    formData.value = {
      BusinessName: "",
      CompanyName: "",
      CompanyCode: "",
    };
    await fetchAllData();
    isEditModalVisible.value = false;
  } catch (error) {
    isUpdating.value = false;
    isEditModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const page = ref(1);
const per_page = ref(10);
const total = ref(0);
const search = ref(" ");

const allData = ref([]);
const loading = ref(false);

// Fetch allData with search and pagination
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/payroll/setting/business?page=${page.value}&per_page=${per_page.value}&BusinessName=${search.value}`,
      getToken()
    );
    loading.value = false;
    allData.value = res?.data?.data?.data;
    total.value = res?.data?.data?.total;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    console.error("Failed to fetch allData:", err);
  }
};

const deleteData = async (BusinessCode) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/payroll/setting/business/${BusinessCode}`,
      getToken()
    );
    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (error) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const fundTypeLoading = ref(false);
const fundType = ref([]);
const getFundType = async () => {
  try {
    fundTypeLoading.value = true;
    const res = await axios.get(`${apiBase}/settings/fund-types/all`, getToken());
    fundTypeLoading.value = false;
    if (res?.data) {
      fundType.value = res?.data?.data;
    }
  } catch (error) {
    console.log(error);
    fundTypeLoading.value = false;
  }
};

const closeModal = () => {
  formData.value = {
    GroupHead: "",
    ReportOrder: "",
    FundType: "",
  };

  isCreateModalVisible.value = false;
};

// search company

// Fetch company name
const fetchCompanyName = async () => {
  companyLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/payroll/setting/company_search`, getToken());
    companyLoading.value = false;
    companyName.value = res?.data?.data?.data;
    all_companyName.value = companyName.value;
    console.log("companyName:", companyName.value);
  } catch (err) {
    companyLoading.value = false;
    companyName.value = [];
    all_companyName.value = [];
    total.value = 0;
    console.error("Failed to fetch companyName:", err);
  }
};

onMounted(async () => {
  await fetchAllData();
  await getFundType();
  await fetchCompanyName();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

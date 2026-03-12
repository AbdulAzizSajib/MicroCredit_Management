<template>
  <MainLayout>
    <div class="flex justify-between">
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
          @click="isCreateModalVisible = true"
        >
          Add Vendor Type
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Vendro Type
      <Icon v-if="isShowLoading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">VendorType</th>
          <th class="border border-white px-4 py-2">VendorTypeDetails</th>
          <th class="border border-white px-4 py-2">IDFrom</th>
          <th class="border border-white px-4 py-2">IDTo</th>
          <th class="border border-white px-4 py-2">ProofOfReturnReq</th>
          <th class="border border-white px-4 py-2">BulkInsert</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.VendorType }}</td>
          <td class="px-4 border">{{ data?.VendorTypeDetails }}</td>
          <td class="px-4 border">{{ data?.IDFrom }}</td>
          <td class="px-4 border">{{ data?.IDTo }}</td>
          <td class="px-2 py-1 text-center align-middle border border-gray-200">
            <div
              :class="
                data?.ProofOfReturnReq === 'YES'
                  ? 'inline-block border border-green-400 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full'
                  : 'inline-block border border-red-400 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full'
              "
            >
              {{ data?.ProofOfReturnReq === "YES" ? "Yes" : "No" }}
            </div>
          </td>
          <td class="px-2 py-1 text-center align-middle border border-gray-200">
            <div
              :class="
                data?.BulkInsert == 'Y'
                  ? 'inline-block border border-green-400 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full'
                  : 'inline-block border border-red-400 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full'
              "
            >
              {{ data?.BulkInsert == "Y" ? "Yes" : "No" }}
            </div>
          </td>

          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                @click="allData_idwise(data?.VendorType)"
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <a-popconfirm
                @confirm="deleteData(data?.VendorType)"
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

    <!-- Create Modal -->
    <a-modal
      v-model:open="isCreateModalVisible"
      title="Vendor Type"
      @cancel="isCreateModalVisible = false"
      :footer="null"
    >
      <form @submit.prevent="createallData" @keydown="handleEnterAsTab">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <!-- Site Name Field -->
          <a-form-item
            label="Vendor Type"
            name="VendorType"
            :rules="[{ required: false, message: 'Please select a Vendor Type!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Vendor Type"
              v-model:value="formData.VendorType"
            />
          </a-form-item>

          <!-- Short Name Field -->
          <a-form-item
            label="Vendor Type Details"
            name="VendorTypeDetails"
            :rules="[
              { required: false, message: 'Please select a Vendor Type Details!' },
            ]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Vendor Type Details"
              v-model:value="formData.VendorTypeDetails"
            />
          </a-form-item>

          <a-form-item
            label="IDFrom"
            name="IDFrom"
            :rules="[{ required: false, message: 'Please select a IDFrom!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter IDFrom"
              v-model:value="formData.IDFrom"
            />
          </a-form-item>

          <a-form-item
            label="IDTo"
            name="IDTo"
            :rules="[{ required: false, message: 'Please select a IDTo!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter IDTo"
              v-model:value="formData.IDTo"
            />
          </a-form-item>
          <a-form-item
            label="ProofOfReturnReq"
            name="ProofOfReturnReq"
            :rules="[{ required: false, message: 'Please select a ProofOfReturnReq!' }]"
          >
            <a-select
              class="w-full"
              placeholder="Select ProofOfReturnReq"
              v-model:value="formData.ProofOfReturnReq"
            >
              <a-select-option value="YES">Yes</a-select-option>
              <a-select-option value="NO">No</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="BulkInsert"
            name="BulkInsert"
            :rules="[{ required: false, message: 'Please select a BulkInsert!' }]"
          >
            <a-select
              class="w-full"
              placeholder="Select BulkInsert"
              v-model:value="formData.BulkInsert"
            >
              <a-select-option value="Y">Yes</a-select-option>
              <a-select-option value="N">No</a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <!-- @click="createallData" -->
        <div class="flex items-center justify-end">
          <button
            type="submit"
            class="border px-6 py-1 rounded font-semibold bg-primary text-white"
          >
            Save
          </button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal
      :footer="null"
      v-model:open="isEditModalVisible"
      title="Edit Vendor Type"
      @cancel="isEditModalVisible = false"
      width="500px"
    >
      <form
        @submit.prevent="updateallData(updateformData.VendorType)"
        @keydown="handleEnterAsTab"
      >
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <!-- Site Name Field -->
          <a-form-item
            label="Vendor Type"
            name="VendorType"
            :rules="[{ required: false, message: 'Please select a Vendor Type!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Site Name"
              v-model:value="updateformData.VendorType"
            />
          </a-form-item>

          <!-- Short Name Field -->
          <a-form-item
            label="Vendor Type Details"
            name="VendorTypeDetails"
            :rules="[
              { required: false, message: 'Please select a Vendor Type Details!' },
            ]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Vendor Type Details"
              v-model:value="updateformData.VendorTypeDetails"
            />
          </a-form-item>

          <a-form-item
            label="IDFrom"
            name="IDFrom"
            :rules="[{ required: false, message: 'Please select a IDFrom!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter IDFrom"
              v-model:value="updateformData.IDFrom"
            />
          </a-form-item>

          <a-form-item
            label="IDTo"
            name="IDTo"
            :rules="[{ required: false, message: 'Please select a IDTo!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter IDTo"
              v-model:value="updateformData.IDTo"
            />
          </a-form-item>
          <a-form-item
            label="ProofOfReturnReq"
            name="ProofOfReturnReq"
            :rules="[{ required: false, message: 'Please select a ProofOfReturnReq!' }]"
          >
            <a-select
              class="w-full"
              placeholder="Select ProofOfReturnReq"
              v-model:value="updateformData.ProofOfReturnReq"
            >
              <a-select-option value="YES">Yes</a-select-option>
              <a-select-option value="NO">No</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="BulkInsert"
            name="BulkInsert"
            :rules="[{ required: false, message: 'Please select a BulkInsert!' }]"
          >
            <a-select
              class="w-full"
              placeholder="Select BulkInsert"
              v-model:value="updateformData.BulkInsert"
            >
              <a-select-option value="Y">Yes</a-select-option>
              <a-select-option value="N">No</a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <div class="flex items-center justify-end">
          <button
            type="submit"
            class="border px-6 py-1 rounded font-semibold bg-primary text-white"
          >
            Update
          </button>
        </div>
      </form>
    </a-modal>

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
  </MainLayout>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";

import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: "overview" });
};

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);

const formData = ref({
  VendorType: "",
  VendorTypeDetails: "",
  IDFrom: "",
  IDTo: "",
  ProofOfReturnReq: "YES",
  BulkInsert: "Y",
});
const updateformData = ref({
  VendorType: "",
  VendorTypeDetails: "",
  IDFrom: "",
  IDTo: "",
  ProofOfReturnReq: "",
  BulkInsert: "",
});

// create
const createallData = async () => {
  // console.log(formData.value);
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/settings/vendor-type/`,
      formData.value,
      getToken()
    );
    isCreating.value = false;

    if (res.data.success === true) {
      showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
      await fetchAllData();
      formData.value = {
        VendorType: " ",
        VendorTypeDetails: " ",
        IDFrom: " ",
        IDTo: " ",
        ProofOfReturnReq: " ",
        BulkInsert: " ",
      };
    }
    isCreateModalVisible.value = false;
  } catch (error) {
    isCreating.value = false;
    isCreateModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const isShowLoading = ref(false);
const allData_idwise = async (VendorType) => {
  try {
    isShowLoading.value = true;
    const res = await axios.get(
      `${apiBase}/settings/vendor-type/show?type=${VendorType}`,
      getToken()
    );
    isShowLoading.value = false;

    updateformData.value = {
      VendorType: res?.data?.data?.VendorType,
      VendorTypeDetails: res?.data?.data?.VendorTypeDetails,
      IDFrom: res?.data?.data?.IDFrom,
      IDTo: res?.data?.data?.IDTo,
      ProofOfReturnReq: res?.data?.data?.ProofOfReturnReq,
      BulkInsert: res?.data?.data?.BulkInsert,
    };
    console.log(updateformData.value);
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// update
const updateallData = async (VendorType) => {
  const finalFormData = {
    VendorType: updateformData.value.VendorType,
    VendorTypeDetails: updateformData.value.VendorTypeDetails,
    IDFrom: updateformData.value.IDFrom,
    IDTo: updateformData.value.IDTo,
    ProofOfReturnReq: updateformData.value.ProofOfReturnReq,
    BulkInsert: updateformData.value.BulkInsert,
  };
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/settings/vendor-type?type=${VendorType}`,
      finalFormData,
      getToken()
    );
    isUpdating.value = false;
    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);

    updateformData.value = {
      VendorType: " ",
      VendorTypeDetails: " ",
      IDFrom: " ",
      IDTo: " ",
      ProofOfReturnReq: " ",
      BulkInsert: " ",
    };
    await fetchAllData();
    isEditModalVisible.value = false;
  } catch (error) {
    isUpdating.value = false;
    isEditModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

//delete API
const deleteData = async (VendorType) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/vendor-type?type=${VendorType}`,
      getToken()
    );
    showNotification(res?.data ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (err) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const page = ref(1);
const per_page = ref(10);
const total = ref(0);
const search = ref("");

const allData = ref([]);
const loading = ref(false);

// Fetch allData with search and pagination
const fetchAllData = async () => {
  loading.value = true;
  try {
    console.log(apiBase);
    const res = await axios.get(
      `${apiBase}/settings/vendor-type?page=${page.value}&per_page=${
        per_page.value
      }&search=${search.value || ""}`,
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

// next input when pressing Enter
const handleEnterAsTab = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll(
        "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])"
      )
    );

    const index = focusableElements.indexOf(event.target);
    if (index > -1 && index < focusableElements.length - 1) {
      focusableElements[index + 1].focus();
    } else {
      event.currentTarget.requestSubmit();
    }
  }
};

onMounted(async () => {
  await fetchAllData();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

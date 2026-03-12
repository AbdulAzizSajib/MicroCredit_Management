<template>
  <MainLayout>
    <!-- voucher type -->
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
          @click="
            () => {
              formData.JVDetails = '';
              isCreateModalVisible = true;
            }
          "
        >
          Add Voucher Type
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Voucher Type ({{ total }})
      <Icon v-if="isShowLoading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Company Code</th>
          <th class="border border-white px-4 py-2">AM Code</th>
          <th class="border border-white px-4 py-2">JV Details</th>
          <th class="border border-white px-4 py-2">JV Type</th>
          <th class="border border-white px-4 py-2">Category</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.SiteCode || "-" }}</td>
          <td class="px-4 border">{{ data?.AMCode || "-" }}</td>
          <td class="px-4 border">{{ data?.JVDetails || "-" }}</td>
          <td class="px-4 border">{{ data?.JVType || "-" }}</td>
          <td class="px-4 border">{{ data?.Category || "-" }}</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                @click="allData_idwise(data?.SiteCode, data?.JVType)"
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <a-popconfirm
                @confirm="deleteData(data?.SiteCode, data?.JVType)"
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
      title="Voucher Type"
      @cancel="isCreateModalVisible = false"
      :footer="null"
    >
      <form @submit.prevent="createallData">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <!-- Site Code Dropdown -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]"
              >Company Code: <span class="text-red-500">*</span></label
            >
            <a-select
              class="w-full"
              placeholder="Select Site Code"
              v-model:value="formData.SiteCode"
            >
              <a-select-option
                v-for="item in siteCodeList"
                :value="item?.SiteCode"
                :key="item?.SiteCode"
              >
                {{ `${item?.SiteCode} - ${item?.SiteName}` }}
              </a-select-option>
            </a-select>
          </div>

          <!-- AM Code Dropdown -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]"
              >Account Head:<span class="text-red-500"> *</span></label
            >
            <a-select
              show-search
              allowClear
              class="w-full"
              :filter-option="false"
              placeholder="Select Account Head"
              v-model:value="formData.AMCode"
              @search="getaMCodeList"
              @select="selectAMCode"
            >
              <a-select-option
                v-for="item in aMCodeList"
                :value="item?.AMCode"
                :key="item?.AMCode"
              >
                {{ `${item?.AMCode} - ${item?.AMDetails}` }}
              </a-select-option>
            </a-select>
          </div>

          <!-- JV Details Field -->

          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]"
              >JV Details:<span class="text-red-500"> *</span></label
            >
            <a-input
              class="w-full"
              placeholder="Enter JV Details"
              v-model:value="formData.JVDetails"
            />
          </div>

          <!-- JV Type Field -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]"
              >JV Type:<span class="text-red-500"> *</span></label
            >
            <a-input
              class="w-full"
              placeholder="Enter JV Type"
              v-model:value="formData.JVType"
            />
          </div>
          <!-- Category Field -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">
              Category:<span class="text-red-500"> *</span></label
            >
            <a-input
              class="w-full"
              placeholder="Enter Category"
              v-model:value="formData.Category"
            />
          </div>
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
      title="Edit Voucher Type "
      @cancel="isEditModalVisible = false"
      width="500px"
    >
      <form
        @submit.prevent="
          updateallData(updateformData.SiteCode, updateformData.JVType)
        "
      >
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <div class="grid grid-cols-1 gap-x-4 custom-form">
            <!-- Site Code Dropdown -->
            <div class="flex items-center justify-between mb-5">
              <label class="w-[160px]">Company Code: </label>
              <a-select
                disabled
                class="w-full"
                placeholder="Select Site Code"
                v-model:value="updateformData.SiteCode"
              >
                <a-select-option
                  v-for="item in siteCodeList"
                  :value="item?.SiteCode"
                  :key="item?.SiteCode"
                >
                  {{ `${item?.SiteCode} - ${item?.SiteName}` }}
                </a-select-option>
              </a-select>
            </div>

            <!-- AM Code Dropdown -->
            <div class="flex items-center justify-between mb-5">
              <label class="w-[160px]"
                >Account Head: <span class="text-red-500"> *</span></label
              >
              <a-select
                show-search
                allowClear
                class="w-full"
                :filter-option="false"
                placeholder="Select Account Head"
                v-model:value="updateformData.AMCode"
                @search="getaMCodeList"
                @select="selectAMCode"
              >
                <a-select-option
                  v-for="item in aMCodeList"
                  :value="item?.AMCode"
                  :key="item?.AMCode"
                >
                  {{ `${item?.AMCode} - ${item?.AMDetails}` }}
                </a-select-option>
              </a-select>
            </div>

            <!-- JV Details Field -->

            <div class="flex items-center justify-between mb-5">
              <label class="w-[160px]"
                >JV Details: <span class="text-red-500"> *</span></label
              >
              <a-input
                class="w-full"
                placeholder="Enter JV Details"
                v-model:value="updateformData.JVDetails"
              />
            </div>

            <!-- JV Type Field -->
            <div class="flex items-center justify-between mb-5">
              <label class="w-[160px]">JV Type:</label>
              <a-input
                disabled
                class="w-full"
                placeholder="Enter JV Type"
                v-model:value="updateformData.JVType"
              />
            </div>
            <!-- Category Field -->
            <div class="flex items-center justify-between mb-5">
              <label class="w-[160px]">
                Category:<span class="text-red-500"> *</span></label
              >
              <a-input
                class="w-full"
                placeholder="Enter Category"
                v-model:value="updateformData.Category"
              />
            </div>
          </div>
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
import debounce from "debounce";
const router = useRouter();
const goBack = () => {
  router.push({ name: "overview" });
};

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);

const formData = ref({
  SiteCode: "",
  JVType: "",
  JVDetails: "",
  AMCode: "",
  Category: "",
});
const updateformData = ref({
  JVDetails: "",
  AMCode: "",
  Category: "",
});

const siteCodeList = ref([]);
const getsiteCodeList = async () => {
  try {
    const res = await axios.get(`${apiBase}/settings/site/all`, getToken());
    if (res?.data) {
      siteCodeList.value = res?.data?.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

// create
const createallData = async () => {
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/settings/voucher-type`,
      formData.value,
      getToken()
    );
    isCreating.value = false;

    if (res.data.success === true) {
      showNotification(
        res?.data?.success ? "success" : "error",
        res?.data?.message
      );
      await fetchAllData();
      formData.value = {
        SiteCode: "",
        JVType: "",
        JVDetails: "",
        AMCode: "",
        Category: "",
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
const allData_idwise = async (SiteCode, JVType) => {
  try {
    isShowLoading.value = true;
    const res = await axios.get(
      `${apiBase}/settings/voucher-type/show?site=${SiteCode}&jvtype=${JVType}`,
      getToken()
    );
    isShowLoading.value = false;

    updateformData.value = {
      SiteCode: res?.data?.data?.SiteCode,
      JVType: res?.data?.data?.JVType,
      JVDetails: res?.data?.data?.JVDetails,
      AMCode: res?.data?.data?.AMCode,
      Category: res?.data?.data?.Category,
    };
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// update
const updateallData = async (SiteCode, JVType) => {
  const finalFormData = {
    JVDetails: updateformData.value.JVDetails,
    AMCode: updateformData.value.AMCode,
    Category: updateformData.value.Category,
  };
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/settings/voucher-type?site=${SiteCode}&jvtype=${JVType}`,
      finalFormData,
      getToken()
    );
    isUpdating.value = false;
    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );

    createallData;
    await fetchAllData();
    isEditModalVisible.value = false;
  } catch (error) {
    isUpdating.value = false;
    isEditModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

let searchTimeout = null;

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
    const res = await axios.get(
      `${apiBase}/settings/voucher-type?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
      getToken()
    );
    console.log(res.data);
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

const deleteData = async (site, jvType) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/voucher-type?site=${site}&jvtype=${jvType}`,
      getToken()
    );
    showNotification(res?.data ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (err) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const aMCodeList = ref([]);
const getaMCodeList = async (search) => {
  try {
    const res = await axios.get(
      `${apiBase}/acmaster?search=${search}`,
      getToken()
    );
    if (res?.data) {
      aMCodeList.value = res?.data?.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

const selectAMCode = (e) => {
  const selectedItem = aMCodeList.value.find((item) => item.AMCode === e);
  if (selectedItem) {
    formData.value.JVDetails = selectedItem.AMDetails;
    updateformData.value.JVDetails = selectedItem.AMDetails;
  }
};

onMounted(async () => {
  await fetchAllData();

  await getsiteCodeList();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

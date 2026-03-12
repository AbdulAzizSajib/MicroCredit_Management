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
          Add Site
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Site ({{ total }})
      <Icon v-if="isShowLoading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">SiteCode</th>
          <th class="border border-white px-4 py-2">SiteName</th>
          <th class="border border-white px-4 py-2">ShortName</th>
          <th class="border border-white px-4 py-2">ZoneCode</th>
          <th class="border border-white px-4 py-2">Address1</th>
          <th class="border border-white px-4 py-2">Address2</th>
          <th class="border border-white px-4 py-2 text-right">ActiveSite</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.SiteCode }}</td>
          <td class="px-4 border">{{ data?.SiteName }}</td>
          <td class="px-4 border">{{ data?.ShortName }}</td>
          <td class="px-4 border">{{ data?.ZoneCode }}</td>
          <td class="px-4 border">{{ data?.Address1 }}</td>
          <td class="px-4 border">{{ data?.Address2 }}</td>
          <td class="px-2 py-1 text-center align-middle border border-gray-200">
            <div
              :class="
                data?.ActiveSite == 1
                  ? 'inline-block border border-green-400 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full'
                  : 'inline-block border border-red-400 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full'
              "
            >
              {{ data?.ActiveSite == 1 ? "Active" : "Inactive" }}
            </div>
          </td>

          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                @click="allData_idwise(data?.SiteCode)"
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <a-popconfirm
                @confirm="deleteData(data?.SiteCode)"
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
      title="Site Code"
      @cancel="isCreateModalVisible = false"
      :footer="null"
    >
      <form @submit.prevent="createallData" @keydown="handleEnterAsTab">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <!-- Site Name Field -->
          <a-form-item
            label="Site Name"
            name="SiteName"
            :rules="[{ required: false, message: 'Please select a site name!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Site Name"
              v-model:value="formData.SiteName"
            />
          </a-form-item>

          <!-- Short Name Field -->
          <a-form-item
            label="Short Name"
            name="ShortName"
            :rules="[{ required: false, message: 'Please select a short name!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Short Name"
              v-model:value="formData.ShortName"
            />
          </a-form-item>

          <a-form-item
            label="Zone Code"
            name="ZoneCode"
            :rules="[{ required: false, message: 'Please select a zone code!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Zone Code"
              v-model:value="formData.ZoneCode"
            />
          </a-form-item>

          <a-form-item
            label="Address1"
            name="Address1"
            :rules="[{ required: false, message: 'Please select a address1!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Address1"
              v-model:value="formData.Address1"
            />
          </a-form-item>

          <a-form-item
            label="Address2"
            name="Address2"
            :rules="[{ required: false, message: 'Please select a address2!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Address2"
              v-model:value="formData.Address2"
            />
          </a-form-item>

          <a-form-item
            label="Active Site"
            name="ActiveSite"
            :rules="[{ required: false, message: 'Please select a ActiveSite!' }]"
          >
            <a-select
              class="w-full"
              placeholder="Select Active Site"
              v-model:value="formData.ActiveSite"
            >
              <a-select-option :value="1">Active</a-select-option>
              <a-select-option :value="0">Inactive</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="Group Billing"
            name="GroupBilling"
            :rules="[{ required: false, message: 'Please select a Group Billing!' }]"
          >
            <a-select
              class="w-full"
              placeholder="Select Group Billing"
              v-model:value="formData.GroupBilling"
            >
              <a-select-option :value="1">Yes</a-select-option>
              <a-select-option :value="0">No</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="RSite Code"
            name="RSiteCode"
            :rules="[{ required: false, message: 'Please select a RSiteCode!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter RSiteCode"
              v-model:value="formData.RSiteCode"
            />
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
      title="Edit site code"
      @cancel="isEditModalVisible = false"
      width="500px"
    >
      <form
        @submit.prevent="updateallData(updateformData.SiteCode)"
        @keydown="handleEnterAsTab"
      >
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <a-form-item
            label="Site Name"
            name="SiteName"
            :rules="[{ required: false, message: 'Please select a site name!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Site Name"
              v-model:value="updateformData.SiteName"
            />
          </a-form-item>

          <!-- Short Name Field -->
          <a-form-item
            label="Short Name"
            name="ShortName"
            :rules="[{ required: false, message: 'Please select a short name!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Short Name"
              v-model:value="updateformData.ShortName"
            />
          </a-form-item>

          <a-form-item
            label="Zone Code"
            name="ZoneCode"
            :rules="[{ required: false, message: 'Please select a zone code!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Zone Code"
              v-model:value="updateformData.ZoneCode"
            />
          </a-form-item>

          <a-form-item
            label="Address1"
            name="Address1"
            :rules="[{ required: false, message: 'Please select a address1!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Address1"
              v-model:value="updateformData.Address1"
            />
          </a-form-item>

          <a-form-item
            label="Address2"
            name="Address2"
            :rules="[{ required: false, message: 'Please select a address2!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Address2"
              v-model:value="updateformData.Address2"
            />
          </a-form-item>

          <a-form-item
            label="ActiveSite"
            name="ActiveSite"
            :rules="[{ required: false, message: 'Please select a ActiveSite!' }]"
          >
            <a-select
              class="w-full"
              placeholder="Select ActiveSite"
              v-model:value="updateformData.ActiveSite"
            >
              <a-select-option :value="1">Active</a-select-option>
              <a-select-option :value="0">Inactive</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="Group Billing"
            name="GroupBilling"
            :rules="[{ required: false, message: 'Please select a Group Billing!' }]"
          >
            <a-select
              class="w-full"
              placeholder="Select GroupBilling"
              v-model:value="updateformData.GroupBilling"
            >
              <a-select-option :value="1">Yes</a-select-option>
              <a-select-option :value="0">No</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="RSite Code"
            name="RSiteCode"
            :rules="[{ required: false, message: 'Please select a RSiteCode!' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter RSiteCode"
              v-model:value="updateformData.RSiteCode"
            />
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
  SiteName: "",
  ShortName: "",
  ZoneCode: "",
  Address1: "",
  Address2: "",
  ActiveSite: "",
  GroupBilling: "",
  RSiteCode: "",
});
const updateformData = ref({
  SiteName: "",
  ShortName: "",
  ZoneCode: "",
  Address1: "",
  Address2: "",
  ActiveSite: "",
  GroupBilling: "",
  RSiteCode: "",
});

// create
const createallData = async () => {
  // console.log(formData.value);
  isCreating.value = true;
  try {
    const res = await axios.post(`${apiBase}/settings/site`, formData.value, getToken());
    isCreating.value = false;

    if (res.data.success === true) {
      showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
      await fetchAllData();
      formData.value = {
        SiteName: "",
        ShortName: "",
        ZoneCode: "",
        Address1: "",
        Address2: "",
        ActiveSite: "",
        GroupBilling: "",
        RSiteCode: "",
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
const allData_idwise = async (id) => {
  try {
    isShowLoading.value = true;
    console.log(apiBase);
    const res = await axios.get(`${apiBase}/settings/site/show?site=${id}`, getToken());
    isShowLoading.value = false;
    console.log(res);

    updateformData.value = {
      SiteCode: res?.data?.data?.SiteCode,
      SiteName: res?.data?.data?.SiteName,
      ShortName: res?.data?.data?.ShortName,
      ZoneCode: res?.data?.data?.ZoneCode,
      Address1: res?.data?.data?.Address1,
      Address2: res?.data?.data?.Address2,
      ActiveSite: res?.data?.data?.ActiveSite,
      GroupBilling: res?.data?.data?.GroupBilling,
      RSiteCode: res?.data?.data?.RSiteCode,
    };
    console.log(updateformData.value);
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// update
const updateallData = async (SiteCode) => {
  const finalFormData = {
    SiteName: updateformData.value.SiteName,
    ShortName: updateformData.value.ShortName,
    ZoneCode: updateformData.value.ZoneCode,
    Address1: updateformData.value.Address1,
    Address2: updateformData.value.Address2,
    ActiveSite: updateformData.value.ActiveSite,
    GroupBilling: updateformData.value.GroupBilling,
    RSiteCode: updateformData.value.RSiteCode,
  };
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/settings/site?site=${SiteCode}`,
      finalFormData,
      getToken()
    );
    isUpdating.value = false;
    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);

    updateformData.value = {
      SiteCode: "",
      SiteName: "",
      ShortName: "",
      ZoneCode: "",
      Address1: "",
      Address2: "",
      ActiveSite: "",
      GroupBilling: "",
      RSiteCode: "",
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
const deleteData = async (SiteCode) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/site?site=${SiteCode}`,
      getToken()
    );
    showNotification(res?.data ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (err) {
    loading.value = false;
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
    console.log(apiBase);
    const res = await axios.get(
      `${apiBase}/settings/site?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
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

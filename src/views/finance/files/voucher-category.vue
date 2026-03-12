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
          @click="
            () => {
              formData.JVDetails = '';
              isCreateModalVisible = true;
            }
          "
        >
          Add Voucher Category
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Voucher Category ({{ total }})
      <Icon v-if="isShowLoading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">JV Type</th>
          <th class="border border-white px-4 py-2">Category</th>
          <th class="border border-white px-4 py-2">Short</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.JVType || "-" }}</td>
          <td class="px-4 border">{{ data?.Category || "-" }}</td>
          <td class="px-4 border">{{ data?.Short || "-" }}</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                @click="allData_idwise(data?.JVType, data?.Category)"
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <a-popconfirm
                @confirm="deleteData(data?.JVType, data?.Category)"
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
      title="Voucher Category "
      @cancel="isCreateModalVisible = false"
      :footer="null"
    >
      <form @submit.prevent="createallData">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <!-- Site Code Dropdown -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]"
              >JV Type: <span class="text-red-500">*</span></label
            >
            <a-select
              show-search
              allowClear
              :filter-option="false"
              class="w-full"
              placeholder="Select JV Type"
              v-model:value="formData.JVType"
              @search="getJVTypeList"
            >
              <a-select-option
                v-for="item in JVTypeList"
                :value="item?.JVType"
                :key="item?.JVType"
              >
                {{ `${item?.JVType} - ${item?.JVDetails}` }}
              </a-select-option>
            </a-select>
          </div>

          <!-- Category Field -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">
              Category:<span class="text-red-500"> *</span></label
            >
            <a-select
              class="w-full"
              placeholder="Enter Category"
              v-model:value="formData.Category"
            >
              <a-select-option value="Credit">Credit</a-select-option>
              <a-select-option value="Debit">Debit</a-select-option>
              <a-select-option value="Payment">Payment</a-select-option>
              <a-select-option value="Receipt">Receipt</a-select-option>
              <a-select-option value="Journal">Journal</a-select-option>
            </a-select>
          </div>

          <!-- Short Field -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">
              Short:<span class="text-red-500"> *</span></label
            >
            <a-input
              class="w-full"
              placeholder="Enter Short"
              v-model:value="formData.Short"
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
          updateallData(updateformData.JVType, updateformData.Category)
        "
      >
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <div class="grid grid-cols-1 gap-x-4 custom-form">
            <!-- Site Code Dropdown -->
            <div class="flex items-center justify-between mb-5">
              <label class="w-[160px]"
                >JV Type: <span class="text-red-500">*</span></label
              >
              <a-select
                disabled
                show-search
                allowClear
                :filter-option="false"
                class="w-full"
                placeholder="Select JV Type"
                v-model:value="updateformData.JVType"
                @search="getJVTypeList"
              >
                <a-select-option
                  v-for="item in JVTypeList"
                  :value="item?.JVType"
                  :key="item?.JVType"
                >
                  {{ `${item?.JVType} - ${item?.JVDetails}` }}
                </a-select-option>
              </a-select>
            </div>

            <!-- Category Field -->
            <div class="flex items-center justify-between mb-5">
              <label class="w-[160px]">
                Category:<span class="text-red-500"> *</span></label
              >
              <a-select
                disabled
                class="w-full"
                placeholder="Enter Category"
                v-model:value="updateformData.Category"
              >
                <a-select-option value="Credit">Credit</a-select-option>
                <a-select-option value="Debit">Debit</a-select-option>
                <a-select-option value="Payment">Payment</a-select-option>
                <a-select-option value="Receipt">Receipt</a-select-option>
                <a-select-option value="Journal">Journal</a-select-option>
              </a-select>
            </div>

            <!-- Short Field -->
            <div class="flex items-center justify-between mb-5">
              <label class="w-[160px]">
                Short:<span class="text-red-500"> *</span></label
              >
              <a-input
                class="w-full"
                placeholder="Enter Short"
                v-model:value="updateformData.Short"
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
  JVType: null,
  Category: null,
  Short: "",
});
const updateformData = ref({
  JVType: "",
  Category: "",
  Short: "",
});

const JVTypeList = ref([]);
const getJVTypeList = async (searchTerm) => {
  try {
    const res = await axios.get(
      `${apiBase}/settings/voucher-type/all?search=${searchTerm || ""}`,
      getToken()
    );
    if (res?.data) {
      JVTypeList.value = res?.data?.data;
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
      `${apiBase}/settings/voucher-type-category`,
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
        JVType: "",
        Category: "",
        Short: "",
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
const allData_idwise = async (JVType, Category) => {
  try {
    isShowLoading.value = true;
    const res = await axios.get(
      `${apiBase}/settings/voucher-type-category/show?JVType=${JVType}&Category=${Category}`,
      getToken()
    );
    isShowLoading.value = false;

    updateformData.value = {
      JVType: res?.data?.data[0]?.JVType || "",
      Category: res?.data?.data[0]?.Category || "",
      Short: res?.data?.data[0]?.Short || "",
    };
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// update
const updateallData = async (JVType, Category) => {
  const finalFormData = {
    Short: updateformData.value.Short,
  };
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/settings/voucher-type-category?JVType=${JVType}&Category=${Category}`,
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
      `${apiBase}/settings/voucher-type-category?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
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

const deleteData = async (jvType, Category) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/voucher-type-category?JVType=${jvType}&Category=${Category}`,
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

onMounted(async () => {
  await fetchAllData();
  await getJVTypeList();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

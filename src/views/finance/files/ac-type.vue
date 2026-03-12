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
          Add AC Type
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4 flex items-center gap-4">
      AC Type ({{ total }})

      <Icon v-if="isShowLoading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">GroupCode</th>
          <th class="border border-white px-4 py-2">Group Details</th>
          <th class="border border-white px-4 py-2">Group Code Sub</th>
          <th class="border border-white px-4 py-2 text-right">AC Type</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.GroupCode }}</td>
          <td class="px-4 border">{{ data?.ACType1Details }}</td>
          <td class="px-4 border">{{ data?.GroupCodeSub || "-" }}</td>
          <td class="px-4 border text-right">{{ data?.ACType1 }}</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                @click="
                  allData_idwise(
                    data?.ACType1,
                    data?.GroupCode,
                    data?.GroupCodeSub
                  )
                "
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <a-popconfirm
                @confirm="
                  deleteData(data?.ACType1, data?.GroupCode, data?.GroupCodeSub)
                "
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
      title="A/C Type"
      @cancel="isCreateModalVisible = false"
      :footer="null"
    >
      <form @submit.prevent="createallData">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <!-- Group Code Field -->
          <a-form-item
            label="Group Code"
            name="GroupCode"
            :rules="[
              { required: false, message: 'Please select a group code!' },
            ]"
          >
            <a-select
              class="w-full"
              placeholder="Select Group Code"
              v-model:value="formData.GroupCode"
              @select="getacSubGroup"
            >
              <a-select-option
                v-for="item in groupcodeList"
                :value="item?.GroupCode"
                :key="item?.GroupCode"
              >
                {{ item?.GroupCode }} - {{ item?.GroupDetails }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- Group Code Field -->
          <a-form-item
            label="A/C Sub Group"
            name="A/CSubGroup"
            :rules="[
              { required: false, message: 'Please select A/C Sub Group!' },
            ]"
          >
            <a-select
              class="w-full"
              placeholder="Select A/C Sub Group"
              v-model:value="formData.GroupCodeSub"
            >
              <a-select-option
                v-for="item in acSubGroupList"
                :value="item?.GroupCodeSub"
                :key="item?.GroupCodeSub"
              >
                {{ item?.GroupCodeSub }} - {{ item?.GroupDetailsSub }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- A/C Type  -->
          <a-form-item label="A/C Type " name="ACType1">
            <a-input
              type="number"
              class="w-full"
              placeholder="Enter A/C Type "
              v-model:value="formData.ACType1"
              @input="handleNumeric($event)"
            />
          </a-form-item>
          <!-- A/C Type Details Field -->
          <a-form-item
            label="A/C Type Details"
            name="ACType1Details"
            :rules="[
              { required: false, message: 'Please input A/C Type details!' },
            ]"
          >
            <a-input
              class="w-full"
              placeholder="Enter A/C Type Details"
              v-model:value="formData.ACType1Details"
            />
          </a-form-item>
        </div>

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
      title="Edit A/C Type"
      @cancel="isEditModalVisible = false"
      width="500px"
    >
      <form
        @submit.prevent="
          updateallData(
            updateformData.ACType1,
            updateformData.GroupCode,
            updateformData.GroupCodeSub
          )
        "
      >
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <!-- Group Code Field (Disabled) -->
          <a-form-item label="Group Code" name="GroupCode">
            <a-select
              disabled
              class="w-full"
              placeholder="Select Group Code"
              v-model:value="updateformData.GroupCode"
            >
              <a-select-option
                v-for="item in groupcodeList"
                :value="item?.GroupCode"
                :key="item?.GroupCode"
              >
                {{ item?.GroupCode }} - {{ item?.GroupDetails }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- Group Code Field -->
          <a-form-item label="A/C Sub Group" name="A/CSubGroup">
            <a-select
              disabled
              class="w-full"
              placeholder="Select A/C Sub Group"
              v-model:value="updateformData.GroupCodeSub"
            >
              <a-select-option
                v-for="item in acSubGroupList"
                :value="item?.GroupCodeSub"
                :key="item?.GroupCodeSub"
              >
                {{ item?.GroupCodeSub }} - {{ item?.GroupDetailsSub }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- A/C Type Field (Disabled) -->
          <a-form-item label="A/C Type" name="ACType1">
            <a-input
              disabled
              type="number"
              class="w-full"
              placeholder="Enter A/C Type"
              v-model:value="updateformData.ACType1"
            />
          </a-form-item>

          <!-- A/C Type Details Field -->
          <a-form-item label="A/C Type Details" name="ACType1Details">
            <a-input
              class="w-full"
              placeholder="Enter A/C Type Details"
              v-model:value="updateformData.ACType1Details"
            />
          </a-form-item>
        </div>

        <div class="flex items-center justify-end">
          <button
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
  router.push({ name: "sub-ledger" });
};

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);

const formData = ref({
  ACType1: "",
  GroupCode: "",
  GroupCodeSub: "",
  ACType1Details: "",
});
const updateformData = ref({
  ACType1: "",
  GroupCode: "",
  GroupCodeSub: "",
  ACType1Details: "",
});

// create
const createallData = async () => {
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/settings/ac-types`,
      formData.value,
      getToken()
    );
    isCreating.value = false;

    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );
    await fetchAllData();
    formData.value = {
      ACType1: "",
      GroupCode: "",
      GroupCodeSub: "",
      ACType1Details: "",
    };

    isCreateModalVisible.value = false;
  } catch (error) {
    isCreating.value = false;
    isCreateModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const isShowLoading = ref(false);

const allData_idwise = async (ACType1, GroupCode, GroupCodeSub) => {
  try {
    isShowLoading.value = true;
    const res = await axios.get(
      `${apiBase}/settings/ac-types/show?actype1=${ACType1}&groupcode=${GroupCode}&groupcodesub=${GroupCodeSub}`,
      getToken()
    );
    isShowLoading.value = false;
    updateformData.value = {
      ACType1: res?.data?.data[0]?.ACType1,
      GroupCode: res?.data?.data[0]?.GroupCode,
      GroupCodeSub: res?.data?.data[0]?.GroupCodeSub,
      ACType1Details: res?.data?.data[0]?.ACType1Details,
    };
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// update
const updateallData = async (ACType1, GroupCode, GroupCodeSub) => {
  isUpdating.value = true;
  const finaldata = {
    ACType1Details: updateformData.value.ACType1Details,
  };
  try {
    const res = await axios.put(
      `${apiBase}/settings/ac-types?actype1=${ACType1}&groupcode=${GroupCode}&groupcodesub=${GroupCodeSub}`,
      finaldata,
      getToken()
    );
    isUpdating.value = false;
    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );

    updateformData.value = {
      ACType1: "",
      GroupCode: "",
      ACType1Details: "",
      GroupCodeSub: "",
    };
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
      `${apiBase}/settings/ac-types?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
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

const deleteData = async (actype1, groupcode, groupcodesub) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/ac-types?actype1=${actype1}&groupcode=${groupcode}&groupcodesub=${groupcodesub}`,
      getToken()
    );
    showNotification(res?.data ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (err) {
    loading.value = false;
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const groupcodeList = ref([]);
const getGroupCode = async () => {
  try {
    const res = await axios.get(
      `${apiBase}/settings/ac-groups/all`,
      getToken()
    );
    if (res?.data) {
      groupcodeList.value = res?.data?.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

const acSubGroupList = ref([]);
const getacSubGroup = async () => {
  try {
    const res = await axios.get(
      `${apiBase}/settings/ac-groups-sub/show?GroupCode=${formData.value.GroupCode}`,
      getToken()
    );
    if (res?.data) {
      acSubGroupList.value = res?.data?.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

const handleNumeric = (event) => {
  const value = event.target.value;
  // Remove any non-numeric characters
  formData.value.ACType1 = value.replace(/[^0-9]/g, "");
};

onMounted(async () => {
  await fetchAllData();
  await getGroupCode();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

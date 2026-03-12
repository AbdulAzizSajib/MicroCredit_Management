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
          Add Cheques No
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Cheque({{ total }})
      <Icon v-if="isShowLoading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Cheque No</th>
          <th class="border border-white px-4 py-2">Audit</th>

          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.ChequeNo }}</td>
          <td class="px-4 border">{{ data?.Audit }}</td>

          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                @click="allData_idwise(data?.ChequeNo)"
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <a-popconfirm
                @confirm="deleteData(data?.ChequeNo)"
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
      title="Add Cheque No"
      @cancel="isCreateModalVisible = false"
      :footer="null"
    >
      <form @submit.prevent="createallData">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <a-form-item
            label="Cheque No"
            name="Cheque No"
            :rules="[{ required: false, message: 'Please input Cheque No !' }]"
          >
            <a-input
              class="w-full"
              placeholder="Enter Cheque No"
              v-model:value="formData.ChequeNo"
            />
          </a-form-item>
          <a-form-item
            label="Audit Type"
            name="Audit"
            :rules="[
              { required: false, message: 'Please select a group type!' },
            ]"
          >
            <a-select
              class="w-full"
              placeholder="Select Audit Type"
              v-model:value="formData.Audit"
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
      title="Edit Cheque No"
      @cancel="isEditModalVisible = false"
      width="500px"
    >
      <form @submit.prevent="updateallData(updateformData.ChequeNo)">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <a-form-item
            label="Cheque No"
            name="Cheque No"
            :rules="[{ required: false, message: 'Please input Cheque No !' }]"
          >
            <a-input
              disabled
              class="w-full"
              placeholder="Enter Cheque No"
              v-model:value="updateformData.ChequeNo"
            />
          </a-form-item>
          <a-form-item
            label="Audit Type"
            name="Audit"
            :rules="[
              { required: false, message: 'Please select a group type!' },
            ]"
          >
            <a-select
              class="w-full"
              placeholder="Select Audit Type"
              v-model:value="updateformData.Audit"
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
  ChequeNo: "",
  Audit: "",
});
const updateformData = ref({
  ChequeNo: "",
  Audit: "",
});

// create
const createallData = async () => {
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/settings/cheques`,
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
        ChequeNo: "",
        Audit: "",
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
    const res = await axios.get(
      `${apiBase}/settings/cheques/show?cheque=${id}`,
      getToken()
    );
    isShowLoading.value = false;

    updateformData.value = {
      Audit: res?.data?.data?.Audit,
      ChequeNo: res?.data?.data?.ChequeNo,
    };
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// update
const updateallData = async (ChequeNo) => {
  const finalFormData = {
    Audit: updateformData.value.Audit,
  };
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/settings/cheques?cheque=${ChequeNo}`,
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
      `${apiBase}/settings/cheques?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
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

const deleteData = async (cheque) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/cheques?cheque=${cheque}`,
      getToken()
    );
    showNotification(res?.data ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (err) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};
const searchLoading = ref(false);

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
      console.log(groupcodeList.value);
    }
  } catch (error) {
    console.log(error.message);
    searchLoading.value = false;
  }
}, 500);

onMounted(async () => {
  await fetchAllData();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

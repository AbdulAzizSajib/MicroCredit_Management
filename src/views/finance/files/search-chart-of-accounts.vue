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
        <router-link :to="{ name: 'chart-of-accounts' }">
          <button
            class="bg-primary text-white px-4 py-2 rounded"
            @click="isCreateModalVisible = true"
          >
            Add Chart of account
          </button>
        </router-link>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4">
      Search Chart of Accounts ({{ total }})
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Account Code</th>
          <th class="border border-white px-4 py-2">Account Details</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.AMCode }}</td>
          <td class="px-4 border">{{ data?.AMDetails }}</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <router-link
                :to="{
                  name: 'chart-of-accounts-edit',
                  params: {
                    am_code: data?.AMCode,
                  },
                }"
              >
                <button
                  type="button"
                  class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                >
                  <i class="bi bi-pencil"></i>
                </button>
              </router-link>
              <a-popconfirm
                @confirm="deleteData(data?.AMCode)"
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
  Dept: "",
  DeptDetail: "",
});
const updateformData = ref({
  DeptDetail: "",
});

// create
const createallData = async () => {
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/settings/department`,
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
      Dept: "",
      DeptDetail: "",
    };

    isCreateModalVisible.value = false;
  } catch (error) {
    isCreating.value = false;
    isCreateModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const allData_idwise = async (id) => {
  try {
    const res = await axios.get(
      `${apiBase}/settings/department/show?dept=${id}`,
      getToken()
    );

    formData.value = {
      Dept: res?.data?.data?.Dept,
      DeptDetail: res?.data?.data?.DeptDetail,
    };
    updateformData.value = {
      DeptDetail: res?.data?.data?.DeptDetail,
    };
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// update
const updateallData = async (Dept) => {
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/settings/department?dept=${Dept}`,
      updateformData.value,
      getToken()
    );
    isUpdating.value = false;
    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );
    formData.value = {
      Dept: "",
      DeptDetail: "",
    };
    updateformData.value = {
      DeptDetail: "",
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
      `${apiBase}/acmaster?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
      getToken()
    );
    loading.value = false;
    allData.value = res?.data?.data;
    total.value = res?.data?.total;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    console.error("Failed to fetch allData:", err);
  }
};

const deleteData = async (AMCode) => {
  loading.value = true;
  try {
    const res = await axios.delete(`${apiBase}/acmaster/${AMCode}`, getToken());
    showNotification(res?.data ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (err) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
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

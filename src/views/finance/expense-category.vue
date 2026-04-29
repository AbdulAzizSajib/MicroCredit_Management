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
          @click="openCreateModal"
        >
          Add Expense Category
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Expense Category ({{ total }})
      <Icon v-if="isShowLoading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Expense Category ID</th>
          <th class="border border-white px-4 py-2">Expense Category Name</th>
          <th class="border border-white px-4 py-2 text-center">Active</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.ExpenseCatId || "-" }}</td>
          <td class="px-4 border">{{ data?.ExpenseCatName || "-" }}</td>
          <td class="px-2 py-1 text-center align-middle border border-gray-200">
            <div
              :class="
                data?.Active === 'Y'
                  ? 'inline-block border border-green-400 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full'
                  : 'inline-block border border-red-400 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full'
              "
            >
              {{ data?.Active === "Y" ? "Yes" : "No" }}
            </div>
          </td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                @click="allData_idwise(data?.ExpenseCatId)"
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <a-popconfirm
                @confirm="deleteData(data?.ExpenseCatId)"
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
        <tr v-if="!allData.length && !loading">
          <td colspan="4" class="px-4 py-6 border text-center text-gray-500">
            No data found
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create Modal -->
    <a-modal
      v-model:open="isCreateModalVisible"
      title="Add Expense Category"
      @cancel="isCreateModalVisible = false"
      :footer="null"
    >
      <form @submit.prevent="createallData" @keydown="handleEnterAsTab">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <div class="flex items-center justify-between mb-5">
            <label class="w-[180px]">Category ID:</label>
            <a-input
              class="w-full"
              placeholder="Auto generated"
              v-model:value="formData.ExpenseCatId"
              disabled
            />
          </div>

          <div class="flex items-center justify-between mb-5">
            <label class="w-[180px]">
              Category Name:
              <span class="text-red-500">*</span>
            </label>
            <a-input
              class="w-full"
              placeholder="Enter Category Name"
              v-model:value="formData.ExpenseCatName"
            />
          </div>

          <div class="flex items-center justify-between mb-5">
            <label class="w-[180px]">
              Active:
              <span class="text-red-500">*</span>
            </label>
            <a-select
              class="w-full"
              placeholder="Select Active"
              v-model:value="formData.Active"
            >
              <a-select-option value="Y">Yes</a-select-option>
              <a-select-option value="N">No</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            @click="isCreateModalVisible = false"
            class="border px-6 py-1 rounded font-semibold bg-gray-500 text-white"
          >
            Close
          </button>
          <button
            type="submit"
            :disabled="isCreating"
            class="border px-6 py-1 rounded font-semibold bg-primary text-white disabled:opacity-60"
          >
            {{ isCreating ? "Saving..." : "Save" }}
          </button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal
      :footer="null"
      v-model:open="isEditModalVisible"
      title="Edit Expense Category"
      @cancel="isEditModalVisible = false"
      width="500px"
    >
      <form
        @submit.prevent="updateallData(updateformData.ExpenseCatId)"
        @keydown="handleEnterAsTab"
      >
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <div class="flex items-center justify-between mb-5">
            <label class="w-[180px]">Category ID:</label>
            <a-input
              class="w-full"
              placeholder="Category ID"
              v-model:value="updateformData.ExpenseCatId"
              disabled
            />
          </div>

          <div class="flex items-center justify-between mb-5">
            <label class="w-[180px]">
              Category Name:
              <span class="text-red-500">*</span>
            </label>
            <a-input
              class="w-full"
              placeholder="Enter Category Name"
              v-model:value="updateformData.ExpenseCatName"
            />
          </div>

          <div class="flex items-center justify-between mb-5">
            <label class="w-[180px]">
              Active:
              <span class="text-red-500">*</span>
            </label>
            <a-select
              class="w-full"
              placeholder="Select Active"
              v-model:value="updateformData.Active"
            >
              <a-select-option value="Y">Yes</a-select-option>
              <a-select-option value="N">No</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            @click="isEditModalVisible = false"
            class="border px-6 py-1 rounded font-semibold bg-gray-500 text-white"
          >
            Close
          </button>
          <button
            type="submit"
            :disabled="isUpdating"
            class="border px-6 py-1 rounded font-semibold bg-primary text-white disabled:opacity-60"
          >
            {{ isUpdating ? "Updating..." : "Update" }}
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

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isShowLoading = ref(false);

const blankForm = () => ({
  ExpenseCatId: "",
  ExpenseCatName: "",
  Active: "Y",
});

const formData = ref(blankForm());
const updateformData = ref(blankForm());

const page = ref(1);
const per_page = ref(10);
const total = ref(0);
const search = ref("");

const allData = ref([]);
const loading = ref(false);

// Generate next ExpenseCatId like EX01, EX02 ... by analyzing existing IDs
const generateNextExpenseCatId = async () => {
  try {
    const res = await axios.get(
      `${apiBase}/settings/expense-category?search=&per_page=100000&page=1`,
      getToken()
    );
    const list = res?.data?.data?.data || [];

    let prefix = "EX";
    let maxNum = 0;

    list.forEach((c) => {
      const m = String(c.ExpenseCatId || "").match(/^([A-Za-z]*)(\d+)$/);
      if (m) {
        const num = parseInt(m[2], 10);
        if (num > maxNum) {
          maxNum = num;
          prefix = m[1] || prefix;
        }
      }
    });

    const nextNum = maxNum + 1;
    const width = Math.max(2, String(nextNum).length);
    const next = String(nextNum).padStart(width, "0");
    return `${prefix}${next}`;
  } catch (err) {
    console.error("Failed to generate expense category id:", err);
    return "EX01";
  }
};

const openCreateModal = async () => {
  formData.value = blankForm();
  isCreateModalVisible.value = true;
  formData.value.ExpenseCatId = await generateNextExpenseCatId();
};

// Fetch list with search and pagination
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/settings/expense-category?page=${page.value}&per_page=${
        per_page.value
      }&search=${search.value || ""}`,
      getToken()
    );
    loading.value = false;
    allData.value = res?.data?.data?.data || [];
    total.value = res?.data?.data?.total || 0;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

// Create
const createallData = async () => {
  if (
    !formData.value.ExpenseCatId ||
    !formData.value.ExpenseCatName ||
    !formData.value.Active
  ) {
    showNotification("error", "Please fill all required fields");
    return;
  }
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/settings/expense-category`,
      formData.value,
      getToken()
    );
    isCreating.value = false;

    if (res?.data?.success === true) {
      showNotification("success", res?.data?.message);
      await fetchAllData();
      formData.value = blankForm();
      isCreateModalVisible.value = false;
    } else {
      showNotification("error", res?.data?.message || "Failed to create");
    }
  } catch (error) {
    isCreating.value = false;
    showNotification(
      "error",
      error?.response?.data?.message || error?.message
    );
  }
};

// Show by id (for edit)
const allData_idwise = async (ExpenseCatId) => {
  try {
    isShowLoading.value = true;
    const res = await axios.get(
      `${apiBase}/settings/expense-category/show?ExpenseCatId=${ExpenseCatId}`,
      getToken()
    );
    isShowLoading.value = false;

    const item = Array.isArray(res?.data?.data)
      ? res?.data?.data[0]
      : res?.data?.data;

    updateformData.value = {
      ExpenseCatId: item?.ExpenseCatId || ExpenseCatId,
      ExpenseCatName: item?.ExpenseCatName || "",
      Active: item?.Active || "Y",
    };
    isEditModalVisible.value = true;
  } catch (error) {
    isShowLoading.value = false;
    showNotification(
      "error",
      error?.response?.data?.message || error?.message
    );
  }
};

// Update
const updateallData = async (ExpenseCatId) => {
  if (!updateformData.value.ExpenseCatName || !updateformData.value.Active) {
    showNotification("error", "Please fill all required fields");
    return;
  }
  const finalFormData = {
    ExpenseCatName: updateformData.value.ExpenseCatName,
    Active: updateformData.value.Active,
  };
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/settings/expense-category?ExpenseCatId=${ExpenseCatId}`,
      finalFormData,
      getToken()
    );
    isUpdating.value = false;
    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );
    await fetchAllData();
    isEditModalVisible.value = false;
  } catch (error) {
    isUpdating.value = false;
    showNotification(
      "error",
      error?.response?.data?.message || error?.message
    );
  }
};

// Delete
const deleteData = async (ExpenseCatId) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/expense-category?ExpenseCatId=${ExpenseCatId}`,
      getToken()
    );
    showNotification(res?.data ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (error) {
    loading.value = false;
    showNotification(
      "error",
      error?.response?.data?.message || error?.message
    );
  }
};

// Enter key acts as Tab in forms
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

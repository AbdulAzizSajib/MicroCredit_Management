<template>
  <MainLayout>
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-3">
      <a-input
        placeholder="Search here..."
        v-model:value="search"
        @input="handleSearch"
        class="w-full sm:w-64"
      />
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 w-full sm:w-auto">
        <a-range-picker
          v-model:value="dateRange"
          value-format="YYYY-MM-DD"
          format="DD-MMM-YYYY"
          :input-read-only="true"
          @change="handleDateChange"
          class="w-full sm:w-auto"
        />
        <button
          class="bg-primary text-white px-4 py-2 rounded w-full sm:w-auto"
          @click="openCreateModal"
        >
          Add Expense
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4 mt-4">
      Expense ({{ total }})
      <Icon v-if="isShowLoading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">Category</th>
            <th class="border border-white px-4 py-2">Expense Date</th>
            <th class="border border-white px-4 py-2 text-right">Amount</th>
            <th class="border border-white px-4 py-2">Remarks</th>
            <th class="border border-white px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-for="(item, index) in allData" :key="item?.id || index">
            <td class="px-4 border">
              {{ item?.category?.ExpenseCatName || item?.ExpenseCatName || "-" }}
              <span class="ml-1 text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">
                {{ item?.ExpenseCatId }}
              </span>
            </td>
            <td class="px-4 border">{{ formatDate(item?.ExpenseDate) }}</td>
            <td class="px-4 border text-right">{{ formatAmount(item?.Amount) }}</td>
            <td class="px-4 border">{{ item?.Remarks || "-" }}</td>
            <td class="px-4 border text-center w-8">
              <div class="flex justify-center gap-x-3">
                <button
                  type="button"
                  class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                  @click="openEditModal(item?.id)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <a-popconfirm
                  @confirm="deleteData(item?.id)"
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
            <td colspan="5" class="px-4 py-6 border text-center text-gray-500">
              No data found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <a-modal
      v-model:open="isCreateModalVisible"
      title="Add Expense"
      @cancel="isCreateModalVisible = false"
      :footer="null"
      width="550px"
    >
      <form @submit.prevent="createExpense" @keydown="handleEnterAsTab">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">
              Category: <span class="text-red-500">*</span>
            </label>
            <a-select
              show-search
              allowClear
              :filter-option="false"
              class="w-full"
              placeholder="Search Category"
              v-model:value="formData.ExpenseCatId"
              @search="getCategoryList"
              @focus="() => getCategoryList('')"
            >
              <a-select-option
                v-for="item in categoryList"
                :value="item?.ExpenseCatId"
                :key="item?.ExpenseCatId"
              >
                {{ `${item?.ExpenseCatId} - ${item?.ExpenseCatName}` }}
              </a-select-option>
            </a-select>
          </div>

          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">
              Expense Date: <span class="text-red-500">*</span>
            </label>
            <a-date-picker
              v-model:value="formData.ExpenseDate"
              value-format="YYYY-MM-DD"
              format="DD-MMM-YYYY"
              class="w-full"
            />
          </div>

          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">
              Amount: <span class="text-red-500">*</span>
            </label>
            <a-input-number
              v-model:value="formData.Amount"
              :min="0"
              :step="0.01"
              class="w-full"
              placeholder="Enter Amount"
            />
          </div>

          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">Remarks:</label>
            <a-input
              class="w-full"
              placeholder="Enter Remarks"
              v-model:value="formData.Remarks"
            />
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
      v-model:open="isEditModalVisible"
      title="Edit Expense"
      @cancel="isEditModalVisible = false"
      :footer="null"
      width="550px"
    >
      <form @submit.prevent="updateExpense" @keydown="handleEnterAsTab">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">
              Category: <span class="text-red-500">*</span>
            </label>
            <a-select
              show-search
              allowClear
              :filter-option="false"
              class="w-full"
              placeholder="Search Category"
              v-model:value="updateFormData.ExpenseCatId"
              @search="getCategoryList"
              @focus="() => getCategoryList('')"
            >
              <a-select-option
                v-for="item in categoryList"
                :value="item?.ExpenseCatId"
                :key="item?.ExpenseCatId"
              >
                {{ `${item?.ExpenseCatId} - ${item?.ExpenseCatName}` }}
              </a-select-option>
            </a-select>
          </div>

          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">
              Expense Date: <span class="text-red-500">*</span>
            </label>
            <a-date-picker
              v-model:value="updateFormData.ExpenseDate"
              value-format="YYYY-MM-DD"
              format="DD-MMM-YYYY"
              class="w-full"
            />
          </div>

          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">
              Amount: <span class="text-red-500">*</span>
            </label>
            <a-input-number
              v-model:value="updateFormData.Amount"
              :min="0"
              :step="0.01"
              class="w-full"
              placeholder="Enter Amount"
            />
          </div>

          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]">Remarks:</label>
            <a-input
              class="w-full"
              placeholder="Enter Remarks"
              v-model:value="updateFormData.Remarks"
            />
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
      :show-total="(t) => `Total ${t} items`"
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
  ExpenseCatId: undefined,
  ExpenseDate: "",
  Amount: null,
  Remarks: "",
});

const formData = ref(blankForm());
const updateFormData = ref(blankForm());
const editingId = ref(null);

const page = ref(1);
const per_page = ref(10);
const total = ref(0);
const search = ref("");
const dateRange = ref([]);

const allData = ref([]);
const loading = ref(false);
const categoryList = ref([]);

const formatAmount = (amount) => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "-";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};

const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Category search (used in create/edit modals)
let categorySearchTimer = null;
const getCategoryList = (q = "") => {
  clearTimeout(categorySearchTimer);
  categorySearchTimer = setTimeout(async () => {
    try {
      const res = await axios.get(
        `${apiBase}/expense-voucher/get-category?q=${encodeURIComponent(q || "")}`,
        getToken()
      );
      const rows =
        res?.data?.data?.data ||
        res?.data?.data ||
        res?.data ||
        [];
      categoryList.value = Array.isArray(rows) ? rows : [];
    } catch (error) {
      categoryList.value = [];
      console.error("Failed to load categories:", error);
    }
  }, 250);
};

// List
const fetchAllData = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      search: search.value || "",
      per_page: per_page.value,
      page: page.value,
    });
    if (dateRange.value?.[0]) params.append("from_date", dateRange.value[0]);
    if (dateRange.value?.[1]) params.append("to_date", dateRange.value[1]);

    const res = await axios.get(
      `${apiBase}/expense?${params.toString()}`,
      getToken()
    );
    loading.value = false;
    allData.value = res?.data?.data?.data || res?.data?.data || [];
    total.value = res?.data?.data?.total || allData.value.length || 0;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

// Search debounce
let searchTimeout = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchAllData();
  }, 300);
};

const handleDateChange = () => {
  page.value = 1;
  fetchAllData();
};

// Create
const openCreateModal = () => {
  formData.value = blankForm();
  formData.value.ExpenseDate = new Date().toISOString().slice(0, 10);
  getCategoryList("");
  isCreateModalVisible.value = true;
};

const createExpense = async () => {
  if (!formData.value.ExpenseCatId) {
    return showNotification("error", "Please select a Category");
  }
  if (!formData.value.ExpenseDate) {
    return showNotification("error", "Please select an Expense Date");
  }
  if (formData.value.Amount === null || formData.value.Amount === "") {
    return showNotification("error", "Please enter an Amount");
  }

  isCreating.value = true;
  try {
    const payload = {
      ExpenseCatId: formData.value.ExpenseCatId,
      ExpenseDate: formData.value.ExpenseDate,
      Amount: Number(formData.value.Amount),
      Remarks: formData.value.Remarks || "",
    };
    const res = await axios.post(`${apiBase}/expense`, payload, getToken());
    isCreating.value = false;

    if (res?.data?.success === true || res?.status === 200 || res?.status === 201) {
      showNotification("success", res?.data?.message || "Expense created");
      await fetchAllData();
      formData.value = blankForm();
      isCreateModalVisible.value = false;
    } else {
      showNotification("error", res?.data?.message || "Failed to create");
    }
  } catch (error) {
    isCreating.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// Show -> Edit
const openEditModal = async (id) => {
  if (!id) return;
  editingId.value = id;
  isShowLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/expense/${id}`, getToken());
    const item = res?.data?.data || res?.data || {};
    updateFormData.value = {
      ExpenseCatId: item?.ExpenseCatId || undefined,
      ExpenseDate: item?.ExpenseDate
        ? String(item.ExpenseDate).slice(0, 10)
        : "",
      Amount: item?.Amount != null ? Number(item.Amount) : null,
      Remarks: item?.Remarks || "",
    };

    // ensure the selected category appears in the dropdown options
    if (item?.ExpenseCatId) {
      const catName =
        item?.category?.ExpenseCatName || item?.ExpenseCatName || "";
      categoryList.value = [
        {
          ExpenseCatId: item.ExpenseCatId,
          ExpenseCatName: catName || item.ExpenseCatId,
        },
      ];
    }
    isShowLoading.value = false;
    isEditModalVisible.value = true;
  } catch (error) {
    isShowLoading.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const updateExpense = async () => {
  if (!editingId.value) return;
  if (!updateFormData.value.ExpenseCatId) {
    return showNotification("error", "Please select a Category");
  }
  if (!updateFormData.value.ExpenseDate) {
    return showNotification("error", "Please select an Expense Date");
  }
  if (updateFormData.value.Amount === null || updateFormData.value.Amount === "") {
    return showNotification("error", "Please enter an Amount");
  }

  isUpdating.value = true;
  try {
    const payload = {
      ExpenseCatId: updateFormData.value.ExpenseCatId,
      ExpenseDate: updateFormData.value.ExpenseDate,
      Amount: Number(updateFormData.value.Amount),
      Remarks: updateFormData.value.Remarks || "",
    };
    const res = await axios.put(
      `${apiBase}/expense/${editingId.value}`,
      payload,
      getToken()
    );
    isUpdating.value = false;
    showNotification(
      res?.data?.success ? "success" : "success",
      res?.data?.message || "Expense updated"
    );
    await fetchAllData();
    isEditModalVisible.value = false;
  } catch (error) {
    isUpdating.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// Delete
const deleteData = async (id) => {
  if (!id) return;
  loading.value = true;
  try {
    const res = await axios.delete(`${apiBase}/expense/${id}`, getToken());
    showNotification(res?.data ? "success" : "error", res?.data?.message || "Deleted");
    await fetchAllData();
  } catch (error) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// Enter -> Tab
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
  await getCategoryList("");
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

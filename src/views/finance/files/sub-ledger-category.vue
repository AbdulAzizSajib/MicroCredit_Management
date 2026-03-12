<template>
  <mainLayout>
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input
          v-model:value="search"
          placeholder="Search here..."
          @input="handleSearch"
        />
      </div>
      <div class="mb-4">
        <button
          class="bg-primary text-white px-4 py-2 rounded"
          @click="openCreateModal"
        >
          Add Sub Ledger category
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary mb-4">
      Sub-Ledger Category List ({{ total }})
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">AS Type</th>
          <th class="border border-white px-4 py-2">AS Details</th>
          <th class="border border-white px-4 py-2">Category</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.ASType }}</td>
          <td class="px-4 border">{{ data?.ASDetails }}</td>
          <td class="px-4 border">{{ data?.Category }}</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                @click="openEditModal(data)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <a-popconfirm
                title="Are you sure?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="() => deleteAS(data)"
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

    <!-- Create / Edit Modal -->
    <a-modal
      v-model:open="isModalVisible"
      :title="modalTitle"
      @cancel="closeModal"
      :ok-text="isEditMode ? 'Update' : 'Save'"
      @ok="isEditMode ? updateAS() : createAS()"
    >
      <a-form>
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <!-- AS Type Section -->
          <a-form-item
            label="AS Type"
            name="ASType"
            :rules="[
              { required: false, message: 'AS Type is auto-generated!' },
            ]"
          >
            <a-input
              v-model:value="form.ASType"
              placeholder="Auto generated"
              class="w-full"
            />
          </a-form-item>

          <!-- AS Details Section -->
          <a-form-item
            label="AS Details"
            name="ASDetails"
            :rules="[{ required: false, message: 'Please enter AS Details!' }]"
          >
            <a-input
              v-model:value="form.ASDetails"
              placeholder="Enter AS Details"
              class="w-full"
            />
            <p v-if="errors.ASDetails" class="text-red-500 text-sm mt-1">
              {{ errors.ASDetails }}
            </p>
          </a-form-item>

          <!-- Category Section -->
          <a-form-item
            label="Category"
            name="Category"
            :rules="[{ required: false, message: 'Please enter Category!' }]"
          >
            <a-input
              v-model:value="form.Category"
              placeholder="Enter Category"
              class="w-full"
            />
            <p v-if="errors.Category" class="text-red-500 text-sm mt-1">
              {{ errors.Category }}
            </p>
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </mainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import mainLayout from "@/components/layouts/mainLayout.vue";
import { useRouter } from "vue-router";
import { apiBase } from "@/config.js";
import { getToken } from "@/utilities/common.js";

const router = useRouter();
const goBack = () => router.push({ name: "overview" });

const allData = ref([]);
const total = ref(0);
const page = ref(1);
const per_page = ref(10);
const search = ref("");
const loading = ref(false);

const isModalVisible = ref(false);
const isEditMode = ref(false);
const modalTitle = ref("Add Sub-Ledger Category");

const form = ref({
  ASType: "",
  ASDetails: "",
  Category: "",
});

const errors = ref({
  ASType: "",
  ASDetails: "",
  Category: "",
});

let searchTimeout = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchAllData();
  }, 500);
};

const validateForm = () => {
  let valid = true;
  errors.value = { ASType: "", ASDetails: "", Category: "" };

  if (!form.value.ASDetails.trim()) {
    errors.value.ASDetails = "AS Details is required";
    valid = false;
  }
  if (!form.value.Category.trim()) {
    errors.value.Category = "Category is required";
    valid = false;
  }

  return valid;
};

// Open create modal
const openCreateModal = () => {
  form.value = { ASType: " ", ASDetails: "", Category: "" };
  isEditMode.value = false;
  modalTitle.value = "Add Sub-Ledger Category";
  isModalVisible.value = true;
};

// Open edit modal
const openEditModal = (record) => {
  form.value = { ...record };
  isEditMode.value = true;
  modalTitle.value = "Edit Sub-Ledger Category";
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

// Create
const createAS = async () => {
  if (!validateForm()) return;
  try {
    loading.value = true;
    const res = await axios.post(
      `${apiBase}/settings/as-type`,
      { ...form.value },
      getToken()
    );
    isModalVisible.value = false;
    fetchAllData();
    console.log("Created:", res.data);
  } catch (err) {
    console.error("Create failed:", err);
  } finally {
    loading.value = false;
  }
};

// Update
const updateAS = async () => {
  if (!validateForm()) return;
  try {
    loading.value = true;
    const res = await axios.put(
      `${apiBase}/settings/as-type?astype=${form.value.ASType}`,
      { ASDetails: form.value.ASDetails, Category: form.value.Category },
      getToken()
    );
    isModalVisible.value = false;
    fetchAllData();
    console.log("Updated:", res.data);
  } catch (err) {
    console.error("Update failed:", err);
  } finally {
    loading.value = false;
  }
};

// Delete
const deleteAS = async (record) => {
  try {
    loading.value = true;
    await axios.delete(
      `${apiBase}/settings/as-type?astype=${record.ASType}`,
      getToken()
    );
    fetchAllData();
    console.log("Deleted:", record);
  } catch (err) {
    console.error("Delete failed:", err);
  } finally {
    loading.value = false;
  }
};

// Fetch all data
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/settings/as-type?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
      getToken()
    );
    const data = res?.data?.data;
    allData.value = data?.data || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.error("Failed to fetch data:", err);
    allData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
.ant-input-status-error {
  border-color: #dc2626 !important;
  box-shadow: none;
}
</style>

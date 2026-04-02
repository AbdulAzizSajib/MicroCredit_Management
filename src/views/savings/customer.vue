<template>
  <MainLayout>
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input
          placeholder="Search here..."
          v-model:value="search"
          @input="handleSearch"
          class="w-64"
        />
      </div>
      <div class="mb-4">
        <button
          class="bg-primary text-white px-4 py-2 rounded"
          @click="openCreateModal"
        >
          Add Customer
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4">
      Customer ({{ total }})
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Customer Code</th>
          <th class="border border-white px-4 py-2">Customer Name</th>
          <th class="border border-white px-4 py-2">Address</th>
          <th class="border border-white px-4 py-2">Mobile</th>
          <th class="border border-white px-4 py-2">Email</th>
          <th class="border border-white px-4 py-2 text-center">Status</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.CustomerCode }}</td>
          <td class="px-4 border">{{ data?.CustomerName }}</td>
          <td class="px-4 border">{{ data?.Add1 }}</td>
          <td class="px-4 border">{{ data?.Mobile }}</td>
          <td class="px-4 border lowercase">{{ data?.Email }}</td>
          <td class="px-4 border text-center">
            <span
              class="px-2 py-0.5 rounded text-xs font-semibold"
              :class="data?.Active === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ data?.Active === 'Y' ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="px-4 border text-center">
            <div class="flex justify-center gap-x-3">
              <button
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                @click="openEditModal(data)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <a-popconfirm
                @confirm="deleteCustomer(data?.CustomerCode)"
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

    <!-- Create Modal -->
    <a-modal
      v-model:open="isCreateModalVisible"
      title="Add Customer"
      @cancel="isCreateModalVisible = false"
      :footer="null"
      width="550px"
    >
      <form @submit.prevent="createCustomer">
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Customer Code <span class="text-red-500">*</span></label>
            <a-input v-model:value="formData.CustomerCode" placeholder="Customer Code" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name <span class="text-red-500">*</span></label>
            <a-input v-model:value="formData.CustomerName" placeholder="Customer Name" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address <span class="text-red-500">*</span></label>
            <a-input v-model:value="formData.Add1" placeholder="Address" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mobile <span class="text-red-500">*</span></label>
            <a-input v-model:value="formData.Mobile" placeholder="Mobile" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
            <a-input v-model:value="formData.Email" placeholder="Email" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status <span class="text-red-500">*</span></label>
            <a-select v-model:value="formData.Active" class="w-full">
              <a-select-option value="Y">Active</a-select-option>
              <a-select-option value="N">Inactive</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isCreateModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            type="submit"
            :disabled="isCreating"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            {{ isCreating ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal
      v-model:open="isEditModalVisible"
      title="Edit Customer"
      @cancel="isEditModalVisible = false"
      :footer="null"
      width="550px"
    >
      <form @submit.prevent="updateCustomer">
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Customer Code <span class="text-red-500">*</span></label>
            <a-input :value="editFormData.CustomerCode" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name <span class="text-red-500">*</span></label>
            <a-input v-model:value="editFormData.CustomerName" placeholder="Customer Name" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address <span class="text-red-500">*</span></label>
            <a-input v-model:value="editFormData.Add1" placeholder="Address" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mobile <span class="text-red-500">*</span></label>
            <a-input v-model:value="editFormData.Mobile" placeholder="Mobile" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
            <a-input v-model:value="editFormData.Email" placeholder="Email" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status <span class="text-red-500">*</span></label>
            <a-select v-model:value="editFormData.Active" class="w-full">
              <a-select-option value="Y">Active</a-select-option>
              <a-select-option value="N">Inactive</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isEditModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            type="submit"
            :disabled="isUpdating"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            {{ isUpdating ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";

const page = ref(1);
const per_page = ref(10);
const total = ref(0);
const search = ref("");
const allData = ref([]);
const loading = ref(false);

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);

const defaultForm = {
  CustomerCode: "",
  CustomerName: "",
  Add1: "",
  Mobile: "",
  Email: "",
  Business: "01",
  Active: "Y",
};

const formData = ref({ ...defaultForm });
const editFormData = ref({ ...defaultForm });

const handleSearch = () => {
  page.value = 1;
  fetchAllData();
};

// List
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/customer?search=${search.value}&limit=${per_page.value}&page=${page.value}`,
      getToken()
    );
    loading.value = false;
    allData.value = res?.data?.data?.data || [];
    total.value = res?.data?.data?.total || 0;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    console.error("Failed to fetch customers:", err);
  }
};

// Create
const openCreateModal = () => {
  formData.value = { ...defaultForm };
  isCreateModalVisible.value = true;
};

const createCustomer = async () => {
  if (!formData.value.CustomerCode?.trim()) return showNotification("error", "Customer Code is required.");
  if (!formData.value.CustomerName?.trim()) return showNotification("error", "Customer Name is required.");
  if (!formData.value.Add1?.trim()) return showNotification("error", "Address is required.");
  if (!formData.value.Mobile?.trim()) return showNotification("error", "Mobile is required.");
  if (!formData.value.Email?.trim()) return showNotification("error", "Email is required.");
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/customer`,
      formData.value,
      getToken()
    );
    isCreating.value = false;
    showNotification("success", res?.data?.message || "Customer created successfully!");
    isCreateModalVisible.value = false;
    formData.value = { ...defaultForm };
    await fetchAllData();
  } catch (error) {
    isCreating.value = false;
    showNotification("error", error?.response?.data?.message || "Failed to create customer.");
  }
};

// Edit
const openEditModal = async (data) => {
  try {
    const res = await axios.get(
      `${apiBase}/customer/${data.CustomerCode}`,
      getToken()
    );
    const customer = res?.data?.data || data;
    editFormData.value = {
      CustomerCode: customer.CustomerCode,
      CustomerName: customer.CustomerName,
      Add1: customer.Add1,
      Mobile: customer.Mobile,
      Email: customer.Email,
      Business: customer.Business,
      Active: customer.Active,
    };
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", "Failed to load customer data.");
  }
};

const updateCustomer = async () => {
  if (!editFormData.value.CustomerName?.trim()) return showNotification("error", "Customer Name is required.");
  if (!editFormData.value.Add1?.trim()) return showNotification("error", "Address is required.");
  if (!editFormData.value.Mobile?.trim()) return showNotification("error", "Mobile is required.");
  if (!editFormData.value.Email?.trim()) return showNotification("error", "Email is required.");
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/customer/${editFormData.value.CustomerCode}`,
      {
        CustomerName: editFormData.value.CustomerName,
        Add1: editFormData.value.Add1,
        Mobile: editFormData.value.Mobile,
        Email: editFormData.value.Email,
        Business: editFormData.value.Business,
        Active: editFormData.value.Active,
      },
      getToken()
    );
    isUpdating.value = false;
    showNotification("success", res?.data?.message || "Customer updated successfully!");
    isEditModalVisible.value = false;
    await fetchAllData();
  } catch (error) {
    isUpdating.value = false;
    showNotification("error", error?.response?.data?.message || "Failed to update customer.");
  }
};

// Delete
const deleteCustomer = async (customerCode) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/customer/${customerCode}`,
      getToken()
    );
    showNotification("success", res?.data?.message || "Customer deleted successfully!");
    await fetchAllData();
  } catch (error) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || "Failed to delete customer.");
  }
};

onMounted(async () => {
  await fetchAllData();
});
</script>

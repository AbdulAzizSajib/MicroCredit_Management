<template>
  <mainLayout>


    <!-- Search & Add -->
    <div class="flex justify-between mb-4">
      <a-input v-model:value="search" placeholder="Search here..." @input="handleSearch" class="w-1/3" />
      <button class="bg-primary text-white px-4 py-2 rounded" @click="openCreateModal">
        Add Sub-Ledger
      </button>
    </div>

    <!-- Table -->
    <h1 class="text-2xl font-bold text-primary mb-4">Sub-Ledger ({{ total }})</h1>
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Site</th>
          <th class="border border-white px-4 py-2">Category</th>
          <th class="border border-white px-4 py-2">Sub-Ledger Code</th>
          <th class="border border-white px-4 py-2">Sub-Ledger Details</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ getSiteName(data.SiteCode) }}</td>
          <td class="px-4 border">{{ data.ASType }}</td>
          <td class="px-4 border">{{ data.ASCode }}</td>
          <td class="px-4 border">{{ data.ASDetails }}</td>
          <td class="px-4 border text-center">
            <div class="flex justify-center gap-x-3">
              <button type="button" class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                @click="openEditModal(data)">
                <i class="bi bi-pencil"></i>
              </button>
              <a-popconfirm title="Are you sure?" ok-text="Yes" cancel-text="No" @confirm="() => deleteSubLedger(data)">
                <button type="button" class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark">
                  <i class="bi bi-trash3"></i>
                </button>
              </a-popconfirm>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Loading -->
    <div v-if="loading" class="mt-2 text-center flex justify-center items-center gap-2 text-gray-500">
      <a-spin />
    </div>

    <!-- Pagination -->
    <a-pagination class="mt-4" v-model:current="page" :page-size="per_page" :total="total" :show-size-changer="false"
      :show-total="(total) => `Total ${total} items`" @change="(pageNo) => { page = pageNo; fetchAllData(); }"
      v-if="total > per_page" />

    <!-- Create Modal -->
    <a-modal v-model:open="isCreateModalVisible" title="Add Sub-Ledger" @cancel="closeCreateModal" :ok-text="'Save'"
      @ok="createSubLedger" width="700px">
      <a-form ref="formRef" :model="form">
        <div class="grid grid-cols-1 gap-4 sub-custom-form">
          <!-- Site Dropdown -->
          <a-form-item label="Site" name="SiteCode" :rules="[{ required: true, message: 'Please select a site!' }]">
            <a-select v-model:value="form.SiteCode" class="w-full" placeholder="Select site"
              :class="{ 'border-red-500': errors.SiteCode }">
              <a-select-option v-for="site in sites" :key="site.SiteCode" :value="site.SiteCode">
                {{ site.SiteName }}
              </a-select-option>
            </a-select>
            <p v-if="errors.SiteCode" class="text-red-500 text-sm mt-1">{{ errors.SiteCode }}</p>
          </a-form-item>

          <!-- Category Dropdown -->
          <a-form-item label="Category" name="ASType"
            :rules="[{ required: false, message: 'Please select a category!' }]">
            <a-select v-model:value="form.ASType" class="w-full" placeholder="Select category"
              :class="{ 'border-red-500': errors.ASType }">
              <a-select-option v-for="item in categories" :key="item.ASType" :value="item.ASType">
                {{ item.ASDetails }}
              </a-select-option>
            </a-select>
            <p v-if="errors.ASType" class="text-red-500 text-sm mt-1">{{ errors.ASType }}</p>
          </a-form-item>

          <!-- Sub-Ledger Details Input -->
          <a-form-item label="Sub-Ledger Details" name="ASDetails"
            :rules="[{ required: true, message: 'Please enter sub-ledger details!' }]">
            <a-input v-model:value="form.ASDetails" placeholder="Enter details"
              :class="{ 'border-red-500': errors.ASDetails }" />
            <p v-if="errors.ASDetails" class="text-red-500 text-sm mt-1">{{ errors.ASDetails }}</p>
          </a-form-item>

          <!-- User Name Input -->
          <a-form-item label="User Name" name="UserName"
            :rules="[{ required: true, message: 'Please enter user name!' }]">
            <a-input v-model:value="form.UserName" placeholder="Enter user name"
              :class="{ 'border-red-500': errors.UserName }" />
            <p v-if="errors.UserName" class="text-red-500 text-sm mt-1">{{ errors.UserName }}</p>
          </a-form-item>

          <!-- Address Input -->
          <a-form-item label="Address" name="Address" :rules="[{ required: true, message: 'Please enter address!' }]">
            <a-input v-model:value="form.Address" placeholder="Enter address"
              :class="{ 'border-red-500': errors.Address }" />
            <p v-if="errors.Address" class="text-red-500 text-sm mt-1">{{ errors.Address }}</p>
          </a-form-item>

          <!-- Location Input -->
          <a-form-item label="Location" name="Location"
            :rules="[{ required: true, message: 'Please enter location!' }]">
            <a-input v-model:value="form.Location" placeholder="Enter location"
              :class="{ 'border-red-500': errors.Location }" />
            <p v-if="errors.Location" class="text-red-500 text-sm mt-1">{{ errors.Location }}</p>
          </a-form-item>
        </div>

      </a-form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal v-model:open="isEditModalVisible" title="Edit Sub-Ledger" @cancel="closeEditModal" :ok-text="'Update'"
      @ok="updateSubLedger" width="700px">
      <a-form>
        <div class="grid grid-cols-1 gap-4 sub-custom-form">
          <!-- Site Dropdown -->
          <a-form-item label="Site" name="SiteCode" :rules="[{ required: true, message: 'Please select a site!' }]">
            <a-select v-model:value="form.SiteCode" class="w-full" placeholder="Select site"
              :class="{ 'border-red-500': errors.SiteCode }">
              <a-select-option v-for="site in sites" :key="site.SiteCode" :value="site.SiteCode">
                {{ site.SiteName }}
              </a-select-option>
            </a-select>
            <p v-if="errors.SiteCode" class="text-red-500 text-sm mt-1">{{ errors.SiteCode }}</p>
          </a-form-item>

          <!-- Category Dropdown -->
          <a-form-item label="Category" name="ASType"
            :rules="[{ required: true, message: 'Please select a category!' }]">
            <a-select v-model:value="form.ASType" class="w-full" placeholder="Select category"
              :class="{ 'border-red-500': errors.ASType }">
              <a-select-option v-for="item in categories" :key="item.ASType" :value="item.ASType">
                {{ item.ASDetails }}
              </a-select-option>
            </a-select>
            <p v-if="errors.ASType" class="text-red-500 text-sm mt-1">{{ errors.ASType }}</p>
          </a-form-item>

          <!-- Sub-Ledger Details Input -->
          <a-form-item label="Sub-Ledger Details" name="ASDetails"
            :rules="[{ required: true, message: 'Please enter sub-ledger details!' }]">
            <a-input v-model:value="form.ASDetails" placeholder="Enter details"
              :class="{ 'border-red-500': errors.ASDetails }" />
            <p v-if="errors.ASDetails" class="text-red-500 text-sm mt-1">{{ errors.ASDetails }}</p>
          </a-form-item>

          <!-- User Name Input -->
          <a-form-item label="User Name" name="UserName"
            :rules="[{ required: true, message: 'Please enter user name!' }]">
            <a-input v-model:value="form.UserName" placeholder="Enter user name"
              :class="{ 'border-red-500': errors.UserName }" />
            <p v-if="errors.UserName" class="text-red-500 text-sm mt-1">{{ errors.UserName }}</p>
          </a-form-item>

          <!-- Address Input -->
          <a-form-item label="Address" name="Address" :rules="[{ required: true, message: 'Please enter address!' }]">
            <a-input v-model:value="form.Address" placeholder="Enter address"
              :class="{ 'border-red-500': errors.Address }" />
            <p v-if="errors.Address" class="text-red-500 text-sm mt-1">{{ errors.Address }}</p>
          </a-form-item>

          <!-- Location Input -->
          <a-form-item label="Location" name="Location"
            :rules="[{ required: true, message: 'Please enter location!' }]">
            <a-input v-model:value="form.Location" placeholder="Enter location"
              :class="{ 'border-red-500': errors.Location }" />
            <p v-if="errors.Location" class="text-red-500 text-sm mt-1">{{ errors.Location }}</p>
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

// State
const allData = ref([]);
const categories = ref([]);
const sites = ref([]);
const total = ref(0);
const page = ref(1);
const per_page = ref(10);
const search = ref("");
const loading = ref(false);

// Modals
const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);

const form = ref({
  SiteCode: "",
  ASType: "",
  ASDetails: "",
  UserName: "",
  Address: "",
  Location: "",
  ASCode: "",
});
const errors = ref({
  SiteCode: "",
  ASType: "",
  ASDetails: "",
  UserName: "",
  Address: "",
  Location: "",
});

const validateForm = () => {
  let valid = true;
  errors.value = {
    SiteCode: "",
    ASType: "",
    ASDetails: "",
    UserName: "",
    Address: "",
    Location: "",
  };

  if (!form.value.SiteCode) {
    errors.value.SiteCode = "Site is required";
    valid = false;
  }
  if (!form.value.ASType) {
    errors.value.ASType = "Category is required";
    valid = false;
  }
  if (!form.value.ASDetails.trim()) {
    errors.value.ASDetails = "Sub-Ledger Details is required";
    valid = false;
  }
  if (!form.value.UserName.trim()) {
    errors.value.UserName = "User Name is required";
    valid = false;
  }
  if (!form.value.Address.trim()) {
    errors.value.Address = "Address is required";
    valid = false;
  }
  if (!form.value.Location.trim()) {
    errors.value.Location = "Location is required";
    valid = false;
  }

  return valid;
};

// Search debounce
let searchTimeout = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchAllData();
  }, 500);
};

// Fetch categories
const fetchCategories = async () => {
  try {
    const res = await axios.get(`${apiBase}/settings/as-type/all`, getToken());
    categories.value = res?.data?.data || [];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
};

// Fetch sites
const fetchSites = async () => {
  try {
    const res = await axios.get(`${apiBase}/settings/site/all`, getToken());
    sites.value = res?.data?.data || [];
  } catch (err) {
    console.error("Failed to fetch sites:", err);
  }
};

// Fetch sub-ledgers
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
        `${apiBase}/settings/ac-sub?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
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

// Open modals
const openCreateModal = () => {
  form.value = {
    SiteCode: "",
    ASType: "",
    ASDetails: "",
    UserName: "",
    Address: "",
    Location: "",
  };
  errors.value = {};
  isCreateModalVisible.value = true;
};

const openEditModal = (record) => {
  form.value = {
    SiteCode: record.SiteCode,
    ASType: record.ASType,
    ASDetails: record.ASDetails,
    UserName: record.UserName,
    Address: record.Address,
    Location: record.Location,
    ASCode: record.ASCode,
  };
  errors.value = {};
  isEditModalVisible.value = true;
};

const closeCreateModal = () => (isCreateModalVisible.value = false);
const closeEditModal = () => (isEditModalVisible.value = false);

const formRef = ref();
// CRUD
const createSubLedger = async () => {
  // if (!form.value.SiteCode) {
  //   alert("Site is required!");
  //   return;
  // }
  if (!validateForm()) return;
  try {
    await formRef.value.validate();
    loading.value = true;
    await axios.post(`${apiBase}/settings/ac-sub`, form.value, getToken());
    isCreateModalVisible.value = false;
    fetchAllData();
  } catch (err) {
    console.error("Create failed:", err);
  } finally {
    loading.value = false;
  }
};

const updateSubLedger = async () => {
  // if (!form.value.SiteCode) {
  //   alert("Site is required!");
  //   return;
  // }
  if (!validateForm()) return;
  try {
    loading.value = true;
    await axios.put(
        `${apiBase}/settings/ac-sub?ascode=${form.value.ASCode}&sitecode=${form.value.SiteCode}`,
        {
          SiteCode: form.value.SiteCode,
          ASType: form.value.ASType,
          ASDetails: form.value.ASDetails,
          UserName: form.value.UserName,
          Address: form.value.Address,
          Location: form.value.Location,
        },
        getToken()
    );
    isEditModalVisible.value = false;
    fetchAllData();
  } catch (err) {
    console.error("Update failed:", err);
  } finally {
    loading.value = false;
  }
};

const deleteSubLedger = async (record) => {
  try {
    loading.value = true;
    await axios.delete(
        `${apiBase}/settings/ac-sub?ascode=${record.ASCode}&sitecode=${record.SiteCode}`,
        getToken()
    );
    fetchAllData();
  } catch (err) {
    console.error("Delete failed:", err);
  } finally {
    loading.value = false;
  }
};

// Helper to get site name
const getSiteName = (code) => {
  const site = sites.value.find((s) => s.SiteCode === code);
  return site ? site.SiteName : code;
};

// Init
onMounted(() => {
  fetchCategories();
  fetchSites();
  fetchAllData();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}

.sub-custom-form .ant-form-item-label>label {
  @apply w-40;
}
</style>

<template>
  <MainLayout>

    <div class="flex justify-between mb-4">
      <a-input placeholder="Search here..." class="w-1/2" v-model="searchQuery" />
      <button class="bg-primary text-white px-4 py-2 rounded" @click="openCreateModal">
        Add Permission
      </button>
    </div>

    <h1 class="text-2xl font-bold text-primary mb-4">Permission List</h1>

    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Name</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="perm in filteredPermissions" :key="perm.id" class="bg-gray-100">
          <td class="px-4 border">{{ perm.name }}</td>
          <td class="px-4 border text-center">
            <div class="flex justify-center gap-x-3">
              <button class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                @click="openEditModal(perm)">
                <i class="bi bi-pencil"></i>
              </button>
              <a-popconfirm title="Are you sure?" ok-text="Yes" cancel-text="No" @confirm="deletePermission(perm.id)">
                <button class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark">
                  <i class="bi bi-trash3"></i>
                </button>
              </a-popconfirm>
            </div>
          </td>
        </tr>
        <tr v-if="!loading && permissionList.length === 0">
          <td colspan="2" class="text-center py-4">No permissions found.</td>
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="mt-2 text-center text-gray-500 flex justify-center items-center gap-2">
      <i class="bi bi-arrow-repeat animate-spin text-xl"></i>
      <span>Loading...</span>
    </div>

    <!-- Add Permission Modal -->
    <a-modal title="Add Permission" width="400px" :open="isCreateModalVisible" @cancel="handleCloseCreate"
      :footer="null">
      <a-form layout="vertical">
        <a-form-item label="Permission Name" :validate-status="errors.name ? 'error' : ''" :help="errors.name" required>
          <a-input v-model:value="form.name" placeholder="Enter permission name" />
        </a-form-item>

        <div class="flex justify-end gap-2 mt-4">
          <a-button @click="handleCloseCreate">Close</a-button>
          <a-button type="primary" :loading="loading" @click="handleSaveCreate">
            Save
          </a-button>
        </div>
      </a-form>
    </a-modal>

    <!-- Edit Permission Modal -->
    <a-modal title="Edit Permission" width="400px" :open="isEditModalVisible" @cancel="handleCloseEdit" :footer="null">
      <a-form layout="vertical">
        <a-form-item label="Permission Name" :validate-status="errors.name ? 'error' : ''" :help="errors.name" required>
          <a-input v-model:value="form.name" placeholder="Enter permission name" />
        </a-form-item>

        <div class="flex justify-end gap-2 mt-4">
          <a-button @click="handleCloseEdit">Close</a-button>
          <a-button type="primary" :loading="loading" @click="handleSaveEdit">
            Update
          </a-button>
        </div>
      </a-form>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import {showNotification} from "@/utilities/common.js";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: 'overview' });
};

// Replace with your real API base
const apiBase = "https://wa.acibd.com/api/accounting/api";

// State
const permissionList = ref([]);
const loading = ref(false);
const searchQuery = ref("");

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const selectedPermission = ref(null);

const form = ref({ name: "" });
const errors = ref({});

// Filtered permissions
const filteredPermissions = computed(() => {
  if (!searchQuery.value) return permissionList.value;
  return permissionList.value.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Axios headers
const headers = { headers: { Authorization: `Bearer 10|D9no0WZNCrzPWFfb6CcclHZ3d8C96zulQDK63dhHd5644453` } };

// Fetch permissions
const fetchPermissions = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${apiBase}/permissions`, headers);
    permissionList.value = res.data.permissions || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// CRUD
const createPermission = async name => {
  loading.value = true;
  try {

    const formData = new FormData();
    formData.append("name", name);
    const res = await axios.post(`${apiBase}/permissions`, formData, headers);
    await fetchPermissions();
    showNotification("success", res.data.message);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const updatePermission = async (id, name) => {
  loading.value = true;
  try {
    const res = await axios.put(`${apiBase}/permissions/${id}?name=${encodeURIComponent(name)}`, null, headers);
    await fetchPermissions();
    showNotification("success", res.data.message);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const deletePermission = async id => {
  loading.value = true;
  try {
    const res = await axios.delete(`${apiBase}/permissions/${id}`, headers);
    permissionList.value = permissionList.value.filter(p => p.id !== id);
    showNotification("success", res.data.message);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Modals
const openCreateModal = () => {
  form.value = { name: "" };
  errors.value = {};
  isCreateModalVisible.value = true;
};

const handleCloseCreate = () => (isCreateModalVisible.value = false);

const handleSaveCreate = async () => {
  errors.value = {};
  if (!form.value.name) errors.value.name = "Permission name is required";
  if (Object.keys(errors.value).length) return;
  await createPermission(form.value.name);
  handleCloseCreate();
};

const openEditModal = perm => {
  selectedPermission.value = perm;
  form.value = { name: perm.name };
  errors.value = {};
  isEditModalVisible.value = true;
};

const handleCloseEdit = () => (isEditModalVisible.value = false);

const handleSaveEdit = async () => {
  errors.value = {};
  if (!form.value.name) errors.value.name = "Permission name is required";
  if (Object.keys(errors.value).length) return;
  await updatePermission(selectedPermission.value.id, form.value.name);
  handleCloseEdit();
};

// Lifecycle
onMounted(() => {
  fetchPermissions();
});
</script>

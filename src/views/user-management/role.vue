<template>
  <MainLayout>

    <div class="flex justify-between mb-4">
      <a-input placeholder="Search here..." class="w-1/2" v-model="searchQuery" />
      <button class="bg-primary text-white px-4 py-2 rounded" @click="openCreateModal">
        Add Role
      </button>
    </div>

    <h1 class="text-2xl font-bold text-primary mb-4">Role List</h1>

    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Role Name</th>
          <th class="border border-white px-4 py-2">Permissions</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="role in filteredRoles" :key="role.id" class="bg-gray-100">
          <td class="px-4 border">{{ role.name }}</td>
          <td class="px-4 border">
            <span v-if="role.permissions.length">
              {{ role.permissions.map(p => p.name).join(', ') }}
            </span>
            <span v-else>No permissions</span>
          </td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                @click="openEditModal(role)">
                <i class="bi bi-pencil"></i>
              </button>
              <a-popconfirm title="Are you sure?" ok-text="Yes" cancel-text="No" @confirm="deleteRole(role.id)">
                <button class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark">
                  <i class="bi bi-trash3"></i>
                </button>
              </a-popconfirm>
            </div>
          </td>
        </tr>
        <tr v-if="!loading && roles.length === 0">
          <td colspan="3" class="text-center py-4">No roles found.</td>
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="mt-2 text-center text-gray-500 flex justify-center items-center gap-2">
      <i class="bi bi-arrow-repeat animate-spin text-xl"></i>
      <span>Loading...</span>
    </div>

    <!-- Add Role Modal -->
    <a-modal title="Add New Role" width="600px" :open="isCreateModalVisible" @cancel="handleCloseCreate" :footer="null">
      <a-form layout="vertical">
        <a-form-item :validate-status="errors.name ? 'error' : ''" :help="errors.name" required>
          <template #label>
            Role Name <span class="text-red-500">*</span>
          </template>
          <a-input v-model:value="form.name" placeholder="Enter role name" />
        </a-form-item>

        <a-form-item label="Permissions" :validate-status="errors.permissions ? 'error' : ''" :help="errors.permissions"
          required>
          <a-select v-model:value="form.permissions" mode="multiple" placeholder="Select permissions" class="w-full">
            <a-select-option v-for="perm in permissionList" :key="perm.id" :value="perm.name">
              {{ perm.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <div class="flex justify-end gap-2 mt-4">
          <a-button @click="handleCloseCreate">Close</a-button>
          <a-button type="primary" :loading="loading" @click="handleSaveCreate">
            Save
          </a-button>
        </div>
      </a-form>
    </a-modal>

    <!-- Edit Role Modal -->
    <a-modal title="Edit Role" width="600px" :open="isEditModalVisible" @cancel="handleCloseEdit" :footer="null">
      <a-form layout="vertical">
        <a-form-item label="Role Name" :validate-status="errors.name ? 'error' : ''" :help="errors.name" required>
          <a-input v-model:value="form.name" placeholder="Enter role name" />
        </a-form-item>

        <a-form-item label="Permissions" :validate-status="errors.permissions ? 'error' : ''" :help="errors.permissions"
          required>
          <a-select v-model:value="form.permissions" mode="multiple" placeholder="Select permissions" class="w-full">
            <a-select-option v-for="perm in permissionList" :key="perm.id" :value="perm.name">
              {{ perm.name }}
            </a-select-option>
          </a-select>
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
import { apiBase } from "@/config.js"; // Your API base URL
import {getToken, showNotification} from "@/utilities/common.js"; // Function to get Bearer token
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: 'overview' });
};

// State
const roles = ref([]);
const permissionList = ref([]);
const loading = ref(false);
const searchQuery = ref("");

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const selectedRole = ref(null);

const form = ref({
  name: "",
  permissions: [],
});
const errors = ref({});

// Computed filtered roles
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value;
  return roles.value.filter(role =>
      role.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// API calls
const fetchRoles = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${apiBase}/roles`,getToken() );
    roles.value = res.data.role;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchPermissions = async () => {
  try {
    const res = await axios.get(`${apiBase}/permissions`, getToken());
    permissionList.value = res.data.permissions;

  } catch (err) {
    console.error(err);
    permissionList.value = [];
  }
};

const createRole = async data => {
  loading.value = true;
  try {
    const res = await axios.post(
        `${apiBase}/roles`,
        { name: data.name, permission: data.permissions },
        getToken()
    );
    await fetchRoles();
    showNotification("success", res.data.message);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const updateRole = async (id, data) => {
  loading.value = true;
  try {
    const res = await axios.put(
        `${apiBase}/roles/${id}`,
        { name: data.name, permission: data.permissions },
        getToken()
    );
    await fetchRoles();
    showNotification("success", res.data.message);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const deleteRole = async id => {
  loading.value = true;
  try {
    const res = await axios.delete(`${apiBase}/roles/${id}`, getToken());
    roles.value = roles.value.filter(r => r.id !== id);
    showNotification("success", res.data.message);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Modal functions
const openCreateModal = () => {
  form.value = { name: "", permissions: [] };
  errors.value = {};
  isCreateModalVisible.value = true;
};

const handleCloseCreate = () => (isCreateModalVisible.value = false);

const handleSaveCreate = async () => {
  errors.value = {};
  if (!form.value.name) errors.value.name = "Role name is required";
  if (!form.value.permissions.length) errors.value.permissions = "Select at least one permission";

  if (Object.keys(errors.value).length > 0) return;

  await createRole(form.value);
  handleCloseCreate();
};

const openEditModal = role => {
  selectedRole.value = role;
  form.value = {
    name: role.name,
    permissions: role.permissions.map(p => p.name),
  };
  errors.value = {};
  isEditModalVisible.value = true;
};

const handleCloseEdit = () => (isEditModalVisible.value = false);

const handleSaveEdit = async () => {
  errors.value = {};
  if (!form.value.name) errors.value.name = "Role name is required";
  if (!form.value.permissions.length) errors.value.permissions = "Select at least one permission";

  if (Object.keys(errors.value).length > 0) return;

  await updateRole(selectedRole.value.id, form.value);
  handleCloseEdit();
};

// Lifecycle
onMounted(() => {
  fetchRoles();
  fetchPermissions();
});
</script>

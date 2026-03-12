<template>
  <MainLayout>

    <!-- Header -->
    <div class="flex justify-between mb-4">
      <a-input v-model="search" placeholder="Search here..." class="w-1/3" />
      <button class="bg-primary text-white px-4 py-2 rounded" @click="showCreateModal">
        Add User
      </button>
    </div>

    <!-- User List -->
    <!-- User List -->
    <h1 class="text-2xl font-bold text-primary mb-4">User List</h1>
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Name</th>
          <th class="border border-white px-4 py-2">User ID</th>
          <th class="border border-white px-4 py-2">Roles</th> <!-- New Roles column -->
          <th class="border border-white px-4 py-2">Permissions</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="user in filteredUsers" :key="user.id" class="bg-gray-100">
          <td class="px-4 border">{{ user.name }}</td>
          <td class="px-4 border">{{ user.UserId }}</td>
          <td class="px-4 border">
            {{ user.roles?.map(r => r.name).join(', ') || '—' }}
          </td>
          <td class="px-4 border">
            {{ user.all_permissions?.map(p => p.name).join(', ') || '—' }}
          </td>
          <td class="px-4 border text-center">
            <div class="flex justify-center gap-x-3">
              <button class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                @click="showEditModal(user)">
                <i class="bi bi-pencil"></i>
              </button>
              <a-popconfirm title="Are you sure?" ok-text="Yes" cancel-text="No" @confirm="deleteUser(user.id)">
                <button class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark">
                  <i class="bi bi-trash3"></i>
                </button>
              </a-popconfirm>
            </div>
          </td>
        </tr>
        <tr v-if="!loading && users.length === 0">
          <td colspan="5" class="text-center py-4">No users found.</td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading" class="mt-2 text-center text-gray-500 flex justify-center items-center gap-2">
      <i class="bi bi-arrow-repeat animate-spin text-xl"></i>
      <span>Loading...</span>
    </div>

    <!-- Modal -->
    <a-modal :title="modalTitle" width="600px" :open="isModalVisible" @cancel="handleClose" @ok="handleSave"
      :confirm-loading="saving">
      <a-form layout="vertical">
        <!-- Roles -->
        <a-form-item :validate-status="errors.roles ? 'error' : ''" :help="errors.roles">
          <template #label>
            Roles <span class="text-red-500">*</span>
          </template>
          <a-select v-model:value="form.roles" placeholder="Select Role">
            <a-select-option v-for="role in roles" :key="role.id" :value="role.name">
              {{ role.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Permissions -->
        <a-form-item :validate-status="errors.permissions ? 'error' : ''" :help="errors.permissions">
          <template #label>
            Permissions <span class="text-red-500">*</span>
          </template>
          <a-select v-model:value="form.permissions" mode="multiple" placeholder="Select Permissions" allow-clear>
            <a-select-option v-for="perm in permissions" :key="perm.id" :value="perm.name">
              {{ perm.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Name -->
        <a-form-item :validate-status="errors.name ? 'error' : ''" :help="errors.name">
          <template #label>
            Name <span class="text-red-500">*</span>
          </template>
          <a-input v-model:value="form.name" />
        </a-form-item>

        <!-- UserId -->
        <a-form-item :validate-status="errors.UserId ? 'error' : ''" :help="errors.UserId">
          <template #label>
            UserId <span class="text-red-500">*</span>
          </template>
          <a-input v-model:value="form.UserId" />
        </a-form-item>

        <!-- Password -->
        <a-form-item :validate-status="errors.password ? 'error' : ''" :help="errors.password">
          <template #label>
            Password <span class="text-red-500">*</span>
          </template>
          <a-input type="password" v-model:value="form.password"
            :placeholder="editingUserId ? 'Leave empty to keep current password' : ''" />
        </a-form-item>
      </a-form>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { getToken, showNotification } from "@/utilities/common.js";
import { apiBase } from "@/config.js";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: 'overview' });
};

const saving = ref(false);
const users = ref([]);
const loading = ref(false);
const search = ref("");
const isModalVisible = ref(false);
const modalTitle = ref("Add User");
const editingUserId = ref(null);

const form = ref({
  roles: "",
  permissions: [],
  name: "",
  UserId: "",
  password: ""
});

const roles = ref([]);
const permissions = ref([]);

// Filter users
const filteredUsers = computed(() => {
  if (!search.value) return users.value;
  return users.value.filter((u) =>
      u.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Fetch users
async function fetchUsers() {
  loading.value = true;
  try {
    const response = await axios.get(`${apiBase}/user_list`, getToken());
    if (response.data.status === "success") {
      users.value = response.data.users;
    }
  } catch (err) {
    console.error("Failed to fetch users:", err);
  } finally {
    loading.value = false;
  }
}

// Fetch roles
async function fetchRoles() {
  try {
    const response = await axios.get(`${apiBase}/roles`, getToken());
    roles.value = response.data.role;
  } catch (err) {
    console.error("Failed to fetch roles:", err);
  }
}

// Fetch permissions
async function fetchPermissions() {
  try {
    const response = await axios.get(`${apiBase}/permissions`, getToken());
    permissions.value = response.data.permissions;
  } catch (err) {
    console.error("Failed to fetch permissions:", err);
  }
}

// Show create modal
function showCreateModal() {
  modalTitle.value = "Add User";
  isModalVisible.value = true;
  editingUserId.value = null;
  form.value = { roles: "", permissions: [], name: "", UserId: "", password: "" };
}

// Show edit modal
function showEditModal(user) {
  modalTitle.value = "Edit User";
  isModalVisible.value = true;
  editingUserId.value = user.id;

  form.value = {
    name: user.name || "",
    UserId: user.UserId || "",
    password: "",
    roles: user.roles?.length ? user.roles[0].name : "",
    permissions: user.all_permissions?.map((p) => p.name) || []
  };
}

// Close modal
function handleClose() {
  isModalVisible.value = false;
}

const errors = ref({});
// Save user
// async function handleSave() {
//   saving.value = true;
//   errors.value = {};
//   try {
//     let payload = { ...form.value };
//
//     if (editingUserId.value && !payload.password) delete payload.password;
//
//     let res;
//     if (editingUserId.value) {
//       res = await axios.put(
//           `${apiBase}/user_update/${editingUserId.value}`,
//           payload,
//           getToken()
//       );
//       showNotification("success", res.data.message);
//       // assign permissions separately if needed
//       if (form.value.permissions.length) {
//          res = await axios.put(
//             `${apiBase}/assign_permission/${editingUserId.value}`,
//             { "permissions[]": form.value.permissions },
//             getToken()
//         );
//         showNotification("success", res.data.message);
//       }
//     } else {
//       res = await axios.post(`${apiBase}/register`, payload, getToken());
//       showNotification(res?.data?.status?.toLowerCase(), res?.data?.message)
//     }
//
//     if (res.data.status === "error" && res.data.message) {
//       errors.value = Object.fromEntries(
//           Object.entries(res.data.message).map(([k, v]) => [
//             k,
//             Array.isArray(v) ? v[0] : v
//           ])
//       );
//       return;
//     }
//
//     showNotification("success", res.data.message);
//     handleClose();
//     fetchUsers();
//   } catch (err) {
//     console.error("Failed to save user:", err);
//     showNotification("error", err.response?.data?.message || "Failed to save user");
//   } finally {
//     saving.value = false;
//   }
// }
async function handleSave() {
  saving.value = true;
  errors.value = {};

  try {
    let payload = { ...form.value };

    if (editingUserId.value && !payload.password) delete payload.password;

    let res;
    if (editingUserId.value) {
      // Update user
      res = await axios.put(
          `${apiBase}/user_update/${editingUserId.value}`,
          payload,
          getToken()
      );

      // Assign permissions if selected
      const permPayload = form.value.permissions.length
          ? form.value.permissions.map(p => `permissions[]=${encodeURIComponent(p.trim())}`).join('&')
          : 'permissions[]=';
        const permRes = await axios.put(
            `${apiBase}/assign_permission/${editingUserId.value}`,
            permPayload,
            {
              headers: {
                ...getToken().headers,
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
        );

        if (permRes.data.status?.toLowerCase() === "success") {
          showNotification("success", permRes.data.message);
        } else if (permRes.data.status === "error") {
          showNotification("error", permRes.data.message || "Failed to assign permissions");
        }
    } else {
      // Create new user
      res = await axios.post(`${apiBase}/register`, payload, getToken());
    }

    // Handle main response
    if (res.data.status.toLowerCase() === "success") {
      showNotification("success", res.data.message);
      handleClose();
      fetchUsers();
    } else if (res.data.status === "error" && res.data.message) {
      // Validation errors
      if (res.data.message) {
        errors.value = Object.fromEntries(
            Object.entries(res.data.message).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
        );
      }
      showNotification("error", res.data.message || "Failed to save user");
    }
  } catch (err) {
    console.error("Failed to save user:", err);
    showNotification("error", err.response?.data?.message || "Failed to save user");
  } finally {
    saving.value = false;
  }
}

// Delete user
async function deleteUser(id) {
  try {
    const res = await axios.delete(`${apiBase}/user_delete/${id}`, getToken());
    const status = res.data.status?.toLowerCase() || "success";
    showNotification(status, res.data.message);
    fetchUsers();
  } catch (err) {
    console.error("Failed to delete user:", err);
  }
}

onMounted(() => {
  fetchUsers();
  fetchRoles();
  fetchPermissions();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

<template>
  <PayrollLayout>

    <div class="flex justify-between">
      <div class="mb-4">
        <a-input placeholder="Search here..." v-model:value="search" @input="
          async () => {
            page = 1;
            await fetchAllData();
          }
        " class="w-64" />
      </div>
      <div class="mb-4">
        <button class="bg-primary text-white px-4 py-2 rounded" @click="openCreateModal">
          Add Designation
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4">
      Designation ({{ total }})
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
      <tr class="bg-primary text-white">
        <th class="border border-white px-4 py-2 text-right w-44">Designation Code</th>
        <th class="border border-white px-4 py-2">Designation Name</th>
        <th class="border border-white px-4 py-2 text-center"> Status</th>
        <th class="border border-white px-4 py-2 text-center">Actions</th>
      </tr>
      </thead>
      <tbody class="capitalize">
      <tr v-for="(data, index) in allData" :key="index">
        <td class="px-4 border text-right">{{ data.DesgCode }}</td>
        <td class="px-4 border">{{ data.DesgName }}</td>
        <td class="px-4 border text-center py-2">
            <span
                :class="data.Active === 'Y' ? 'bg-green-500' : 'bg-red-500'"
                class="text-white rounded-full py-1 px-3 my-2"
            >
              {{ data.Active === 'Y' ? 'Active' : 'Inactive' }}
            </span>
        </td>
        <td class="px-4 border text-center w-8">
          <div class="flex justify-center gap-x-3">
            <button type="button"
                    class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                    @click="allData_idwise(data.DesgCode)">
              <i class="bi bi-pencil"></i>
            </button>
            <a-popconfirm @confirm="deleteData(data.DesgCode)" title="Are you sure?" ok-text="Yes" cancel-text="No">
              <button type="button" class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark">
                <i class="bi bi-trash3"></i>
              </button>
            </a-popconfirm>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="loading" class="mt-2 text-center text-gray-500 flex justify-center items-center gap-2">
      <span><a-spin></a-spin></span>
    </div>

    <a-pagination class="mt-4" v-model:current="page" :page-size="per_page" :total="total" :show-size-changer="false"
                  :show-total="(total) => `Total ${total} items`" @change="
                    (pageNo) => {
                      page = pageNo;
                      fetchAllData();
                    }
                  " v-if="total > per_page" />

    <!-- Create Modal -->
    <a-modal v-model:open="isCreateModalVisible" :footer="null" title="Designation" @cancel="closeModal">
      <form @submit.prevent="createallData">
        <div class="grid grid-cols-2 gap-y-4 items-center border rounded p-4 bg-slate-100">
          <label class="font-semibold">Designation Name:</label>
          <a-input class="w-full" v-model:value="formData.DesgName" />

          <label class="font-semibold">Designation Level:</label>
          <a-select class="w-full" v-model:value="formData.DesgLevel">
            <a-select-option value="Junior">Junior</a-select-option>
          </a-select>

          <label class="font-semibold">Classification:</label>
          <a-input class="w-full" v-model:value="formData.Classification" />

          <label class="font-semibold">Status :</label>
          <a-select class="w-full" v-model:value="formData.Active">
            <a-select-option value="Y">Active</a-select-option>
            <a-select-option value="N">Inactive</a-select-option>
          </a-select>
        </div>
        <div class="flex gap-5 items-end justify-end mt-4">
          <a-button html-type="submit"
                    :disabled="isCreating"
                    class="rounded flex items-center justify-center px-6 pb-2 pt-2.5 gap-2 text-white bg-primary">
            Save
            <Icon v-if="isCreating" class="size-7 animate-spin" icon="system-uicons:loader" />
          </a-button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal v-model:open="isEditModalVisible" :footer="null" title="Edit Designation"
             @cancel="isEditModalVisible = false">
      <form @submit.prevent="updateallData(formData.DesgCode)">
        <div class="grid grid-cols-2 gap-y-4 items-center border rounded p-4 bg-slate-100">

          <label class="font-semibold">Designation Name:</label>
          <a-input class="w-full" v-model:value="formData.DesgName" />

          <label class="font-semibold">Designation Level:</label>
          <a-select class="w-full" v-model:value="formData.DesgLevel">
            <a-select-option value="Junior">Junior</a-select-option>
          </a-select>

          <label class="font-semibold">Classification:</label>
          <a-input class="w-full" v-model:value="formData.Classification" />

          <label class="font-semibold">Status:</label>
          <a-select class="w-full" v-model:value="formData.Active">
            <a-select-option value="Y">Active</a-select-option>
            <a-select-option value="N">Inactive</a-select-option>
          </a-select>
        </div>

        <div class="flex gap-5 items-end justify-end mt-4">
          <a-button html-type="submit"
                    :disabled="isUpdating"
                    class="rounded flex items-center justify-center px-6 pb-2 pt-2.5 gap-2 text-white bg-primary">
            Update
            <Icon v-if="isUpdating" class="size-7 animate-spin" icon="system-uicons:loader" />
          </a-button>
        </div>
      </form>
    </a-modal>

  </PayrollLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import PayrollLayout from "@/components/layouts/PayrollLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

const router = useRouter();
const goBack = () => {
  router.push({ name: 'overview' });
};

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);

const formData = ref({
  DesgName: "",
  DesgLevel: "",
  Classification: "",
  Active: "Y",
});

// Open Create Modal
const openCreateModal = () => {
  formData.value = {
    DesgName: "",
    DesgLevel: "",
    Classification: "",
    Active: "Y",
  };
  isCreateModalVisible.value = true;
};

// Create
const createallData = async () => {
  isCreating.value = true;
  try {
    const payload = {
      DesgName: formData.value.DesgName,
      DesgLevel: formData.value.DesgLevel,
      Classification: formData.value.Classification,
      Active: formData.value.Active,
    };
    const res = await axios.post(`${apiBase}/payroll/setting/designation`, payload, getToken());
    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
    await fetchAllData();
    isCreateModalVisible.value = false;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  } finally {
    isCreating.value = false;
  }
};

// Fetch single designation for edit
const allData_idwise = async (id) => {
  try {
    const res = await axios.get(`${apiBase}/payroll/setting/designation/${id}`, getToken());
    const item = res?.data?.data;
    if (item) {
      formData.value = {
        DesgCode: item.DesgCode,
        DesgName: item.DesgName,
        DesgLevel: item.DesgLevel,
        Classification: item.Classification,
        Active: item.Active,
      };
      isEditModalVisible.value = true;
    } else {
      showNotification("error", "Invalid data received");
    }
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// Update
const updateallData = async (id) => {
  isUpdating.value = true;
  try {
    const payload = {
      DesgName: formData.value.DesgName,
      DesgLevel: formData.value.DesgLevel,
      Classification: formData.value.Classification,
      Active: formData.value.Active,
    };
    const res = await axios.put(`${apiBase}/payroll/setting/designation/${id}`, payload, getToken());
    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
    await fetchAllData();
    isEditModalVisible.value = false;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  } finally {
    isUpdating.value = false;
  }
};

// Delete
const deleteData = async (id) => {
  try {
    const res = await axios.delete(`${apiBase}/payroll/setting/designation/${id}`, getToken());
    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// Pagination & search
const page = ref(1);
const per_page = ref(10);
const total = ref(0);
const search = ref("");
const allData = ref([]);
const loading = ref(false);

const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
        `${apiBase}/payroll/setting/designation?page=${page.value}&per_page=${per_page.value}&DesgName=${search.value}`,
        getToken()
    );
    allData.value = res?.data?.data?.data || [];
    total.value = res?.data?.data?.total || 0;
  } catch (err) {
    console.error(err);
    allData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// Close modal
const closeModal = () => {
  isCreateModalVisible.value = false;
  formData.value = {
    DesgName: "",
    DesgLevel: "",
    Classification: "",
    Active: "Y",
  };
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

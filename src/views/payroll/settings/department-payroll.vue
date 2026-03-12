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
        <button class="bg-primary text-white px-4 py-2 rounded" @click="() => { closeModal(); isCreateModalVisible = true; }">
          Add Department
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary mb-4">
      Department ({{ total }})
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
      <tr class="bg-primary text-white">
        <th class="border border-white px-4 py-2 text-center">Department Code</th>
        <th class="border border-white px-4 py-2 text-center"> Department Name</th>
        <th class="border border-white px-4 py-2 text-center"> Company Name</th>
        <th class="border border-white px-4 py-2 text-center"> Status</th>
        <th class="border border-white px-4 py-2 text-center">Actions</th>
      </tr>
      </thead>
      <tbody class="capitalize">
      <tr v-for="(data, index) in allData" :key="index">
        <td class="px-4 border text-center">{{ data?.DeptCode || '-'}}</td>
        <td class="px-4 border">{{ data?.DeptName || '-' }}</td>
        <td class="px-4 border">{{ data?.CompanyName || '-'}}</td>
        <td class="px-4 border text-center">
            <span class="text-white rounded-full py-1 px-3"
                  :class="{ 'bg-green-500': data?.Active === 'Y', 'bg-red-500': data?.Active === 'N' }">
              {{ data?.Active === 'Y' ? 'Active' : 'Inactive' }}
            </span>
        </td>
        <td class="px-4 border text-center w-8">
          <div class="flex justify-center gap-x-3">
            <button type="button" class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                    @click="allData_idwise(data?.DeptCode)">
              <i class="bi bi-pencil"></i>
            </button>
            <a-popconfirm @confirm="deleteData(data?.DeptCode)" title="Are you sure?" ok-text="Yes"
                          cancel-text="No">
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
                  :show-total="(total) => `Total ${total} items`" @change="(pageNo) => { page = pageNo; fetchAllData(); }"
                  v-if="total > per_page" />

    <!-- Create Modal -->
    <a-modal v-model:open="isCreateModalVisible" :footer="null" title="Department" @cancel="closeModal">
      <form>
        <div class="grid grid-cols-2 gap-y-4 items-center border rounded p-4 bg-slate-100">
          <label class="font-semibold">Department Name:</label>
          <a-input class="w-full" v-model:value="formData.DeptName"/>

          <label class="font-semibold">Company name :</label>
          <a-select show-search v-model:value="formData.CompanyCode" class="w-full" :filter-option="false" @search="
            (event) => {
              companyName.value = all_companyName.value.filter((cname) =>
                cname?.CompanyName?.toLowerCase().includes(event.toLowerCase())
              );
            }
          " @change="handleCompanyChange" :loading="companyLoading">
            <a-select-option v-for="cname in companyName" :key="cname.CompanyCode" :value="cname.CompanyCode">
              {{ cname.CompanyName }}
            </a-select-option>
          </a-select>

          <label class="font-semibold">Status :</label>
          <a-select class="w-full" v-model:value="formData.Active">
            <a-select-option value="Y">Active</a-select-option>
            <a-select-option value="N">Inactive</a-select-option>
          </a-select>
        </div>
        <div class="flex gap-5 items-end justify- mt-4">
          <a-button
              type="button"
              @click="createallData"
              :disabled="isCreating"
              class="rounded flex items-center justify-center px-6 pb-2 pt-2.5 gap-2 text-white bg-primary">
            Save
            <Icon v-if="isCreating" class="size-7 animate-spin" icon="system-uicons:loader" />
          </a-button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal v-model:open="isEditModalVisible" :footer="null" title="Edit Department"
             @cancel="isEditModalVisible = false">
      <form>
        <div class="grid grid-cols-2 gap-y-4 items-center border rounded p-4 bg-slate-100">
          <label class="font-semibold">Department Name:</label>
          <a-input class="w-full" v-model:value="formData.DeptName"/>

          <label class="font-semibold">Company name :</label>
          <a-select show-search v-model:value="formData.CompanyCode" class="w-full"
                    :filter-option="false"
                    @search="(event) => {
            companyName.value = all_companyName.value.filter((c) =>
              c?.CompanyName?.toLowerCase().includes(event.toLowerCase())
            );
          }"
                    :loading="companyLoading">
            <a-select-option v-for="cname in companyName" :key="cname.CompanyCode" :value="cname.CompanyCode">
              {{ cname.CompanyName }}
            </a-select-option>
          </a-select>


          <label class="font-semibold">Status :</label>
          <a-select class="w-full" v-model:value="formData.Active">
            <a-select-option value="Y">Active</a-select-option>
            <a-select-option value="N">Inactive</a-select-option>
          </a-select>
        </div>
        <div class="flex gap-5 items-end justify- mt-4">
          <a-button :disabled="isUpdating" @click="updateallData(formData.DeptCode)"
                    class="rounded flex items-center justify-center px-6 pb-2 pt-2.5 gap-2 text-white bg-primary" type="submit">
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
const goBack = () => router.push({ name: 'overview' });

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);

const formData = ref({
  DeptCode: "",
  DeptName: "",
  CompanyCode: "",
  CompanyName: null,
  Active: "Y",
});

const handleCompanyChange = (selectedCompanyCode) => {
  const selectedCompany = all_companyName.value.find(
      company => company.CompanyCode === selectedCompanyCode
  );
  if (selectedCompany) {
    formData.value.CompanyCode = selectedCompany.CompanyCode;
    formData.value.CompanyName = selectedCompany.CompanyName;
  }
};

// Create Department
const createallData = async () => {
  isCreating.value = true;
  try {
    const final_formData = { ...formData.value };
    const res = await axios.post(`${apiBase}/payroll/setting/department`, final_formData, getToken());
    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
    await fetchAllData();
    closeModal();
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  } finally {
    isCreating.value = false;
  }
};

// Edit Department
const allData_idwise = async (id) => {
  try {
    const res = await axios.get(`${apiBase}/payroll/setting/department/${id}`, getToken());
    const itemData = res?.data?.data || res?.data;

    if (!itemData || !itemData.DeptCode) {
      showNotification("error", "Invalid data received");
      return;
    }

    // Set formData
    formData.value.DeptCode = itemData.DeptCode;
    formData.value.DeptName = itemData.DeptName;
    formData.value.CompanyCode = itemData.CompanyCode;
    formData.value.CompanyName = itemData.CompanyName;
    formData.value.Active = itemData.Active || "Y";

    // Ensure selected company exists in the dropdown
    if (!companyName.value.find(c => c.CompanyCode === itemData.CompanyCode)) {
      companyName.value.unshift({ CompanyCode: itemData.CompanyCode, CompanyName: itemData.CompanyName });
    }

    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};


// Update Department
const updateallData = async () => {
  if (!formData.value.DeptCode) return;

  isUpdating.value = true;
  try {
    // Ensure CompanyName is correct
    const selectedCompany = all_companyName.value.find(c => c.CompanyCode === formData.value.CompanyCode);
    if (selectedCompany) {
      formData.value.CompanyName = selectedCompany.CompanyName;
    }

    const payload = new URLSearchParams();
    payload.append("DeptName", formData.value.DeptName);
    payload.append("CompanyCode", formData.value.CompanyCode);
    payload.append("CompanyName", formData.value.CompanyName);
    payload.append("Active", formData.value.Active);

    const res = await axios.put(`${apiBase}/payroll/setting/department/${formData.value.DeptCode}`, payload, {
      headers: { ...getToken().headers, "Content-Type": "application/x-www-form-urlencoded" }
    });

    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
    await fetchAllData();
    isEditModalVisible.value = false;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  } finally {
    isUpdating.value = false;
  }
};



// Pagination & Search
const page = ref(1);
const per_page = ref(10);
const total = ref(0);
const search = ref(" ");
const allData = ref([]);
const loading = ref(false);

const fetchAllData = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({ page: page.value, per_page: per_page.value, DeptName: search.value.trim() });
    const res = await axios.get(`${apiBase}/payroll/setting/department?${params.toString()}`, getToken());
    allData.value = res?.data?.data?.data || [];
    total.value = res?.data?.data?.total || 0;
  } catch (err) {
    allData.value = [];
    total.value = 0;
    console.error("Failed to fetch allData:", err);
  } finally {
    loading.value = false;
  }
};

// Delete
const deleteData = async (id) => {
  loading.value = true;
  try {
    const res = await axios.delete(`${apiBase}/payroll/setting/department/${id}`, getToken());
    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  } finally {
    loading.value = false;
  }
};

// Close Modal
const closeModal = () => {
  formData.value = { DeptCode: "", DeptName: "", CompanyCode: "", CompanyName: "", Active: "Y" };
  isCreateModalVisible.value = false;
};

// Company
const companyName = ref([]);
const all_companyName = ref([]);
const companyLoading = ref(false);

const fetchCompanyName = async () => {
  companyLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/payroll/setting/company_search`, getToken());
    companyName.value = res?.data?.data?.data || [];
    all_companyName.value = [...companyName.value];
  } catch (err) {
    companyName.value = [];
    all_companyName.value = [];
    total.value = 0;
    console.error("Failed to fetch companyName:", err);
  } finally {
    companyLoading.value = false;
  }
};

onMounted(async () => {
  await fetchAllData();
  await fetchCompanyName();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

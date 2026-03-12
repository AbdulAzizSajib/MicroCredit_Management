<template>
  <MainLayout>
   
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input
            v-model:value="search"
            placeholder="Search here..."
            @input="handleSearch"
        />
      </div>
      <div class="mb-4">
        <button @click="createallData" class="bg-primary text-white px-4 py-2 rounded">
          Add Financial Month
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4"> Financial Month ({{ total }})</h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Year Start</th>
          <th class="border border-white px-4 py-2">Month Start</th>
          <th class="border border-white px-4 py-2 text-center">Default Month</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.FinYear }}</td>
          <td class="px-4 border">{{ data?.FinMonth }}</td>
          <td class="px-4 border w-32">
            <div class="text-center">

              <!-- Checkbox to toggle Defaults -->
              <input
                  type="checkbox"
                  :checked="!!data.Defaults"
                  @change="confirmDefaultChange(data)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="mt-2 text-center text-gray-500 flex justify-center items-center gap-2">
      <span><a-spin></a-spin></span>
    </div>

    <a-pagination class="mt-4" v-model:current="page" :page-size="per_page" :total="total" :show-size-changer="false"
      :show-total="(total) => `Total ${total} items`" @change="(pageNo) => { page = pageNo; fetchAllData() }"
      v-if="total > per_page" />
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";
import { useRouter } from "vue-router";
import {Modal} from "ant-design-vue";
const router = useRouter();
const goBack = () => {
  router.push({ name: 'overview' });
};


const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);



const formData = ref({
  GroupHeadCode: "",
  GroupHead: "",
  ReportOrder: null,
  FundType: null,
});

// create
const createallData = async () => {
  isCreating.value = true;
  try {
    const final_formData = { ...formData.value };
    delete final_formData.GroupHeadCode;
    const res = await axios.post(
      `${apiBase}/settings/financial-month`,
      "",
      getToken()
    );
    isCreating.value = false;
    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );
    await fetchAllData();
    isCreateModalVisible.value = false;
  } catch (error) {
    isCreating.value = false;
    isCreateModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

let searchTimeout = null;

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchAllData();
  }, 500);
};


const updateallData = async (FinYear, FinMonth, Defaults) => {
  isUpdating.value = true;
  try {
    const res = await axios.put(
        `${apiBase}/settings/financial-month?finmonth=${FinMonth}`,
        { defaults: Defaults },
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
    isEditModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};



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
        `${apiBase}/settings/financial-month?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
        getToken()
    );
    loading.value = false;

    // Robust normalization of Defaults (handles "true"/"false", "1"/"0", boolean, number)
    allData.value = (res?.data?.data?.data || []).map(item => ({
      ...item,
      Defaults: ['1', 'true', 'yes'].includes(String(item?.Defaults ?? '').toLowerCase())
    }));

    total.value = res?.data?.data?.total;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    console.error("Failed to fetch allData:", err);
  }
};


const deleteData = async (id) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/group-heads?GroupHeadCode=${id}`,
      getToken()
    );
    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );
    await fetchAllData();
  } catch (err) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const confirmDefaultChange = (data) => {
  const previousState = !!data.Defaults;
  data.Defaults = !previousState;

  Modal.confirm({
    title: "Confirm Default Month",
    content: `Do you want to make ${data.FinMonth} the default month?`,
    okText: "Yes",
    cancelText: "No",
    async onOk() {
      try {
        await updateallData(data.FinYear, data.FinMonth, true);
        // showNotification("success", "Default month updated successfully");
        allData.value.forEach(item => {
          item.Defaults = (item.FinMonth === data.FinMonth);
        });
      } catch (error) {
        console.error("Error updating default:", error);
        showNotification("error", "Failed to update default month");
        data.Defaults = previousState;
      }
    },
    onCancel() {
      data.Defaults = previousState;
    },
  });
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
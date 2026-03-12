<template>
  <MainLayout>
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input
          placeholder="Search here..."
          v-model:value="search"
          @input="
            async () => {
              page = 1;
              await fetchAllData();
            }
          "
          class="w-64"
        />
      </div>
      <div class="mb-4">
        <button
          class="bg-primary text-white px-4 py-2 rounded"
          @click="
            () => {
              isCreateModalVisible = true;
              formData.value.CrBalance = '';
              formData.value.DrBalance = '';
            }
          "
        >
          Add Opening
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4">Opening ({{ total }})</h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Company Code</th>
          <th class="border border-white px-4 py-2">Account Head</th>
          <th class="border border-white px-4 py-2">Account Head Details</th>
          <th class="border border-white px-4 py-2">Sub Ledger</th>
          <th class="border border-white px-4 py-2 text-right">Debit</th>
          <th class="border border-white px-4 py-2 text-right">Credit</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <tr v-if="allData.length === 0">
          <td colspan="7" class="text-center px-4 py-2 border">
            No data available
          </td>
        </tr>
        <tr v-else v-for="(data, index) in allData" :key="index">
          <td class="px-4 border">{{ data?.SiteCode || "-" }}</td>
          <td class="px-4 border">{{ data?.AMCode || "-" }}</td>
          <td class="px-4 border">{{ data?.AMDetails || "-" }}</td>
          <td class="px-4 border">{{ data?.ASCode || "-" }}</td>
          <td class="px-4 border text-right">{{ data?.DrBalance || "_" }}</td>
          <td class="px-4 border text-right">{{ data?.CrBalance || "-" }}</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <button
                @click="
                  allData_idwise(
                    data?.SiteCode,
                    data?.AMCode,
                    data?.ASCode,
                    data?.BalDate
                  )
                "
                type="button"
                class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <a-popconfirm
                @confirm="
                  deleteData(
                    data?.SiteCode,
                    data?.AMCode,
                    data?.ASCode,
                    data?.BalDate
                  )
                "
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

    <!-- Create Modal -->
    <a-modal
      v-model:open="isCreateModalVisible"
      title="Opening"
      @cancel="isCreateModalVisible = false"
      :footer="null"
      width="700px"
    >
      <a-form :model="formData" @finish="createallData">
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <!-- Site Code Dropdown -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]"
              >Company Code: <span class="text-red-500">*</span></label
            >
            <a-select
              class="w-full"
              placeholder="Select Site Code"
              v-model:value="formData.SiteCode"
            >
              <a-select-option
                v-for="item in siteCodeList"
                :value="item?.SiteCode"
                :key="item?.SiteCode"
              >
                {{ `${item?.SiteCode} - ${item?.SiteName}` }}
              </a-select-option>
            </a-select>
          </div>

          <!-- AM Code Dropdown -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]"
              >Account Head:<span class="text-red-500"> *</span></label
            >
            <a-select
              show-search
              allowClear
              class="w-full"
              :filter-option="false"
              placeholder="Select Account Head"
              v-model:value="formData.AMCode"
              @search="getaMCodeList"
            >
              <a-select-option
                v-for="item in aMCodeList"
                :value="item?.AMCode"
                :key="item?.AMCode"
              >
                {{ `${item?.AMCode} - ${item?.AMDetails}` }}
              </a-select-option>
            </a-select>
          </div>

          <!-- AS Code Dropdown -->
          <a-form-item label="Sub Ledger" name="Sub Ledger">
            <a-select
              class="w-full"
              placeholder="Select Sub Ledger"
              v-model:value="formData.ASCode"
            >
              <a-select-option
                v-for="item in asTypeList"
                :value="item?.ASType"
                :key="item?.ASType"
              >
                {{ `${item?.ASType} - ${item?.ASDetails}` }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- Debit Balance Input -->
          <a-form-item label="Debit Balance" name="DrBalance">
            <a-input
              class="w-full"
              placeholder="Enter Debit Balance"
              v-model:value="formData.DrBalance"
              @input="handleDrBalancelogic(formData.DrBalance)"
            />
          </a-form-item>

          <!-- Credit Balance Input -->
          <a-form-item label="Credit Balance" name="CrBalance">
            <a-input
              class="w-full"
              placeholder="Enter Credit Balance"
              v-model:value="formData.CrBalance"
              @input="handleCrBalancelogic"
            />
          </a-form-item>
        </div>

        <div class="flex items-center justify-end mt-2">
          <a-button
            type="primary"
            html-type="submit"
            :loading="isCreating"
            class="px-6 py-1 rounded font-semibold"
          >
            Save
          </a-button>
        </div>
      </a-form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal
      :footer="null"
      v-model:open="isEditModalVisible"
      title="Edit group code"
      @cancel="isEditModalVisible = false"
      width="500px"
    >
      <a-form
        :model="updateformData"
        @finish="
          () =>
            updateallData(
              updateformData.SiteCode,
              updateformData.AMCode,
              updateformData.ASCode,
              updateformData.BalDate
            )
        "
      >
        <div class="grid grid-cols-1 gap-x-4 custom-form">
          <!-- Site Code Dropdown -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]"
              >Company Code: <span class="text-red-500">*</span></label
            >
            <a-select
              disabled
              class="w-full"
              placeholder="Select Site Code"
              v-model:value="updateformData.SiteCode"
            >
              <a-select-option
                v-for="item in siteCodeList"
                :value="item?.SiteCode"
                :key="item?.SiteCode"
              >
                {{ `${item?.SiteCode} - ${item?.SiteName}` }}
              </a-select-option>
            </a-select>
          </div>

          <!-- AM Code Dropdown -->
          <div class="flex items-center justify-between mb-5">
            <label class="w-[160px]"
              >Account Head:<span class="text-red-500"> *</span></label
            >
            <a-select
              disabled
              class="w-full"
              placeholder="Select Account Head"
              v-model:value="updateformData.AMCode"
            >
              <a-select-option
                v-for="item in aMCodeList"
                :value="item?.AMCode"
                :key="item?.AMCode"
              >
                {{ `${item?.AMCode} - ${item?.AMDetails}` }}
              </a-select-option>
            </a-select>
          </div>

          <!-- AS Code Dropdown -->
          <a-form-item label="Sub Ledger" name="Sub Ledger">
            <a-select
              class="w-full"
              placeholder="Select Sub Ledger"
              v-model:value="asCode_div"
            >
              <a-select-option
                v-for="item in asTypeList"
                :value="item?.ASType"
                :key="item?.ASType"
              >
                {{ `${item?.ASType} - ${item?.ASDetails}` }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- Debit Balance Input -->
          <a-form-item label="Debit Balance" name="DrBalance">
            <a-input
              class="w-full"
              placeholder="Enter Debit Balance"
              v-model:value="updateformData.DrBalance"
              @input="handleDrBalancelogic"
            />
          </a-form-item>

          <!-- Credit Balance Input -->
          <a-form-item label="Credit Balance" name="CrBalance">
            <a-input
              class="w-full"
              placeholder="Enter Credit Balance"
              v-model:value="updateformData.CrBalance"
              @input="handleCrBalancelogic"
            />
          </a-form-item>
        </div>

        <div class="flex items-center justify-end mt-2">
          <a-button
            type="primary"
            html-type="submit"
            :loading="isUpdating"
            class="px-6 py-1 rounded font-semibold"
          >
            Update
          </a-button>
        </div>
      </a-form>
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
      :show-total="(total) => `Total ${total} items`"
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
import { useRouter } from "vue-router";

const router = useRouter();
const goBack = () => {
  router.push({ name: "overview" });
};

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);

const formData = ref({
  SiteCode: "",
  AMCode: "",
  ASCode: "",
  DrBalance: "",
  CrBalance: "",
});
const updateformData = ref({
  BalDate: "",
  SiteCode: "",
  AMCode: "",
  ASCode: "",
  DrBalance: "",
  CrBalance: "",
});

// create
const createallData = async () => {
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/settings/opening`,
      formData.value,
      getToken()
    );
    isCreating.value = false;

    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );
    await fetchAllData();
    formData.value = {
      SiteCode: "",
      AMCode: "",
      ASCode: "",
      DrBalance: "",
      CrBalance: "",
    };

    isCreateModalVisible.value = false;
  } catch (error) {
    isCreating.value = false;
    isCreateModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const allData_idwise = async (SiteCode, AMCode, ASCode, BalDate) => {
  try {
    const res = await axios.get(
      `${apiBase}/settings/opening/show?site=${SiteCode}&am=${AMCode}&as=${ASCode}&date=${BalDate}`,
      getToken()
    );

    asCode_div.value = res?.data?.data?.ASCode;
    updateformData.value = {
      SiteCode: res?.data?.data?.SiteCode,
      AMCode: res?.data?.data?.AMCode,
      ASCode: res?.data?.data?.ASCode,
      DrBalance: res?.data?.data?.DrBalance,
      CrBalance: res?.data?.data?.CrBalance,
      BalDate: res?.data?.data?.BalDate,
    };
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// update

const asCode_div = ref("");
const updateallData = async (SiteCode, AMCode, ASCode, BalDate) => {
  isUpdating.value = true;
  const finalupdateformData = {
    ASCode: asCode_div.value,
    DrBalance: updateformData.value.DrBalance,
    CrBalance: updateformData.value.CrBalance,
  };
  try {
    const res = await axios.put(
      `${apiBase}/settings/opening?site=${SiteCode}&am=${AMCode}&as=${ASCode}&date=${BalDate}`,
      finalupdateformData,
      getToken()
    );
    isUpdating.value = false;
    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );

    updateformData.value = {
      DeptDetail: "",
    };
    await fetchAllData();
    isEditModalVisible.value = false;
  } catch (error) {
    isUpdating.value = false;
    isEditModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

let searchTimeout = null;

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
      `${apiBase}/settings/opening?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
      getToken()
    );

    loading.value = false;
    allData.value = res?.data?.data?.data;
    total.value = res?.data?.data?.total;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    showNotification("info", err?.response?.data?.message || err?.message);
    console.error("Failed to fetch allData:", err);
  }
};

const deleteData = async (SiteCode, AMCode, ASCode, BalDate) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/opening?site=${SiteCode}&am=${AMCode}&as=${ASCode}&date=${BalDate}`,
      getToken()
    );
    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );
    await fetchAllData();
  } catch (err) {
    loading.value = false;
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const asTypeList = ref([]);
const getTypeList = async () => {
  try {
    const res = await axios.get(`${apiBase}/settings/as-type/all`, getToken());
    if (res?.data) {
      asTypeList.value = res?.data?.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};
const siteCodeList = ref([]);
const getsiteCodeList = async () => {
  try {
    const res = await axios.get(`${apiBase}/settings/site/all`, getToken());
    if (res?.data) {
      siteCodeList.value = res?.data?.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};
const aMCodeList = ref([]);
const getaMCodeList = async (search) => {
  try {
    const res = await axios.get(
      `${apiBase}/acmaster?search=${search}`,
      getToken()
    );
    if (res?.data) {
      aMCodeList.value = res?.data?.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

const handleDrBalancelogic = (e) => {
  console.log(e);
  if (formData.value.DrBalance || updateformData.value.DrBalance) {
    formData.value.CrBalance = 0;
    updateformData.value.CrBalance = 0;
  }
};
const handleCrBalancelogic = () => {
  if (formData.value.CrBalance || updateformData.value.CrBalance) {
    formData.value.DrBalance = 0;
    updateformData.value.DrBalance = 0;
  }
};

onMounted(async () => {
  await fetchAllData();
  await getTypeList();
  await getsiteCodeList();
  await getaMCodeList();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
.custom-form {
}
</style>

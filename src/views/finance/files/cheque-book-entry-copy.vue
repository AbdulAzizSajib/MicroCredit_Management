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
          @click="isCreateModalVisible = true"
        >
          Add Cheque Book
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">
      Cheque Book Entry ({{ total }})
      <Icon v-if="isShowLoading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2 w-8">-</th>
          <th class="border border-white px-4 py-2">Cheque Book No</th>
          <th class="border border-white px-4 py-2">No of Books</th>
          <th class="border border-white px-4 py-2 text-right">Serial to</th>
          <th class="border border-white px-4 py-2 text-right">Serial from</th>
          <th class="border border-white px-4 py-2 text-center">Status</th>
          <th class="border border-white px-4 py-2 text-center">Entry Date</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <template v-for="data in allData" :key="data?.ChequeBookNo">
          <tr>
            <td class="px-4 border">
              <button
                @click="toggleDetails(data?.ChequeBookNo)"
                class="text-xl transition-transform duration-300 w-6 h-6 flex items-center justify-center"
                :class="{ 'rotate-45': expandedRows[data?.ChequeBookNo] }"
              >
                +
              </button>
            </td>
            <td class="px-4 border">{{ data?.ChequeBookNo }}</td>
            <td class="px-4 border">{{ data?.NoOfBooks }}</td>
            <td class="px-4 border text-right">{{ data?.SerialTo }}</td>
            <td class="px-4 border text-right">{{ data?.SerialFrom }}</td>
            <td class="px-4 border text-center">
              <span
                class="px-2 py-1 rounded text-xs inline-block"
                :class="{
                  'bg-green-100 text-green-800': data?.Status === 'ACTIVE',
                  'bg-red-100 text-red-800': data?.Status === 'INACTIVE',
                }"
              >
                {{ data?.Status }}
              </span>
            </td>
            <td class="px-4 border text-center">
              {{ formatDate(data?.EntryDate) }}
            </td>
            <td class="px-4 border text-center w-8">
              <div class="flex justify-center gap-x-3">
                <button
                  @click="allData_idwise(data?.ChequeBookNo)"
                  type="button"
                  class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                >
                  <i class="bi bi-pencil"></i>
                </button>

                <a-popconfirm
                  @confirm="deleteData(data?.ChequeBookNo)"
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

          <!-- Expandable Details Row with Collapse -->
          <tr v-if="expandedRows[data?.ChequeBookNo]">
            <td colspan="8" class="p-0 border-x border-b">
              <a-collapse
                v-model:activeKey="activeKeys[data?.ChequeBookNo]"
                :bordered="false"
                expand-icon-position="end"
                class="cheque-details-collapse"
              >
                <a-collapse-panel
                  :key="data?.ChequeBookNo"
                  class="custom-panel"
                >
                  <template #header>
                    <div class="flex items-center justify-between">
                      <span class="font-semibold text-gray-700">
                        Cheque Details for {{ data?.ChequeBookNo }}
                      </span>
                      <span class="text-sm text-gray-500">
                        {{
                          chequeDetails[data?.ChequeBookNo]?.length || 0
                        }}
                        Cheque(s)
                      </span>
                    </div>
                  </template>

                  <a-spin
                    :spinning="
                      isDetailsLoading && loadingBookNo === data?.ChequeBookNo
                    "
                  >
                    <div
                      v-if="
                        chequeDetails[data?.ChequeBookNo] &&
                        chequeDetails[data?.ChequeBookNo].length > 0
                      "
                    >
                      <!-- Details Table -->
                      <div class="overflow-x-auto">
                        <table class="w-full border-collapse bg-white">
                          <thead>
                            <tr class="bg-gray-100">
                              <th
                                class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700"
                              >
                                Cheque No
                              </th>
                              <th
                                class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700"
                              >
                                Status
                              </th>
                              <th
                                class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700"
                              >
                                JV No
                              </th>
                              <th
                                class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700"
                              >
                                Period
                              </th>
                              <th
                                class="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700"
                              >
                                Locked
                              </th>
                              <th
                                class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700"
                              >
                                User ID
                              </th>
                              <th
                                class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700"
                              >
                                Edit User
                              </th>
                              <th
                                class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700"
                              >
                                Edit Date
                              </th>
                              <th
                                class="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700"
                              >
                                Remarks
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(detail, index) in chequeDetails[
                                data?.ChequeBookNo
                              ]"
                              :key="`${data?.ChequeBookNo}-detail-${index}`"
                              class="hover:bg-gray-50 transition-colors"
                            >
                              <td
                                class="border border-gray-300 px-3 py-2 text-sm font-mono"
                              >
                                {{ detail.ChequeNo }}
                              </td>
                              <td
                                class="border border-gray-300 px-3 py-2 text-sm"
                              >
                                <span
                                  class="px-2 py-1 rounded-full text-xs font-medium"
                                  :class="{
                                    'bg-green-100 text-green-800':
                                      detail.Status === 'ACTIVE',
                                    'bg-yellow-100 text-yellow-800':
                                      detail.Status === 'USED',
                                    'bg-red-100 text-red-800':
                                      detail.Status === 'CANCELLED',
                                    'bg-gray-100 text-gray-800':
                                      detail.Status === 'INACTIVE',
                                  }"
                                >
                                  {{ detail.Status }}
                                </span>
                              </td>
                              <td
                                class="border border-gray-300 px-3 py-2 text-sm"
                              >
                                {{ detail.JVNo || "-" }}
                              </td>
                              <td
                                class="border border-gray-300 px-3 py-2 text-sm text-center"
                              >
                                {{ detail.Period || "0" }}
                              </td>
                              <td
                                class="border border-gray-300 px-3 py-2 text-sm text-center"
                              >
                                <span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full"
                                  :class="{
                                    'bg-red-100 text-red-600':
                                      detail.Locked === 'Y',
                                    'bg-green-100 text-green-600':
                                      detail.Locked === 'N',
                                  }"
                                >
                                  <i
                                    class="bi text-xs"
                                    :class="{
                                      'bi-lock-fill': detail.Locked === 'Y',
                                      'bi-unlock-fill': detail.Locked === 'N',
                                    }"
                                  ></i>
                                </span>
                              </td>
                              <td
                                class="border border-gray-300 px-3 py-2 text-sm"
                              >
                                {{ detail.UserID }}
                              </td>
                              <td
                                class="border border-gray-300 px-3 py-2 text-sm"
                              >
                                {{ detail.EditUserID || "-" }}
                              </td>
                              <td
                                class="border border-gray-300 px-3 py-2 text-sm"
                              >
                                {{ formatDate(detail.EditDate) || "-" }}
                              </td>
                              <td
                                class="border border-gray-300 px-3 py-2 text-sm"
                              >
                                <span class="text-gray-600">{{
                                  detail.Remarks || "-"
                                }}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Summary Section -->
                      <div
                        class="mt-4 p-3 bg-gray-50 rounded flex justify-between items-center"
                      >
                        <div class="text-sm text-gray-600">
                          <span class="font-medium">Total Cheques:</span>
                          {{ chequeDetails[data?.ChequeBookNo].length }}
                        </div>
                        <div class="flex gap-4 text-sm">
                          <span class="text-green-600">
                            Active:
                            {{
                              countByStatus(
                                chequeDetails[data?.ChequeBookNo],
                                "ACTIVE"
                              )
                            }}
                          </span>
                          <span class="text-yellow-600">
                            Used:
                            {{
                              countByStatus(
                                chequeDetails[data?.ChequeBookNo],
                                "USED"
                              )
                            }}
                          </span>
                          <span class="text-red-600">
                            Cancelled:
                            {{
                              countByStatus(
                                chequeDetails[data?.ChequeBookNo],
                                "CANCELLED"
                              )
                            }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="py-8 text-center">
                      <i class="bi bi-inbox text-4xl text-gray-400"></i>
                      <p class="mt-2 text-gray-500">
                        No cheque details available
                      </p>
                    </div>
                  </a-spin>
                </a-collapse-panel>
              </a-collapse>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Create Modal -->
    <a-modal
      v-model:open="isCreateModalVisible"
      title="Cheque Book Entry"
      @cancel="isCreateModalVisible = false"
      :footer="null"
    >
      <form @submit.prevent="createallData">
        <div class="grid grid-cols-1 gap-x-4 custom-form cheque-register">
          <!-- Voucher Type Field -->
          <a-form-item
            label="Voucher Type"
            name="VoucherType"
            :rules="[
              { required: false, message: 'Please input voucher type!' },
            ]"
          >
            <a-select
              show-search
              v-model:value="formData.JVType"
              class="w-full"
              placeholder="Enter Voucher Type"
            >
              <a-select-option
                v-for="data in voucherTypeList"
                :value="data.JVType"
                :key="data.JVType"
              >
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- Date Field -->
          <a-form-item
            label="Date"
            name="Date"
            :rules="[{ required: false, message: 'Please select a date!' }]"
          >
            <a-date-picker
              disabled
              v-model:value="formData.EntryDate"
              class="w-full"
              placeholder="Select Date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </a-form-item>

          <!-- No. of Books Field -->
          <a-form-item
            label="No. of Books"
            name="NumberOfBooks"
            :rules="[
              { required: false, message: 'Please input number of books!' },
            ]"
          >
            <a-input
              v-model:value="formData.NoOfBooks"
              class="w-full"
              placeholder="Enter Number of Books"
            />
          </a-form-item>

          <!-- Digit Field -->

          <a-form-item
            label="Digit"
            name="Digit"
            :rules="[{ required: false, message: 'Please input digit!' }]"
          >
            <a-input
              v-model:value="formData.Digit"
              class="w-full"
              placeholder="Enter Digit"
              @input="handleDigitLogic"
            />
          </a-form-item>

          <!-- Cheque Serial From Field -->
          <a-form-item
            label="Cheque Serial From"
            name="ChequeSerialFrom"
            :rules="[
              { required: false, message: 'Please input cheque serial from!' },
            ]"
          >
            <a-input
              v-model:value="formData.SerialFrom"
              class="w-full"
              @input="handleSerialFromLogic"
              placeholder="Enter Cheque Serial From"
            />
          </a-form-item>

          <!-- Cheque Serial To Field -->
          <a-form-item
            label="Cheque Serial To"
            name="ChequeSerialTo"
            :rules="[
              { required: false, message: 'Please input cheque serial to!' },
            ]"
          >
            <a-input
              v-model:value="formData.SerialTo"
              class="w-full"
              @input="handleSerialToLogic"
              placeholder="Enter Cheque Serial To"
            />
          </a-form-item>
        </div>

        <!-- @click="createallData" -->
        <div class="flex items-center justify-end">
          <button
            :disabled="isCreating"
            type="submit"
            class="border px-6 py-1 rounded font-semibold bg-primary text-white"
          >
            {{ isCreating ? "Processing..." : "Save" }}
          </button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal
      :footer="null"
      v-model:open="isEditModalVisible"
      title="Edit Cheque No"
      @cancel="isEditModalVisible = false"
      width="500px"
    >
      <form @submit.prevent="updateallData(ChequeBookNo)">
        <div class="grid grid-cols-1 gap-x-4 custom-form cheque-register">
          <!-- Date Field -->
          <a-form-item
            label="Date"
            name="Date"
            :rules="[{ required: false, message: 'Please select a date!' }]"
          >
            <a-date-picker
              disabled
              v-model:value="updateformData.EntryDate"
              class="w-full"
              placeholder="Select Date"
              value-format="YYYY-MM-DD"
            />
          </a-form-item>

          <!-- No. of Books Field -->
          <a-form-item
            label="No. of Books"
            name="NumberOfBooks"
            :rules="[
              { required: false, message: 'Please input number of books!' },
            ]"
          >
            <a-input
              v-model:value="updateformData.NoOfBooks"
              class="w-full"
              placeholder="Enter Number of Books"
            />
          </a-form-item>

          <!-- Digit Field -->

          <a-form-item
            label="Digit"
            name="Digit"
            :rules="[{ required: false, message: 'Please input digit!' }]"
          >
            <a-input
              v-model:value="updateformData.Digit"
              class="w-full"
              placeholder="Enter Digit"
            />
          </a-form-item>

          <!-- Cheque Serial From Field -->
          <a-form-item
            label="Cheque Serial From"
            name="ChequeSerialFrom"
            :rules="[
              { required: false, message: 'Please input cheque serial from!' },
            ]"
          >
            <a-input
              v-model:value="updateformData.SerialFrom"
              class="w-full"
              placeholder="Enter Cheque Serial From"
            />
          </a-form-item>

          <!-- Cheque Serial To Field -->
          <a-form-item
            label="Cheque Serial To"
            name="ChequeSerialTo"
            :rules="[
              { required: false, message: 'Please input cheque serial to!' },
            ]"
          >
            <a-input
              v-model:value="updateformData.SerialTo"
              class="w-full"
              placeholder="Enter Cheque Serial To"
            />
          </a-form-item>
          <a-form-item
            label="Status"
            name="Status"
            :rules="[{ required: false, message: 'Please input Status!' }]"
          >
            <a-select
              v-model:value="updateformData.Status"
              class="w-full"
              placeholder="Enter Cheque Serial To"
            >
              <a-option-select value="ACTIVE">Active</a-option-select>
              <a-option-select value="USED">Used</a-option-select>
              <a-option-select value="CANCEL">Cancel</a-option-select>
            </a-select>
          </a-form-item>
        </div>
        <div class="flex items-center justify-end">
          <button
            :disabled="isUpdating"
            type="submit"
            class="border px-6 py-1 rounded font-semibold bg-primary text-white"
          >
            {{ isUpdating ? "Processing ..." : "Update" }}
          </button>
        </div>
      </form>
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
import dayjs from "dayjs";

import { useRouter } from "vue-router";
import debounce from "debounce";
const router = useRouter();
const goBack = () => {
  router.push({ name: "overview" });
};

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const userInfo = JSON.parse(localStorage.getItem("user_info"));

const formData = ref({
  SiteCode: "01",
  JVType: "",
  EntryDate: dayjs().format("YYYY-MM-DD"),
  NoOfBooks: "",
  Digit: "",
  SerialFrom: "",
  SerialTo: "",
  Status: "ACTIVE",
  UserID: userInfo?.name,
});
const updateformData = ref({
  EntryDate: "",
  NoOfBooks: "",
  Digit: "",
  SerialFrom: "",
  SerialTo: "",
  Status: "",
  UserID: userInfo?.name,
});

// create
const createallData = async () => {
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/settings/cheque-register-master`,
      {
        ...formData.value,
        EntryDate: formData.value.EntryDate
          ? dayjs(formData.value.EntryDate).format("YYYY-MM-DD")
          : "",
      },
      getToken()
    );
    isCreating.value = false;

    if (res.data.success === true) {
      showNotification(
        res?.data?.success ? "success" : "error",
        res?.data?.message
      );
      await fetchAllData();
      formData.value = {
        SiteCode: "01",
        JVType: "",
        EntryDate: "",
        NoOfBooks: "",
        Digit: "",
        SerialFrom: "",
        SerialTo: "",
        Status: "ACTIVE",
        UserID: userInfo?.name,
      };
    }

    isCreateModalVisible.value = false;
  } catch (error) {
    isCreating.value = false;
    isCreateModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const ChequeBookNo = ref();
const isShowLoading = ref(false);
const allData_idwise = async (id) => {
  try {
    isShowLoading.value = true;
    const res = await axios.get(
      `${apiBase}/settings/cheque-register-master/show?ChequeBookNo=${id}`,
      getToken()
    );
    isShowLoading.value = false;
    ChequeBookNo.value = res?.data?.data?.ChequeBookNo;
    updateformData.value = {
      EntryDate: res?.data?.data?.EntryDate
        ? dayjs(res?.data?.data?.EntryDate)
        : null,
      NoOfBooks: res?.data?.data?.NoOfBooks,
      Digit: res?.data?.data?.GroupCode,
      SerialFrom: res?.data?.data?.SerialFrom,
      SerialTo: res?.data?.data?.SerialTo,
      Digit: res?.data?.data?.Digit || 6,
      Status: res?.data?.data?.Status,
    };
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// update
const updateallData = async (ChequeBookNo) => {
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/settings/cheque-register-master?cheque=${ChequeBookNo}`,
      updateformData.value,
      getToken()
    );
    isUpdating.value = false;
    showNotification(
      res?.data?.success ? "success" : "error",
      res?.data?.message
    );

    createallData;
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

// Fetch allData with search and pagination
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/settings/cheque-register-master?page=${page.value}&per_page=${per_page.value}&search=${search.value}`,
      getToken()
    );
    console.log(res.data);
    loading.value = false;
    allData.value = res?.data?.data?.data;
    total.value = res?.data?.data?.total;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    console.error("Failed to fetch allData:", err);
  }
};

const deleteData = async (ChequeBookNo) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/cheque-register-master?cheque=${ChequeBookNo}`,
      getToken()
    );
    showNotification(res?.data ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (err) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

const searchLoading = ref(false);

const voucherTypeList = ref([]);
const getVoucherType = async () => {
  searchLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/settings/voucher-type/all`,
      getToken()
    );
    searchLoading.value = false;
    if (res?.data) {
      voucherTypeList.value = res?.data?.data;
    }
  } catch (error) {
    console.log(error.message);
    searchLoading.value = false;
  }
};

const handleSerialFromLogic = () => {
  const digit = parseInt(formData.value.Digit);

  if (!digit || digit < 1 || digit > 7) {
    formData.value.SerialFrom = "";
    return showNotification("warning", "Please set Digit first (1-7)");
  }

  const serialFrom = formData.value.SerialFrom;

  if (serialFrom) {
    // Remove any non-numeric characters
    let numericValue = serialFrom.replace(/\D/g, "");

    // Calculate max value for given digits (e.g., 99 for 2 digits, 999 for 3 digits)
    const maxValue = Math.pow(10, digit) - 1;

    // Prevent entering more digits than allowed
    if (numericValue.length > digit) {
      numericValue = numericValue.substring(0, digit);
      formData.value.SerialFrom = numericValue;
      return showNotification("warning", `Maximum ${digit} digits allowed`);
    }

    // Check if value exceeds maximum
    if (parseInt(numericValue) > maxValue) {
      formData.value.SerialFrom = maxValue.toString();
      return showNotification(
        "warning",
        `Maximum value for ${digit} digits is ${maxValue}`
      );
    }

    // Check if value is less than minimum (1)
    if (parseInt(numericValue) < 1 && numericValue !== "") {
      formData.value.SerialFrom = "1";
      return showNotification("warning", "Minimum value is 1");
    }

    // Update value without padding
    formData.value.SerialFrom = numericValue;
  }
};

const handleSerialToLogic = () => {
  const digit = parseInt(formData.value.Digit);

  if (!digit || digit < 1 || digit > 7) {
    formData.value.SerialTo = "";
    return showNotification("warning", "Please set Digit first (1-7)");
  }

  const serialTo = formData.value.SerialTo;
  const serialFromNum = parseInt(formData.value.SerialFrom) || 1;

  if (serialTo) {
    // Remove any non-numeric characters
    let numericValue = serialTo.replace(/\D/g, "");

    // Calculate max value for given digits
    const maxValue = Math.pow(10, digit) - 1;

    // Prevent entering more digits than allowed
    if (numericValue.length > digit) {
      numericValue = numericValue.substring(0, digit);
      formData.value.SerialTo = numericValue;
      return showNotification("warning", `Maximum ${digit} digits allowed`);
    }

    // Check if value exceeds maximum
    if (parseInt(numericValue) > maxValue) {
      formData.value.SerialTo = maxValue.toString();
      return showNotification(
        "warning",
        `Maximum value for ${digit} digits is ${maxValue}`
      );
    }

    // Check if value is less than SerialFrom
    if (parseInt(numericValue) < serialFromNum && numericValue !== "") {
      formData.value.SerialTo = serialFromNum.toString();
      return showNotification(
        "warning",
        `Serial To must be Greater then Serial From (${formData.value.SerialFrom})`
      );
    }

    // Check if value is less than minimum (1)
    if (parseInt(numericValue) < 1 && numericValue !== "") {
      formData.value.SerialTo = "1";
      return showNotification("warning", "Minimum value is 1");
    }

    // Update value without padding
    formData.value.SerialTo = numericValue;
  }
};

const handleDigitLogic = () => {
  if (formData.value.Digit > 7) {
    formData.value.Digit = "";
    return showNotification("warning", "Maximum limit 1 to 7 Digit");
  }

  // Optional: Clear serial fields when digit changes
  // This ensures user doesn't have invalid values when switching digits
  formData.value.SerialFrom = "";
  formData.value.SerialTo = "";
};

const isDetailsLoading = ref(false);
const chequeBookNoDetails = ref([]);
const handleDetails = async (ChequeBookNo) => {
  try {
    isDetailsLoading.value = true;
    const res = await axios.get(
      `${apiBase}/settings/cheque-register-master/show?ChequeBookNo=${ChequeBookNo}`,
      getToken()
    );
    isDetailsLoading.value = false;
    if (res?.data.success === true) {
      chequeBookNoDetails.value = res?.data?.data?.details;
      console.log(chequeBookNoDetails.value);
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchAllData();
  await getVoucherType();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}

.cheque-register .ant-form-item-label label {
  width: 170px !important;
}
</style>

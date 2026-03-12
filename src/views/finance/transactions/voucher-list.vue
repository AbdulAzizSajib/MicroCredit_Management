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
        <router-link :to="{ name: 'voucher-add' }">
          <button class="bg-primary text-white px-4 py-2 rounded">
            Add Voucher
          </button>
        </router-link>
      </div>
    </div>
    <div class="grid grid-cols-8 gap-4 mb-4 items-end">
      <h1 class="text-2xl font-bold text-primary mb-4">
        Voucher List ({{ total }})
      </h1>
      <div class="w-full">
        <label for="period" class="w-36 font-bold">Form Date:</label>
        <input
          type="date"
          v-model="from_date"
          :max="to_date"
          class="w-full border p-1 border-black rounded-md"
          :class="{ 'border-red-500': dateError }"
        />
      </div>

      <div class="w-full">
        <label for="period" class="w-36 font-bold">To Date:</label>
        <input
          type="date"
          v-model="to_date"
          :min="from_date"
          class="w-full border p-1 border-black rounded-md"
          :class="{ 'border-red-500': dateError }"
        />
        <p v-if="dateError" class="text-red-500 text-xs mt-1">
          To Date must be greater than or equal to From Date
        </p>
      </div>

      <div>
        <a-button
          type="primary"
          @click="fetchAllData"
          :loading="loading"
          :disabled="dateError"
          >Filter</a-button
        >
      </div>
    </div>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">Voucher No</th>
          <th class="border border-white px-4 py-2">Voucher Category</th>
          <th class="border border-white px-4 py-2">Narration</th>
          <th class="border border-white px-4 py-2">Period</th>

          <th class="border border-white px-4 py-2">Voucher Date</th>

          <th class="border border-white px-4 py-2 text-center">Debit</th>
          <th class="border border-white px-4 py-2 text-center">Credit</th>
          <th class="border border-white px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="capitalize">
        <!-- Changed from paginatedData to allData -->
        <tr v-for="(voucher, index) in allData" :key="index">
          <td class="px-4 border">{{ voucher?.JVNo }}</td>
          <td class="px-4 border">{{ voucher?.JvCat }}</td>
          <td class="px-4 border">{{ voucher?.Narration }}</td>

          <td class="px-4 border">
            {{ dayjs(voucher?.Period).format("MM-YYYY ") }}
          </td>

          <td class="px-4 border">
            {{ dayjs(voucher?.JvDate).format("DD-MM-YYYY") }}
          </td>

          <td class="px-4 border text-end">{{ voucher?.Debit }}</td>
          <td class="px-4 border text-end">{{ voucher?.Credit }}</td>
          <td class="px-4 border text-center w-8">
            <div class="flex justify-center gap-x-3">
              <router-link
                :to="{
                  name: 'voucher-edit',
                  query: {
                    Period: voucher?.Period,
                    SiteCode: voucher?.SiteCode,
                    JVNo: voucher?.JVNo,
                  },
                }"
              >
                <button
                  type="button"
                  class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                >
                  <i class="bi bi-pencil"></i>
                </button>
              </router-link>

              <!-- <button
                type="button"
                class="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                @click="confirmDelete(voucher)"
              >
                <i class="bi bi-trash"></i>
              </button> -->

              <router-link
                :to="{
                  name: 'voucher-list-print',
                  query: {
                    SiteCode: voucher?.SiteCode,
                    Period: voucher?.Period,
                    Type: voucher?.JVType,
                    Category: voucher?.Type,
                    VoucherFrom: voucher?.JVSerial,
                    VoucherTo: voucher?.JVSerial,
                  },
                }"
              >
                <button
                  type="button"
                  class="px-2 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <i class="bi bi-printer"></i>
                </button>
              </router-link>
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

    <!-- Added @change event to handle page changes -->
    <a-pagination
      class="mt-4"
      v-model:current="page"
      :page-size="per_page"
      :total="total"
      :show-size-changer="false"
      :show-total="(total) => `Total ${total} items`"
      @change="handlePageChange"
      v-if="total > per_page"
    />
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";
import { useRouter } from "vue-router";
import { Modal } from "ant-design-vue";
import dayjs from "dayjs";

const router = useRouter();
const goBack = () => {
  router.push({ name: "overview" });
};

const page = ref(1);
const per_page = ref(10);
const total = ref(0);
const search = ref("");
const allData = ref([]);
const loading = ref(false);

// Fetch data from server
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/journal-master?page=${page.value}&per_page=${
        per_page.value
      }&search=${search.value}&from_date=${from_date.value || " "}&to_date=${
        to_date.value || " "
      }`,
      getToken()
    );

    // Store the paginated data from server
    allData.value = res?.data?.data || [];

    console.log("allData--------->", allData.value);

    // Use the total from server response
    total.value = res?.data?.total || 0;
    per_page.value = res?.data?.per_page || 10;
  } catch (err) {
    allData.value = [];
    total.value = 0;
    console.error("Failed to fetch allData:", err);
  } finally {
    loading.value = false;
  }
};

// Handle page change
const handlePageChange = (newPage) => {
  page.value = newPage;
  fetchAllData();
};

// Handle search with debounce
let searchTimeout;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1; // Reset to first page on search
    fetchAllData();
  }, 300); // 300ms debounce
};

// Watch page changes (alternative to @change event)
// watch(page, () => {
//   fetchAllData();
// });

const confirmDelete = (voucher) => {
  Modal.confirm({
    title: "Delete Confirmation",
    content: `Are you sure you want to delete voucher ${voucher.JVNo}?`,
    okText: "Yes, Delete",
    okType: "danger",
    cancelText: "Cancel",
    async onOk() {
      try {
        loading.value = true;
        const url = `${apiBase}/journal-master?SiteCode=${
          voucher.SiteCode
        }&Period=${voucher.Period}&JVNo=${encodeURIComponent(voucher.JVNo)}`;
        await axios.delete(url, getToken());
        showNotification(
          "success",
          `Voucher ${voucher.JVNo} deleted successfully.`
        );
        await fetchAllData();
      } catch (err) {
        console.error("Delete failed:", err);
        showNotification("error", "Failed to delete voucher.");
      } finally {
        loading.value = false;
      }
    },
  });
};

const from_date = ref(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
const to_date = ref(dayjs().format("YYYY-MM-DD"));
const dateError = ref(false);

onMounted(async () => {
  await fetchAllData();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

<template>
  <MainLayout>
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input
          :placeholder="$t('common.searchHere')"
          v-model:value="search"
          @input="handleSearch"
          class="w-64"
        />
      </div>
      <div class="mb-4">
        <router-link :to="{ name: 'voucher-add' }">
          <button class="bg-primary text-white px-4 py-2 rounded">
            {{ $t('voucher.addVoucher') }}
          </button>
        </router-link>
      </div>
    </div>
    <div class="flex flex-wrap gap-4 mb-4 items-end">
      <h1 class="text-2xl font-bold text-primary">
        {{ $t('voucher.voucherList') }} ({{ total }})
      </h1>
      <div>
        <a-range-picker
          v-model:value="dateRange"
          value-format="YYYY-MM-DD"
          format="DD-MMM-YYYY"
        />
      </div>
      <div>
        <a-button
          type="primary"
          @click="fetchAllData"
          :loading="loading"
          >{{ $t('voucher.filter') }}</a-button
        >
      </div>
    </div>

    <!-- Table -->
    <table class="w-full border border-collapse text-left">
      <thead>
        <tr class="bg-primary text-white">
          <th class="border border-white px-4 py-2">{{ $t('voucher.voucherNo') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('voucher.voucherCategoryLabel') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('voucher.narration') }}</th>
          <th class="border border-white px-4 py-2">{{ $t('common.period') }}</th>

          <th class="border border-white px-4 py-2">{{ $t('voucher.voucherDate') }}</th>

          <th class="border border-white px-4 py-2 text-center">{{ $t('voucher.debit') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('voucher.credit') }}</th>
          <th class="border border-white px-4 py-2 text-center">{{ $t('common.actions') }}</th>
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
      :show-total="(total) => $t('common.totalItems', { total })"
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
      }&search=${search.value}&from_date=${dateRange.value?.[0] || " "}&to_date=${
        dateRange.value?.[1] || " "
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

const dateRange = ref(["2024-07-01", dayjs().format("YYYY-MM-DD")]);

onMounted(async () => {
  await fetchAllData();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

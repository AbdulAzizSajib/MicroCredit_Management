<template>
  <MainLayout>
    <!-- Balance Sheet Two-Column Layout -->
    <div class="bg-white min-h-screen p-8 border">
      <div
        class="border-b border-black mb-6 pb-4 flex justify-between items-center"
      >
        <div>
          <h1 class="text-2xl font-bold text-center">Balance Sheet</h1>
        </div>
        <div class="flex items-end justify-center gap-3">
          <div class="">
            <h2>As On Date:</h2>
            <input
              v-model="DateFrom"
              type="date"
              class="border border-black p-1 mr-4"
            />
          </div>
          <div class="flex items-end gap-6">
            <button
              @click="fetchBalanceSheet"
              class="border px-4 py-1.5 rounded-md hover:bg-indigo-700 bg-indigo-600 text-white font-semibold"
            >
              Search
            </button>
            <button class="" title="Export PDF" @click="exportPDF">
              <Icon icon="vscode-icons:file-type-pdf2" width="40" height="40" />
            </button>
          </div>
        </div>
      </div>
      <div v-if="isLoading">
        <p class="text-center font-semibold text-lg">
          Please select a date and click Search to view the Balance Sheet
        </p>
      </div>
      <div v-else class="max-w-5xl mx-auto border border-black">
        <!-- Main Content Area - Two Columns -->
        <div class="flex">
          <!-- Left Side - Assets -->
          <div class="w-1/2 border-r border-black">
            <!-- Column Header -->
            <div class="px-4 py-2">
              <h2 class="font-bold underline">Assets</h2>
            </div>

            <!-- Fixed Assets Section -->
            <div class="px-4 py-2">
              <h3 class="font-bold italic underline">Fixed Assets</h3>
              <template v-if="fixedAssets.length > 0">
                <div
                  v-for="(item, index) in fixedAssets"
                  :key="'fa-' + index"
                  class="flex justify-between pl-4 py-1"
                >
                  <span
                    :class="{ 'text-indigo-600 cursor-pointer': item?.ACType1 }"
                    @click="getDetails(item?.ACType1)"
                    >{{ item.AccountName }}</span
                  >
                  <span>{{ formatAmount(item.Amount) }}</span>
                </div>
              </template>
              <div v-else class="flex justify-between pl-4 py-1">
                <span>-</span>
                <span>-</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="italic">Total of Fixed Assets</span>
                <div class="flex gap-8">
                  <span></span>
                  <span>{{ formatAmount(fixedAssetsTotal) }}</span>
                </div>
              </div>
            </div>

            <!-- Current Assets Section -->
            <div class="px-4 py-2">
              <h3 class="font-bold italic underline">Current Assets</h3>
              <template v-if="currentAssets.length > 0">
                <div
                  v-for="(item, index) in currentAssets"
                  :key="'ca-' + index"
                  class="flex justify-between pl-4 py-1"
                >
                  <span
                    :class="{ 'text-indigo-600 cursor-pointer': item?.ACType1 }"
                    @click="getDetails(item?.ACType1)"
                    >{{ item?.AccountName }}
                  </span>
                  <span>{{ formatAmount(item?.Amount) }}</span>
                </div>
              </template>
              <div v-else class="flex justify-between pl-4 py-1">
                <span>-</span>
                <span>-</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="italic font-semibold"
                  >Total of Current Assets</span
                >
                <div class="flex gap-8">
                  <span></span>
                  <span class="border-t border-black font-semibold">{{
                    formatAmount(currentAssetsTotal)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Total Assets -->
            <div class="px-4 py-4 mt-8">
              <div class="flex justify-between font-bold">
                <span class="italic">TOTAL OF ASSETS</span>
                <span class="border-t border-b border-black px-2">{{
                  formatAmount(totalAssets)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Right Side - Liabilities & Equities -->
          <div class="w-1/2">
            <!-- Column Header -->
            <div class="px-4 py-2">
              <h2 class="font-bold underline">Liabilities & Equities</h2>
            </div>

            <!-- Liabilities Section -->
            <div class="px-4 py-2">
              <h3 class="font-bold underline">Liabilities</h3>

              <!-- Fixed Liabilities -->
              <div class="py-1">
                <span class="font-bold italic pl-4 underline"
                  >Fixed Liabilities</span
                >
              </div>
              <template v-if="fixedLiabilities.length > 0">
                <div
                  v-for="(item, index) in fixedLiabilities"
                  :key="'fl-' + index"
                  class="flex justify-between pl-8 py-1"
                >
                  <span
                    :class="{ 'text-indigo-600 cursor-pointer': item?.ACType1 }"
                    @click="getDetails(item?.ACType1)"
                    >{{ item.AccountName }}</span
                  >
                  <span class="font-semibold">{{
                    formatAmount(item.Amount)
                  }}</span>
                </div>
              </template>
              <div v-else class="flex justify-between pl-8 py-1">
                <span>-</span>
                <span>-</span>
              </div>

              <!-- Current Liabilities -->
              <div class="py-2">
                <h4 class="font-bold italic underline pl-4">
                  Current Liabilities
                </h4>
                <template v-if="currentLiabilities.length > 0">
                  <div
                    v-for="(item, index) in currentLiabilities"
                    :key="'cl-' + index"
                    class="flex justify-between pl-8 py-1"
                  >
                    <span
                      :class="{
                        'text-indigo-600 cursor-pointer': item?.ACType1,
                      }"
                      @click="getDetails(item?.ACType1)"
                      >{{ item.AccountName }}</span
                    >
                    <span>{{ formatAmount(item.Amount) }}</span>
                  </div>
                </template>
                <div v-else class="flex justify-between pl-8 py-1">
                  <span>-</span>
                  <span>-</span>
                </div>
                <div class="flex justify-between pl-4 py-1">
                  <span class="italic font-semibold"
                    >Total of Current Liabilities</span
                  >
                  <div class="flex gap-8">
                    <span></span>
                    <span class="border-t border-black font-semibold">{{
                      formatAmount(currentLiabilitiesTotal)
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Total Liabilities -->
              <div class="flex justify-between py-1">
                <span class="italic font-semibold">Total of Liabilities</span>
                <div class="flex gap-8">
                  <span></span>
                  <span class="border-t border-black font-semibold">{{
                    formatAmount(totalLiabilities)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Equity Section -->
            <div class="px-4 py-2">
              <h3 class="font-bold underline">Equity</h3>
              <template v-if="equity.length > 0">
                <div
                  v-for="(item, index) in equity"
                  :key="'eq-' + index"
                  class="flex justify-between pl-8 py-1"
                >
                  <span
                    :class="{ 'text-indigo-600 cursor-pointer': item?.ACType1 }"
                    @click="getDetails(item?.ACType1)"
                    >{{ item.AccountName }}</span
                  >
                  <span>{{ formatAmount(item.Amount) }}</span>
                </div>
              </template>
              <template v-if="retainedEarnings.length > 0">
                <div
                  v-for="(item, index) in retainedEarnings"
                  :key="'re-' + index"
                  class="flex justify-between pl-8 py-1"
                >
                  <span>{{ item.Description }}</span>
                  <span>{{ formatAmount(item.TotalAmount) }}</span>
                </div>
              </template>
              <div v-else class="flex justify-between pl-8 py-1">
                <span>-</span>
                <span>-</span>
              </div>
              <div class="flex justify-between pl-4 py-1">
                <span class="italic font-semibold">Total of Equity</span>
                <div class="flex gap-8">
                  <span></span>
                  <span class="border-t border-black font-semibold">{{
                    formatAmount(totalEquity)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Total Liabilities + Equity -->
            <div class="px-4 py-4 mt-4">
              <div class="flex justify-between font-bold">
                <span>TOTAL OF LIABILITIES + EQUITY</span>
                <span class="border-t border-b border-black px-2">{{
                  formatAmount(totalLiabilitiesEquity)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- modal -->
    <a-modal
      centered
      :footer="null"
      :width="800"
      v-model:open="open"
      :title="null"
    >
      <nav class="flex items-center text-sm text-gray-600 mb-4">
        <span class="font-medium text-gray-800">{{
          detailsInfo[0].GroupDetails
        }}</span>
        <span class="mx-2 text-gray-400">></span>
        <span class="font-medium text-gray-800">{{
          detailsInfo[0].GroupDetailsSub
        }}</span>
        <span class="mx-2 text-gray-400">></span>
        <span class="font-semibold text-indigo-600">{{
          detailsInfo[0].ACType1Details
        }}</span>
      </nav>
      <table class="w-full border-collapse text-sm">
        <thead class="bg-gray-100">
          <tr>
            <!-- <th
              class="border border-gray-300 px-3 py-2 text-left font-semibold"
            >
              Group Details
            </th>
            <th
              class="border border-gray-300 px-3 py-2 text-left font-semibold"
            >
              Group Details Sub
            </th>
            <th
              class="border border-gray-300 px-3 py-2 text-left font-semibold"
            >
              AC Type Details
            </th> -->
            <th
              class="border border-gray-300 px-3 py-2 text-left font-semibold"
            >
              AM Code
            </th>
            <th
              class="border border-gray-300 px-3 py-2 text-left font-semibold"
            >
              AM Details
            </th>
            <th
              class="border border-gray-300 px-3 py-2 text-right font-semibold"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in detailsInfo"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="border border-gray-300 px-3 py-2">{{ item.AMCode }}</td>
            <td class="border border-gray-300 px-3 py-2">
              {{ item.AMDetails }}
            </td>
            <td class="border border-gray-300 px-3 py-2 text-right">
              {{ formatAmount(item.Amount) }}
            </td>
          </tr>
          <tr>
            <td
              colspan="2"
              class="border border-gray-300 px-3 py-2 font-semibold text-right"
            >
              Total
            </td>
            <td
              class="border border-gray-300 px-3 py-2 font-semibold text-right"
            >
              {{
                formatAmount(
                  detailsInfo.reduce(
                    (sum, item) => sum + parseFloat(item.Amount || 0),
                    0,
                  ),
                )
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken } from "@/utilities/common";
import { Icon } from "@iconify/vue";
import axios from "axios";
import dayjs from "dayjs";
import printJS from "print-js";
import { ref, computed } from "vue";

const DateFrom = ref(dayjs().format("YYYY-MM-DD"));

// Table refs for API response
const table_0 = ref([]); // Fixed Assets
const table_1 = ref([]); // Current Assets
const table_2 = ref([]); // Total Assets
const table_3 = ref([]); // Fixed Liabilities
const table_4 = ref([]); // Current Liabilities
const table_5 = ref([]); // Total Liabilities
const table_6 = ref([]); // Equity
const table_7 = ref([]); // Total Equity
const table_8 = ref([]); // Total Liabilities + Equity
const table_9 = ref([]); // Balance Status
const table_10 = ref([]); // Retained Earnings

// Computed properties for filtered data (excluding placeholder "-" entries)
const fixedAssets = computed(() =>
  table_0.value.filter((item) => item.AccountName !== "-"),
);

const currentAssets = computed(() =>
  table_1.value.filter((item) => item.AccountName !== "-"),
);

const fixedLiabilities = computed(() =>
  table_3.value.filter((item) => item.AccountName !== "-"),
);

const currentLiabilities = computed(() =>
  table_4.value.filter((item) => item.AccountName !== "-"),
);

const equity = computed(() =>
  table_6.value.filter((item) => item.AccountName !== "-"),
);

const retainedEarnings = computed(() => table_10.value);

// Computed totals
const fixedAssetsTotal = computed(() => {
  return fixedAssets.value.reduce(
    (sum, item) => sum + parseFloat(item.Amount || 0),
    0,
  );
});

const currentAssetsTotal = computed(() => {
  return currentAssets.value.reduce(
    (sum, item) => sum + parseFloat(item.Amount || 0),
    0,
  );
});

const totalAssets = computed(() => {
  if (table_2.value.length > 0) {
    return parseFloat(table_2.value[0].TotalAmount || 0);
  }
  return fixedAssetsTotal.value + currentAssetsTotal.value;
});

const currentLiabilitiesTotal = computed(() => {
  return currentLiabilities.value.reduce(
    (sum, item) => sum + parseFloat(item.Amount || 0),
    0,
  );
});

const totalLiabilities = computed(() => {
  if (table_5.value.length > 0) {
    return parseFloat(table_5.value[0].TotalAmount || 0);
  }
  return currentLiabilitiesTotal.value;
});

const totalEquity = computed(() => {
  if (table_7.value.length > 0) {
    return parseFloat(table_7.value[0].TotalAmount || 0);
  }
  const equitySum = equity.value.reduce(
    (sum, item) => sum + parseFloat(item.Amount || 0),
    0,
  );
  const retainedEarningsSum = retainedEarnings.value.reduce(
    (sum, item) => sum + parseFloat(item.TotalAmount || 0),
    0,
  );
  return equitySum + retainedEarningsSum;
});

const totalLiabilitiesEquity = computed(() => {
  if (table_8.value.length > 0) {
    return parseFloat(table_8.value[0].TotalAmount || 0);
  }
  return totalLiabilities.value + totalEquity.value;
});

const balanceStatus = computed(() => {
  return table_9.value.length > 0 ? table_9.value[0] : null;
});

// Format amount with thousand separators
// const formatAmount = (amount) => {
//   if (amount == null || amount === "" || amount === ".00") return "0.00";
//   const num = parseFloat(amount);
//   if (isNaN(num)) return "0.00";
//   return num.toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// };

const formatAmount = (amount) => {
  if (amount == null || amount === "" || amount === ".00") return "-";
  const num = parseFloat(amount);
  if (isNaN(num)) return "-";
  if (num === 0) return "-";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const isLoading = ref(true);
const fetchBalanceSheet = async () => {
  try {
    isLoading.value = true;
    const res = await axios.post(
      `${apiBase}/journal-master/balance-sheet-new-report`,
      {
        AsOnDate: dayjs(DateFrom.value).format("YYYY-MM-DD"),
      },
      getToken(),
    );
    isLoading.value = false;
    if (res.data?.data) {
      console.log(res.data.data);
      table_0.value = res.data.data.table_0 || [];
      table_1.value = res.data.data.table_1 || [];
      table_2.value = res.data.data.table_2 || [];
      table_3.value = res.data.data.table_3 || [];
      table_4.value = res.data.data.table_4 || [];
      table_5.value = res.data.data.table_5 || [];
      table_6.value = res.data.data.table_6 || [];
      table_7.value = res.data.data.table_7 || [];
      table_8.value = res.data.data.table_8 || [];
      table_10.value = res.data.data.table_10 || [];
      console.log("Balance Sheet Data loaded successfully");
    }
  } catch (error) {
    console.error("Error fetching balance sheet data:", error);
    isLoading.value = false;
  }
};

const detailsInfo = ref([]);
const getDetails = async (ACTypeCode) => {
  try {
    const res = await axios.post(
      `${apiBase}/journal-master/balance-sheet-detail`,
      {
        ASOnDate: dayjs(DateFrom.value).format("YYYY-MM-DD"),
        ACTypeCode: ACTypeCode,
      },
      getToken(),
    );
    console.log("res.data----------", res.data);
    if (res) {
      detailsInfo.value = res.data || [];
      open.value = true;
    }
  } catch (error) {
    console.log(error);
  }
};

const open = ref(false);
const showModal = () => {
  open.value = true;
};

const exportPDF = () => {
  const printContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 900px; margin: 0 auto;">
      <h1 style="text-align: center; font-size: 24px; margin-bottom: 5px;">Balance Sheet</h1>
      <p style="text-align: center; margin-bottom: 20px;">As On Date: ${dayjs(
        DateFrom.value,
      ).format("DD-MM-YYYY")}</p>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
        <tr>
          <!-- Assets Column -->
          <td style="width: 50%; vertical-align: top; border-right: 1px solid black;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td colspan="2" style="padding: 8px; font-weight: bold; text-decoration: underline;">Assets</td>
              </tr>

              <!-- Fixed Assets -->
              <tr>
                <td colspan="2" style="padding: 8px; font-weight: bold; font-style: italic; text-decoration: underline;">Fixed Assets</td>
              </tr>
              ${
                fixedAssets.value
                  .map(
                    (item) => `
                <tr>
                  <td style="padding: 4px 8px 4px 24px;">${
                    item.AccountName
                  }</td>
                  <td style="padding: 4px 8px; text-align: right;">${formatAmount(
                    item.Amount,
                  )}</td>
                </tr>
              `,
                  )
                  .join("") ||
                '<tr><td style="padding: 4px 8px 4px 24px;">-</td><td style="padding: 4px 8px; text-align: right;">-</td></tr>'
              }
              <tr>
                <td style="padding: 4px 8px; font-style: italic;">Total of Fixed Assets</td>
                <td style="padding: 4px 8px; text-align: right;">${formatAmount(
                  fixedAssetsTotal.value,
                )}</td>
              </tr>

              <!-- Current Assets -->
              <tr>
                <td colspan="2" style="padding: 8px; font-weight: bold; font-style: italic; text-decoration: underline;">Current Assets</td>
              </tr>
              ${
                currentAssets.value
                  .map(
                    (item) => `
                <tr>
                  <td style="padding: 4px 8px 4px 24px;">${
                    item.AccountName
                  }</td>
                  <td style="padding: 4px 8px; text-align: right;">${formatAmount(
                    item.Amount,
                  )}</td>
                </tr>
              `,
                  )
                  .join("") ||
                '<tr><td style="padding: 4px 8px 4px 24px;">-</td><td style="padding: 4px 8px; text-align: right;">-</td></tr>'
              }
              <tr>
                <td style="padding: 4px 8px; font-style: italic; font-weight: 600;">Total of Current Assets</td>
                <td style="padding: 4px 8px; text-align: right; border-top: 1px solid black;">${formatAmount(
                  currentAssetsTotal.value,
                )}</td>
              </tr>

              <!-- Total Assets -->
              <tr>
                <td style="padding: 16px 8px 8px 8px; font-weight: bold; font-style: italic;">TOTAL OF ASSETS</td>
                <td style="padding: 16px 8px 8px 8px; text-align: right; font-weight: bold; border-top: 1px solid black; border-bottom: 1px solid black;">${formatAmount(
                  totalAssets.value,
                )}</td>
              </tr>
            </table>
          </td>

          <!-- Liabilities & Equities Column -->
          <td style="width: 50%; vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td colspan="2" style="padding: 8px; font-weight: bold; text-decoration: underline;">Liabilities & Equities</td>
              </tr>

              <!-- Liabilities -->
              <tr>
                <td colspan="2" style="padding: 8px; font-weight: bold; text-decoration: underline;">Liabilities</td>
              </tr>

              <!-- Fixed Liabilities -->
              <tr>
                <td colspan="2" style="padding: 4px 8px 4px 16px; font-weight: bold; font-style: italic; text-decoration: underline;">Fixed Liabilities</td>
              </tr>
              ${
                fixedLiabilities.value
                  .map(
                    (item) => `
                <tr>
                  <td style="padding: 4px 8px 4px 32px;">${
                    item.AccountName
                  }</td>
                  <td style="padding: 4px 8px; text-align: right;">${formatAmount(
                    item.Amount,
                  )}</td>
                </tr>
              `,
                  )
                  .join("") ||
                '<tr><td style="padding: 4px 8px 4px 32px;">-</td><td style="padding: 4px 8px; text-align: right;">-</td></tr>'
              }

              <!-- Current Liabilities -->
              <tr>
                <td colspan="2" style="padding: 8px 8px 4px 16px; font-weight: bold; font-style: italic; text-decoration: underline;">Current Liabilities</td>
              </tr>
              ${
                currentLiabilities.value
                  .map(
                    (item) => `
                <tr>
                  <td style="padding: 4px 8px 4px 32px;">${
                    item.AccountName
                  }</td>
                  <td style="padding: 4px 8px; text-align: right;">${formatAmount(
                    item.Amount,
                  )}</td>
                </tr>
              `,
                  )
                  .join("") ||
                '<tr><td style="padding: 4px 8px 4px 32px;">-</td><td style="padding: 4px 8px; text-align: right;">-</td></tr>'
              }
              <tr>
                <td style="padding: 4px 8px 4px 16px; font-style: italic; font-weight: 600;">Total of Current Liabilities</td>
                <td style="padding: 4px 8px; text-align: right; border-top: 1px solid black;">${formatAmount(
                  currentLiabilitiesTotal.value,
                )}</td>
              </tr>

              <!-- Total Liabilities -->
              <tr>
                <td style="padding: 4px 8px; font-style: italic; font-weight: 600;">Total of Liabilities</td>
                <td style="padding: 4px 8px; text-align: right; border-top: 1px solid black;">${formatAmount(
                  totalLiabilities.value,
                )}</td>
              </tr>

              <!-- Equity -->
              <tr>
                <td colspan="2" style="padding: 8px; font-weight: bold; text-decoration: underline;">Equity</td>
              </tr>
              ${
                equity.value
                  .map(
                    (item) => `
                <tr>
                  <td style="padding: 4px 8px 4px 32px;">${
                    item.AccountName
                  }</td>
                  <td style="padding: 4px 8px; text-align: right;">${formatAmount(
                    item.Amount,
                  )}</td>
                </tr>
              `,
                  )
                  .join("") ||
                '<tr><td style="padding: 4px 8px 4px 32px;">-</td><td style="padding: 4px 8px; text-align: right;">-</td></tr>'
              }
              ${retainedEarnings.value
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 4px 8px 4px 32px;">${
                    item.Description
                  }</td>
                  <td style="padding: 4px 8px; text-align: right;">${formatAmount(
                    item.TotalAmount,
                  )}</td>
                </tr>
              `,
                )
                .join("")}
              <tr>
                <td style="padding: 4px 8px 4px 16px; font-style: italic; font-weight: 600;">Total of Equity</td>
                <td style="padding: 4px 8px; text-align: right; border-top: 1px solid black;">${formatAmount(
                  totalEquity.value,
                )}</td>
              </tr>

              <!-- Total Liabilities + Equity -->
              <tr>
                <td style="padding: 16px 8px 8px 8px; font-weight: bold;">TOTAL OF LIABILITIES + EQUITY</td>
                <td style="padding: 16px 8px 8px 8px; text-align: right; font-weight: bold; border-top: 1px solid black; border-bottom: 1px solid black;">${formatAmount(
                  totalLiabilitiesEquity.value,
                )}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  printJS({
    printable: printContent,
    type: "raw-html",
    style: `
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      body {
        font-family: Arial, sans-serif;
      }
      table {
        page-break-inside: avoid;
      }
    `,
  });
};
</script>

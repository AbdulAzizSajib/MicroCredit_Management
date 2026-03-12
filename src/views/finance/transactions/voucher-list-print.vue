<template>
  <MainLayout>
    <div
      v-for="(data, index) in reportData"
      :key="index"
      :id="`voucher-${index}`"
    >
      <div class="flex justify-end items-end no-print">
        <a-button
          type="primary"
          class="bg-green-600 text-white px-6"
          @click="printSingle(index)"
        >
          Print This
        </a-button>
      </div>

      <h2 class="font-normal text-base uppercase mb-1 text-center">
        {{
          data?.at(0)?.JvCat === "P"
            ? "Payment Voucher"
            : data?.at(0)?.JvCat === "R"
            ? "Receipt Voucher"
            : data?.at(0)?.JvCat === "J"
            ? "Journal Voucher"
            : ""
        }}
      </h2>

      <h3 class="font-semibold text-base capitalize mb-3 text-center">
        P-ERP Food and Snacks
      </h3>

      <div>
        <h4 class="uppercase mb-0 font-normal">
          Voucher No: <span class="font-semibold">{{ data?.at(0)?.JvNo }}</span>
        </h4>

        <div class="overflow-x-auto">
          <table
            class="border border-gray-400 border-collapse w-full text-left"
          >
            <thead>
              <tr>
                <th
                  class="border border-gray-400 w-4 whitespace-nowrap px-3 py-1 text-sm font-normal"
                >
                  DATE:
                  <span class="font-semibold">{{ data?.at(0)?.Period }}</span>
                </th>
                <th class="border border-gray-400"></th>
                <th class="border border-gray-400"></th>
                <th class="border border-gray-400"></th>
                <th class="border border-gray-400"></th>
                <th class="border border-gray-400"></th>
              </tr>
              <tr class="text-center">
                <th
                  class="uppercase w-2 border border-gray-400 px-3 py-1 text-sm font-normal"
                >
                  Account Code
                </th>
                <th
                  class="uppercase w-2 border border-gray-400 px-3 py-1 text-sm font-normal"
                >
                  Account Name
                </th>
                <th
                  class="uppercase w-2 border border-gray-400 px-3 py-1 text-sm font-normal"
                >
                  Narration
                </th>
                <th
                  class="uppercase w-2 border border-gray-400 px-3 py-1 text-sm font-normal"
                >
                  SUB Ledger
                </th>
                <th
                  class="uppercase w-2 border border-gray-400 px-3 py-1 text-sm font-normal debit-credit-label"
                >
                  DEBIT-TAKA
                </th>
                <th
                  class="uppercase w-2 border border-gray-400 px-3 py-1 text-sm font-normal debit-credit-label"
                >
                  CREDIT-TAKA
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="report_Loading">
                <td colspan="5"><a-skeleton /></td>
              </tr>
              <tr v-if="!report_Loading && !data?.length">
                <td colspan="5"><a-empty /></td>
              </tr>

              <tr v-for="item in data">
                <td class="capitalize border border-gray-400 px-3 py-1 text-sm">
                  {{ item?.AMCode || "-" }}
                </td>
                <td class="capitalize border border-gray-400 px-3 py-1 text-sm">
                  {{ item?.AMDetails || "-" }}
                </td>
                <td class="capitalize border border-gray-400 px-3 py-1 text-sm">
                  {{ item?.Narration || "-" }}
                </td>
                <td class="capitalize border border-gray-400 px-3 py-1 text-sm">
                  {{ item?.AsCode === "0" ? "-" : item?.AsCode }}
                </td>
                <!-- <td class="capitalize border border-gray-400 px-3 py-1 text-sm">
                  -
                </td> -->
                <td
                  class="capitalize border border-gray-400 px-3 py-1 text-sm text-right debit-credit-value"
                >
                  {{ formatNumber(item?.Debit || 0) }}
                </td>
                <td
                  class="capitalize border border-gray-400 px-3 py-1 text-sm text-right debit-credit-value"
                >
                  {{ formatNumber(item?.Credit || 0) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="">
                <td
                  class="capitalize border border-t-2 border-gray-400 border-t-gray-600 px-3 py-1 text-sm"
                ></td>
                <td
                  colspan="3"
                  class="capitalize border border-t-2 border-gray-400 border-t-gray-600 px-3 py-1 text-sm text-right"
                >
                  TOTAL ===>
                </td>
                <td
                  class="capitalize border border-t-2 border-gray-400 border-t-gray-600 px-3 py-1 text-sm text-right font-semibold debit-credit-value"
                >
                  {{ calculateTotal(data, "Debit") }}
                </td>
                <td
                  class="capitalize border border-t-2 border-gray-400 border-t-gray-600 px-3 py-1 text-sm text-right font-semibold debit-credit-value"
                >
                  {{ calculateTotal(data, "Credit") }}
                </td>
              </tr>
              <tr>
                <td
                  colspan="6"
                  class="capitalize border border-gray-400 px-3 py-1 text-sm font-semibold"
                >
                  {{ numberToTakaWords(calculateTotal(data, "Debit")) }}
                </td>
              </tr>
              <tr>
                <td
                  colspan="6"
                  class="border border-gray-400 px-3 py-1 text-xs"
                >
                  <!-- {{ data[0]?.Narration }} -->
                  {{ "-" }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="flex justify-between items-start mt-28">
          <div class="text-sm">
            Prepared <br />
            By
          </div>
          <div class="text-sm">
            Check <br />
            By
          </div>
          <div class="text-sm">
            Authorised <br />
            By
          </div>
          <div class="text-sm">
            Posted <br />
            By
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import axios from "axios";
import { ref } from "vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { onMounted } from "vue";
import { debounce } from "lodash";
import { LoadingOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import printJS from "print-js";
import { useRoute } from "vue-router";

const route = useRoute();
const period = ref(route.query.Period);
const siteCode = ref(route.query.SiteCode);
const Type = ref(route.query.Type);
const Category = ref(route.query.Category);
const VoucherFrom = ref(route.query.VoucherFrom);
const VoucherTo = ref(route.query.VoucherTo);

const voucher_idwise = async () => {
  try {
    const res = await axios.post(
      `${apiBase}/journal-master/voucher-print`,
      {
        SiteCode: siteCode.value,
        Period: period.value,
        Type: Type.value,
        Category: Category.value,
        VoucherFrom: VoucherFrom.value,
        VoucherTo: VoucherTo.value,
      },
      getToken()
    );
    if (res?.data) {
      reportData.value = res?.data;
    }
  } catch (error) {
    console.error("Error fetching voucher:", error);
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

function formatNumber(num) {
  if (isNaN(num)) return num;
  return Number(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const codeData = ref([]);

const code_loading = ref(false);

const report_Loading = ref(false);

onMounted(async () => {
  await voucher_idwise();
});

// Table Data
const formData = ref({
  SiteCode: "01",
  Period: dayjs(),
  Type: "",
  Category: "",
  VoucherFrom: "",
  VoucherTo: "",
});
const reportData = ref([]);

const getReport = async () => {
  if (!formData.value.Type) {
    return showNotification("warning", "please select code");
  }
  if (!formData.value.Category) {
    return showNotification("warning", "please select Category");
  }
  if (!formData.value.VoucherFrom) {
    return showNotification("warning", "please input Vouchar From");
  }
  if (!formData.value.VoucherTo) {
    return showNotification("warning", "please input Vouchar To");
  }
  if (!formData.value.Period) {
    return showNotification("warning", "please input Period (month)");
  }

  const date = new Date(formData.value.Period);
  const formattedPeriod = `${date.getFullYear()}${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;

  const data = {
    ...formData.value,
    Period: formattedPeriod,
  };
  report_Loading.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/journal-master/report`,
      data,
      getToken()
    );
    report_Loading.value = false;
    reportData.value = res?.data;
  } catch (err) {
    report_Loading.value = false;
    reportData.value = [];
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const calculateTotal = (tableData, field) => {
  if (!Array.isArray(tableData)) return "0.00";
  return tableData
    .reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0)
    .toFixed(2);
};
function numberToTakaWords(num) {
  num = parseInt(num);
  if (isNaN(num)) return "";
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function inWords(n) {
    if ((n = n.toString()).length > 9) return "Overflow";
    let nStr = ("000000000" + n).substr(-9);
    let crore = parseInt(nStr.substr(0, 2));
    let lakh = parseInt(nStr.substr(2, 2));
    let thousand = parseInt(nStr.substr(4, 2));
    let hundred = parseInt(nStr.substr(6, 1));
    let tens = parseInt(nStr.substr(7, 2));
    let str = "";

    if (crore) str += (a[crore] || b[crore]) + " Crore ";
    if (lakh) str += (a[lakh] || b[lakh]) + " Lakh ";
    if (thousand) str += (a[thousand] || b[thousand]) + " Thousand ";
    if (hundred) str += a[hundred] + " Hundred ";
    if (tens) {
      if (tens < 20) str += a[tens] + " ";
      else str += b[Math.floor(tens / 10)] + " " + a[tens % 10] + " ";
    }
    return str.trim();
  }

  return `Taka ${inWords(num)} Only`;
}

const printSingle = (index) => {
  const voucher = document.getElementById(`voucher-${index}`);
  printJS({
    printable: voucher.outerHTML,
    type: "raw-html",
    style: `
  @page {
    size: A4;
    margin: 10mm;
  }
  .no-print {
    display: none !important;
  }
  .voucher-page {
    page-break-after: always !important;
    page-break-inside: avoid !important;
    margin-bottom: 20px;
  }
  body {
    font-family: Arial, sans-serif;
    font-size: 11px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 4px;
    text-align: left;
  }
  thead tr:first-child th {
    border: 1px solid #999 !important;
  }
  thead tr:nth-child(2) th {
    text-align: center !important;
    border: 1px solid #999 !important;
  }
  th.debit-credit-label{
    text-align: center !important;
    }
  td.debit-credit-value{
    text-align: right !important;
    }
  h2, h3 {
    text-align: center;
    margin: 4px 0;
  }
  .flex {
    display: flex;
  }
  .justify-between {
    justify-content: space-between;
  }
  .items-start {
    align-items: flex-start;
  }
  .mt-28 {
    margin-top: 125px;
  }
`,
  });
};
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}

@media print {
  .no-print {
    display: none !important;
  }
  .voucher-page {
    margin-top: 10mm;
    page-break-after: always;
    page-break-inside: avoid;
  }
}
</style>

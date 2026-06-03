<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="w-full sm:w-48">
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Plant <span class="text-red-500">*</span>
          </label>
          <a-select
            v-model:value="selectedPlant"
            class="w-full"
            placeholder="Select Plant"
            show-search
            allow-clear
            :filter-option="filterOption"
            option-filter-prop="label"
            :loading="plantLoading"
          >
            <a-select-option
              v-for="p in plants"
              :key="p.PlantCode"
              :value="p.PlantCode"
              :label="`${p.PlantCode} ${p.PlantName}`"
            >
              {{ p.PlantCode }} — {{ p.PlantName }}
            </a-select-option>
          </a-select>
        </div>
        <div class="w-full sm:w-48">
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Business <span class="text-red-500">*</span>
          </label>
          <a-select
            v-model:value="selectedBusiness"
            class="w-full"
            placeholder="Select Business"
            show-search
            allow-clear
            :filter-option="filterOption"
            option-filter-prop="label"
            :loading="businessLoading"
          >
            <a-select-option
              v-for="b in businesses"
              :key="b.Business"
              :value="b.Business"
              :label="`${b.Business} ${b.BusinessName}`"
            >
              {{ b.Business }} — {{ b.BusinessName }}
            </a-select-option>
          </a-select>
        </div>
        <button
          class="bg-primary text-white px-5 py-1.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
          :disabled="loading"
          @click="onGo"
        >
          <Icon v-if="loading" icon="line-md:loading-loop" class="size-4" />
          GO
        </button>
        <div class="flex gap-2 sm:ml-2">
          <button
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium disabled:opacity-50"
            :disabled="!filtered.length"
            @click="exportCSV"
          >
            CSV
          </button>
          <button
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium disabled:opacity-50"
            :disabled="!filtered.length"
            @click="exportPDF"
          >
            PDF
          </button>
        </div>
        <div class="flex items-center gap-2 sm:ml-auto">
          <label class="text-sm text-gray-600 whitespace-nowrap">Search:</label>
          <a-input v-model:value="search" class="w-48" allow-clear placeholder="Code or Name" />
        </div>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex items-center gap-3 mb-4" data-aos="fade-right">
      Current Stock Report ({{ filtered.length }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <div class="hidden print:block mb-3">
        <h2 class="text-lg font-bold">Current Stock Report</h2>
        <p class="text-xs">
          Plant: {{ selectedPlant || "-" }} | Business: {{ selectedBusiness || "-" }} |
          Generated: {{ generatedAt }}
        </p>
      </div>
      <table class="w-full min-w-[900px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2 w-12">S/L</th>
            <th
              class="border border-white px-4 py-2 cursor-pointer select-none"
              @click="sortBy('ProductCode')"
            >
              Product Code {{ sortIcon("ProductCode") }}
            </th>
            <th
              class="border border-white px-4 py-2 cursor-pointer select-none"
              @click="sortBy('ProductName')"
            >
              Product Name {{ sortIcon("ProductName") }}
            </th>
            <th
              class="border border-white px-4 py-2 text-right cursor-pointer select-none"
              @click="sortBy('NotRelease')"
            >
              Not Release QTY {{ sortIcon("NotRelease") }}
            </th>
            <th
              class="border border-white px-4 py-2 text-right cursor-pointer select-none"
              @click="sortBy('SB_Balance')"
            >
              SB Balance {{ sortIcon("SB_Balance") }}
            </th>
            <th
              class="border border-white px-4 py-2 text-right cursor-pointer select-none"
              @click="sortBy('NotRelease_SBBalance')"
            >
              (Not Release + SB Balance) QTY {{ sortIcon("NotRelease_SBBalance") }}
            </th>
            <th
              class="border border-white px-4 py-2 text-right cursor-pointer select-none"
              @click="sortBy('TradePrice')"
            >
              Trade Price {{ sortIcon("TradePrice") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filtered" :key="row.ProductCode" class="hover:bg-gray-50">
            <td class="px-4 border">{{ i + 1 }}</td>
            <td class="px-4 border font-medium text-primary">{{ row.ProductCode }}</td>
            <td class="px-4 border">{{ row.ProductName }}</td>
            <td class="px-4 border text-right">{{ formatNumber(row.NotRelease) }}</td>
            <td class="px-4 border text-right">{{ formatNumber(row.SB_Balance) }}</td>
            <td class="px-4 border text-right">{{ formatNumber(row.NotRelease_SBBalance) }}</td>
            <td class="px-4 border text-right">{{ formatMoney(row.TradePrice) }}</td>
          </tr>
          <tr v-if="filtered.length" class="bg-gray-50 font-semibold">
            <td class="px-4 border text-right" colspan="3">Total</td>
            <td class="px-4 border text-right">{{ formatNumber(totals.NotRelease) }}</td>
            <td class="px-4 border text-right">{{ formatNumber(totals.SB_Balance) }}</td>
            <td class="px-4 border text-right">{{ formatNumber(totals.NotRelease_SBBalance) }}</td>
            <td class="px-4 border"></td>
          </tr>
          <tr v-if="!filtered.length && !loading">
            <td colspan="7" class="px-4 py-6 border text-center text-gray-400">
              No data found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { fetchAllPlants } from "./plants-api";
import { fetchAllBusinesses } from "./business-api";

const selectedPlant = ref(undefined);
const selectedBusiness = ref(undefined);
const search = ref("");
const sortKey = ref("");
const sortOrder = ref(1);
const loading = ref(false);

const plants = ref([]);
const businesses = ref([]);
const plantLoading = ref(false);
const businessLoading = ref(false);

const tableData = ref([]);
const generatedAt = ref("");

const filterOption = (input, option) => {
  const text = (option?.label ?? "").toString().toLowerCase();
  return text.includes(input.toLowerCase());
};

const toNum = (val) => {
  if (val == null || val === "") return 0;
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
};

const formatNumber = (val) => {
  if (val == null || val === "") return "0.00";
  return toNum(val).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
};

const formatMoney = (val) => {
  if (val == null || val === "") return "0.00";
  return toNum(val).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
};

const onGo = () => {
  if (!selectedPlant.value) {
    showNotification("error", "Please select a Plant");
    return;
  }
  if (!selectedBusiness.value) {
    showNotification("error", "Please select a Business");
    return;
  }
  fetchData();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      PlantCode: selectedPlant.value || "",
      Business: selectedBusiness.value || "",
    }).toString();
    const res = await axios.get(
      `${apiBase}/inventory/stock/current?${params}`,
      getToken(),
    );
    const payload = res?.data?.data ?? res?.data;
    tableData.value = Array.isArray(payload) ? payload : (payload?.data ?? []);
    generatedAt.value = dayjs().format("YYYY-MM-DD HH:mm");
    if (!tableData.value.length) {
      showNotification("info", "No stock records for this selection.");
    }
  } catch (e) {
    tableData.value = [];
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    loading.value = false;
  }
};

const sortBy = (key) => {
  if (sortKey.value === key) sortOrder.value *= -1;
  else {
    sortKey.value = key;
    sortOrder.value = 1;
  }
};

const sortIcon = (key) => {
  if (sortKey.value !== key) return "⇅";
  return sortOrder.value === 1 ? "▲" : "▼";
};

const NUMERIC_KEYS = ["NotRelease", "SB_Balance", "NotRelease_SBBalance", "TradePrice"];

const filtered = computed(() => {
  let data = tableData.value;
  if (search.value) {
    const s = search.value.toLowerCase();
    data = data.filter(
      (r) =>
        r.ProductCode?.toLowerCase().includes(s) ||
        r.ProductName?.toLowerCase().includes(s),
    );
  }
  if (sortKey.value) {
    const numeric = NUMERIC_KEYS.includes(sortKey.value);
    data = [...data].sort((a, b) => {
      const av = numeric ? toNum(a[sortKey.value]) : (a[sortKey.value] ?? "");
      const bv = numeric ? toNum(b[sortKey.value]) : (b[sortKey.value] ?? "");
      if (av === bv) return 0;
      return av > bv ? sortOrder.value : -sortOrder.value;
    });
  }
  return data;
});

const totals = computed(() => {
  return filtered.value.reduce(
    (acc, r) => {
      acc.NotRelease += toNum(r.NotRelease);
      acc.SB_Balance += toNum(r.SB_Balance);
      acc.NotRelease_SBBalance += toNum(r.NotRelease_SBBalance);
      return acc;
    },
    { NotRelease: 0, SB_Balance: 0, NotRelease_SBBalance: 0 },
  );
});

const csvEscape = (val) => {
  if (val == null) return "";
  const s = String(val);
  return /["\n,]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const exportCSV = () => {
  if (!filtered.value.length) return;
  const headers = [
    "S/L",
    "Product Code",
    "Product Name",
    "Not Release QTY",
    "SB Balance",
    "(Not Release + SB Balance) QTY",
    "Trade Price",
  ];
  const rows = filtered.value.map((r, i) => [
    i + 1,
    r.ProductCode,
    r.ProductName,
    r.NotRelease,
    r.SB_Balance,
    r.NotRelease_SBBalance,
    r.TradePrice,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `current-stock-${selectedPlant.value || "all"}-${selectedBusiness.value || "all"}-${dayjs().format("YYYYMMDD-HHmm")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const escHtml = (val) => {
  if (val == null) return "";
  return String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

const exportPDF = () => {
  if (!filtered.value.length) return;
  const win = window.open("", "_blank");
  if (!win) {
    showNotification("error", "Popup blocked. Please allow popups to export PDF.");
    return;
  }
  const bodyRows = filtered.value
    .map(
      (r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escHtml(r.ProductCode)}</td>
        <td>${escHtml(r.ProductName)}</td>
        <td class="r">${formatNumber(r.NotRelease)}</td>
        <td class="r">${formatNumber(r.SB_Balance)}</td>
        <td class="r">${formatNumber(r.NotRelease_SBBalance)}</td>
        <td class="r">${formatMoney(r.TradePrice)}</td>
      </tr>`,
    )
    .join("");
  const totalRow = `
    <tr class="total">
      <td colspan="3" class="r">Total</td>
      <td class="r">${formatNumber(totals.value.NotRelease)}</td>
      <td class="r">${formatNumber(totals.value.SB_Balance)}</td>
      <td class="r">${formatNumber(totals.value.NotRelease_SBBalance)}</td>
      <td></td>
    </tr>`;
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Current Stock Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h2 { margin: 0 0 8px 0; }
    p.meta { margin: 0 0 12px 0; font-size: 12px; color: #444; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th, td { padding: 4px 6px; border: 1px solid #ccc; text-align: left; }
    th { background: #1e40af; color: #fff; }
    td.r, th.r { text-align: right; }
    tr.total { background: #f3f4f6; font-weight: bold; }
  </style>
</head>
<body>
  <h2>Current Stock Report</h2>
  <p class="meta">
    Plant: ${escHtml(selectedPlant.value || "-")} |
    Business: ${escHtml(selectedBusiness.value || "-")} |
    Generated: ${escHtml(generatedAt.value || dayjs().format("YYYY-MM-DD HH:mm"))} |
    Records: ${filtered.value.length}
  </p>
  <table>
    <thead>
      <tr>
        <th style="width:32px;">S/L</th>
        <th>Product Code</th>
        <th>Product Name</th>
        <th class="r">Not Release QTY</th>
        <th class="r">SB Balance</th>
        <th class="r">(Not Release + SB Balance) QTY</th>
        <th class="r">Trade Price</th>
      </tr>
    </thead>
    <tbody>${bodyRows}${totalRow}</tbody>
  </table>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  win.location.href = url;
  win.onload = () => {
    win.focus();
    win.print();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
};

onMounted(async () => {
  plantLoading.value = true;
  businessLoading.value = true;
  try {
    const [allPlants, allBusinesses] = await Promise.all([
      fetchAllPlants(),
      fetchAllBusinesses(),
    ]);
    plants.value = allPlants;
    businesses.value = allBusinesses;
  } finally {
    plantLoading.value = false;
    businessLoading.value = false;
  }
});
</script>

<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h1 class="text-2xl font-bold text-primary flex items-center gap-3">
        Edit Sales — {{ IssueNo }}
        <Icon v-if="isLoading" class="size-7" icon="line-md:loading-loop" />
      </h1>
      <button
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        @click="$router.push('/inventory/sales')"
      >
        Back to List
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
      <!-- Left: Items (read-only) -->
      <div class="lg:col-span-2 border rounded-lg p-5 space-y-4" data-aos="fade-up" data-aos-delay="100">
        <h2 class="font-bold text-gray-800">Sales Details (read-only)</h2>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px] border border-collapse text-sm">
            <thead>
              <tr class="bg-primary text-white text-xs">
                <th class="border border-white px-2 py-2 text-left w-10">S/L</th>
                <th class="border border-white px-2 py-2 text-left">Product</th>
                <th class="border border-white px-2 py-2 text-left w-28">Batch No</th>
                <th class="border border-white px-2 py-2 text-right w-24">Qty</th>
                <th class="border border-white px-2 py-2 text-right w-24">TP</th>
                <th class="border border-white px-2 py-2 text-right w-24">VAT</th>
                <th class="border border-white px-2 py-2 text-right w-28">Net</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in items" :key="idx">
                <td class="border px-2 py-1">{{ idx + 1 }}</td>
                <td class="border px-2 py-1">
                  <div class="text-xs font-medium">{{ it.ProductCode }}</div>
                  <div class="text-xs text-gray-500">{{ it.ProductName || "" }}</div>
                </td>
                <td class="border px-2 py-1 text-xs">{{ it.BatchNo || "—" }}</td>
                <td class="border px-2 py-1 text-right">{{ it.Quantity }}</td>
                <td class="border px-2 py-1 text-right">{{ formatMoney(it.TP) }}</td>
                <td class="border px-2 py-1 text-right">{{ formatMoney(it.Vat) }}</td>
                <td class="border px-2 py-1 text-right">{{ formatMoney(it.Net) }}</td>
              </tr>
              <tr v-if="!items.length">
                <td colspan="7" class="px-3 py-4 border text-center text-gray-400 text-xs">
                  No items.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            class="bg-primary text-white px-5 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-60"
            :disabled="isSaving"
            @click="save"
            type="button"
          >
            {{ isSaving ? "Updating..." : "Update Sales" }}
          </button>
          <button
            class="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition-colors"
            @click="$router.push('/inventory/sales')"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Right: Master form -->
      <div class="border rounded-lg p-5 space-y-3" data-aos="fade-up" data-aos-delay="150">
        <h2 class="font-bold text-gray-800">Sales Information</h2>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Plant</label>
          <div class="col-span-3">
            <a-input :value="form.PlantCode" disabled />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Business</label>
          <div class="col-span-3">
            <a-input :value="form.Business" disabled />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Movement</label>
          <div class="col-span-3">
            <a-input :value="form.MovementId" disabled />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Customer <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-select
              class="w-full"
              placeholder="Select Customer"
              v-model:value="form.CustomerCode"
              show-search
              :filter-option="filterOption"
              option-filter-prop="label"
              :loading="customerLoading"
            >
              <a-select-option
                v-for="c in customers"
                :key="c.CustomerCode"
                :value="c.CustomerCode"
                :label="`${c.CustomerCode} ${c.CustomerName || ''}`"
              >
                {{ c.CustomerCode }}<span v-if="c.CustomerName"> — {{ c.CustomerName }}</span>
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Issue Date</label>
          <div class="col-span-3">
            <a-input :value="form.IssueDate" disabled />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Order No</label>
          <div class="col-span-3">
            <a-input placeholder="Order No" v-model:value="form.OrderNo" :maxlength="50" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Vehicle No</label>
          <div class="col-span-3">
            <a-input placeholder="Vehicle No" v-model:value="form.VehicleNo" :maxlength="50" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">VAT Challan No</label>
          <div class="col-span-3">
            <a-input
              placeholder="VAT Challan No"
              v-model:value="form.VatChallanNo"
              :maxlength="50"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">VAT Challan Date</label>
          <div class="col-span-3">
            <a-date-picker
              class="w-full"
              v-model:value="form.VatChallanDate"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import dayjs from "dayjs";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { fetchCustomers } from "./customer-api";

const route = useRoute();
const router = useRouter();

const IssueNo = computed(() => route.query.IssueNo || "");

const currentUser =
  JSON.parse(localStorage.getItem("user_info") || "null")?.UserId || "admin";

const customers = ref([]);
const customerLoading = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);

const filterOption = (input, option) => {
  const text = (option?.label ?? "").toString().toLowerCase();
  return text.includes(input.toLowerCase());
};

const form = ref({
  PlantCode: "",
  Business: "",
  MovementId: "",
  CustomerCode: undefined,
  IssueDate: "",
  OrderNo: "",
  VehicleNo: "",
  VatChallanNo: "",
  VatChallanDate: "",
  EditBy: currentUser,
});

const items = ref([]);

const formatMoney = (val) => {
  if (val == null || val === "") return "—";
  return Number(val).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const loadCustomers = async () => {
  if (!form.value.PlantCode || !form.value.Business) return;
  customerLoading.value = true;
  try {
    customers.value = await fetchCustomers(form.value.PlantCode, form.value.Business);
  } catch {
    customers.value = [];
  } finally {
    customerLoading.value = false;
  }
};

const fetchDetail = async () => {
  if (!IssueNo.value) {
    showNotification("error", "Missing IssueNo in URL");
    router.push("/inventory/sales");
    return;
  }
  isLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/sales/show?IssueNo=${encodeURIComponent(IssueNo.value)}`,
      getToken(),
    );
    const payload = res?.data?.data ?? res?.data;
    if (!payload) {
      showNotification("error", "Sales entry not found");
      router.push("/inventory/sales");
      return;
    }
    const master = payload.master ?? payload;
    const rawItems = payload.details ?? payload.Items ?? payload.items ?? [];
    form.value = {
      PlantCode: master.PlantCode || "",
      Business: master.Business || "",
      MovementId: master.MovementId || "",
      CustomerCode: master.CustomerCode || undefined,
      IssueDate: master.IssueDate ? dayjs(master.IssueDate).format("YYYY-MM-DD") : "",
      OrderNo: master.OrderNo || "",
      VehicleNo: master.VehicleNo || "",
      VatChallanNo: master.VatChallanNo || "",
      VatChallanDate: master.VatChallanDate
        ? dayjs(master.VatChallanDate).format("YYYY-MM-DD")
        : "",
      EditBy: currentUser,
    };
    items.value = rawItems.map((i) => ({
      ProductCode: i.ProductCode,
      ProductName: i.ProductName || "",
      BatchNo: i.BatchNo || "",
      Quantity: i.Quantity ?? 0,
      TP: i.TP ?? 0,
      Vat: i.Vat ?? 0,
      Net: i.Net ?? 0,
    }));
    await loadCustomers();
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isLoading.value = false;
  }
};

const validate = () => {
  if (!form.value.CustomerCode) return "Please select Customer";
  return null;
};

const save = async () => {
  const err = validate();
  if (err) {
    showNotification("error", err);
    return;
  }
  isSaving.value = true;
  try {
    const payload = {
      CustomerCode: form.value.CustomerCode,
      OrderNo: form.value.OrderNo || "",
      VehicleNo: form.value.VehicleNo || "",
      VatChallanNo: form.value.VatChallanNo || "",
      VatChallanDate: form.value.VatChallanDate || "",
      EditBy: form.value.EditBy,
    };
    const res = await axios.put(
      `${apiBase}/inventory/sales?IssueNo=${encodeURIComponent(IssueNo.value)}`,
      payload,
      getToken(),
    );
    if (res?.data?.success !== false) {
      showNotification("success", res?.data?.message || "Sales updated");
      router.push("/inventory/sales");
    } else {
      showNotification("error", res?.data?.message || "Failed to update");
    }
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchDetail();
});
</script>

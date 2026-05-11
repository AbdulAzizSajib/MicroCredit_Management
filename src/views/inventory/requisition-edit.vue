<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-primary flex items-center gap-3">
        Edit Requisition — {{ RequisitionNo }}
        <Icon v-if="isLoading" class="size-7" icon="line-md:loading-loop" />
      </h1>
      <button
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        @click="$router.push('/inventory/requisition')"
      >
        Back to List
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
      <!-- Left: Items -->
      <div class="lg:col-span-2 border rounded-lg p-5 space-y-4">
        <h2 class="font-bold text-gray-800">Product Information</h2>

        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-5">
            <label class="text-sm font-medium text-gray-700 block mb-1">
              Product <span class="text-red-500">*</span>
            </label>
            <a-select
              show-search
              class="w-full"
              placeholder="Search product code or name..."
              v-model:value="itemForm.ProductCode"
              :filter-option="false"
              :loading="productSearching"
              :not-found-content="productSearching ? 'Searching...' : 'No product found'"
              @search="onProductSearch"
              @dropdown-visible-change="onProductDropdownOpen"
            >
              <a-select-option
                v-for="p in productOptions"
                :key="p.ProductCode"
                :value="p.ProductCode"
                :label="`${p.ProductCode} ${p.ProductName}`"
              >
                {{ p.ProductCode }} — {{ p.ProductName }}
              </a-select-option>
            </a-select>
          </div>
          <div class="col-span-3">
            <label class="text-sm font-medium text-gray-700 block mb-1">
              Qty <span class="text-red-500">*</span>
            </label>
            <a-input-number
              class="w-full"
              placeholder="Qty"
              v-model:value="itemForm.Quantity"
              :min="1"
              :precision="0"
            />
          </div>
          <div class="col-span-3">
            <label class="text-sm font-medium text-gray-700 block mb-1">
              Remark
            </label>
            <a-input placeholder="Remark" v-model:value="itemForm.Remark" />
          </div>
          <div class="col-span-1">
            <button
              class="w-full bg-primary text-white px-4 py-2 rounded font-bold hover:opacity-90 transition-opacity"
              @click="addItem"
              type="button"
            >
              +
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border border-collapse text-sm">
            <thead>
              <tr class="bg-primary text-white">
                <th class="border border-white px-3 py-2 text-left w-16">S/L</th>
                <th class="border border-white px-3 py-2 text-left">Product</th>
                <th class="border border-white px-3 py-2 text-center w-24">Qty</th>
                <th class="border border-white px-3 py-2 text-left">Remark</th>
                <th class="border border-white px-3 py-2 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in items" :key="idx">
                <td class="border px-3 py-2">{{ idx + 1 }}</td>
                <td class="border px-3 py-2">
                  {{ it.ProductCode }} — {{ productName(it.ProductCode) }}
                </td>
                <td class="border px-3 py-2 text-right">{{ it.Quantity }}</td>
                <td class="border px-3 py-2">{{ it.Remark || "-" }}</td>
                <td class="border px-3 py-2 text-center">
                  <button
                    type="button"
                    class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark"
                    @click="removeItem(idx)"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!items.length">
                <td colspan="5" class="px-3 py-4 border text-center text-gray-400 text-xs">
                  No items added.
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
            {{ isSaving ? "Updating..." : "Update" }}
          </button>
          <button
            class="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition-colors"
            @click="$router.push('/inventory/requisition')"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Right: Master form -->
      <div class="border rounded-lg p-5 space-y-3">
        <h2 class="font-bold text-gray-800">Other Information</h2>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Plant</label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.PlantCode" disabled>
              <a-select-option
                v-for="p in plants"
                :key="p.PlantCode"
                :value="p.PlantCode"
              >
                {{ p.PlantCode }} — {{ p.PlantName }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Business <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-select
              class="w-full"
              placeholder="Select Business"
              v-model:value="form.Business"
              show-search
              :filter-option="filterOption"
              option-filter-prop="label"
              :loading="businessLoading"
              @change="onBusinessChange"
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
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Customer <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-select
              class="w-full"
              :placeholder="form.Business ? 'Select Customer' : 'Select Business first'"
              v-model:value="form.CustomerCode"
              show-search
              :filter-option="filterOption"
              option-filter-prop="label"
              :loading="customerLoading"
              :disabled="!form.PlantCode || !form.Business"
            >
              <a-select-option
                v-for="c in customers"
                :key="c.CustomerCode"
                :value="c.CustomerCode"
                :label="`${c.CustomerCode} ${c.CustomerName}`"
              >
                {{ c.CustomerCode }} — {{ c.CustomerName }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Delivery Date <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-date-picker
              class="w-full"
              v-model:value="form.DeliveryDate"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Sales Type</label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.SalesType">
              <a-select-option v-for="s in SALES_TYPES" :key="s" :value="s">{{ s }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Invoice Type</label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.InvoiceType">
              <a-select-option v-for="i in INVOICE_TYPES" :key="i" :value="i">{{ i }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">STI Courier</label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.IsSTIProductCourier">
              <a-select-option v-for="o in YN" :key="o.value" :value="o.value">{{ o.label }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Auto Receive</label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.AutoReceive">
              <a-select-option v-for="o in YN" :key="o.value" :value="o.value">{{ o.label }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Approve User</label>
          <div class="col-span-3">
            <a-input placeholder="Approver username" v-model:value="form.ApproveUser" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-start">
          <label class="text-sm font-medium text-gray-700 mt-2">Notes</label>
          <div class="col-span-3">
            <a-textarea placeholder="Notes" v-model:value="form.Notes" :rows="3" />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { SALES_TYPES, INVOICE_TYPES, YN } from "./_static";
import { fetchAllPlants } from "./plants-api";
import { fetchAllBusinesses } from "./business-api";
import { fetchCustomers } from "./customer-api";

const route = useRoute();
const router = useRouter();

const RequisitionNo = computed(() => route.query.RequisitionNo || "");
const PlantCode = computed(() => route.query.PlantCode || "");

const plants = ref([]);
const businesses = ref([]);
const customers = ref([]);
const businessLoading = ref(false);
const customerLoading = ref(false);

const filterOption = (input, option) => {
  const text = (option?.label ?? "").toString().toLowerCase();
  return text.includes(input.toLowerCase());
};

// API-driven product search
const productOptions = ref([]);
const productMap = ref({});
const productSearching = ref(false);
let productSearchTimer = null;

const searchProducts = async (val = "") => {
  productSearching.value = true;
  try {
    const params = new URLSearchParams({
      search: val,
      PlantCode: PlantCode.value || "",
      per_page: 20,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/product?${params}`, getToken());
    const payload = res?.data?.data ?? res?.data;
    const items = payload?.data ?? payload ?? [];
    productOptions.value = items;
    items.forEach((p) => { productMap.value[p.ProductCode] = p.ProductName; });
  } catch {
    productOptions.value = [];
  } finally {
    productSearching.value = false;
  }
};

const onProductSearch = (val) => {
  clearTimeout(productSearchTimer);
  productSearchTimer = setTimeout(() => searchProducts(val), 350);
};

const onProductDropdownOpen = (open) => {
  if (open && productOptions.value.length === 0) {
    searchProducts("");
  }
};

const productName = (code) => productMap.value[code] || code || "-";

const form = ref({
  PlantCode: "",
  Business: "",
  CustomerCode: "",
  DeliveryDate: "",
  SalesType: "LOCAL",
  InvoiceType: "Invoice",
  IsSTIProductCourier: "N",
  AutoReceive: "N",
  Notes: "",
  ApproveUser: "",
});

const itemForm = ref({ ProductCode: undefined, Quantity: null, Remark: "" });
const items = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);

const addItem = () => {
  if (!itemForm.value.ProductCode || !itemForm.value.Quantity) {
    showNotification("error", "Please select product and enter quantity");
    return;
  }
  items.value.push({
    ProductCode: itemForm.value.ProductCode,
    Quantity: itemForm.value.Quantity,
    Remark: itemForm.value.Remark || "",
  });
  itemForm.value = { ProductCode: undefined, Quantity: null, Remark: "" };
};

const removeItem = (idx) => {
  items.value.splice(idx, 1);
};

const loadCustomers = async () => {
  if (!form.value.PlantCode || !form.value.Business) {
    customers.value = [];
    return;
  }
  customerLoading.value = true;
  try {
    customers.value = await fetchCustomers(form.value.PlantCode, form.value.Business);
  } catch (e) {
    customers.value = [];
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    customerLoading.value = false;
  }
};

const onBusinessChange = () => {
  form.value.CustomerCode = undefined;
  loadCustomers();
};

const fetchDetail = async () => {
  if (!RequisitionNo.value || !PlantCode.value) {
    showNotification("error", "Missing RequisitionNo / PlantCode in URL");
    router.push("/inventory/requisition");
    return;
  }
  isLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/requisition/show?RequisitionNo=${RequisitionNo.value}&PlantCode=${PlantCode.value}`,
      getToken(),
    );
    const detail = res?.data?.data ?? res?.data;
    if (!detail) {
      showNotification("error", "Requisition not found");
      router.push("/inventory/requisition");
      return;
    }
    form.value = {
      PlantCode: detail.PlantCode || PlantCode.value,
      Business: detail.Business || undefined,
      CustomerCode: detail.CustomerCode || undefined,
      DeliveryDate: detail.DeliveryDate || "",
      SalesType: detail.Segment || detail.SalesType || "LOCAL",
      InvoiceType: detail.InvoiceType || "Invoice",
      IsSTIProductCourier: detail.IsSTIProductCourier || "N",
      AutoReceive: detail.AutoReceive || "N",
      Notes: detail.Notes || "",
      ApproveUser: detail.ApproveUser || detail.ApproveDate || "",
    };
    if (form.value.Business) loadCustomers();
    const rawItems = detail.Items ?? detail.items ?? [];
    items.value = rawItems.map((i) => ({
      ProductCode: i.ProductCode,
      Quantity: i.Quantity,
      Remark: i.Remark || "",
    }));
    // populate productMap from loaded items so names show in the table
    rawItems.forEach((i) => {
      if (i.ProductName) productMap.value[i.ProductCode] = i.ProductName;
    });
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isLoading.value = false;
  }
};

const validate = () => {
  if (!form.value.Business) return "Please enter Business";
  if (!form.value.CustomerCode) return "Please enter Customer code";
  if (!form.value.DeliveryDate) return "Please select Delivery Date";
  if (!items.value.length) return "Please add at least one item";
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
      Business: form.value.Business,
      CustomerCode: form.value.CustomerCode,
      DeliveryDate: form.value.DeliveryDate,
      SalesType: form.value.SalesType,
      InvoiceType: form.value.InvoiceType,
      IsSTIProductCourier: form.value.IsSTIProductCourier,
      AutoReceive: form.value.AutoReceive,
      Notes: form.value.Notes,
      ApproveUser: form.value.ApproveUser,
      items: items.value,
    };
    const res = await axios.put(
      `${apiBase}/inventory/requisition?RequisitionNo=${RequisitionNo.value}&PlantCode=${PlantCode.value}`,
      payload,
      getToken(),
    );
    if (res?.data?.success !== false) {
      showNotification("success", res?.data?.message || "Requisition updated");
      router.push("/inventory/requisition");
    } else {
      showNotification("error", res?.data?.message || "Failed to update");
    }
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  businessLoading.value = true;
  try {
    const [allPlants, allBusinesses] = await Promise.all([
      fetchAllPlants(),
      fetchAllBusinesses(),
    ]);
    plants.value = allPlants;
    businesses.value = allBusinesses;
  } finally {
    businessLoading.value = false;
  }
  fetchDetail();
});
</script>

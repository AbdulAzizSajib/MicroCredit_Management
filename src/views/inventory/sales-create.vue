<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h1 class="text-2xl font-bold text-primary flex items-center gap-3" data-aos="fade-right">
        Sales Create
        <Icon v-if="isLoadingNo" class="size-7" icon="line-md:loading-loop" />
      </h1>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Next Issue No:</span>
          <span class="px-3 py-1 rounded bg-primary/10 text-primary font-semibold text-sm">
            {{ nextIssueNo || "—" }}
          </span>
        </div>
        <button
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          @click="$router.push('/inventory/sales')"
        >
          Back to List
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
      <!-- Left: Items -->
      <div class="lg:col-span-2 border rounded-lg p-5 space-y-4" data-aos="fade-up" data-aos-delay="100">
        <h2 class="font-bold text-gray-800">Sales Details</h2>

        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Product Search</label>
          <a-select
            :key="pickerKey"
            ref="pickerRef"
            show-search
            class="w-full"
            placeholder="Search product code or name, select to add..."
            :value="productPicker"
            :filter-option="false"
            :loading="productSearching"
            :not-found-content="productSearching ? 'Searching...' : 'Type to search...'"
            :disabled="!form.PlantCode || !form.Business"
            @search="onProductSearch"
            @select="onProductSelect"
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
          <p v-if="!form.PlantCode || !form.Business" class="text-xs text-gray-400 mt-1">
            Select Plant and Business first to search products.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px] border border-collapse text-sm">
            <thead>
              <tr class="bg-primary text-white text-xs">
                <th class="border border-white px-2 py-2 text-left w-10">S/L</th>
                <th class="border border-white px-2 py-2 text-left">Product</th>
                <th class="border border-white px-2 py-2 text-right w-28">MRP</th>
                <th class="border border-white px-2 py-2 text-right w-28">Stock</th>
                <th class="border border-white px-2 py-2 text-center w-28">Qty</th>
                <th class="border border-white px-2 py-2 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in items" :key="idx">
                <td class="border px-2 py-1">{{ idx + 1 }}</td>
                <td class="border px-2 py-1">
                  <div class="text-xs font-medium">{{ it.ProductCode }}</div>
                  <div class="text-xs text-gray-500">{{ productName(it.ProductCode) }}</div>
                </td>
                <td class="border px-2 py-1 text-right">
                  {{ it.MRP != null ? formatMoney(it.MRP) : "" }}
                </td>
                <td class="border px-2 py-1 text-right">
                  {{ it.Stock != null ? it.Stock : "" }}
                </td>
                <td class="border px-1 py-1">
                  <a-input-number
                    class="w-full text-right"
                    :bordered="false"
                    v-model:value="it.Quantity"
                    :min="0"
                    :max="it.Stock != null ? Number(it.Stock) : undefined"
                    :precision="2"
                    @change="(v) => onQtyChange(it, v)"
                  />
                </td>
                <td class="border px-1 py-1 text-center">
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
                <td colspan="6" class="px-3 py-4 border text-center text-gray-400 text-xs">
                  No items added. Search a product above to add a row.
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
            {{ isSaving ? "Saving..." : "Submit Sales" }}
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
          <label class="text-sm font-medium text-gray-700">
            Plant <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-select
              class="w-full"
              placeholder="Select Plant"
              v-model:value="form.PlantCode"
              show-search
              :filter-option="filterOption"
              option-filter-prop="label"
              :loading="plantLoading"
              @change="onPlantOrBusinessChange"
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
              @change="onPlantOrBusinessChange"
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
            Movement <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-select
              class="w-full"
              placeholder="Select Movement"
              v-model:value="form.MovementId"
              show-search
              :filter-option="filterOption"
              option-filter-prop="label"
              :loading="movementLoading"
            >
              <a-select-option
                v-for="m in movementTypes"
                :key="m.MovementId"
                :value="m.MovementId"
                :label="`${m.MovementId} ${m.MovementType}`"
              >
                {{ m.MovementId }} — {{ m.MovementType }}
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
              placeholder="Select Customer"
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
                :label="`${c.CustomerCode} ${c.CustomerName || ''}`"
              >
                {{ c.CustomerCode }}<span v-if="c.CustomerName"> — {{ c.CustomerName }}</span>
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Issue Date <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-date-picker
              class="w-full"
              v-model:value="form.IssueDate"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
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
          <label class="text-sm font-medium text-gray-700">Mode</label>
          <div class="col-span-3">
            <a-input placeholder="Mode Code" v-model:value="form.ModeCode" :maxlength="20" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">VAT Challan No</label>
          <div class="col-span-3">
            <a-input placeholder="VAT Challan No" v-model:value="form.VatChallanNo" :maxlength="50" />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import axios from "axios";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { fetchAllPlants } from "./plants-api";
import { fetchAllBusinesses } from "./business-api";
import { fetchAllMovementTypes } from "./movement-type-api";
import { fetchCustomers } from "./customer-api";

const router = useRouter();

const DEFAULT_STORE_CODE = "01";

const plants = ref([]);
const businesses = ref([]);
const movementTypes = ref([]);
const customers = ref([]);

const plantLoading = ref(false);
const businessLoading = ref(false);
const movementLoading = ref(false);
const customerLoading = ref(false);
const isLoadingNo = ref(false);
const nextIssueNo = ref("");

const filterOption = (input, option) => {
  const text = (option?.label ?? "").toString().toLowerCase();
  return text.includes(input.toLowerCase());
};

const currentUser =
  JSON.parse(localStorage.getItem("user_info") || "null")?.UserId || "admin";

const form = ref({
  PlantCode: undefined,
  StoreCode: DEFAULT_STORE_CODE,
  MovementId: "SAL",
  CustomerCode: undefined,
  Business: undefined,
  IssueDate: dayjs().format("YYYY-MM-DD"),
  OrderNo: "",
  VehicleNo: "",
  ModeCode: "",
  VatChallanNo: "",
  CreateBy: currentUser,
});

const items = ref([]);
const productPicker = ref(undefined);
const pickerKey = ref(0);
const pickerRef = ref(null);
const isSaving = ref(false);

const productOptions = ref([]);
const productMap = ref({});
const productSearching = ref(false);
let productSearchTimer = null;

const searchProducts = async (val = "") => {
  if (!form.value.PlantCode || !form.value.Business) return;
  productSearching.value = true;
  try {
    const params = new URLSearchParams({
      search: val,
      PlantCode: form.value.PlantCode,
      Business: form.value.Business,
    }).toString();
    const res = await axios.get(
      `${apiBase}/inventory/sales/product-search?${params}`,
      getToken(),
    );
    const payload = res?.data?.data ?? res?.data;
    const list = payload?.data ?? payload ?? [];
    productOptions.value = list;
    list.forEach((p) => {
      productMap.value[p.ProductCode] = p;
    });
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

const onProductSelect = async (code) => {
  if (!code) return;
  if (items.value.some((it) => it.ProductCode === code)) {
    showNotification("info", "Product already added.");
    productPicker.value = undefined;
    pickerKey.value++;
    return;
  }
  const p = productMap.value[code] || {};
  items.value.push({
    ProductCode: code,
    BatchNo: p.BatchNo || "",
    ReceiveNo: p.ReceiveNo || "",
    MRP: p.MRP ?? p.Mrp ?? null,
    Stock: p.Stock ?? p.StockQty ?? null,
    Quantity: null,
    OrderQuantity: null,
    TP: p.TP ?? null,
    Vat: p.Vat ?? 0,
    Net: p.Net ?? null,
    SDPrice: p.SDPrice ?? 0,
    SDVat: p.SDVat ?? 0,
    Type: form.value.MovementId || "SAL",
  });
  productPicker.value = undefined;
  pickerKey.value++;
  await nextTick();
  pickerRef.value?.focus?.();
};

const productName = (code) =>
  productMap.value[code]?.ProductName || productMap.value[code]?.Name || "";

const removeItem = (idx) => {
  items.value.splice(idx, 1);
};

const onQtyChange = (it, val) => {
  if (it.Stock == null || val == null) return;
  const stock = Number(it.Stock);
  if (Number(val) > stock) {
    it.Quantity = stock;
    showNotification("warning", `Qty cannot exceed Stock (${stock}). Clamped.`);
  }
};

const formatMoney = (val) => {
  if (val == null || val === "") return "";
  return Number(val).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const fetchNextIssueNo = async () => {
  if (!form.value.PlantCode) {
    nextIssueNo.value = "";
    return;
  }
  isLoadingNo.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/sales/last?PlantCode=${encodeURIComponent(form.value.PlantCode)}`,
      getToken(),
    );
    const payload = res?.data?.data ?? res?.data;
    nextIssueNo.value =
      payload?.nextIssueNo ?? payload?.NextIssueNo ?? payload?.lastIssueNo ?? "";
  } catch (e) {
    nextIssueNo.value = "";
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isLoadingNo.value = false;
  }
};

const loadCustomers = async () => {
  if (!form.value.PlantCode || !form.value.Business) {
    customers.value = [];
    return;
  }
  customerLoading.value = true;
  try {
    customers.value = await fetchCustomers(form.value.PlantCode, form.value.Business);
  } catch {
    customers.value = [];
  } finally {
    customerLoading.value = false;
  }
};

const onPlantOrBusinessChange = () => {
  form.value.CustomerCode = undefined;
  items.value = [];
  productOptions.value = [];
  fetchNextIssueNo();
  loadCustomers();
};

watch(
  () => form.value.MovementId,
  (val) => {
    items.value.forEach((it) => {
      it.Type = val || "SAL";
    });
  },
);

const validate = () => {
  const f = form.value;
  if (!f.PlantCode) return "Please select a Plant";
  if (!f.Business) return "Please select Business";
  if (!f.MovementId) return "Please select Movement";
  if (!f.CustomerCode) return "Please select Customer";
  if (!f.IssueDate) return "Please select Issue Date";
  if (!items.value.length) return "Please add at least one product";
  for (let i = 0; i < items.value.length; i++) {
    const it = items.value[i];
    if (!it.Quantity || Number(it.Quantity) <= 0)
      return `Row ${i + 1}: Qty must be greater than 0`;
    if (it.Stock != null && Number(it.Quantity) > Number(it.Stock))
      return `Row ${i + 1}: Qty cannot exceed Stock (${it.Stock})`;
  }
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
      PlantCode: form.value.PlantCode,
      StoreCode: form.value.StoreCode,
      MovementId: form.value.MovementId,
      CustomerCode: form.value.CustomerCode,
      Business: form.value.Business,
      IssueDate: form.value.IssueDate,
      OrderNo: form.value.OrderNo || "",
      VehicleNo: form.value.VehicleNo || "",
      ModeCode: form.value.ModeCode || "",
      VatChallanNo: form.value.VatChallanNo || "",
      CreateBy: form.value.CreateBy,
      details: items.value.map((it) => ({
        ProductCode: it.ProductCode,
        BatchNo: it.BatchNo || "",
        ReceiveNo: it.ReceiveNo || "",
        Quantity: Number(it.Quantity) || 0,
        OrderQuantity: Number(it.OrderQuantity ?? it.Quantity) || 0,
        TP: Number(it.TP) || 0,
        Vat: Number(it.Vat) || 0,
        Net: Number(it.Net) || 0,
        SDPrice: Number(it.SDPrice) || 0,
        SDVat: Number(it.SDVat) || 0,
        Type: it.Type || form.value.MovementId || "SAL",
      })),
    };
    const res = await axios.post(`${apiBase}/inventory/sales`, payload, getToken());
    if (res?.data?.success !== false) {
      showNotification("success", res?.data?.message || "Sales created");
      router.push("/inventory/sales");
    } else {
      showNotification("error", res?.data?.message || "Failed to create");
    }
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  plantLoading.value = true;
  businessLoading.value = true;
  movementLoading.value = true;
  try {
    const [allPlants, allBusinesses, allMovements] = await Promise.all([
      fetchAllPlants(),
      fetchAllBusinesses(),
      fetchAllMovementTypes(),
    ]);
    plants.value = allPlants;
    businesses.value = allBusinesses;
    movementTypes.value = allMovements;
  } finally {
    plantLoading.value = false;
    businessLoading.value = false;
    movementLoading.value = false;
  }
});
</script>

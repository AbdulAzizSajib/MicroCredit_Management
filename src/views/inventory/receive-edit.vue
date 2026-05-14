<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h1 class="text-2xl font-bold text-primary flex items-center gap-3">
        Edit Goods Receive — {{ QuarantineReceiveNo }}
        <Icon v-if="isLoading" class="size-7" icon="line-md:loading-loop" />
      </h1>
      <button
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        @click="$router.push('/inventory/receive')"
      >
        Back to List
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
      <!-- Left: Items -->
      <div class="lg:col-span-2 border rounded-lg p-5 space-y-4" data-aos="fade-up" data-aos-delay="100">
        <h2 class="font-bold text-gray-800">Receive Details</h2>

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
            :not-found-content="productSearching ? 'Searching...' : 'No product found'"
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
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px] border border-collapse text-sm">
            <thead>
              <tr class="bg-primary text-white text-xs">
                <th class="border border-white px-2 py-2 text-left w-10">S/L</th>
                <th class="border border-white px-2 py-2 text-left">Product</th>
                <th class="border border-white px-2 py-2 text-center w-28">Batch No</th>
                <th class="border border-white px-2 py-2 text-center w-32">Qty</th>
                <th class="border border-white px-2 py-2 text-left w-24">Carton Pack</th>
                <th class="border border-white px-2 py-2 text-left w-32">MFG Date</th>
                <th class="border border-white px-2 py-2 text-left w-32">Expire Date</th>
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
                <td class="border px-1 py-1">
                  <a-input
                    :bordered="false"
                    placeholder="Batch No"
                    v-model:value="it.BatchNo"
                    class="w-full text-right"
                  />
                </td>
                <td class="border px-1 py-1">
                  <a-input-number
                    class="w-full text-right"
                    :bordered="false"
                    v-model:value="it.Quantity"
                    :min="0"
                    :precision="2"
                  />
                </td>
                <td class="border px-2 py-1 text-gray-600">{{ it.CartonPack || 0 }}</td>
                <td class="border px-1 py-1">
                  <a-date-picker
                    class="w-full"
                    :bordered="false"
                    v-model:value="it.MFGDate"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </td>
                <td class="border px-1 py-1">
                  <a-date-picker
                    class="w-full"
                    :bordered="false"
                    v-model:value="it.ExpireDate"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
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
                <td colspan="8" class="px-3 py-4 border text-center text-gray-400 text-xs">
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
            {{ isSaving ? "Updating..." : "Update Goods Receive" }}
          </button>
          <button
            class="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition-colors"
            @click="$router.push('/inventory/receive')"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Right: Master form -->
      <div class="border rounded-lg p-5 space-y-3" data-aos="fade-up" data-aos-delay="150">
        <h2 class="font-bold text-gray-800">Receive Information</h2>

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
            Movement Type <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-select
              class="w-full"
              placeholder="Select Movement Type"
              v-model:value="form.MovementId"
              show-search
              :filter-option="filterOption"
              option-filter-prop="label"
              :loading="movementLoading"
              @change="onMovementChange"
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

        <div v-if="form.MovementId === 'RQ'" class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Requisition No <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-select
              class="w-full"
              placeholder="Select Requisition"
              v-model:value="form.RequisitionNo"
              show-search
              :filter-option="filterOption"
              option-filter-prop="label"
              :loading="requisitionLoading"
              :disabled="!form.PlantCode"
            >
              <a-select-option
                v-for="r in requisitions"
                :key="r.RequisitionNo"
                :value="r.RequisitionNo"
                :label="`${r.RequisitionNo} ${r.CustomerCode || ''}`"
              >
                {{ r.RequisitionNo }}<span v-if="r.CustomerCode"> — {{ r.CustomerCode }}</span>
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Supplier</label>
          <div class="col-span-3">
            <a-select
              class="w-full"
              placeholder="Select Supplier"
              v-model:value="form.SupplierCode"
              show-search
              :filter-option="filterOption"
              option-filter-prop="label"
              :loading="supplierLoading"
              allow-clear
            >
              <a-select-option
                v-for="s in suppliers"
                :key="s.SupplierCode"
                :value="s.SupplierCode"
                :label="`${s.SupplierCode} ${s.SupplierName}`"
              >
                {{ s.SupplierCode }} — {{ s.SupplierName }}
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
            Receive Date <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-date-picker
              class="w-full"
              v-model:value="form.QuarantineReceiveDate"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">FGTN No</label>
          <div class="col-span-3">
            <a-input placeholder="FGTN No" v-model:value="form.FgtnNo" :maxlength="50" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Reference No</label>
          <div class="col-span-3">
            <a-input placeholder="Reference No" v-model:value="form.ReferenceNo" :maxlength="50" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Reference Date</label>
          <div class="col-span-3">
            <a-date-picker
              class="w-full"
              v-model:value="form.ReferenceDate"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-start">
          <label class="text-sm font-medium text-gray-700 mt-2">Comment</label>
          <div class="col-span-3">
            <a-textarea
              placeholder="Comment"
              v-model:value="form.Comment"
              :rows="3"
              :maxlength="500"
            />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import dayjs from "dayjs";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { fetchAllPlants } from "./plants-api";
import { fetchAllBusinesses } from "./business-api";
import { fetchAllMovementTypes } from "./movement-type-api";
import { fetchAllSuppliers } from "./supplier-api";

const route = useRoute();
const router = useRouter();

const QuarantineReceiveNo = computed(() => route.query.QuarantineReceiveNo || "");

const currentUser =
  JSON.parse(localStorage.getItem("user_info") || "null")?.UserId || "admin";

const plants = ref([]);
const businesses = ref([]);
const movementTypes = ref([]);
const suppliers = ref([]);
const requisitions = ref([]);
const plantLoading = ref(false);
const businessLoading = ref(false);
const movementLoading = ref(false);
const supplierLoading = ref(false);
const requisitionLoading = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);

const filterOption = (input, option) => {
  const text = (option?.label ?? "").toString().toLowerCase();
  return text.includes(input.toLowerCase());
};

const form = ref({
  PlantCode: "",
  MovementId: undefined,
  RequisitionNo: undefined,
  SupplierCode: undefined,
  Business: undefined,
  StoreCode: "A1",
  QuarantineReceiveDate: "",
  FgtnNo: "",
  ReferenceNo: "",
  ReferenceDate: "",
  Comment: "",
  EditBy: currentUser,
});

const items = ref([]);
const productPicker = ref(undefined);
const pickerKey = ref(0);
const pickerRef = ref(null);

const productOptions = ref([]);
const productMap = ref({});
const productSearching = ref(false);
let productSearchTimer = null;

const searchProducts = async (val = "") => {
  productSearching.value = true;
  try {
    const params = new URLSearchParams({
      search: val,
      PlantCode: form.value.PlantCode || "",
      per_page: 20,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/product?${params}`, getToken());
    const payload = res?.data?.data ?? res?.data;
    const list = payload?.data ?? payload ?? [];
    productOptions.value = list;
    list.forEach((p) => { productMap.value[p.ProductCode] = p; });
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
  if (open && productOptions.value.length === 0) searchProducts("");
};

const onProductSelect = async (code) => {
  if (!code) return;
  const p = productMap.value[code] || {};
  items.value.push({
    ProductCode: code,
    BatchNo: "",
    Quantity: null,
    CartonPack: p.Carton ?? "",
    MFGDate: "",
    ExpireDate: "",
  });
  productPicker.value = undefined;
  pickerKey.value++;
  await nextTick();
  pickerRef.value?.focus?.();
};

const productName = (code) => productMap.value[code]?.ProductName || "";
const removeItem = (idx) => { items.value.splice(idx, 1); };

const onMovementChange = (val) => {
  if (val !== "RQ") form.value.RequisitionNo = undefined;
  else loadRequisitions();
};

const loadRequisitions = async () => {
  if (!form.value.PlantCode) return;
  requisitionLoading.value = true;
  try {
    const params = new URLSearchParams({
      PlantCode: form.value.PlantCode,
      per_page: 200,
      page: 1,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/requisition?${params}`, getToken());
    const payload = res?.data?.data ?? res?.data;
    requisitions.value = payload?.data ?? payload ?? [];
  } catch {
    requisitions.value = [];
  } finally {
    requisitionLoading.value = false;
  }
};

const fetchDetail = async () => {
  if (!QuarantineReceiveNo.value) {
    showNotification("error", "Missing QuarantineReceiveNo in URL");
    router.push("/inventory/receive");
    return;
  }
  isLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/receive/show?QuarantineReceiveNo=${encodeURIComponent(QuarantineReceiveNo.value)}`,
      getToken(),
    );
    const payload = res?.data?.data ?? res?.data;
    if (!payload) {
      showNotification("error", "Receive entry not found");
      router.push("/inventory/receive");
      return;
    }
    const master = payload.master ?? payload;
    const rawItems = payload.details ?? payload.Items ?? payload.items ?? [];
    form.value = {
      PlantCode: master.PlantCode || undefined,
      MovementId: master.MovementId || undefined,
      RequisitionNo: master.RequisitionNo || undefined,
      SupplierCode: master.SupplierCode || undefined,
      Business: master.Business || undefined,
      StoreCode: master.StoreCode || "A1",
      QuarantineReceiveDate: master.QuarantineReceiveDate
        ? dayjs(master.QuarantineReceiveDate).format("YYYY-MM-DD")
        : "",
      FgtnNo: master.FgtnNo || "",
      ReferenceNo: master.ReferenceNo || "",
      ReferenceDate: master.ReferenceDate
        ? dayjs(master.ReferenceDate).format("YYYY-MM-DD")
        : "",
      Comment: master.Comment || "",
      EditBy: currentUser,
    };
    if (master.MovementId === "RQ") loadRequisitions();
    items.value = rawItems.map((i) => ({
      ProductCode: i.ProductCode,
      BatchNo: i.BatchNo || "",
      Quantity: i.Quantity ?? null,
      CartonPack: i.CartonPack || 0,
      MFGDate: i.MFGDate ? dayjs(i.MFGDate).format("YYYY-MM-DD") : "",
      ExpireDate: i.ExpireDate ? dayjs(i.ExpireDate).format("YYYY-MM-DD") : "",
    }));
    rawItems.forEach((i) => {
      if (i.ProductName)
        productMap.value[i.ProductCode] = { ProductName: i.ProductName, Carton: i.CartonPack };
    });
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isLoading.value = false;
  }
};

const validate = () => {
  const f = form.value;
  if (!f.MovementId) return "Please select Movement Type";
  if (f.MovementId === "RQ" && !f.RequisitionNo) return "Please select Requisition No";
  if (!f.Business) return "Please select Business";
  if (!f.QuarantineReceiveDate) return "Please select Receive Date";
  if (!items.value.length) return "Please add at least one product";
  for (let i = 0; i < items.value.length; i++) {
    const it = items.value[i];
    if (!it.BatchNo?.trim()) return `Row ${i + 1}: Batch No is required`;
    if (!it.Quantity || Number(it.Quantity) <= 0)
      return `Row ${i + 1}: Quantity must be greater than 0`;
    if (it.MFGDate && it.ExpireDate && dayjs(it.ExpireDate).isBefore(dayjs(it.MFGDate)))
      return `Row ${i + 1}: Expire Date cannot be before MFG Date`;
  }
  return null;
};

const save = async () => {
  const err = validate();
  if (err) { showNotification("error", err); return; }
  isSaving.value = true;
  try {
    const payload = {
      MovementId: form.value.MovementId,
      StoreCode: form.value.StoreCode,
      Business: form.value.Business,
      QuarantineReceiveDate: form.value.QuarantineReceiveDate,
      FgtnNo: form.value.FgtnNo || "",
      ReferenceNo: form.value.ReferenceNo || "",
      ReferenceDate: form.value.ReferenceDate || "",
      Comment: form.value.Comment || "",
      EditBy: form.value.EditBy,
      SupplierCode: form.value.SupplierCode || null,
      ...(form.value.MovementId === "RQ" && form.value.RequisitionNo
        ? { RequisitionNo: form.value.RequisitionNo }
        : {}),
      details: items.value.map((it) => ({
        ProductCode: it.ProductCode,
        BatchNo: it.BatchNo,
        Quantity: Number(it.Quantity),
        CartonPack: String(it.CartonPack || 0),
        MFGDate: it.MFGDate || "",
        ExpireDate: it.ExpireDate || "",
      })),
    };
    const res = await axios.put(
      `${apiBase}/inventory/receive?QuarantineReceiveNo=${encodeURIComponent(QuarantineReceiveNo.value)}`,
      payload,
      getToken(),
    );
    if (res?.data?.success !== false) {
      showNotification("success", res?.data?.message || "Goods Receive updated");
      router.push("/inventory/receive");
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
  plantLoading.value = true;
  businessLoading.value = true;
  movementLoading.value = true;
  supplierLoading.value = true;
  try {
    const [allPlants, allBusinesses, allMovements, allSuppliers] = await Promise.all([
      fetchAllPlants(),
      fetchAllBusinesses(),
      fetchAllMovementTypes(),
      fetchAllSuppliers(),
    ]);
    plants.value = allPlants;
    businesses.value = allBusinesses;
    movementTypes.value = allMovements;
    suppliers.value = allSuppliers;
  } finally {
    plantLoading.value = false;
    businessLoading.value = false;
    movementLoading.value = false;
    supplierLoading.value = false;
  }
  await fetchDetail();
});
</script>

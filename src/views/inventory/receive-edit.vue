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
      <div class="lg:col-span-2 border rounded-lg p-5 space-y-4">
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
                <th class="border border-white px-2 py-2 text-left w-28">Batch No</th>
                <th class="border border-white px-2 py-2 text-right w-24">Qty</th>
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
                  <a-input :bordered="false" placeholder="Batch No" v-model:value="it.BatchNo" />
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
            @click="$router.push('/inventory/receive')"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Right: Master form (read-only key fields, editable Comment) -->
      <div class="border rounded-lg p-5 space-y-3">
        <h2 class="font-bold text-gray-800">Receive Information</h2>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Plant</label>
          <div class="col-span-3">
            <a-input :value="form.PlantCode" readonly />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Movement Type</label>
          <div class="col-span-3">
            <a-input :value="form.MovementId" readonly />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Business</label>
          <div class="col-span-3">
            <a-input :value="form.Business" readonly />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Store</label>
          <div class="col-span-3">
            <a-input :value="form.StoreCode" readonly />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Receive Date</label>
          <div class="col-span-3">
            <a-input :value="form.QuarantineReceiveDate" readonly />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">FGTN No</label>
          <div class="col-span-3">
            <a-input :value="form.FgtnNo" readonly />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Reference No</label>
          <div class="col-span-3">
            <a-input :value="form.ReferenceNo" readonly />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Reference Date</label>
          <div class="col-span-3">
            <a-input :value="form.ReferenceDate" readonly />
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

const route = useRoute();
const router = useRouter();

const QuarantineReceiveNo = computed(() => route.query.QuarantineReceiveNo || "");

const currentUser =
  JSON.parse(localStorage.getItem("user_info") || "null")?.UserId || "admin";

const form = ref({
  PlantCode: "",
  MovementId: "",
  Business: "",
  StoreCode: "",
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
const isLoading = ref(false);
const isSaving = ref(false);

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

const removeItem = (idx) => {
  items.value.splice(idx, 1);
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
    const detail = res?.data?.data ?? res?.data;
    if (!detail) {
      showNotification("error", "Receive entry not found");
      router.push("/inventory/receive");
      return;
    }
    form.value = {
      PlantCode: detail.PlantCode || "",
      MovementId: detail.MovementId || "",
      Business: detail.Business || "",
      StoreCode: detail.StoreCode || "",
      QuarantineReceiveDate: detail.QuarantineReceiveDate
        ? dayjs(detail.QuarantineReceiveDate).format("YYYY-MM-DD")
        : "",
      FgtnNo: detail.FgtnNo || "",
      ReferenceNo: detail.ReferenceNo || "",
      ReferenceDate: detail.ReferenceDate
        ? dayjs(detail.ReferenceDate).format("YYYY-MM-DD")
        : "",
      Comment: detail.Comment || "",
      EditBy: currentUser,
    };
    const rawItems = detail.details ?? detail.Items ?? detail.items ?? [];
    items.value = rawItems.map((i) => ({
      ProductCode: i.ProductCode,
      BatchNo: i.BatchNo || "",
      Quantity: i.Quantity ?? null,
      CartonPack: i.CartonPack || 0,
      MFGDate: i.MFGDate ? dayjs(i.MFGDate).format("YYYY-MM-DD") : "",
      ExpireDate: i.ExpireDate ? dayjs(i.ExpireDate).format("YYYY-MM-DD") : "",
    }));
    rawItems.forEach((i) => {
      if (i.ProductName) productMap.value[i.ProductCode] = { ProductName: i.ProductName, Carton: i.CartonPack };
    });
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isLoading.value = false;
  }
};

const validate = () => {
  if (!items.value.length) return "Please add at least one product";
  for (let i = 0; i < items.value.length; i++) {
    const it = items.value[i];
    if (!it.ProductCode) return `Row ${i + 1}: Product is required`;
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
  if (err) {
    showNotification("error", err);
    return;
  }
  isSaving.value = true;
  try {
    const payload = {
      Comment: form.value.Comment || "",
      EditBy: form.value.EditBy,
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

onMounted(fetchDetail);
</script>

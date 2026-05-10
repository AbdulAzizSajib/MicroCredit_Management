<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3 mb-5">
      <h1 class="text-2xl font-bold text-primary flex items-center gap-3">
        Edit Product — {{ ProductCode }}
        <Icon v-if="isLoading" class="size-7" icon="line-md:loading-loop" />
      </h1>
      <button
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        @click="$router.push('/inventory/product')"
      >
        Back to List
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Left -->
      <div class="border rounded-lg p-5 space-y-4">
        <h2 class="font-bold text-gray-800">Basic Information</h2>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Product Code</label>
          <div class="col-span-3">
            <a-input :value="ProductCode" disabled />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Plant</label>
          <div class="col-span-3">
            <a-input :value="PlantCode" disabled />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Product Name <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input
              placeholder="Product name (English)"
              v-model:value="form.ProductName"
              :maxlength="200"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Name (Bangla)</label>
          <div class="col-span-3">
            <a-input
              placeholder="পণ্যের নাম"
              v-model:value="form.ProductNameBangla"
              :maxlength="3000"
            />
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
            Mushok Print <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.MushokPrint">
              <a-select-option value="Y">Yes</a-select-option>
              <a-select-option value="N">No</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Active <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.Active">
              <a-select-option value="Y">Yes</a-select-option>
              <a-select-option value="N">No</a-select-option>
            </a-select>
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="border rounded-lg p-5 space-y-4">
        <h2 class="font-bold text-gray-800">Pricing & Packaging</h2>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Pack Size <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input
              placeholder="e.g. 1x10"
              v-model:value="form.PackSize"
              :maxlength="50"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Pack Size WT <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input-number class="w-full" placeholder="0.0000" v-model:value="form.PackSizeWT" :precision="4" :min="0" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Batch Size <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input-number class="w-full" placeholder="0.00" v-model:value="form.BatchSize" :precision="2" :min="0" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Carton <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input-number class="w-full" placeholder="0.00" v-model:value="form.Carton" :precision="2" :min="0" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Trade Price <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input-number class="w-full" placeholder="0.0000" v-model:value="form.TradePrice" :precision="4" :min="0" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            VAT (%) <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input-number class="w-full" placeholder="0.0000" v-model:value="form.VAT" :precision="4" :min="0" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            MRP <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input-number class="w-full" placeholder="0.0000" v-model:value="form.MRP" :precision="4" :min="0" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-3 mt-5">
      <button
        class="bg-primary text-white px-5 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-60"
        :disabled="isSaving || isLoading"
        @click="save"
        type="button"
      >
        {{ isSaving ? "Updating..." : "Update" }}
      </button>
      <button
        class="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition-colors"
        @click="$router.push('/inventory/product')"
        type="button"
      >
        Cancel
      </button>
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
import { fetchAllBusinesses } from "./business-api";

const route = useRoute();
const router = useRouter();

const ProductCode = computed(() => route.query.ProductCode || "");
const PlantCode = computed(() => route.query.PlantCode || "");

const businesses = ref([]);
const businessLoading = ref(false);

const filterOption = (input, option) => {
  const text = (option?.label ?? "").toString().toLowerCase();
  return text.includes(input.toLowerCase());
};

const form = ref({
  ProductName: "",
  ProductNameBangla: "",
  PackSize: "",
  PackSizeWT: null,
  BatchSize: null,
  Carton: null,
  TradePrice: null,
  VAT: null,
  MRP: null,
  Business: undefined,
  SubBusinessCode: "",
  Active: "Y",
  MushokPrint: "N",
});

const isLoading = ref(false);
const isSaving = ref(false);

const fetchDetail = async () => {
  if (!ProductCode.value || !PlantCode.value) {
    showNotification("error", "Missing ProductCode / PlantCode in URL");
    router.push("/inventory/product");
    return;
  }
  isLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/product/show?ProductCode=${ProductCode.value}&PlantCode=${PlantCode.value}`,
      getToken(),
    );
    const detail = res?.data?.data ?? res?.data;
    if (!detail) {
      showNotification("error", "Product not found");
      router.push("/inventory/product");
      return;
    }
    form.value = {
      ProductName: detail.ProductName || "",
      ProductNameBangla: detail.ProductNameBangla || "",
      PackSize: detail.PackSize || "",
      PackSizeWT: detail.PackSizeWT ?? null,
      BatchSize: detail.BatchSize ?? null,
      Carton: detail.Carton ?? null,
      TradePrice: detail.TradePrice ?? null,
      VAT: detail.VAT ?? null,
      MRP: detail.MRP ?? null,
      Business: detail.Business || undefined,
      SubBusinessCode: detail.SubBusinessCode || "1",
      Active: detail.Active || "Y",
      MushokPrint: detail.MushokPrint || "N",
    };
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isLoading.value = false;
  }
};

const validate = () => {
  const f = form.value;
  if (!f.ProductName?.trim()) return "Please enter Product Name";
  if (f.ProductName.length > 200) return "Product Name must be 200 characters max";
  if (f.ProductNameBangla && f.ProductNameBangla.length > 3000)
    return "Product Name (Bangla) must be 3000 characters max";
  if (!f.PackSize?.trim()) return "Please enter Pack Size";
  if (f.PackSize.length > 50) return "Pack Size must be 50 characters max";
  if (f.PackSizeWT == null || f.PackSizeWT === "") return "Please enter Pack Size WT";
  if (f.BatchSize == null || f.BatchSize === "") return "Please enter Batch Size";
  if (f.Carton == null || f.Carton === "") return "Please enter Carton";
  if (f.TradePrice == null || f.TradePrice === "") return "Please enter Trade Price";
  if (f.VAT == null || f.VAT === "") return "Please enter VAT";
  if (f.MRP == null || f.MRP === "") return "Please enter MRP";
  if (!f.Business?.trim()) return "Please enter Business";
  if (f.Business.length > 2) return "Business must be 2 characters max";
  if (!f.SubBusinessCode?.trim()) return "Please enter Sub Business Code";
  if (f.SubBusinessCode.length > 10) return "Sub Business Code must be 10 characters max";
  if (!f.Active) return "Please select Active";
  if (!f.MushokPrint) return "Please select Mushok Print";
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
    const res = await axios.put(
      `${apiBase}/inventory/product?ProductCode=${ProductCode.value}&PlantCode=${PlantCode.value}`,
      form.value,
      getToken(),
    );
    if (res?.data?.success !== false) {
      showNotification("success", res?.data?.message || "Product updated");
      router.push("/inventory/product");
    } else {
      showNotification("error", res?.data?.message || "Failed to update");
    }
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isSaving.value = false;
  }
};

const loadBusinesses = async () => {
  businessLoading.value = true;
  try {
    businesses.value = await fetchAllBusinesses();
  } finally {
    businessLoading.value = false;
  }
};

onMounted(() => {
  fetchDetail();
  loadBusinesses();
});
</script>

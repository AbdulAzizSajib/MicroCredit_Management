<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3 mb-5">
      <h1 class="text-2xl font-bold text-primary">Create Product</h1>
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
          <label class="text-sm font-medium text-gray-700">
            Product Code <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input
              placeholder="e.g. PRD001"
              v-model:value="form.ProductCode"
              :maxlength="15"
            />
          </div>
        </div>

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
        :disabled="isSaving"
        @click="save"
        type="button"
      >
        {{ isSaving ? "Saving..." : "Save" }}
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { fetchAllPlants } from "./plants-api";
import { fetchAllBusinesses } from "./business-api";

const router = useRouter();

const plants = ref([]);
const businesses = ref([]);
const businessLoading = ref(false);

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
});

const filterOption = (input, option) => {
  const text = (option?.label ?? "").toString().toLowerCase();
  return text.includes(input.toLowerCase());
};

const form = ref({
  ProductCode: "",
  PlantCode: undefined,
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
  SubBusinessCode: "1",
  Active: "Y",
  MushokPrint: "N",
  CreateBy:
    JSON.parse(localStorage.getItem("user_info") || "null")?.UserId || "",
});

const isSaving = ref(false);

const validate = () => {
  const f = form.value;
  if (!f.ProductCode?.trim()) return "Please enter Product Code";
  if (f.ProductCode.length > 15) return "Product Code must be 15 characters max";
  if (!f.PlantCode) return "Please select a Plant";
  if (!f.ProductName?.trim()) return "Please enter Product Name";
  if (f.ProductName.length > 200) return "Product Name must be 200 characters max";
  if (f.ProductNameBangla && f.ProductNameBangla.length > 3000)
    return "Product Name (Bangla) must be 3000 characters max";
  if (!f.Business) return "Please select a Business";
  if (!f.MushokPrint) return "Please select Mushok Print";
  if (!f.Active) return "Please select Active";
  if (!f.PackSize?.trim()) return "Please enter Pack Size";
  if (f.PackSize.length > 50) return "Pack Size must be 50 characters max";
  if (f.PackSizeWT == null || f.PackSizeWT === "") return "Please enter Pack Size WT";
  if (f.BatchSize == null || f.BatchSize === "") return "Please enter Batch Size";
  if (f.Carton == null || f.Carton === "") return "Please enter Carton";
  if (f.TradePrice == null || f.TradePrice === "") return "Please enter Trade Price";
  if (f.VAT == null || f.VAT === "") return "Please enter VAT";
  if (f.MRP == null || f.MRP === "") return "Please enter MRP";
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
    const res = await axios.post(`${apiBase}/inventory/product`, form.value, getToken());
    if (res?.data?.success !== false) {
      showNotification("success", res?.data?.message || "Product created");
      router.push("/inventory/product");
    } else {
      showNotification("error", res?.data?.message || "Failed to create");
    }
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isSaving.value = false;
  }
};
</script>

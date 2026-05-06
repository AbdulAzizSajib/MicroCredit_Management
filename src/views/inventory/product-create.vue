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

    <a-form ref="formRef" :model="form" layout="vertical" :scroll-to-first-error="true">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Left: Basic Information -->
        <div class="border rounded-lg p-5">
          <h2 class="font-bold text-gray-800 mb-4">Basic Information</h2>

          <a-form-item
            label="Product Code"
            name="ProductCode"
            :rules="[
              { required: true, message: 'Product Code is required' },
              { max: 15, message: 'Max 15 characters' },
            ]"
          >
            <a-input
              v-model:value="form.ProductCode"
              placeholder="e.g. PRD001"
              :maxlength="15"
              show-count
            />
          </a-form-item>

          <a-form-item
            label="Plant"
            name="PlantCode"
            :rules="[{ required: true, message: 'Please select a Plant' }]"
          >
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
          </a-form-item>

          <a-form-item
            label="Product Name"
            name="ProductName"
            :rules="[
              { required: true, message: 'Product Name is required' },
              { max: 200, message: 'Max 200 characters' },
            ]"
          >
            <a-input
              v-model:value="form.ProductName"
              placeholder="Product name (English)"
              :maxlength="200"
              show-count
            />
          </a-form-item>

          <a-form-item
            label="Product Name (Bangla)"
            name="ProductNameBangla"
          >
            <a-input
              v-model:value="form.ProductNameBangla"
              placeholder="পণ্যের নাম"
              :maxlength="3000"
            />
          </a-form-item>

          <a-form-item
            label="Business"
            name="Business"
            :rules="[
              { required: true, message: 'Business code is required' },
              { max: 2, message: 'Max 2 characters' },
            ]"
          >
            <a-input
              v-model:value="form.Business"
              placeholder="e.g. B1"
              :maxlength="2"
              show-count
            />
          </a-form-item>

          <a-form-item
            label="Sub Business Code"
            name="SubBusinessCode"
            :rules="[
              { required: true, message: 'Sub Business Code is required' },
              { max: 10, message: 'Max 10 characters' },
            ]"
          >
            <a-input
              v-model:value="form.SubBusinessCode"
              placeholder="e.g. SB01"
              :maxlength="10"
              show-count
            />
          </a-form-item>

          <a-form-item
            label="Create By"
            name="CreateBy"
            :rules="[
              { required: true, message: 'Create By is required' },
              { max: 20, message: 'Max 20 characters' },
            ]"
          >
            <a-input
              v-model:value="form.CreateBy"
              placeholder="Username"
              :maxlength="20"
            />
          </a-form-item>

          <div class="grid grid-cols-2 gap-4">
            <a-form-item
              label="Active"
              name="Active"
              :rules="[{ required: true, message: 'Required' }]"
            >
              <a-select class="w-full" v-model:value="form.Active">
                <a-select-option value="Y">Yes</a-select-option>
                <a-select-option value="N">No</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              label="Mushok Print"
              name="MushokPrint"
              :rules="[{ required: true, message: 'Required' }]"
            >
              <a-select class="w-full" v-model:value="form.MushokPrint">
                <a-select-option value="Y">Yes</a-select-option>
                <a-select-option value="N">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </div>

        <!-- Right: Pricing & Packaging -->
        <div class="border rounded-lg p-5">
          <h2 class="font-bold text-gray-800 mb-4">Pricing & Packaging</h2>

          <a-form-item
            label="Pack Size"
            name="PackSize"
            :rules="[
              { required: true, message: 'Pack Size is required' },
              { max: 50, message: 'Max 50 characters' },
            ]"
          >
            <a-input
              v-model:value="form.PackSize"
              placeholder="e.g. 1x10"
              :maxlength="50"
              show-count
            />
          </a-form-item>

          <div class="grid grid-cols-2 gap-4">
            <a-form-item
              label="Pack Size WT"
              name="PackSizeWT"
              :rules="[{ required: true, type: 'number', message: 'Required' }]"
            >
              <a-input-number
                class="w-full"
                placeholder="0.0000"
                v-model:value="form.PackSizeWT"
                :precision="4"
                :min="0"
              />
            </a-form-item>

            <a-form-item
              label="Batch Size"
              name="BatchSize"
              :rules="[{ required: true, type: 'number', message: 'Required' }]"
            >
              <a-input-number
                class="w-full"
                placeholder="0.00"
                v-model:value="form.BatchSize"
                :precision="2"
                :min="0"
              />
            </a-form-item>
          </div>

          <a-form-item
            label="Carton"
            name="Carton"
            :rules="[{ required: true, type: 'number', message: 'Required' }]"
          >
            <a-input-number
              class="w-full"
              placeholder="0.00"
              v-model:value="form.Carton"
              :precision="2"
              :min="0"
            />
          </a-form-item>

          <a-form-item
            label="Trade Price"
            name="TradePrice"
            :rules="[{ required: true, type: 'number', message: 'Required' }]"
          >
            <a-input-number
              class="w-full"
              placeholder="0.0000"
              v-model:value="form.TradePrice"
              :precision="4"
              :min="0"
            />
          </a-form-item>

          <div class="grid grid-cols-2 gap-4">
            <a-form-item
              label="VAT (%)"
              name="VAT"
              :rules="[{ required: true, type: 'number', message: 'Required' }]"
            >
              <a-input-number
                class="w-full"
                placeholder="0.0000"
                v-model:value="form.VAT"
                :precision="4"
                :min="0"
              />
            </a-form-item>

            <a-form-item
              label="MRP"
              name="MRP"
              :rules="[{ required: true, type: 'number', message: 'Required' }]"
            >
              <a-input-number
                class="w-full"
                placeholder="0.0000"
                v-model:value="form.MRP"
                :precision="4"
                :min="0"
              />
            </a-form-item>
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
    </a-form>
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

const router = useRouter();
const formRef = ref(null);

const plants = ref([]);

onMounted(async () => {
  const allPlants = await fetchAllPlants();
  plants.value = allPlants;
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
  PackSizeWT: 0,
  BatchSize: 0,
  Carton: 0,
  TradePrice: 0,
  VAT: 0,
  MRP: 0,
  Business: "",
  SubBusinessCode: "",
  Active: "Y",
  MushokPrint: "N",
  CreateBy: "admin",
});

const isSaving = ref(false);

const save = async () => {
  try {
    await formRef.value.validate();
  } catch {
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

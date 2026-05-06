<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3 mb-5">
      <h1 class="text-2xl font-bold text-primary">Create Plant</h1>
      <button
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        @click="$router.push('/inventory/plant')"
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
            Plant Code <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input placeholder="e.g. P001" v-model:value="form.PlantCode" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Plant Name <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input placeholder="Plant name" v-model:value="form.PlantName" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-start">
          <label class="text-sm font-medium text-gray-700 mt-2">Address</label>
          <div class="col-span-3">
            <a-textarea placeholder="Plant address" v-model:value="form.PlantAddress" :rows="3" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Email</label>
          <div class="col-span-3">
            <a-input placeholder="plant@example.com" v-model:value="form.PlantEmail" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Phone</label>
          <div class="col-span-3">
            <a-input placeholder="+88017XXXXXXXX" v-model:value="form.PlantPhone" />
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="border rounded-lg p-5 space-y-4">
        <h2 class="font-bold text-gray-800">Other Settings</h2>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Depot Code</label>
          <div class="col-span-3">
            <a-input placeholder="e.g. D001" v-model:value="form.DepotCode" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">MM Plant ID</label>
          <div class="col-span-3">
            <a-input-number class="w-full" placeholder="0" v-model:value="form.MM_PlantId" :min="0" :precision="0" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Active</label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.Active">
              <a-select-option value="Y">Yes</a-select-option>
              <a-select-option value="N">No</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Update Undelivered</label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.UpdateUndeliverd">
              <a-select-option value="Y">Yes</a-select-option>
              <a-select-option value="N">No</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Production Receive</label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.ProductionReceive">
              <a-select-option value="Y">Yes</a-select-option>
              <a-select-option value="N">No</a-select-option>
            </a-select>
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
        @click="$router.push('/inventory/plant')"
        type="button"
      >
        Cancel
      </button>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";
import { clearPlantsCache } from "./plants-api";

const router = useRouter();

const form = ref({
  PlantCode: "",
  PlantName: "",
  PlantAddress: "",
  PlantEmail: "",
  PlantPhone: "",
  DepotCode: "",
  MM_PlantId: null,
  Active: "Y",
  UpdateUndeliverd: "N",
  ProductionReceive: "Y",
});

const isSaving = ref(false);

const save = async () => {
  if (!form.value.PlantCode?.trim()) { showNotification("error", "Please enter Plant Code"); return; }
  if (!form.value.PlantName?.trim()) { showNotification("error", "Please enter Plant Name"); return; }
  isSaving.value = true;
  try {
    const res = await axios.post(`${apiBase}/inventory/plant`, form.value, getToken());
    if (res?.data?.success !== false) {
      showNotification("success", res?.data?.message || "Plant created");
      clearPlantsCache();
      router.push("/inventory/plant");
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

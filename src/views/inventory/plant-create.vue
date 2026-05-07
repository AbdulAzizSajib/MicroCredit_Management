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
            <a-input placeholder="Max 4 chars (e.g. P001)" v-model:value="form.PlantCode" :maxlength="4" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Plant Name <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input placeholder="Plant name" v-model:value="form.PlantName" :maxlength="200" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-start">
          <label class="text-sm font-medium text-gray-700 mt-2">
            Address <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-textarea
              placeholder="Plant address"
              v-model:value="form.PlantAddress"
              :rows="3"
              :maxlength="100"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Email <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input placeholder="plant@example.com" v-model:value="form.PlantEmail" :maxlength="30" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Phone <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input placeholder="+88017XXXXXXXX" v-model:value="form.PlantPhone" :maxlength="20" />
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="border rounded-lg p-5 space-y-4">
        <h2 class="font-bold text-gray-800">Other Settings</h2>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">
            Depot Code <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-input placeholder="Max 10 chars (e.g. D001)" v-model:value="form.DepotCode" :maxlength="10" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">MM Plant ID</label>
          <div class="col-span-3">
            <a-input-number class="w-full" placeholder="0" v-model:value="form.MM_PlantId" :min="0" :precision="0" />
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

const validate = () => {
  const f = form.value;
  if (!f.PlantCode?.trim()) return "Please enter Plant Code";
  if (f.PlantCode.length > 4) return "Plant Code must be 4 characters max";
  if (!f.PlantName?.trim()) return "Please enter Plant Name";
  if (f.PlantName.length > 200) return "Plant Name must be 200 characters max";
  if (!f.PlantAddress?.trim()) return "Please enter Address";
  if (f.PlantAddress.length > 100) return "Address must be 100 characters max";
  if (!f.PlantEmail?.trim()) return "Please enter Email";
  if (f.PlantEmail.length > 30) return "Email must be 30 characters max";
  if (!/^\S+@\S+\.\S+$/.test(f.PlantEmail)) return "Email is invalid";
  if (!f.PlantPhone?.trim()) return "Please enter Phone";
  if (f.PlantPhone.length > 20) return "Phone must be 20 characters max";
  if (!f.DepotCode?.trim()) return "Please enter Depot Code";
  if (f.DepotCode.length > 10) return "Depot Code must be 10 characters max";
  if (!f.Active) return "Please select Active";
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

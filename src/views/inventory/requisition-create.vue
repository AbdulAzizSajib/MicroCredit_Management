<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-primary" data-aos="fade-right">
        Purchase Requisition Create
      </h1>
      <button
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        @click="$router.push('/inventory/requisition')"
      >
        Back to List
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5" data-aos="fade-up" data-aos-delay="100">
      <!-- Left: Product info (spans 2 columns on lg) -->
      <div class="lg:col-span-2 border rounded-lg p-5 space-y-4">
        <h2 class="font-bold text-gray-800">Product Information</h2>

        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-7">
            <label class="text-sm font-medium text-gray-700 block mb-1">Product <span class="text-red-500">*</span></label>
            <a-select
              show-search
              class="w-full"
              placeholder="Search Name of Product"
              v-model:value="form.product"
              :filter-option="filterOption"
            >
              <a-select-option v-for="p in products" :key="p" :value="p">{{ p }}</a-select-option>
            </a-select>
          </div>
          <div class="col-span-3">
            <label class="text-sm font-medium text-gray-700 block mb-1">Qty <span class="text-red-500">*</span></label>
            <a-input-number
              class="w-full"
              placeholder="Qty"
              v-model:value="form.qty"
              :min="1"
              :precision="0"
            />
          </div>
          <div class="col-span-2">
            <button
              class="w-full bg-primary text-white px-4 py-2 rounded font-bold hover:opacity-90 transition-opacity"
              @click="addItem"
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
                <th class="border border-white px-3 py-2 text-left">Item Details</th>
                <th class="border border-white px-3 py-2 text-right w-24">Qty</th>
                <th class="border border-white px-3 py-2 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in items" :key="idx">
                <td class="border px-3 py-2">{{ idx + 1 }}</td>
                <td class="border px-3 py-2">{{ item.product }}</td>
                <td class="border px-3 py-2 text-right">{{ item.qty }}</td>
                <td class="border px-3 py-2 text-center">
                  <button type="button" class="action-btn action-btn-danger" @click="removeItem(idx)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!items.length">
                <td colspan="4" class="px-3 py-4 border text-center text-gray-400 text-xs">No items added.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex gap-3 pt-2">
          <button class="bg-primary text-white px-5 py-2 rounded hover:opacity-90 transition-opacity" @click="save">
            Save
          </button>
          <button class="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition-colors" @click="$router.push('/inventory/requisition')">
            Cancel
          </button>
        </div>
      </div>

      <!-- Right: Other info -->
      <div class="border rounded-lg p-5 space-y-3">
        <h2 class="font-bold text-gray-800">Other Information</h2>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Date <span class="text-red-500">*</span></label>
          <div class="col-span-3">
            <a-date-picker class="w-full" placeholder="Date" v-model:value="other.date" format="DD-MM-YYYY" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Delivery Date <span class="text-red-500">*</span></label>
          <div class="col-span-3">
            <a-date-picker class="w-full" placeholder="Delivery Date" v-model:value="other.deliveryDate" format="DD-MM-YYYY" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Project <span class="text-red-500">*</span></label>
          <div class="col-span-3">
            <a-select class="w-full" placeholder="Search Project" v-model:value="other.project" show-search :filter-option="filterOption">
              <a-select-option v-for="p in projectOptions" :key="p" :value="p">{{ p }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Segment <span class="text-red-500">*</span></label>
          <div class="col-span-3">
            <a-select class="w-full" placeholder="Select Segment" v-model:value="other.segment">
              <a-select-option v-for="s in segmentOptions" :key="s" :value="s">{{ s }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Approve User <span class="text-red-500">*</span></label>
          <div class="col-span-3">
            <a-select class="w-full" placeholder="Select Next Approve User" v-model:value="other.approveUser">
              <a-select-option v-for="u in approveUsers" :key="u" :value="u">{{ u }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-start">
          <label class="text-sm font-medium text-gray-700 mt-2">Notes</label>
          <div class="col-span-3">
            <a-textarea class="w-full" placeholder="Enter Notes" v-model:value="other.notes" :rows="3" />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import MainLayout from "@/components/layouts/mainLayout.vue";

const router = useRouter();
const STORE_KEY = "inventory_requisitions";

const products = [
  "Shampling Pack-S CB2E", "Sav. Twinkle Pant BD M5", "Sav. Twinkle Pant BD M40",
  "Product A - 500g", "Product B - 1kg", "Product C - 250ml",
];
const projectOptions = ["Project Alpha", "Project Beta", "Project Gamma", "Consumer Pack"];
const segmentOptions = ["Segment 1", "Segment 2", "Segment 3", "Retail"];
const approveUsers = ["Manager A", "Manager B", "HOD Finance", "Director"];

const filterOption = (input, option) =>
  option.children?.[0]?.children?.toLowerCase?.().includes(input.toLowerCase()) ||
  String(option.value).toLowerCase().includes(input.toLowerCase());

const form = ref({ product: undefined, qty: null });
const items = ref([]);
const other = ref({
  date: dayjs(),
  deliveryDate: null,
  project: undefined,
  segment: undefined,
  approveUser: undefined,
  notes: "",
});

const addItem = () => {
  if (!form.value.product || !form.value.qty) return;
  items.value.push({ product: form.value.product, qty: form.value.qty });
  form.value = { product: undefined, qty: null };
};

const removeItem = (idx) => {
  items.value.splice(idx, 1);
};

const save = () => {
  if (!items.value.length || !other.value.date || !other.value.project || !other.value.segment) return;

  const existing = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
  const newEntry = {
    id: Date.now(),
    refNo: `REQ-${String(existing.length + 1).padStart(4, "0")}`,
    date: other.value.date ? dayjs(other.value.date).format("YYYY-MM-DD") : "",
    deliveryDate: other.value.deliveryDate ? dayjs(other.value.deliveryDate).format("YYYY-MM-DD") : "",
    project: other.value.project,
    segment: other.value.segment,
    approveUser: other.value.approveUser,
    notes: other.value.notes,
    items: [...items.value],
    status: "Pending",
  };
  existing.push(newEntry);
  localStorage.setItem(STORE_KEY, JSON.stringify(existing));
  router.push("/inventory/requisition");
};
</script>

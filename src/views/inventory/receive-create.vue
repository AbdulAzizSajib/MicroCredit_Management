<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-primary" data-aos="fade-right">
        Product Release By Production
      </h1>
      <button
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        @click="$router.push('/inventory/receive')"
      >
        Back to List
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 mt-5" data-aos="fade-up" data-aos-delay="100">
      <!-- Left column -->
      <div class="space-y-3">
        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Movement Type <span class="text-red-500">*</span></label>
          <div class="col-span-3">
            <a-select class="w-full" placeholder="Select..." v-model:value="form.movementType">
              <a-select-option v-for="t in movementTypes" :key="t" :value="t">{{ t }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Business</label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.business">
              <a-select-option v-for="b in businessOptions" :key="b" :value="b">{{ b }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Receive Date</label>
          <div class="col-span-3">
            <a-date-picker class="w-full" v-model:value="form.receiveDate" format="DD-MM-YYYY" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">FGTN No</label>
          <div class="col-span-3">
            <a-input placeholder="FGTN NO" v-model:value="form.fgtnNo" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Store</label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.store">
              <a-select-option v-for="s in storeOptions" :key="s" :value="s">{{ s }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Reference No</label>
          <div class="col-span-3">
            <a-input placeholder="REFERENCE NO" v-model:value="form.referenceNo" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Reference Date</label>
          <div class="col-span-3">
            <a-date-picker class="w-full" v-model:value="form.referenceDate" format="DD-MM-YYYY" />
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="space-y-3">
        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">Last Quarantine No</label>
          <div class="col-span-3">
            <a-input :value="lastQuarantineNo" readonly />
          </div>
        </div>
        <div class="grid grid-cols-4 gap-3 items-center">
          <div></div>
          <div class="col-span-3">
            <button class="bg-primary text-white w-full px-4 py-2 rounded hover:opacity-90 transition-opacity" @click="generateQuarantineNo">
              Get Receive No
            </button>
          </div>
        </div>
        <div v-if="form.generatedNo" class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700">New Quarantine No</label>
          <div class="col-span-3">
            <a-input :value="form.generatedNo" readonly />
          </div>
        </div>
      </div>
    </div>

    <h2 class="text-lg font-bold text-primary mt-6 mb-3" data-aos="fade-right" data-aos-delay="150">
      Quarantine Receive Details
    </h2>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="200">
      <table class="w-full min-w-[900px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-3 py-2 text-left">Product</th>
            <th class="border border-white px-3 py-2 text-left w-24">ProCode</th>
            <th class="border border-white px-3 py-2 text-left w-24">PackSize</th>
            <th class="border border-white px-3 py-2 text-left w-28">BatchNo</th>
            <th class="border border-white px-3 py-2 text-left w-44">Location</th>
            <th class="border border-white px-3 py-2 text-right w-28">Quantity</th>
            <th class="border border-white px-3 py-2 text-right w-24">Balance</th>
            <th class="border border-white px-3 py-2 w-16 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in detailRows" :key="idx">
            <td class="border px-2 py-1">
              <a-input v-model:value="row.product" :bordered="false" placeholder="Product name" />
            </td>
            <td class="border px-2 py-1">
              <a-input v-model:value="row.proCode" :bordered="false" />
            </td>
            <td class="border px-2 py-1">
              <a-input v-model:value="row.packSize" :bordered="false" />
            </td>
            <td class="border px-2 py-1">
              <a-input v-model:value="row.batchNo" :bordered="false" />
            </td>
            <td class="border px-2 py-1">
              <a-select class="w-full" :bordered="false" v-model:value="row.location">
                <a-select-option v-for="l in locationOptions" :key="l" :value="l">{{ l }}</a-select-option>
              </a-select>
            </td>
            <td class="border px-2 py-1">
              <a-input-number :bordered="false" class="w-full text-right" v-model:value="row.quantity" :min="0" />
            </td>
            <td class="border px-2 py-1 text-right text-gray-400">{{ row.balance ?? '' }}</td>
            <td class="border px-2 py-1 text-center">
              <button type="button" class="action-btn action-btn-danger" @click="removeRow(idx)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="!detailRows.length">
            <td colspan="8" class="px-3 py-4 border text-center text-gray-400 text-xs">No items. Click Add to insert a row.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-end gap-2 mt-3">
      <button class="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700" @click="addRow">Add</button>
      <button class="bg-red-500 text-white px-4 py-1.5 rounded text-sm hover:bg-red-600" @click="removeLastRow">Remove</button>
    </div>

    <div class="flex gap-3 mt-5">
      <button class="bg-primary text-white px-6 py-2 rounded hover:opacity-90 transition-opacity" @click="submit">
        Submit Goods Receive
      </button>
      <button class="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition-colors" @click="$router.push('/inventory/receive')">
        Cancel
      </button>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import MainLayout from "@/components/layouts/mainLayout.vue";

const router = useRouter();
const STORE_KEY = "inventory_receives";

const movementTypes = ["Transfer In", "Transfer Out", "Return", "Production Release"];
const businessOptions = ["Consumer", "Industrial", "Retail", "Export"];
const storeOptions = ["Sales", "Central Warehouse", "Production", "Dispatch"];
const locationOptions = ["Central Warehouse", "Warehouse A", "Warehouse B", "Cold Storage"];

const existing = () => JSON.parse(localStorage.getItem(STORE_KEY) || "[]");

const initLastQuarantineNo = () => {
  const list = existing();
  return list.length ? list[list.length - 1].quarantineNo : "P0012601246";
};
const lastQuarantineNo = ref(initLastQuarantineNo());

const form = ref({
  movementType: undefined,
  business: "Consumer",
  receiveDate: dayjs(),
  fgtnNo: "",
  store: "Sales",
  referenceNo: "",
  referenceDate: dayjs(),
  generatedNo: "",
});

const detailRows = ref([{ product: "", proCode: "", packSize: "", batchNo: "", location: "Central Warehouse", quantity: null, balance: null }]);

const generateQuarantineNo = () => {
  form.value.generatedNo = `P${String(Date.now()).slice(-10)}`;
};

const addRow = () => {
  detailRows.value.push({ product: "", proCode: "", packSize: "", batchNo: "", location: "Central Warehouse", quantity: null, balance: null });
};

const removeRow = (idx) => {
  detailRows.value.splice(idx, 1);
};

const removeLastRow = () => {
  if (detailRows.value.length > 0) detailRows.value.pop();
};

const submit = () => {
  if (!form.value.movementType) return;
  const list = existing();
  const entry = {
    id: Date.now(),
    quarantineNo: form.value.generatedNo || `P${String(Date.now()).slice(-10)}`,
    movementType: form.value.movementType,
    business: form.value.business,
    receiveDate: form.value.receiveDate ? dayjs(form.value.receiveDate).format("YYYY-MM-DD") : "",
    fgtnNo: form.value.fgtnNo,
    store: form.value.store,
    referenceNo: form.value.referenceNo,
    referenceDate: form.value.referenceDate ? dayjs(form.value.referenceDate).format("YYYY-MM-DD") : "",
    items: detailRows.value.filter((r) => r.product),
  };
  list.push(entry);
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
  router.push("/inventory/receive");
};
</script>

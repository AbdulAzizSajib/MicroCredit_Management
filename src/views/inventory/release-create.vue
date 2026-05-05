<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-primary" data-aos="fade-right">
        QC Release
      </h1>
      <button
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        @click="$router.push('/inventory/release')"
      >
        Back to List
      </button>
    </div>

    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-3 mt-5" data-aos="fade-up" data-aos-delay="100">
      <div class="flex items-center gap-2">
        <a-input
          placeholder="Enter Receive No"
          v-model:value="receiveNoInput"
          class="w-52"
          @pressEnter="loadReceiveNo"
        />
        <button class="bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition-opacity" @click="loadReceiveNo">
          Add
        </button>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">Last Receive No</label>
        <a-input :value="lastReceiveNo" readonly class="w-40" />
      </div>
    </div>

    <div class="overflow-x-auto mt-5" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[900px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-3 py-2 text-left w-28">Product Code</th>
            <th class="border border-white px-3 py-2 text-left">Product Name</th>
            <th class="border border-white px-3 py-2 text-right w-28">Quantity</th>
            <th class="border border-white px-3 py-2 text-left w-28">Batch No</th>
            <th class="border border-white px-3 py-2 text-right w-32">Release Quantity</th>
            <th class="border border-white px-3 py-2 text-left w-36">Exp. Date</th>
            <th class="border border-white px-3 py-2 w-16 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in products" :key="idx">
            <td class="border px-2 py-1">
              <a-input :value="row.productCode" :bordered="false" readonly />
            </td>
            <td class="border px-2 py-1">
              <a-input v-model:value="row.productName" :bordered="false" />
            </td>
            <td class="border px-2 py-1">
              <a-input-number :value="row.quantity" :bordered="false" class="w-full" readonly />
            </td>
            <td class="border px-2 py-1">
              <a-input :value="row.batchNo" :bordered="false" readonly />
            </td>
            <td class="border px-2 py-1">
              <a-input-number :bordered="false" class="w-full" v-model:value="row.releaseQty" :min="0" />
            </td>
            <td class="border px-2 py-1">
              <a-date-picker class="w-full" :bordered="false" v-model:value="row.expDate" format="DD-MM-YYYY" />
            </td>
            <td class="border px-2 py-1 text-center">
              <button type="button" class="action-btn action-btn-danger" @click="removeProduct(idx)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="!products.length">
            <td colspan="7" class="px-4 py-6 border text-center text-gray-400">Enter a Receive No and click Add to load products.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-end mt-3">
      <button class="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-300 font-medium" @click="addManualRow">
        + Add Row
      </button>
    </div>

    <div class="flex gap-3 mt-5">
      <button class="bg-primary text-white px-6 py-2 rounded hover:opacity-90 transition-opacity" @click="submit">
        Submit QC Release
      </button>
      <button class="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition-colors" @click="$router.push('/inventory/release')">
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
const STORE_KEY = "inventory_releases";
const RECEIVE_KEY = "inventory_receives";

const receiveNoInput = ref("");
const products = ref([]);

const initLastReceiveNo = () => {
  const list = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
  return list.length ? list[list.length - 1].receiveNo : "P0012601260";
};
const lastReceiveNo = ref(initLastReceiveNo());

const staticProducts = [
  { productCode: "BDAX", productName: "Sav. Twinkle Pant BD M5", quantity: 0, batchNo: "22PM037" },
  { productCode: "BDAZ", productName: "Sav. Twinkle Pant BD M40", quantity: 0, batchNo: "22PM037" },
  { productCode: "CB2E", productName: "Shampling Pack-S CB2E", quantity: 50, batchNo: "23PM001" },
];

const loadReceiveNo = () => {
  if (!receiveNoInput.value.trim()) return;
  const receives = JSON.parse(localStorage.getItem(RECEIVE_KEY) || "[]");
  const matched = receives.find((r) => r.quarantineNo === receiveNoInput.value.trim());
  if (matched?.items?.length) {
    products.value = matched.items.map((item) => ({
      productCode: item.proCode || item.productCode || "",
      productName: item.product || item.productName || "",
      quantity: item.quantity || 0,
      batchNo: item.batchNo || "",
      releaseQty: 0,
      expDate: null,
    }));
  } else {
    products.value = staticProducts.map((p) => ({ ...p, releaseQty: 0, expDate: null }));
  }
};

const addManualRow = () => {
  products.value.push({ productCode: "", productName: "", quantity: 0, batchNo: "", releaseQty: 0, expDate: null });
};

const removeProduct = (idx) => {
  products.value.splice(idx, 1);
};

const submit = () => {
  if (!products.value.length) return;
  const list = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
  const entry = {
    id: Date.now(),
    releaseNo: `QCR-${String(list.length + 1).padStart(4, "0")}`,
    receiveNo: receiveNoInput.value || "—",
    date: dayjs().format("YYYY-MM-DD"),
    products: products.value.map((p) => ({
      ...p,
      expDate: p.expDate ? dayjs(p.expDate).format("YYYY-MM-DD") : "",
    })),
  };
  list.push(entry);
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
  router.push("/inventory/release");
};
</script>

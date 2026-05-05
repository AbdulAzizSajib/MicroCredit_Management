<template>
  <MainLayout>
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-3">
      <a-input
        placeholder="Search here..."
        v-model:value="search"
        class="w-full sm:w-64"
      />
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
        <button
          class="bg-primary text-white px-4 py-2 rounded w-full sm:w-auto"
          @click="$router.push('/inventory/release/create')"
        >
          + New Release
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary mt-4 mb-4" data-aos="fade-right">
      QC Release
    </h1>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[800px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Release No</th>
            <th class="border border-white px-4 py-2">Receive No</th>
            <th class="border border-white px-4 py-2">Date</th>
            <th class="border border-white px-4 py-2 text-right">Products</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-for="(row, i) in filtered" :key="row.id">
            <td class="px-4 border">{{ i + 1 }}</td>
            <td class="px-4 border font-medium text-primary">{{ row.releaseNo }}</td>
            <td class="px-4 border">{{ row.receiveNo }}</td>
            <td class="px-4 border">{{ row.date }}</td>
            <td class="px-4 border text-right">{{ row.products.length }}</td>
            <td class="px-4 border text-center">
              <div class="flex justify-center items-center gap-1">
                <a-tooltip title="View">
                  <button type="button" class="action-btn action-btn-info" @click="viewRow(row)">
                    <i class="bi bi-eye"></i>
                  </button>
                </a-tooltip>
                <a-tooltip title="Delete">
                  <a-popconfirm title="Delete this release entry?" ok-text="Yes" cancel-text="No" @confirm="deleteRow(row.id)">
                    <button type="button" class="action-btn action-btn-danger">
                      <i class="bi bi-trash"></i>
                    </button>
                  </a-popconfirm>
                </a-tooltip>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="6" class="px-4 py-6 border text-center text-gray-400">No release records found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <a-modal v-model:open="viewModal" title="QC Release Details" :footer="null" width="800px">
      <div v-if="selected" class="space-y-3 text-sm">
        <div class="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Release No:</span>
            <span class="text-sm">{{ selected.releaseNo }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Receive No:</span>
            <span class="text-sm">{{ selected.receiveNo }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Date:</span>
            <span class="text-sm">{{ selected.date }}</span>
          </div>
        </div>
        <table class="w-full border border-collapse mt-2">
          <thead>
            <tr class="bg-primary text-white text-xs">
              <th class="border border-white px-3 py-1.5 text-left">Product Code</th>
              <th class="border border-white px-3 py-1.5 text-left">Product Name</th>
              <th class="border border-white px-3 py-1.5 text-right">Quantity</th>
              <th class="border border-white px-3 py-1.5 text-left">Batch No</th>
              <th class="border border-white px-3 py-1.5 text-right">Release Qty</th>
              <th class="border border-white px-3 py-1.5 text-left">Exp. Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, idx) in selected.products" :key="idx">
              <td class="px-3 py-1.5 border text-xs">{{ p.productCode }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ p.productName }}</td>
              <td class="px-3 py-1.5 border text-xs text-right">{{ p.quantity }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ p.batchNo }}</td>
              <td class="px-3 py-1.5 border text-xs text-right">{{ p.releaseQty }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ p.expDate || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";

const STORE_KEY = "inventory_releases";

const list = ref([]);
const search = ref("");
const viewModal = ref(false);
const selected = ref(null);

onMounted(() => {
  const saved = localStorage.getItem(STORE_KEY);
  list.value = saved ? JSON.parse(saved) : [];
});

const filtered = computed(() =>
  list.value.filter((r) =>
    !search.value ||
    r.receiveNo?.toLowerCase().includes(search.value.toLowerCase()) ||
    r.releaseNo?.toLowerCase().includes(search.value.toLowerCase())
  )
);

const viewRow = (row) => {
  selected.value = row;
  viewModal.value = true;
};

const deleteRow = (id) => {
  list.value = list.value.filter((r) => r.id !== id);
  localStorage.setItem(STORE_KEY, JSON.stringify(list.value));
};
</script>

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
          @click="$router.push('/inventory/receive/create')"
        >
          + New Receive
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary mt-4 mb-4" data-aos="fade-right">
      Goods Receive
    </h1>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[900px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Quarantine No</th>
            <th class="border border-white px-4 py-2">Receive Date</th>
            <th class="border border-white px-4 py-2">Movement Type</th>
            <th class="border border-white px-4 py-2">Business</th>
            <th class="border border-white px-4 py-2">Store</th>
            <th class="border border-white px-4 py-2">Reference No</th>
            <th class="border border-white px-4 py-2 text-right">Items</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-for="(row, i) in filtered" :key="row.id">
            <td class="px-4 border">{{ i + 1 }}</td>
            <td class="px-4 border font-medium text-primary">{{ row.quarantineNo }}</td>
            <td class="px-4 border">{{ row.receiveDate }}</td>
            <td class="px-4 border">{{ row.movementType }}</td>
            <td class="px-4 border">{{ row.business }}</td>
            <td class="px-4 border">{{ row.store }}</td>
            <td class="px-4 border">{{ row.referenceNo || '—' }}</td>
            <td class="px-4 border text-right">{{ row.items.length }}</td>
            <td class="px-4 border text-center">
              <div class="flex justify-center items-center gap-1">
                <a-tooltip title="View">
                  <button type="button" class="action-btn action-btn-info" @click="viewRow(row)">
                    <i class="bi bi-eye"></i>
                  </button>
                </a-tooltip>
                <a-tooltip title="Delete">
                  <a-popconfirm title="Delete this receive entry?" ok-text="Yes" cancel-text="No" @confirm="deleteRow(row.id)">
                    <button type="button" class="action-btn action-btn-danger">
                      <i class="bi bi-trash"></i>
                    </button>
                  </a-popconfirm>
                </a-tooltip>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="9" class="px-4 py-6 border text-center text-gray-400">No records found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <a-modal v-model:open="viewModal" title="Goods Receive Details" :footer="null" width="800px">
      <div v-if="selected" class="space-y-3 text-sm">
        <div class="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Quarantine No:</span>
            <span class="text-sm">{{ selected.quarantineNo }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Receive Date:</span>
            <span class="text-sm">{{ selected.receiveDate }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Movement Type:</span>
            <span class="text-sm">{{ selected.movementType }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Business:</span>
            <span class="text-sm">{{ selected.business }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Store:</span>
            <span class="text-sm">{{ selected.store }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">FGTN No:</span>
            <span class="text-sm">{{ selected.fgtnNo || '—' }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Reference No:</span>
            <span class="text-sm">{{ selected.referenceNo || '—' }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-sm text-gray-600">Reference Date:</span>
            <span class="text-sm">{{ selected.referenceDate || '—' }}</span>
          </div>
        </div>
        <table class="w-full border border-collapse mt-2">
          <thead>
            <tr class="bg-primary text-white text-xs">
              <th class="border border-white px-3 py-1.5 text-left">Product</th>
              <th class="border border-white px-3 py-1.5 text-left">ProCode</th>
              <th class="border border-white px-3 py-1.5 text-left">PackSize</th>
              <th class="border border-white px-3 py-1.5 text-left">BatchNo</th>
              <th class="border border-white px-3 py-1.5 text-left">Location</th>
              <th class="border border-white px-3 py-1.5 text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in selected.items" :key="idx">
              <td class="px-3 py-1.5 border text-xs">{{ item.product }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ item.proCode }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ item.packSize }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ item.batchNo }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ item.location }}</td>
              <td class="px-3 py-1.5 border text-xs text-right">{{ item.quantity }}</td>
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

const STORE_KEY = "inventory_receives";

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
    r.quarantineNo?.toLowerCase().includes(search.value.toLowerCase()) ||
    r.referenceNo?.toLowerCase().includes(search.value.toLowerCase())
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

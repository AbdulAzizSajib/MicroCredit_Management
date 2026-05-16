<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="w-full sm:w-64">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search Receive No / Quarantine No..."
            v-model:value="search"
            allow-clear
            @change="onSearchChange"
          />
        </div>
        <button
          class="bg-primary text-white px-4 py-2 rounded font-semibold sm:ml-auto"
          @click="$router.push('/inventory/release/create')"
        >
          + New Release
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4" data-aos="fade-right">
      QC Release ({{ total }})
      <Icon v-if="loading" class="size-7" icon="line-md:loading-loop" />
    </h1>

    <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[800px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Receive No</th>
            <th class="border border-white px-4 py-2">Quarantine No</th>
            <th class="border border-white px-4 py-2">Receive Date</th>
            <th class="border border-white px-4 py-2">FGTN No</th>
            <th class="border border-white px-4 py-2">Mushok</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in list" :key="row.ReceiveNo">
            <td class="px-4 border">{{ (page - 1) * per_page + i + 1 }}</td>
            <td class="px-4 border font-medium text-primary">{{ row.ReceiveNo }}</td>
            <td class="px-4 border">{{ row.QuarantineReceiveNo }}</td>
            <td class="px-4 border">{{ formatDate(row.ReceiveDate) }}</td>
            <td class="px-4 border">{{ row.FgtnNo || "—" }}</td>
            <td class="px-4 border">
              <span
                v-if="row.Mushok === 'Y'"
                class="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"
              >Yes</span>
              <span
                v-else-if="row.Mushok === 'N'"
                class="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600"
              >No</span>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="px-4 border text-center">
              <div class="flex justify-center items-center gap-1">
                <a-tooltip title="View">
                  <button
                    type="button"
                    class="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    @click="viewRow(row)"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                </a-tooltip>
                <a-tooltip title="Edit">
                  <button
                    type="button"
                    class="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    @click="$router.push({ path: '/inventory/release/edit', query: { ReceiveNo: row.ReceiveNo } })"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </a-tooltip>
                <a-popconfirm
                  title="Delete this QC Release?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteRow(row)"
                >
                  <button
                    type="button"
                    class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </a-popconfirm>
              </div>
            </td>
          </tr>
          <tr v-if="!list.length && !loading">
            <td colspan="7" class="px-4 py-6 border text-center text-gray-400">
              No records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <a-pagination
      class="mt-4"
      v-model:current="page"
      :page-size="per_page"
      :total="total"
      :show-size-changer="false"
      :show-total="(t) => `Total ${t} items`"
      @change="(p) => { page = p; fetchList(); }"
      v-if="total > per_page"
    />

    <a-modal v-model:open="viewModal" title="QC Release Details" :footer="null" width="800px">
      <div v-if="selected" class="space-y-3 text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-3">
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Receive No:</span>
            <span class="text-primary font-medium">{{ selected.ReceiveNo }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Quarantine No:</span>
            <span>{{ selected.QuarantineReceiveNo }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Receive Date:</span>
            <span>{{ formatDate(selected.ReceiveDate) }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">FGTN No:</span>
            <span>{{ selected.FgtnNo || "—" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Mushok:</span>
            <span>{{ selected.Mushok || "—" }}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="font-semibold text-gray-600">Created By:</span>
            <span>{{ selected.CreateBy || "—" }}</span>
          </div>
        </div>
        <div v-if="selected.Comment" class="border-b pb-2">
          <span class="font-semibold text-gray-600">Comment:</span>
          <span class="ml-2">{{ selected.Comment }}</span>
        </div>
        <table class="w-full border border-collapse mt-2">
          <thead>
            <tr class="bg-primary text-white text-xs">
              <th class="border border-white px-3 py-1.5 text-left">#</th>
              <th class="border border-white px-3 py-1.5 text-left">Product</th>
              <th class="border border-white px-3 py-1.5 text-left">Batch No</th>
              <th class="border border-white px-3 py-1.5 text-right">Qty</th>
              <th class="border border-white px-3 py-1.5 text-left">Storage Loc.</th>
              <th class="border border-white px-3 py-1.5 text-left">New Exp. Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in selectedDetails" :key="idx">
              <td class="px-3 py-1.5 border text-xs">{{ idx + 1 }}</td>
              <td class="px-3 py-1.5 border text-xs">
                <div class="font-medium">{{ item.ProductCode }}</div>
                <div class="text-gray-500">{{ item.ProductName || "" }}</div>
              </td>
              <td class="px-3 py-1.5 border text-xs">{{ item.BatchNo || "—" }}</td>
              <td class="px-3 py-1.5 border text-xs text-right">{{ item.Quantity }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ item.StorageLocationCode || "—" }}</td>
              <td class="px-3 py-1.5 border text-xs">{{ formatDate(item.NewExpireDate) || "—" }}</td>
            </tr>
            <tr v-if="!selectedDetails.length">
              <td colspan="6" class="px-3 py-3 border text-center text-gray-400 text-xs">
                No items.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";

const list = ref([]);
const total = ref(0);
const page = ref(1);
const per_page = ref(10);
const loading = ref(false);
const search = ref("");

const viewModal = ref(false);
const selected = ref(null);

const selectedDetails = computed(
  () => selected.value?.details ?? selected.value?.Items ?? selected.value?.items ?? [],
);

const formatDate = (val) => {
  if (!val) return "";
  const d = dayjs(val);
  return d.isValid() ? d.format("YYYY-MM-DD") : val;
};

let searchTimer = null;
const onSearchChange = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    fetchList();
  }, 350);
};

const fetchList = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      search: search.value || "",
      per_page: per_page.value,
      page: page.value,
    }).toString();
    const res = await axios.get(`${apiBase}/inventory/release?${params}`, getToken());
    const payload = res?.data?.data ?? res?.data;
    list.value = payload?.data ?? payload ?? [];
    total.value = payload?.total ?? list.value.length ?? 0;
  } catch (err) {
    list.value = [];
    total.value = 0;
    showNotification("error", err?.response?.data?.message || err?.message);
  } finally {
    loading.value = false;
  }
};

const viewRow = async (row) => {
  selected.value = row;
  viewModal.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/release/show?ReceiveNo=${encodeURIComponent(row.ReceiveNo)}`,
      getToken(),
    );
    const detail = res?.data?.data ?? res?.data;
    if (detail) selected.value = { ...row, ...detail };
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

const deleteRow = async (row) => {
  try {
    const res = await axios.delete(
      `${apiBase}/inventory/release?ReceiveNo=${encodeURIComponent(row.ReceiveNo)}`,
      getToken(),
    );
    showNotification(
      res?.data?.success !== false ? "success" : "error",
      res?.data?.message || "Deleted",
    );
    await fetchList();
  } catch (err) {
    showNotification("error", err?.response?.data?.message || err?.message);
  }
};

onMounted(() => fetchList());
</script>

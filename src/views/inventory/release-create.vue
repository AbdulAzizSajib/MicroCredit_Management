<template>
  <MainLayout>
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h1 class="text-2xl font-bold text-primary flex items-center gap-3" data-aos="fade-right">
        QC Release Create
        <Icon v-if="isLoadingNo" class="size-7" icon="line-md:loading-loop" />
      </h1>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Last Quarantine No:</span>
          <span class="px-3 py-1 rounded bg-primary/10 text-primary font-semibold text-sm">
            {{ lastQuarantineNo || "—" }}
          </span>
        </div>
        <button
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          @click="$router.push('/inventory/release')"
        >
          Back to List
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
      <!-- Left: Items Table -->
      <div class="lg:col-span-2 border rounded-lg p-5 space-y-4" data-aos="fade-up" data-aos-delay="100">
        <h2 class="font-bold text-gray-800">Release Details</h2>

        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Quarantine Receive No <span class="text-red-500">*</span>
          </label>
          <a-select
            :key="quarantinePickerKey"
            ref="quarantineSelectRef"
            show-search
            class="w-full"
            placeholder="Search Quarantine Receive No..."
            v-model:value="selectedQuarantineNo"
            :filter-option="false"
            :loading="quarantineSearching || itemsLoading"
            :not-found-content="quarantineSearching ? 'Searching...' : 'No records found'"
            @search="onQuarantineSearch"
            @select="onQuarantineSelect"
            @dropdown-visible-change="onQuarantineDropdownOpen"
          >
            <a-select-option
              v-for="q in quarantineOptions"
              :key="q.QuarantineReceiveNo"
              :value="q.QuarantineReceiveNo"
              :label="q.QuarantineReceiveNo"
            >
              <span class="font-medium">{{ q.QuarantineReceiveNo }}</span>
              <span class="text-gray-400 text-xs ml-2">{{ q.MovementId }} — {{ q.PlantCode }} ({{ q.ItemCount }} items)</span>
            </a-select-option>
          </a-select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[950px] border border-collapse text-sm">
            <thead>
              <tr class="bg-primary text-white text-xs">
                <th class="border border-white px-2 py-2 text-left w-10">S/L</th>
                <th class="border border-white px-2 py-2 text-left">Product</th>
                <th class="border border-white px-2 py-2 text-left w-28">Batch No</th>
                <th class="border border-white px-2 py-2 text-right w-24">QR Qty</th>
                <th class="border border-white px-2 py-2 text-right w-28">Available Qty</th>
                <th class="border border-white px-2 py-2 text-left w-32">Storage Loc.</th>
                <th class="border border-white px-2 py-2 text-right w-32">Release Qty</th>
                <th class="border border-white px-2 py-2 text-left w-36">New Exp. Date</th>
                <th class="border border-white px-2 py-2 w-12 text-center">Del</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in items" :key="idx">
                <td class="border px-2 py-1">{{ idx + 1 }}</td>
                <td class="border px-2 py-1">
                  <div class="text-xs font-medium">{{ it.ProductCode }}</div>
                  <div class="text-xs text-gray-500">{{ it.ProductName }}</div>
                </td>
                <td class="border px-2 py-1 text-xs">{{ it.BatchNo || "—" }}</td>
                <td class="border px-2 py-1 text-right text-xs">{{ it.Quantity }}</td>
                <td class="border px-2 py-1 text-right text-xs">{{ it.AvailableQuantity }}</td>
                <td class="border px-1 py-1">
                  <a-input
                    :bordered="false"
                    placeholder="e.g. CW"
                    v-model:value="it.StorageLocationCode"
                    class="w-full"
                  />
                </td>
                <td class="border px-1 py-1">
                  <a-input-number
                    class="w-full text-right"
                    :bordered="false"
                    v-model:value="it.ReleaseQty"
                    :min="0"
                    :precision="2"
                  />
                </td>
                <td class="border px-1 py-1">
                  <a-date-picker
                    class="w-full"
                    :bordered="false"
                    v-model:value="it.NewExpireDate"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </td>
                <td class="border px-1 py-1 text-center">
                  <button
                    type="button"
                    class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark"
                    @click="removeItem(idx)"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!items.length">
                <td colspan="9" class="px-3 py-4 border text-center text-gray-400 text-xs">
                  Search and select a Quarantine Receive No above to load products.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            class="bg-primary text-white px-5 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-60"
            :disabled="isSaving"
            @click="save"
            type="button"
          >
            {{ isSaving ? "Saving..." : "Submit QC Release" }}
          </button>
          <button
            class="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition-colors"
            @click="$router.push('/inventory/release')"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Right: Master Form -->
      <div class="border rounded-lg p-5 space-y-3" data-aos="fade-up" data-aos-delay="150">
        <h2 class="font-bold text-gray-800">Release Information</h2>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700 col-span-1">
            Receive Date <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-date-picker
              class="w-full"
              v-model:value="form.ReceiveDate"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700 col-span-1">FGTN No</label>
          <div class="col-span-3">
            <a-input placeholder="FGTN No" v-model:value="form.FgtnNo" :maxlength="50" />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-center">
          <label class="text-sm font-medium text-gray-700 col-span-1">
            Mushok <span class="text-red-500">*</span>
          </label>
          <div class="col-span-3">
            <a-select class="w-full" v-model:value="form.Mushok" placeholder="Select">
              <a-select-option value="Y">Y — Yes</a-select-option>
              <a-select-option value="N">N — No</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-start">
          <label class="text-sm font-medium text-gray-700 col-span-1 mt-2">Comment</label>
          <div class="col-span-3">
            <a-textarea
              placeholder="Comment"
              v-model:value="form.Comment"
              :rows="3"
              :maxlength="500"
            />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import axios from "axios";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import { getToken, showNotification } from "@/utilities/common";

const router = useRouter();

const isLoadingNo = ref(false);
const lastQuarantineNo = ref("");
const quarantineSelectRef = ref(null);
const quarantinePickerKey = ref(0);
const selectedQuarantineNo = ref(undefined);
const quarantineOptions = ref([]);
const quarantineSearching = ref(false);
let quarantineSearchTimer = null;

const itemsLoading = ref(false);
const isSaving = ref(false);
const items = ref([]);

const currentUser =
  JSON.parse(localStorage.getItem("user_info") || "null")?.UserId || "admin";

const form = ref({
  QuarantineReceiveNo: "",
  ReceiveDate: dayjs().format("YYYY-MM-DD"),
  FgtnNo: "",
  Mushok: "N",
  Comment: "",
  CreateBy: currentUser,
});

const searchQuarantines = async (val = "") => {
  quarantineSearching.value = true;
  try {
    const params = new URLSearchParams({ search: val }).toString();
    const res = await axios.get(
      `${apiBase}/inventory/receive/all?${params}`,
      getToken(),
    );
    const payload = res?.data?.data ?? res?.data;
    quarantineOptions.value = Array.isArray(payload) ? payload : (payload?.data ?? []);
  } catch {
    quarantineOptions.value = [];
  } finally {
    quarantineSearching.value = false;
  }
};

const onQuarantineSearch = (val) => {
  clearTimeout(quarantineSearchTimer);
  quarantineSearchTimer = setTimeout(() => searchQuarantines(val), 350);
};

const onQuarantineDropdownOpen = (open) => {
  if (open && quarantineOptions.value.length === 0) searchQuarantines("");
};

const onQuarantineSelect = async (val) => {
  if (!val) return;
  form.value.QuarantineReceiveNo = val;
  selectedQuarantineNo.value = undefined;
  quarantinePickerKey.value++;
  await loadByQuarantine(val);
  await nextTick();
  quarantineSelectRef.value?.focus?.();
};

const fetchLastQuarantineNo = async () => {
  isLoadingNo.value = true;
  try {
    const res = await axios.get(`${apiBase}/inventory/release/last`, getToken());
    const payload = res?.data?.data ?? res?.data;
    lastQuarantineNo.value = payload?.master?.QuarantineReceiveNo ?? "";
  } catch {
    lastQuarantineNo.value = "";
  } finally {
    isLoadingNo.value = false;
  }
};

const loadByQuarantine = async (qNo) => {
  itemsLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/inventory/release/by-quarantine?QuarantineReceiveNo=${encodeURIComponent(qNo)}`,
      getToken(),
    );
    const payload = res?.data?.data ?? res?.data;
    const rawItems =
      payload?.details ?? payload?.Items ?? payload?.items ?? [];
    if (!rawItems.length) {
      showNotification("warning", "No items found for this Quarantine Receive No.");
      return;
    }
    const newRows = rawItems.map((i) => ({
      ProductCode: i.ProductCode ?? "",
      ProductName: i.ProductName ?? "",
      BatchNo: i.BatchNo ?? "",
      Quantity: Number(i.Quantity) || 0,
      AvailableQuantity: Number(i.AvailableQuantity) || 0,
      StorageLocationCode: "",
      ReleaseQty: Number(i.AvailableQuantity) || null,
      NewExpireDate: i.ExpireDate ?? i.NewExpireDate ?? "",
    }));
    items.value.push(...newRows);
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    itemsLoading.value = false;
  }
};

const removeItem = (idx) => {
  items.value.splice(idx, 1);
};

const validate = () => {
  if (!form.value.QuarantineReceiveNo) return "Please select a Quarantine Receive No";
  if (!form.value.ReceiveDate) return "Please select a Receive Date";
  if (!form.value.Mushok) return "Please select Mushok";
  if (!items.value.length) return "No items loaded. Please select a Quarantine Receive No first.";
  for (let i = 0; i < items.value.length; i++) {
    const it = items.value[i];
    if (!it.StorageLocationCode?.trim())
      return `Row ${i + 1}: Storage Location is required`;
    if (!it.ReleaseQty || Number(it.ReleaseQty) <= 0)
      return `Row ${i + 1}: Release Quantity must be greater than 0`;
  }
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
    const payload = {
      QuarantineReceiveNo: form.value.QuarantineReceiveNo,
      ReceiveDate: form.value.ReceiveDate,
      FgtnNo: form.value.FgtnNo || "",
      Mushok: form.value.Mushok,
      Comment: form.value.Comment || "",
      CreateBy: form.value.CreateBy,
      details: items.value.map((it) => ({
        ProductCode: it.ProductCode,
        BatchNo: it.BatchNo,
        Quantity: Number(it.ReleaseQty),
        StorageLocationCode: it.StorageLocationCode,
        NewExpireDate: it.NewExpireDate || "",
      })),
    };
    const res = await axios.post(`${apiBase}/inventory/release`, payload, getToken());
    if (res?.data?.success !== false) {
      showNotification("success", res?.data?.message || "QC Release created");
      router.push("/inventory/release");
    } else {
      showNotification("error", res?.data?.message || "Failed to create");
    }
  } catch (e) {
    showNotification("error", e?.response?.data?.message || e?.message);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => fetchLastQuarantineNo());
</script>

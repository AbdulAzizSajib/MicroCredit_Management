<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="flex-1 min-w-[200px]">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search by id or type..."
            v-model:value="search"
            allow-clear
          />
        </div>
        <button
          class="bg-primary text-white px-4 py-2 rounded font-semibold sm:ml-auto"
          @click="openCreate"
        >
          + Create Movement Type
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary mb-4">
      Movement Types ({{ filtered.length }})
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[800px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Movement ID</th>
            <th class="border border-white px-4 py-2">Movement Type</th>
            <th class="border border-white px-4 py-2">Description</th>
            <th class="border border-white px-4 py-2 text-center">Production Data</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filtered" :key="row.MovementId">
            <td class="px-4 py-2 border">{{ i + 1 }}</td>
            <td class="px-4 py-2 border font-medium text-primary">{{ row.MovementId }}</td>
            <td class="px-4 py-2 border">{{ row.MovementType }}</td>
            <td class="px-4 py-2 border">{{ row.MovmentDescription || "-" }}</td>
            <td class="px-4 py-2 border text-center">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="row.ProductionData === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
              >
                {{ row.ProductionData === "Y" ? "Yes" : "No" }}
              </span>
            </td>
            <td class="px-4 py-2 border text-center">
              <div class="flex justify-center gap-x-2">
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
                    class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                    @click="openEdit(row)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </a-tooltip>
                <a-popconfirm
                  title="Delete this movement type?"
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
          <tr v-if="!filtered.length">
            <td colspan="6" class="px-4 py-6 border text-center text-gray-500">
              No movement type found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <a-modal
      v-model:open="formModal"
      :title="isEditing ? 'Edit Movement Type' : 'Create Movement Type'"
      :footer="null"
      width="600px"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Movement ID <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="3 chars (e.g. RCV)"
            v-model:value="form.MovementId"
            :maxlength="3"
            :disabled="isEditing"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Production Data <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.ProductionData">
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Movement Type <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Movement type name"
            v-model:value="form.MovementType"
            :maxlength="30"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">Description</label>
          <a-textarea
            placeholder="Describe the movement"
            v-model:value="form.MovmentDescription"
            :maxlength="100"
            :rows="3"
          />
        </div>
      </div>

      <div class="flex gap-3 mt-5 justify-end">
        <button
          class="bg-gray-200 text-gray-700 px-5 py-2 rounded hover:bg-gray-300"
          @click="formModal = false"
          type="button"
        >
          Cancel
        </button>
        <button
          class="bg-primary text-white px-5 py-2 rounded hover:opacity-90"
          @click="save"
          type="button"
        >
          {{ isEditing ? "Update" : "Save" }}
        </button>
      </div>
    </a-modal>

    <!-- View Modal -->
    <a-modal v-model:open="viewModal" title="Movement Type Details" :footer="null" width="520px">
      <div v-if="selected" class="grid grid-cols-1 gap-y-2 text-sm">
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Movement ID:</span>
          <span>{{ selected.MovementId }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Movement Type:</span>
          <span>{{ selected.MovementType }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Description:</span>
          <span class="text-right max-w-[60%]">{{ selected.MovmentDescription || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Production Data:</span>
          <span>{{ selected.ProductionData === "Y" ? "Yes" : "No" }}</span>
        </div>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { computed, ref } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { showNotification } from "@/utilities/common";

const list = ref([
  {
    MovementId: "RCV",
    MovementType: "Receive",
    MovmentDescription: "Goods received from supplier",
    ProductionData: "N",
  },
  {
    MovementId: "RLS",
    MovementType: "Release",
    MovmentDescription: "Goods released to customer",
    ProductionData: "N",
  },
  {
    MovementId: "PRD",
    MovementType: "Production",
    MovmentDescription: "Production output movement",
    ProductionData: "Y",
  },
]);

const search = ref("");

const filtered = computed(() => {
  const q = (search.value || "").trim().toLowerCase();
  if (!q) return list.value;
  return list.value.filter(
    (r) =>
      r.MovementId.toLowerCase().includes(q) ||
      r.MovementType.toLowerCase().includes(q),
  );
});

const formModal = ref(false);
const viewModal = ref(false);
const isEditing = ref(false);
const selected = ref(null);
const editingKey = ref(null);

const blank = () => ({
  MovementId: "",
  MovementType: "",
  MovmentDescription: "",
  ProductionData: "N",
});

const form = ref(blank());

const openCreate = () => {
  form.value = blank();
  isEditing.value = false;
  editingKey.value = null;
  formModal.value = true;
};

const openEdit = (row) => {
  form.value = { ...row };
  isEditing.value = true;
  editingKey.value = row.MovementId;
  formModal.value = true;
};

const viewRow = (row) => {
  selected.value = row;
  viewModal.value = true;
};

const validate = () => {
  const f = form.value;
  if (!f.MovementId?.trim()) return "Movement ID is required";
  if (f.MovementId.length > 3) return "Movement ID must be 3 characters max";
  if (!f.MovementType?.trim()) return "Movement Type is required";
  if (!f.ProductionData) return "Production Data is required";
  if (
    !isEditing.value &&
    list.value.some((r) => r.MovementId === f.MovementId)
  ) {
    return "Movement ID already exists";
  }
  return null;
};

const save = () => {
  const err = validate();
  if (err) {
    showNotification("error", err);
    return;
  }
  if (isEditing.value) {
    const idx = list.value.findIndex((r) => r.MovementId === editingKey.value);
    if (idx > -1) list.value[idx] = { ...form.value };
    showNotification("success", "Movement type updated");
  } else {
    list.value.push({ ...form.value });
    showNotification("success", "Movement type created");
  }
  formModal.value = false;
};

const deleteRow = (row) => {
  list.value = list.value.filter((r) => r.MovementId !== row.MovementId);
  showNotification("success", "Movement type deleted");
};
</script>

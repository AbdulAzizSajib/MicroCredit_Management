<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="flex-1 min-w-[200px]">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search by code, name or mobile..."
            v-model:value="search"
            allow-clear
          />
        </div>
        <div class="w-full sm:w-36">
          <label class="text-xs font-medium text-gray-600 block mb-1">Active</label>
          <a-select class="w-full" placeholder="All" v-model:value="filterActive" allow-clear>
            <a-select-option value="Y">Active</a-select-option>
            <a-select-option value="N">Inactive</a-select-option>
          </a-select>
        </div>
        <button
          class="bg-primary text-white px-4 py-2 rounded font-semibold sm:ml-auto"
          @click="openCreate"
        >
          + Create Supplier
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary mb-4">
      Suppliers ({{ filtered.length }})
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Code</th>
            <th class="border border-white px-4 py-2">Supplier Name</th>
            <th class="border border-white px-4 py-2">Address</th>
            <th class="border border-white px-4 py-2">Mobile No</th>
            <th class="border border-white px-4 py-2 text-center">Active</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filtered" :key="row.SupplierCode">
            <td class="px-4 py-2 border">{{ i + 1 }}</td>
            <td class="px-4 py-2 border font-medium text-primary">{{ row.SupplierCode || "-" }}</td>
            <td class="px-4 py-2 border">{{ row.SupplierName }}</td>
            <td class="px-4 py-2 border">{{ row.Address }}</td>
            <td class="px-4 py-2 border">{{ row.MobileNo }}</td>
            <td class="px-4 py-2 border text-center">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="row.Active === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
              >
                {{ row.Active === "Y" ? "Active" : "Inactive" }}
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
                  title="Delete this supplier?"
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
            <td colspan="7" class="px-4 py-6 border text-center text-gray-500">
              No supplier found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <a-modal
      v-model:open="formModal"
      :title="isEditing ? 'Edit Supplier' : 'Create Supplier'"
      :footer="null"
      width="640px"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Supplier Code
          </label>
          <a-input
            placeholder="e.g. SUP001"
            v-model:value="form.SupplierCode"
            :maxlength="10"
            :disabled="isEditing"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Active <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.Active">
            <a-select-option value="Y">Active</a-select-option>
            <a-select-option value="N">Inactive</a-select-option>
          </a-select>
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Supplier Name <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Supplier name"
            v-model:value="form.SupplierName"
            :maxlength="150"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Address <span class="text-red-500">*</span>
          </label>
          <a-textarea
            placeholder="Full address"
            v-model:value="form.Address"
            :maxlength="500"
            :rows="3"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Mobile No <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="+8801XXXXXXXXX"
            v-model:value="form.MobileNo"
            :maxlength="15"
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
    <a-modal v-model:open="viewModal" title="Supplier Details" :footer="null" width="560px">
      <div v-if="selected" class="grid grid-cols-1 gap-y-2 text-sm">
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Supplier Code:</span>
          <span>{{ selected.SupplierCode || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Supplier Name:</span>
          <span>{{ selected.SupplierName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Address:</span>
          <span class="text-right max-w-[60%]">{{ selected.Address }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Mobile No:</span>
          <span>{{ selected.MobileNo }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Active:</span>
          <span>{{ selected.Active === "Y" ? "Yes" : "No" }}</span>
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
    SupplierCode: "SUP001",
    SupplierName: "Beximco Pharmaceuticals Ltd.",
    Address: "19 Dhanmondi R/A, Road 7, Dhaka 1205",
    MobileNo: "+8801711000001",
    Active: "Y",
  },
  {
    SupplierCode: "SUP002",
    SupplierName: "Square Pharmaceuticals Ltd.",
    Address: "Mohakhali C/A, Dhaka 1212",
    MobileNo: "+8801711000002",
    Active: "Y",
  },
  {
    SupplierCode: "SUP003",
    SupplierName: "Incepta Pharmaceuticals Ltd.",
    Address: "40 Shahid Tajuddin Ahmed Sarani, Tejgaon I/A, Dhaka",
    MobileNo: "+8801711000003",
    Active: "N",
  },
]);

const search = ref("");
const filterActive = ref(undefined);

const filtered = computed(() => {
  const q = (search.value || "").trim().toLowerCase();
  return list.value.filter((r) => {
    if (filterActive.value && r.Active !== filterActive.value) return false;
    if (!q) return true;
    return (
      (r.SupplierCode || "").toLowerCase().includes(q) ||
      r.SupplierName.toLowerCase().includes(q) ||
      r.MobileNo.toLowerCase().includes(q)
    );
  });
});

const formModal = ref(false);
const viewModal = ref(false);
const isEditing = ref(false);
const selected = ref(null);
const editingKey = ref(null);

const blank = () => ({
  SupplierCode: "",
  SupplierName: "",
  Address: "",
  MobileNo: "",
  Active: "Y",
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
  editingKey.value = row.SupplierCode;
  formModal.value = true;
};

const viewRow = (row) => {
  selected.value = row;
  viewModal.value = true;
};

const validate = () => {
  const f = form.value;
  if (!f.SupplierName?.trim()) return "Supplier name is required";
  if (!f.Address?.trim()) return "Address is required";
  if (!f.MobileNo?.trim()) return "Mobile No is required";
  if (!f.Active) return "Active is required";
  if (f.SupplierCode && f.SupplierCode.length > 10) return "Supplier code max 10 chars";
  if (
    !isEditing.value &&
    f.SupplierCode &&
    list.value.some((r) => r.SupplierCode === f.SupplierCode)
  ) {
    return "Supplier code already exists";
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
    const idx = list.value.findIndex((r) => r.SupplierCode === editingKey.value);
    if (idx > -1) list.value[idx] = { ...form.value };
    showNotification("success", "Supplier updated");
  } else {
    list.value.push({ ...form.value });
    showNotification("success", "Supplier created");
  }
  formModal.value = false;
};

const deleteRow = (row) => {
  list.value = list.value.filter((r) => r.SupplierCode !== row.SupplierCode);
  showNotification("success", "Supplier deleted");
};
</script>

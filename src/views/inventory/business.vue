<template>
  <MainLayout>
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
        <div class="flex-1 min-w-[200px]">
          <label class="text-xs font-medium text-gray-600 block mb-1">Search</label>
          <a-input
            placeholder="Search by code, name or company..."
            v-model:value="search"
            allow-clear
          />
        </div>
        <button
          class="bg-primary text-white px-4 py-2 rounded font-semibold sm:ml-auto"
          @click="openCreate"
        >
          + Create Business
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary mb-4">
      Business ({{ filtered.length }})
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[1100px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Code</th>
            <th class="border border-white px-4 py-2">Business Name</th>
            <th class="border border-white px-4 py-2">Company Name</th>
            <th class="border border-white px-4 py-2">VAT Reg No</th>
            <th class="border border-white px-4 py-2">Address</th>
            <th class="border border-white px-4 py-2 text-center">Delivered</th>
            <th class="border border-white px-4 py-2 text-center">Inv Approved</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filtered" :key="row.Business">
            <td class="px-4 py-2 border">{{ i + 1 }}</td>
            <td class="px-4 py-2 border font-medium text-primary">{{ row.Business }}</td>
            <td class="px-4 py-2 border">{{ row.BusinessName }}</td>
            <td class="px-4 py-2 border">{{ row.CompanyName }}</td>
            <td class="px-4 py-2 border">{{ row.VatRegNo }}</td>
            <td class="px-4 py-2 border">{{ row.Address }}</td>
            <td class="px-4 py-2 border text-center">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="row.Delivered === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
              >
                {{ row.Delivered === "Y" ? "Yes" : "No" }}
              </span>
            </td>
            <td class="px-4 py-2 border text-center">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="row.InvApproved === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
              >
                {{ row.InvApproved === "Y" ? "Yes" : "No" }}
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
                  title="Delete this business?"
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
            <td colspan="9" class="px-4 py-6 border text-center text-gray-500">
              No business found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <a-modal
      v-model:open="formModal"
      :title="isEditing ? 'Edit Business' : 'Create Business'"
      :footer="null"
      width="700px"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Business Code <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="2 chars (e.g. 01)"
            v-model:value="form.Business"
            :maxlength="2"
            :disabled="isEditing"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Business Name <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Business name"
            v-model:value="form.BusinessName"
            :maxlength="40"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Company Name <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Company name"
            v-model:value="form.CompanyName"
            :maxlength="30"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            VAT Reg No <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="VAT registration number"
            v-model:value="form.VatRegNo"
            :maxlength="50"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Address <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Address"
            v-model:value="form.Address"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Stored</label>
          <a-select class="w-full" v-model:value="form.Stored" allow-clear>
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Stored Comment</label>
          <a-input
            placeholder="Comment"
            v-model:value="form.StoredComment"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Delivered <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.Delivered">
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Server Name <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Server name"
            v-model:value="form.ServerName"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Delivery Notification <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.DeliveryNotification">
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Inv Approved <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.InvApproved">
            <a-select-option value="Y">Yes</a-select-option>
            <a-select-option value="N">No</a-select-option>
          </a-select>
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
    <a-modal v-model:open="viewModal" title="Business Details" :footer="null" width="640px">
      <div v-if="selected" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Code:</span>
          <span>{{ selected.Business }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Business Name:</span>
          <span>{{ selected.BusinessName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Company Name:</span>
          <span>{{ selected.CompanyName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">VAT Reg No:</span>
          <span>{{ selected.VatRegNo }}</span>
        </div>
        <div class="flex justify-between border-b pb-1 col-span-2">
          <span class="font-semibold text-gray-600">Address:</span>
          <span>{{ selected.Address }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Stored:</span>
          <span>{{ selected.Stored || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Stored Comment:</span>
          <span>{{ selected.StoredComment || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Delivered:</span>
          <span>{{ selected.Delivered === "Y" ? "Yes" : "No" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Server Name:</span>
          <span>{{ selected.ServerName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Delivery Notification:</span>
          <span>{{ selected.DeliveryNotification === "Y" ? "Yes" : "No" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Inv Approved:</span>
          <span>{{ selected.InvApproved === "Y" ? "Yes" : "No" }}</span>
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
    Business: "01",
    BusinessName: "Pharma Division",
    CompanyName: "ACI Limited",
    VatRegNo: "VAT-001-PH",
    Address: "Tejgaon, Dhaka",
    Stored: "Y",
    StoredComment: "Main warehouse",
    Delivered: "Y",
    ServerName: "SRV-PH-01",
    DeliveryNotification: "Y",
    InvApproved: "Y",
  },
  {
    Business: "02",
    BusinessName: "Consumer Brands",
    CompanyName: "ACI Consumer Ltd.",
    VatRegNo: "VAT-002-CB",
    Address: "Gulshan, Dhaka",
    Stored: "N",
    StoredComment: "",
    Delivered: "Y",
    ServerName: "SRV-CB-02",
    DeliveryNotification: "N",
    InvApproved: "Y",
  },
  {
    Business: "03",
    BusinessName: "Agribusiness",
    CompanyName: "ACI Agro Ltd.",
    VatRegNo: "VAT-003-AG",
    Address: "Savar, Dhaka",
    Stored: "Y",
    StoredComment: "Cold storage",
    Delivered: "N",
    ServerName: "SRV-AG-03",
    DeliveryNotification: "Y",
    InvApproved: "N",
  },
]);

const search = ref("");

const filtered = computed(() => {
  const q = (search.value || "").trim().toLowerCase();
  if (!q) return list.value;
  return list.value.filter(
    (r) =>
      r.Business.toLowerCase().includes(q) ||
      r.BusinessName.toLowerCase().includes(q) ||
      r.CompanyName.toLowerCase().includes(q),
  );
});

const formModal = ref(false);
const viewModal = ref(false);
const isEditing = ref(false);
const selected = ref(null);
const editingKey = ref(null);

const blank = () => ({
  Business: "",
  BusinessName: "",
  CompanyName: "",
  VatRegNo: "",
  Address: "",
  Stored: undefined,
  StoredComment: "",
  Delivered: "Y",
  ServerName: "",
  DeliveryNotification: "Y",
  InvApproved: "Y",
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
  editingKey.value = row.Business;
  formModal.value = true;
};

const viewRow = (row) => {
  selected.value = row;
  viewModal.value = true;
};

const validate = () => {
  const f = form.value;
  if (!f.Business?.trim()) return "Business code is required";
  if (f.Business.length > 2) return "Business code must be 2 characters max";
  if (!f.BusinessName?.trim()) return "Business name is required";
  if (!f.CompanyName?.trim()) return "Company name is required";
  if (!f.VatRegNo?.trim()) return "VAT Reg No is required";
  if (!f.Address?.trim()) return "Address is required";
  if (!f.Delivered) return "Delivered is required";
  if (!f.ServerName?.trim()) return "Server Name is required";
  if (!f.DeliveryNotification) return "Delivery Notification is required";
  if (!f.InvApproved) return "Inv Approved is required";
  if (!isEditing.value && list.value.some((r) => r.Business === f.Business)) {
    return "Business code already exists";
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
    const idx = list.value.findIndex((r) => r.Business === editingKey.value);
    if (idx > -1) list.value[idx] = { ...form.value };
    showNotification("success", "Business updated");
  } else {
    list.value.push({ ...form.value });
    showNotification("success", "Business created");
  }
  formModal.value = false;
};

const deleteRow = (row) => {
  list.value = list.value.filter((r) => r.Business !== row.Business);
  showNotification("success", "Business deleted");
};
</script>

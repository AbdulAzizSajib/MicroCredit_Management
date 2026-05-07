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
          + Create Customer
        </button>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary mb-4">
      Customers ({{ filtered.length }})
    </h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[1100px] border border-collapse text-left text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">S/L</th>
            <th class="border border-white px-4 py-2">Code</th>
            <th class="border border-white px-4 py-2">Customer Name</th>
            <th class="border border-white px-4 py-2">Contact Person</th>
            <th class="border border-white px-4 py-2">Mobile</th>
            <th class="border border-white px-4 py-2">Business</th>
            <th class="border border-white px-4 py-2">Plant</th>
            <th class="border border-white px-4 py-2">Type</th>
            <th class="border border-white px-4 py-2 text-center">Active</th>
            <th class="border border-white px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filtered" :key="row.CustomerCode">
            <td class="px-4 py-2 border">{{ i + 1 }}</td>
            <td class="px-4 py-2 border font-medium text-primary">{{ row.CustomerCode }}</td>
            <td class="px-4 py-2 border">{{ row.CustomerName }}</td>
            <td class="px-4 py-2 border">{{ row.ContactPerson }}</td>
            <td class="px-4 py-2 border">{{ row.Mobile }}</td>
            <td class="px-4 py-2 border">{{ row.Business }}</td>
            <td class="px-4 py-2 border">{{ row.PlantCode }}</td>
            <td class="px-4 py-2 border">{{ row.CustomerType }}</td>
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
                  title="Delete this customer?"
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
            <td colspan="10" class="px-4 py-6 border text-center text-gray-500">
              No customer found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <a-modal
      v-model:open="formModal"
      :title="isEditing ? 'Edit Customer' : 'Create Customer'"
      :footer="null"
      width="780px"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Customer Code <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Max 10 chars"
            v-model:value="form.CustomerCode"
            :maxlength="10"
            :disabled="isEditing"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Customer Name <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Customer name"
            v-model:value="form.CustomerName"
            :maxlength="100"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Contact Person <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Contact name"
            v-model:value="form.ContactPerson"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Email <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="email@example.com"
            v-model:value="form.Email"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Phone <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Phone"
            v-model:value="form.Phone"
            :maxlength="50"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Mobile <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Mobile"
            v-model:value="form.Mobile"
            :maxlength="50"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Address Line 1 <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Address line 1"
            v-model:value="form.Add1"
            :maxlength="255"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Address Line 2 <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="Address line 2"
            v-model:value="form.Add2"
            :maxlength="255"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Business <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="2 chars"
            v-model:value="form.Business"
            :maxlength="2"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Plant Code <span class="text-red-500">*</span>
          </label>
          <a-input
            placeholder="4 chars"
            v-model:value="form.PlantCode"
            :maxlength="4"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Customer Type <span class="text-red-500">*</span>
          </label>
          <a-select class="w-full" v-model:value="form.CustomerType">
            <a-select-option value="RETAIL">RETAIL</a-select-option>
            <a-select-option value="WHOLESALE">WHOLESALE</a-select-option>
            <a-select-option value="DEALER">DEALER</a-select-option>
            <a-select-option value="CORPORATE">CORPORATE</a-select-option>
          </a-select>
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
    <a-modal v-model:open="viewModal" title="Customer Details" :footer="null" width="700px">
      <div v-if="selected" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Code:</span>
          <span>{{ selected.CustomerCode }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Customer Name:</span>
          <span>{{ selected.CustomerName }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Contact Person:</span>
          <span>{{ selected.ContactPerson }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Email:</span>
          <span>{{ selected.Email }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Phone:</span>
          <span>{{ selected.Phone }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Mobile:</span>
          <span>{{ selected.Mobile }}</span>
        </div>
        <div class="flex justify-between border-b pb-1 col-span-2">
          <span class="font-semibold text-gray-600">Address 1:</span>
          <span>{{ selected.Add1 }}</span>
        </div>
        <div class="flex justify-between border-b pb-1 col-span-2">
          <span class="font-semibold text-gray-600">Address 2:</span>
          <span>{{ selected.Add2 }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Business:</span>
          <span>{{ selected.Business }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Plant Code:</span>
          <span>{{ selected.PlantCode }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Customer Type:</span>
          <span>{{ selected.CustomerType }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Active:</span>
          <span>{{ selected.Active === "Y" ? "Yes" : "No" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Created:</span>
          <span>{{ selected.CreateDate || "-" }}</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold text-gray-600">Edited:</span>
          <span>{{ selected.EditDate || "-" }}</span>
        </div>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { computed, ref } from "vue";
import dayjs from "dayjs";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { showNotification } from "@/utilities/common";

const list = ref([
  {
    CustomerCode: "CUS001",
    CustomerName: "Lazz Pharma Ltd.",
    ContactPerson: "Rahim Uddin",
    Add1: "House 12, Road 5, Dhanmondi",
    Add2: "Dhaka 1205",
    Phone: "02-9123456",
    Mobile: "+8801712000001",
    Email: "rahim@lazzpharma.com",
    Business: "01",
    PlantCode: "P001",
    CustomerType: "WHOLESALE",
    CreateDate: "2025-01-15 10:00:00",
    EditDate: "2025-03-10 14:25:00",
    Active: "Y",
  },
  {
    CustomerCode: "CUS002",
    CustomerName: "Tamanna Pharmacy",
    ContactPerson: "Sadia Akter",
    Add1: "Shop 24, Mirpur 10",
    Add2: "Dhaka 1216",
    Phone: "02-8855221",
    Mobile: "+8801712000002",
    Email: "sadia@tamannapharma.bd",
    Business: "02",
    PlantCode: "P002",
    CustomerType: "RETAIL",
    CreateDate: "2025-02-08 09:30:00",
    EditDate: "",
    Active: "Y",
  },
  {
    CustomerCode: "CUS003",
    CustomerName: "Nandan Mega Shop",
    ContactPerson: "Karim Hossain",
    Add1: "Plot 14, Sector 7, Uttara",
    Add2: "Dhaka 1230",
    Phone: "02-7891122",
    Mobile: "+8801712000003",
    Email: "karim@nandan.com",
    Business: "03",
    PlantCode: "P001",
    CustomerType: "DEALER",
    CreateDate: "2024-11-20 16:45:00",
    EditDate: "2025-04-02 11:10:00",
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
      r.CustomerCode.toLowerCase().includes(q) ||
      r.CustomerName.toLowerCase().includes(q) ||
      r.Mobile.toLowerCase().includes(q)
    );
  });
});

const formModal = ref(false);
const viewModal = ref(false);
const isEditing = ref(false);
const selected = ref(null);
const editingKey = ref(null);

const blank = () => ({
  CustomerCode: "",
  CustomerName: "",
  ContactPerson: "",
  Add1: "",
  Add2: "",
  Phone: "",
  Mobile: "",
  Email: "",
  Business: "",
  PlantCode: "",
  CustomerType: "RETAIL",
  CreateDate: "",
  EditDate: "",
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
  editingKey.value = row.CustomerCode;
  formModal.value = true;
};

const viewRow = (row) => {
  selected.value = row;
  viewModal.value = true;
};

const validate = () => {
  const f = form.value;
  if (!f.CustomerCode?.trim()) return "Customer code is required";
  if (f.CustomerCode.length > 10) return "Customer code max 10 chars";
  if (!f.CustomerName?.trim()) return "Customer name is required";
  if (!f.ContactPerson?.trim()) return "Contact person is required";
  if (!f.Add1?.trim()) return "Address line 1 is required";
  if (!f.Add2?.trim()) return "Address line 2 is required";
  if (!f.Phone?.trim()) return "Phone is required";
  if (!f.Mobile?.trim()) return "Mobile is required";
  if (!f.Email?.trim()) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(f.Email)) return "Email is invalid";
  if (!f.Business?.trim()) return "Business is required";
  if (f.Business.length > 2) return "Business max 2 chars";
  if (!f.PlantCode?.trim()) return "Plant code is required";
  if (f.PlantCode.length > 4) return "Plant code max 4 chars";
  if (!f.CustomerType?.trim()) return "Customer type is required";
  if (!f.Active) return "Active is required";
  if (
    !isEditing.value &&
    list.value.some((r) => r.CustomerCode === f.CustomerCode)
  ) {
    return "Customer code already exists";
  }
  return null;
};

const save = () => {
  const err = validate();
  if (err) {
    showNotification("error", err);
    return;
  }
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  if (isEditing.value) {
    const idx = list.value.findIndex((r) => r.CustomerCode === editingKey.value);
    if (idx > -1) list.value[idx] = { ...form.value, EditDate: now };
    showNotification("success", "Customer updated");
  } else {
    list.value.push({ ...form.value, CreateDate: now, EditDate: "" });
    showNotification("success", "Customer created");
  }
  formModal.value = false;
};

const deleteRow = (row) => {
  list.value = list.value.filter((r) => r.CustomerCode !== row.CustomerCode);
  showNotification("success", "Customer deleted");
};
</script>

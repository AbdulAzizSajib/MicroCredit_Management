<template>
  <MainLayout>
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end sm:items-center gap-2 sm:gap-3">
      <a-input :placeholder="$t('common.searchHere')" v-model:value="search" class="w-full sm:w-64" />
      <a-range-picker
        v-model:value="dateRange"
        value-format="YYYY-MM-DD"
        format="DD-MMM-YYYY"
        class="w-full sm:w-auto"
      />
      <button
        class="bg-primary text-white px-4 py-2 rounded whitespace-nowrap w-full sm:w-auto"
        @click="openCreateModal"
      >
        {{ $t('collection.addCollection') }}
      </button>
    </div>

    <div class="flex flex-wrap justify-between items-center mb-4 gap-2 mt-5" data-aos="fade-right">
      <h1 class="text-2xl font-bold text-primary">
        {{ $t('collection.savingsPaid') }} ({{ filteredData.length }})
      </h1>
    </div>

    <div class="w-full overflow-x-auto" data-aos="fade-up" data-aos-delay="150">
      <table class="w-full min-w-[1100px] border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2 sticky left-0 bg-primary z-20">{{ $t('collection.customerName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('customer.customerBanglaName') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('common.period') }}</th>
            <th class="border border-white px-4 py-2 text-right">{{ $t('common.amount') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('common.date') }}</th>
            <th class="border border-white px-4 py-2">{{ $t('common.remarks') }}</th>
            <th class="border border-white px-4 py-2 text-center">{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-for="(item, index) in filteredData" :key="index">
            <td class="px-4 border sticky left-0 bg-white z-10">
              {{ item.CustomerName }}
              <span class="ml-1 text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">{{ item.CustomerCode }}</span>
            </td>
            <td class="px-4 border">{{ item.CustomerBanglaName }}</td>
            <td class="px-4 border">{{ formatPeriod(item.Period) }}</td>
            <td class="px-4 border text-right">{{ formatAmount(Number(item.Amount)) }}</td>
            <td class="px-4 border">{{ formatDate(item.Date) }}</td>
            <td class="px-4 border">{{ item.Remarks }}</td>
            <td class="px-4 border text-center">
              <div class="flex justify-center items-center gap-1">
                <a-tooltip :title="$t('common.edit')">
                  <button type="button" class="action-btn action-btn-edit" @click="openEditModal(item)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                </a-tooltip>
                <a-popconfirm @confirm="deleteCollection(item.ID)" :title="$t('common.areYouSure')"
                  :ok-text="$t('common.yes')" :cancel-text="$t('common.no')">
                  <a-tooltip :title="$t('common.delete')">
                    <button type="button" class="action-btn action-btn-danger">
                      <i class="bi bi-trash3"></i>
                    </button>
                  </a-tooltip>
                </a-popconfirm>
              </div>
            </td>
          </tr>
          <tr v-if="!filteredData.length">
            <td colspan="7" class="px-4 py-6 border text-center text-gray-500">{{ $t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <a-modal v-model:open="isCreateModalVisible" :title="$t('collection.addCollection')"
      @cancel="isCreateModalVisible = false" :footer="null" width="550px">
      <form @submit.prevent="createCollection">
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('collection.customerName') }} <span class="text-red-500">*</span></label>
            <a-input v-model:value="formData.CustomerName" placeholder="Member Name" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.customerBanglaName') }}</label>
            <a-input v-model:value="formData.CustomerBanglaName" placeholder="সদস্যের নাম" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.customerCode') }}</label>
            <a-input v-model:value="formData.CustomerCode" placeholder="C001" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.period') }} <span class="text-red-500">*</span></label>
            <a-month-picker v-model:value="formData.Period" value-format="YYYYMM" format="MMM YYYY" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.amount') }} <span class="text-red-500">*</span></label>
            <a-input-number v-model:value="formData.Amount" :min="0" :step="0.01" class="w-full" placeholder="Amount" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.date') }} <span class="text-red-500">*</span></label>
            <a-date-picker v-model:value="formData.Date" value-format="YYYY-MM-DD" format="DD-MMM-YYYY" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.remarks') }}</label>
            <a-input v-model:value="formData.Remarks" placeholder="Remarks" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" @click="isCreateModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors">
            {{ $t('common.close') }}
          </button>
          <button type="submit"
            class="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors">
            {{ $t('common.save') }}
          </button>
        </div>
      </form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal v-model:open="isEditModalVisible" :title="$t('collection.editCollection')"
      @cancel="isEditModalVisible = false" :footer="null" width="550px">
      <form @submit.prevent="updateCollection">
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('collection.customerName') }} <span class="text-red-500">*</span></label>
            <a-input v-model:value="editFormData.CustomerName" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.customerBanglaName') }}</label>
            <a-input v-model:value="editFormData.CustomerBanglaName" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('customer.customerCode') }}</label>
            <a-input :value="editFormData.CustomerCode" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.period') }} <span class="text-red-500">*</span></label>
            <a-month-picker v-model:value="editFormData.Period" value-format="YYYYMM" format="MMM YYYY" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.amount') }} <span class="text-red-500">*</span></label>
            <a-input-number v-model:value="editFormData.Amount" :min="0" :step="0.01" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.date') }} <span class="text-red-500">*</span></label>
            <a-date-picker v-model:value="editFormData.Date" value-format="YYYY-MM-DD" format="DD-MMM-YYYY" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('common.remarks') }}</label>
            <a-input v-model:value="editFormData.Remarks" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" @click="isEditModalVisible = false"
            class="px-6 py-2 rounded font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors">
            {{ $t('common.close') }}
          </button>
          <button type="submit"
            class="px-6 py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            {{ $t('common.update') }}
          </button>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import dayjs from "dayjs";

const search = ref("");
const dateRange = ref(["2024-07-01", "2026-04-30"]);

const buildSeed = () => {
  const members = [
    { code: "C014", name: "Belal", bn: "বেলাল", amount: 2000 },
    { code: "C013", name: "Poran", bn: "পরান", amount: 1000 },
    { code: "C012", name: "Arif", bn: "আরিফ", amount: 1000 },
    { code: "C011", name: "Sajib", bn: "সজীব", amount: 1500 },
    { code: "C010", name: "Saimon", bn: "সাইমন", amount: 1000 },
    { code: "C009", name: "Rifat", bn: "রিফাত", amount: 550 },
    { code: "C004", name: "Polash", bn: "পলাশ", amount: 1000 },
    { code: "C002", name: "Rafikul", bn: "রফিকুল", amount: 2000 },
  ];
  const months = [
    { period: "202412", date: "2024-12-01", remarks: "Dec" },
    { period: "202411", date: "2024-11-01", remarks: "Nov" },
    { period: "202410", date: "2024-10-01", remarks: "Oct" },
    { period: "202409", date: "2024-09-01", remarks: "Sep" },
    { period: "202408", date: "2024-08-01", remarks: "Aug" },
  ];
  const rows = [];
  let id = 1;
  members.forEach((m) => {
    months.forEach((mo) => {
      rows.push({
        ID: id++,
        CustomerCode: m.code,
        CustomerName: m.name,
        CustomerBanglaName: m.bn,
        Period: mo.period,
        Amount: m.amount,
        Date: mo.date,
        Remarks: mo.remarks,
      });
    });
  });
  return rows;
};

const data = ref(buildSeed());

const filteredData = computed(() => {
  const q = search.value.trim().toLowerCase();
  let rows = data.value;
  if (q) {
    rows = rows.filter((item) => {
      return (
        (item.CustomerName || "").toLowerCase().includes(q) ||
        (item.CustomerBanglaName || "").toLowerCase().includes(q) ||
        (item.CustomerCode || "").toLowerCase().includes(q) ||
        (item.Remarks || "").toLowerCase().includes(q)
      );
    });
  }
  if (dateRange.value?.length === 2 && dateRange.value[0] && dateRange.value[1]) {
    const from = dayjs(dateRange.value[0]);
    const to = dayjs(dateRange.value[1]);
    rows = rows.filter((item) => {
      const d = dayjs(item.Date);
      return d.isValid() && (d.isAfter(from.subtract(1, "day")) && d.isBefore(to.add(1, "day")));
    });
  }
  return rows;
});

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

const formatDate = (date) => (date ? dayjs(date).format("DD-MMM-YYYY") : "");

const formatPeriod = (period) => {
  if (!period || period.length < 6) return period || "";
  const year = period.slice(0, 4);
  const month = Number(period.slice(4, 6));
  return dayjs(`${year}-${String(month).padStart(2, "0")}-01`).format("MMM YYYY");
};

const blankForm = () => ({
  ID: null,
  CustomerCode: "",
  CustomerName: "",
  CustomerBanglaName: "",
  Period: "",
  Amount: null,
  Date: "",
  Remarks: "",
});

const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);
const formData = ref(blankForm());
const editFormData = ref(blankForm());

const openCreateModal = () => {
  formData.value = blankForm();
  isCreateModalVisible.value = true;
};

const createCollection = () => {
  if (!formData.value.CustomerName || !formData.value.Period || !formData.value.Amount || !formData.value.Date) return;
  const nextId = data.value.reduce((m, r) => (Number(r.ID) > m ? Number(r.ID) : m), 0) + 1;
  data.value.unshift({ ...formData.value, ID: nextId, Amount: Number(formData.value.Amount) });
  isCreateModalVisible.value = false;
};

const openEditModal = (item) => {
  editFormData.value = { ...item };
  isEditModalVisible.value = true;
};

const updateCollection = () => {
  const index = data.value.findIndex((d) => d.ID === editFormData.value.ID);
  if (index !== -1) {
    data.value[index] = { ...editFormData.value, Amount: Number(editFormData.value.Amount) };
  }
  isEditModalVisible.value = false;
};

const deleteCollection = (id) => {
  data.value = data.value.filter((d) => d.ID !== id);
};
</script>

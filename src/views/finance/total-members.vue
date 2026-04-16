<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-indigo-700">{{ $t('dashboard.totalMembers') }}</h1>
        <div class="flex items-center gap-2">
          <a-range-picker v-model:value="dateRange" value-format="YYYY-MM-DD" format="DD-MMM-YYYY"
            @change="handleDateChange" />
          <a-button @click="$router.back()">{{ $t('common.back') }}</a-button>
        </div>
      </div>

      <div class="">
        <div v-if="loading" class="text-center py-10">
          <a-spin size="large" />
        </div>

        <table v-else class="w-full border border-collapse text-left">
          <thead>
            <tr class="bg-primary text-white">
              <th class="border border-white px-4 py-2">#</th>
              <th class="border border-white px-4 py-2">{{ $t('customer.customerName') }}</th>
              <th class="border border-white px-4 py-2">{{ $t('customer.amCode') }}</th>
              <th class="border border-white px-4 py-2">{{ $t('common.details') }}</th>
              <th class="border border-white px-4 py-2">{{ $t('customer.customerCode') }}</th>
              <th class="border border-white px-4 py-2">{{ $t('customer.acType') }}</th>
              <th class="border border-white px-4 py-2">{{ $t('login.userId') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="members.length === 0">
              <td colspan="7" class="text-center py-4 text-gray-500">
                {{ $t('common.noData') }}
              </td>
            </tr>
            <template v-for="(group, gIndex) in groupedMembers" :key="group.MemberCode">
              <tr v-for="(item, i) in group.items" :key="item.AMCode">
                <td v-if="i === 0" class="px-4 border" :rowspan="group.items.length">
                  {{ gIndex + 1 }}
                </td>
                <td v-if="i === 0" class="px-4 border" :rowspan="group.items.length">
                  {{ group.CustomerName }}
                </td>
                <td class="px-4 border">{{ item.AMCode }}</td>
                <td class="px-4 border">{{ item.AMDetails }}</td>
                <td class="px-4 border">{{ item.MemberCode }}</td>
                <td class="px-4 border">{{ item.ACType1 }}</td>
                <td class="px-4 border">{{ item.UserId }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const members = ref([]);

const toYmd = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getCurrentMonthDateRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return [toYmd(start), toYmd(end)];
};

const defaultDateRange = getCurrentMonthDateRange();
const dateRange = ref([
  route.query.from_date || defaultDateRange[0],
  route.query.to_date || defaultDateRange[1],
]);

const groupedMembers = computed(() => {
  const map = new Map();
  members.value.forEach((item) => {
    const key = item.MemberCode;
    if (!map.has(key)) {
      const name = String(item.AMDetails || "")
        .replace(/\s+(Loan|Saving|Savings)$/i, "")
        .trim();
      map.set(key, {
        MemberCode: key,
        CustomerName: name,
        items: [],
      });
    }
    map.get(key).items.push(item);
  });
  return Array.from(map.values());
});

const fetchMembers = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (dateRange.value?.[0]) params.append("from_date", dateRange.value[0]);
    if (dateRange.value?.[1]) params.append("to_date", dateRange.value[1]);
    const qs = params.toString();
    const res = await axios.get(`${apiBase}/dashboard/members${qs ? `?${qs}` : ""}`, getToken());
    members.value = res?.data?.data || [];
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to fetch members.");
  } finally {
    loading.value = false;
  }
};

const handleDateChange = () => {
  router.replace({
    query: {
      ...route.query,
      from_date: dateRange.value?.[0] || undefined,
      to_date: dateRange.value?.[1] || undefined,
    },
  });
  fetchMembers();
};

onMounted(fetchMembers);
</script>

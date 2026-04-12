<template>
  <MainLayout>
    <div class="space-y-8 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-primary" data-aos="fade-right">{{ isCustomerDashboard ? $t('menu.customerDashboard') : $t('menu.accountantDashboard') }}</h1>

      <div v-if="loading" class="text-center py-12">
        <a-spin size="large" />
        <div class="mt-3 text-gray-500">{{ $t('common.loadingDashboard') }}</div>
      </div>

      <!-- Collection Summary (Customer Dashboard) -->
      <div v-if="isCustomerDashboard && collectionData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-card glass-purple cursor-pointer" @click="$router.push('/dashboard/total-members')" data-aos="fade-up" data-aos-delay="100">
          <div class="flex items-center gap-5">
            <div class="bg-purple-200/40 rounded-2xl p-4">
              <Icon icon="mdi:account-group-outline" class="text-purple-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-purple-400 uppercase tracking-wider">{{ $t('dashboard.totalMembers') }}</div>
              <div class="text-4xl font-extrabold text-purple-700 mt-1">{{ collectionData.TotalMemeber }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-blue cursor-pointer" @click="$router.push('/dashboard/should-pay')" data-aos="fade-up" data-aos-delay="200">
          <div class="flex items-center gap-5">
            <div class="bg-blue-200/40 rounded-2xl p-4">
              <Icon icon="mdi:cash-check" class="text-blue-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-blue-400 uppercase tracking-wider">{{ $t('dashboard.totalShouldPay') }}</div>
              <div class="text-4xl font-extrabold text-blue-700 mt-1">{{ formatAmount(Number(collectionData.totalShouldPay || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-green cursor-pointer" @click="$router.push('/dashboard/total-saving-details')" data-aos="fade-up" data-aos-delay="300">
          <div class="flex items-center gap-5">
            <div class="bg-green-200/40 rounded-2xl p-4">
              <Icon icon="mdi:piggy-bank-outline" class="text-green-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-green-400 uppercase tracking-wider">{{ $t('dashboard.totalSaving') }}</div>
              <div class="text-4xl font-extrabold text-green-700 mt-1">{{ formatAmount(Number(collectionData.TotalSaving || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-rose cursor-pointer" @click="$router.push('/dashboard/total-due-details')" data-aos="fade-up" data-aos-delay="400">
          <div class="flex items-center gap-5">
            <div class="bg-rose-200/40 rounded-2xl p-4">
              <Icon icon="mdi:alert-circle-outline" class="text-rose-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-rose-400 uppercase tracking-wider">{{ $t('dashboard.totalDue') }}</div>
              <div class="text-4xl font-extrabold text-rose-700 mt-1">{{ formatAmount(Number(collectionData.TotalDue || 0)) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Accountant Dashboard Cards -->
      <div v-if="!isCustomerDashboard && summaryData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="glass-card glass-purple cursor-pointer" @click="$router.push('/dashboard/total-members')"
          data-aos="fade-up" data-aos-delay="100">
          <div class="flex items-center gap-5">
            <div class="bg-purple-200/40 rounded-2xl p-4">
              <Icon icon="mdi:account-group-outline" class="text-purple-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-purple-400 uppercase tracking-wider">{{ $t('dashboard.totalMembers') }}</div>
              <div class="text-4xl font-extrabold text-purple-700 mt-1">{{ summaryData.allMemberCount }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-indigo cursor-pointer" @click="$router.push('/dashboard/loan-members')"
          data-aos="fade-up" data-aos-delay="200">
          <div class="flex items-center gap-5">
            <div class="bg-indigo-200/40 rounded-2xl p-4">
              <Icon icon="mdi:account-cash-outline" class="text-indigo-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-indigo-400 uppercase tracking-wider">{{ $t('dashboard.loanMembers') }}</div>
              <div class="text-4xl font-extrabold text-indigo-700 mt-1">{{ summaryData.loanMemberCount }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-green cursor-pointer" @click="$router.push('/dashboard/total-saving')"
          data-aos="fade-up" data-aos-delay="300">
          <div class="flex items-center gap-5">
            <div class="bg-green-200/40 rounded-2xl p-4">
              <Icon icon="mdi:piggy-bank-outline" class="text-green-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-green-400 uppercase tracking-wider">{{ $t('dashboard.totalSaving') }}</div>
              <div class="text-4xl font-extrabold text-green-700 mt-1">{{ formatAmount(Number(summaryData.totalSaving || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-blue cursor-pointer" @click="$router.push('/dashboard/total-loan')"
          data-aos="fade-up" data-aos-delay="400">
          <div class="flex items-center gap-5">
            <div class="bg-blue-200/40 rounded-2xl p-4">
              <Icon icon="mdi:bank-outline" class="text-blue-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-blue-400 uppercase tracking-wider">{{ $t('dashboard.totalLoan') }}</div>
              <div class="text-4xl font-extrabold text-blue-700 mt-1">{{ formatAmount(Number(summaryData.totalLoan || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-amber cursor-pointer" @click="$router.push('/dashboard/total-earning')"
          data-aos="fade-up" data-aos-delay="500">
          <div class="flex items-center gap-5">
            <div class="bg-amber-200/40 rounded-2xl p-4">
              <Icon icon="mdi:trending-up" class="text-amber-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-amber-400 uppercase tracking-wider">{{ $t('dashboard.totalEarning') }}</div>
              <div class="text-4xl font-extrabold text-amber-700 mt-1">{{ formatAmount(Number(summaryData.totalEarning || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-rose"
          data-aos="fade-up" data-aos-delay="600">
          <div class="flex items-center gap-5">
            <div class="bg-rose-200/40 rounded-2xl p-4">
              <Icon icon="mdi:wallet-outline" class="text-rose-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-rose-400 uppercase tracking-wider">{{ $t('dashboard.remainingBalance') }}</div>
              <div class="text-4xl font-extrabold text-rose-700 mt-1">{{ formatAmount(Number(summaryData.remaingBalance || 0)) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && !summaryData && !collectionData" class="text-center py-12 text-gray-500">{{ $t('common.noData') }}</div>
    </div>

  </MainLayout>
</template>

<style scoped>
.glass-card {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}
.glass-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
.glass-purple { background: linear-gradient(135deg, rgba(243, 232, 255, 0.7), rgba(233, 213, 255, 0.5)); }
.glass-indigo { background: linear-gradient(135deg, rgba(224, 231, 255, 0.7), rgba(199, 210, 254, 0.5)); }
.glass-green  { background: linear-gradient(135deg, rgba(220, 252, 231, 0.7), rgba(187, 247, 208, 0.5)); }
.glass-blue   { background: linear-gradient(135deg, rgba(219, 234, 254, 0.7), rgba(191, 219, 254, 0.5)); }
.glass-amber  { background: linear-gradient(135deg, rgba(254, 243, 199, 0.7), rgba(253, 230, 138, 0.5)); }
.glass-rose   { background: linear-gradient(135deg, rgba(255, 228, 230, 0.7), rgba(254, 205, 211, 0.5)); }
</style>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";
import { useI18n } from "vue-i18n";
import axios from "axios";

const { t } = useI18n();
const route = useRoute();

const isCustomerDashboard = computed(() => route.path === "/finance-dashboard");

const summaryData = ref(null);

const collectionData = ref(null);
const loading = ref(false);

const fetchSummary = async () => {
  try {
    loading.value = true;
    const res = await axios.get(`${apiBase}/gl-summary`, getToken());
    if (res.data?.success && res.data.data?.length) {
      summaryData.value = res.data.data[0];
    }
  } catch (error) {
    console.log(error);
    showNotification("error", t("dashboard.fetchError"));
  } finally {
    loading.value = false;
  }
};

const fetchCollectionSummary = async () => {
  try {
    loading.value = true;
    const res = await axios.get(`${apiBase}/collection-summary`, getToken());
    if (res.data?.success && res.data.data?.length) {
      collectionData.value = res.data.data[0];
    }
  } catch (error) {
    console.log(error);
    showNotification("error", t("dashboard.fetchError"));
  } finally {
    loading.value = false;
  }
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

onMounted(() => {
  if (isCustomerDashboard.value) {
    fetchCollectionSummary();
  }
  fetchSummary();
});
</script>

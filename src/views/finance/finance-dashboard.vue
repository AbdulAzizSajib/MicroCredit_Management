<template>
  <MainLayout>
    <div class="space-y-8 md:px-20 py-10">
      <div class="flex flex-wrap justify-between items-center gap-3">
        <h1 class="text-3xl font-bold text-primary" data-aos="fade-right">{{ isCustomerDashboard ?
          $t('menu.customerDashboard') : $t('menu.accountantDashboard') }}</h1>
        <div v-if="isCustomerDashboard" class="flex items-center gap-2">
          <a-range-picker v-model:value="dateRange" value-format="YYYY-MM-DD" format="DD-MMM-YYYY"
            @change="handleDateChange" />
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <a-spin size="large" />
        <div class="mt-3 text-gray-500">{{ $t('common.loadingDashboard') }}</div>
      </div>

      <!-- Collection Summary (Customer Dashboard) -->
      <!-- Collection Summary (Customer Dashboard) -->
      <div v-if="isCustomerDashboard && collectionData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card glass-purple cursor-pointer" @click="goToPage('/dashboard/total-members')"
          data-aos="fade-up" data-aos-delay="100">
          <div class="flex items-center gap-4">
            <div class="bg-purple-200/40 rounded-xl p-3">
              <Icon icon="mdi:account-group-outline" class="text-purple-600 text-3xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-xs font-semibold text-purple-400 uppercase tracking-wider">{{
                $t('dashboard.totalMembers') }}</div>
              <div class="text-2xl font-bold text-purple-700 mt-0.5">{{ collectionData.TotalMemeber }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-blue cursor-pointer" @click="goToPage('/dashboard/should-pay')" data-aos="fade-up"
          data-aos-delay="200">
          <div class="flex items-center gap-4">
            <div class="bg-blue-200/40 rounded-xl p-3">
              <Icon icon="mdi:cash-check" class="text-blue-600 text-3xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-xs font-semibold text-blue-400 uppercase tracking-wider">{{
                $t('dashboard.totalShouldPay') }}</div>
              <div class="text-2xl font-bold text-blue-700 mt-0.5">{{ formatAmount(Number(collectionData.totalShouldPay
                || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-green cursor-pointer" @click="goToPage('/dashboard/total-saving-details')"
          data-aos="fade-up" data-aos-delay="300">
          <div class="flex items-center gap-4">
            <div class="bg-green-200/40 rounded-xl p-3">
              <Icon icon="mdi:piggy-bank-outline" class="text-green-600 text-3xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-xs font-semibold text-green-400 uppercase tracking-wider">{{ $t('dashboard.totalSaving')
              }}</div>
              <div class="text-2xl font-bold text-green-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalSaving ||
                0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-rose cursor-pointer" @click="goToPage('/dashboard/total-due-details')"
          data-aos="fade-up" data-aos-delay="400">
          <div class="flex items-center gap-4">
            <div class="bg-rose-200/40 rounded-xl p-3">
              <Icon icon="mdi:alert-circle-outline" class="text-rose-600 text-3xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-xs font-semibold text-rose-400 uppercase tracking-wider">{{ $t('dashboard.totalDue') }}
              </div>
              <div class="text-2xl font-bold text-rose-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalDue || 0))
              }}</div>
            </div>
          </div>
        </div>

        <!-- Loan Summary Cards -->
        <div class="glass-card glass-amber cursor-pointer" @click="goToPage('/dashboard/interest-amount')"
          data-aos="fade-up" data-aos-delay="500">
          <div class="flex items-center gap-4">
            <div class="bg-amber-200/40 rounded-xl p-3">
              <Icon icon="mdi:percent-outline" class="text-amber-600 text-3xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-xs font-semibold text-amber-400 uppercase tracking-wider">{{ $t('loan.interestAmount') }}
              </div>
              <div class="text-2xl font-bold text-amber-700 mt-0.5">{{ formatAmount(Number(collectionData.InterestAmount
                || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-indigo cursor-pointer" @click="goToPage('/dashboard/total-loan-payable')"
          data-aos="fade-up" data-aos-delay="600">
          <div class="flex items-center gap-4">
            <div class="bg-indigo-200/40 rounded-xl p-3">
              <Icon icon="mdi:bank-outline" class="text-indigo-600 text-3xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{{ $t('loan.loanAmount') }}
              </div>
              <div class="text-2xl font-bold text-indigo-700 mt-0.5">{{ formatAmount(Number(collectionData.LoanAmount ||
                0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-green cursor-pointer" @click="goToPage('/dashboard/total-loan-paid')"
          data-aos="fade-up" data-aos-delay="700">
          <div class="flex items-center gap-4">
            <div class="bg-green-200/40 rounded-xl p-3">
              <Icon icon="mdi:cash-multiple" class="text-green-600 text-3xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-xs font-semibold text-green-400 uppercase tracking-wider">{{ $t('loan.totalPaid') }}
              </div>
              <div class="text-2xl font-bold text-green-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalPayment
                || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-rose cursor-pointer" @click="goToPage('/dashboard/total-loan-due')"
          data-aos="fade-up" data-aos-delay="800">
          <div class="flex items-center gap-4">
            <div class="bg-rose-200/40 rounded-xl p-3">
              <Icon icon="mdi:cash-clock" class="text-rose-600 text-3xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-xs font-semibold text-rose-400 uppercase tracking-wider">{{ $t('loan.remaining') }}</div>
              <div class="text-2xl font-bold text-rose-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalDueAmount
                || 0)) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Accountant Dashboard Cards -->
      <div v-if="!isCustomerDashboard" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 1. Total Savings Members -->
        <div class="glass-card glass-purple cursor-pointer" @click="goToSavingsMembers">
          <div class="flex items-center gap-5">
            <div class="bg-purple-200/40 rounded-2xl p-4">
              <Icon icon="mdi:account-group-outline" class="text-purple-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-purple-400 uppercase tracking-wider">{{
                $t('dashboard.totalSavingsMembers') }}</div>
              <div class="text-4xl font-extrabold text-purple-700 mt-1">{{ summaryData?.allMemberCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 2. Total Savings Voucher -->
        <div class="glass-card glass-blue cursor-pointer" @click="$router.push('/transaction/member-savings')">
          <div class="flex items-center gap-5">
            <div class="bg-blue-200/40 rounded-2xl p-4">
              <Icon icon="mdi:ticket-confirmation-outline" class="text-blue-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-blue-400 uppercase tracking-wider">{{ $t('dashboard.totalSavingsVoucher') }}</div>
              <div class="text-4xl font-extrabold text-blue-700 mt-1">{{ pendingCount?.ForSavingApprovalCount || 0 }}</div>
              <div class="text-sm font-bold text-blue-500 mt-0.5">৳ {{ formatAmount(Number(pendingCount?.ForSavingApprovalAmount || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 3. Total Savings Paid -->
        <div class="glass-card glass-green cursor-pointer" @click="$router.push('/dashboard/total-saving')">
          <div class="flex items-center gap-5">
            <div class="bg-green-200/40 rounded-2xl p-4">
              <Icon icon="mdi:piggy-bank-outline" class="text-green-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-green-400 uppercase tracking-wider">{{ $t('dashboard.totalSaving')
              }}</div>
              <div class="text-4xl font-extrabold text-green-700 mt-1">{{ formatAmount(Number(summaryData?.totalSaving ||
                0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 4. Remaining Balance -->
        <div class="glass-card glass-rose">
          <div class="flex items-center gap-5">
            <div class="bg-rose-200/40 rounded-2xl p-4">
              <Icon icon="mdi:wallet-outline" class="text-rose-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-rose-400 uppercase tracking-wider">{{
                $t('dashboard.remainingBalance') }}</div>
              <div class="text-4xl font-extrabold text-rose-700 mt-1">{{ formatAmount(Number(summaryData?.remaingBalance
                || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 5. Total Loan Members -->
        <div class="glass-card glass-indigo cursor-pointer" @click="$router.push('/dashboard/loan-members')">
          <div class="flex items-center gap-5">
            <div class="bg-indigo-200/40 rounded-2xl p-4">
              <Icon icon="mdi:account-cash-outline" class="text-indigo-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-indigo-400 uppercase tracking-wider">{{ $t('dashboard.totalLoanMembers')
              }}</div>
              <div class="text-4xl font-extrabold text-indigo-700 mt-1">{{ summaryData?.loanMemberCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 6. Total Loan Voucher -->
        <div class="glass-card glass-cyan cursor-pointer" @click="$router.push('/transaction/member-loan')">
          <div class="flex items-center gap-5">
            <div class="bg-cyan-200/40 rounded-2xl p-4">
              <Icon icon="mdi:file-document-multiple-outline" class="text-cyan-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-cyan-400 uppercase tracking-wider">{{ $t('dashboard.totalLoanVoucher') }}</div>
              <div class="text-4xl font-extrabold text-cyan-700 mt-1">{{ loanPendingCount?.ForLoanApprovalCount || 0 }}</div>
              <div class="text-sm font-bold text-cyan-500 mt-0.5">৳ {{ formatAmount(Number(loanPendingCount?.ForLoanApprovalAmount || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 7. Total Loan Posted -->
        <div class="glass-card glass-teal cursor-pointer" @click="$router.push('/dashboard/total-loan')">
          <div class="flex items-center gap-5">
            <div class="bg-teal-200/40 rounded-2xl p-4">
              <Icon icon="mdi:bank-outline" class="text-teal-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-teal-400 uppercase tracking-wider">{{ $t('dashboard.totalLoanPosted') }}
              </div>
              <div class="text-4xl font-extrabold text-teal-700 mt-1">{{ formatAmount(Number(summaryData?.totalLoan ||
                0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 8. Total Earning -->
        <div class="glass-card glass-amber cursor-pointer" @click="$router.push('/dashboard/total-earning')">
          <div class="flex items-center gap-5">
            <div class="bg-amber-200/40 rounded-2xl p-4">
              <Icon icon="mdi:trending-up" class="text-amber-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-amber-400 uppercase tracking-wider">{{ $t('dashboard.totalEarning')
              }}</div>
              <div class="text-4xl font-extrabold text-amber-700 mt-1">{{ formatAmount(Number(summaryData?.totalEarning
                || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 9. Total Savings Payable -->
        <div class="glass-card glass-fuchsia cursor-pointer" @click="goToSavingsPayable">
          <div class="flex items-center gap-5">
            <div class="bg-fuchsia-200/40 rounded-2xl p-4">
              <Icon icon="mdi:cash-check" class="text-fuchsia-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-fuchsia-400 uppercase tracking-wider">{{ $t('dashboard.totalShouldPay') }}</div>
              <div class="text-4xl font-extrabold text-fuchsia-700 mt-1">{{ formatAmount(Number(collectionData?.totalShouldPay || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 10. Remaining Collection -->
        <div class="glass-card glass-orange">
          <div class="flex items-center gap-5">
            <div class="bg-orange-200/40 rounded-2xl p-4">
              <Icon icon="mdi:cash-clock" class="text-orange-600 text-5xl" />
            </div>
            <div class="flex-1 text-right">
              <div class="text-sm font-semibold text-orange-400 uppercase tracking-wider">{{ $t('dashboard.remainingCollection') }}</div>
              <div class="text-4xl font-extrabold text-orange-700 mt-1">{{ formatAmount(remainingCollection) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && !summaryData && !collectionData" class="text-center py-12 text-gray-500">{{
        $t('common.noData') }}</div>
    </div>

  </MainLayout>
</template>

<style scoped>
.glass-card {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.glass-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.glass-purple {
  background: linear-gradient(135deg, rgba(243, 232, 255, 0.7), rgba(233, 213, 255, 0.5));
}

.glass-indigo {
  background: linear-gradient(135deg, rgba(224, 231, 255, 0.7), rgba(199, 210, 254, 0.5));
}

.glass-green {
  background: linear-gradient(135deg, rgba(220, 252, 231, 0.7), rgba(187, 247, 208, 0.5));
}

.glass-blue {
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.7), rgba(191, 219, 254, 0.5));
}

.glass-amber {
  background: linear-gradient(135deg, rgba(254, 243, 199, 0.7), rgba(253, 230, 138, 0.5));
}

.glass-rose {
  background: linear-gradient(135deg, rgba(255, 228, 230, 0.7), rgba(254, 205, 211, 0.5));
}

.glass-cyan {
  background: linear-gradient(135deg, rgba(207, 250, 254, 0.7), rgba(165, 243, 252, 0.5));
}

.glass-teal {
  background: linear-gradient(135deg, rgba(204, 251, 241, 0.7), rgba(153, 246, 228, 0.5));
}

.glass-fuchsia {
  background: linear-gradient(135deg, rgba(250, 232, 255, 0.7), rgba(245, 208, 254, 0.5));
}

.glass-orange {
  background: linear-gradient(135deg, rgba(255, 237, 213, 0.7), rgba(254, 215, 170, 0.5));
}
</style>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
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
const pendingCount = ref(null);
const loanPendingCount = ref(null);

const collectionData = ref(null);
const loading = ref(false);

const remainingCollection = computed(() => {
  const payable = Number(collectionData.value?.totalShouldPay || 0);
  const posted = Number(summaryData.value?.totalSaving || 0);
  return payable - posted;
});

const getDateRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const lastDayOfMonth = String(new Date(year, now.getMonth() + 1, 0).getDate()).padStart(2, "0");

  return [`2024-07-01`, `${year}-${month}-${lastDayOfMonth}`];
};

const dateRange = ref(getDateRange());

const router = useRouter();

const buildDateQuery = () => {
  if (dateRange.value?.length === 2 && dateRange.value[0] && dateRange.value[1]) {
    return `?from_date=${dateRange.value[0]}&to_date=${dateRange.value[1]}`;
  }
  return "";
};

const goToPage = (path) => {
  const query = {};
  if (dateRange.value?.length === 2 && dateRange.value[0] && dateRange.value[1]) {
    query.from_date = dateRange.value[0];
    query.to_date = dateRange.value[1];
  }
  router.push({ path, query });
};

const goToSavingsMembers = () => {
  const [from, to] = getDateRange();
  router.push({
    path: "/dashboard/total-members",
    query: { from_date: from, to_date: to },
  });
};

const goToSavingsPayable = () => {
  const [from, to] = getDateRange();
  router.push({
    path: "/dashboard/should-pay",
    query: { from_date: from, to_date: to },
  });
};

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
    const res = await axios.get(`${apiBase}/collection-summary${buildDateQuery()}`, getToken());
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

const handleDateChange = () => {
  fetchCollectionSummary();
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const fetchPendingCount = async () => {
  try {
    const res = await axios.get(`${apiBase}/member-collection-voucher/pending-count`, getToken());
    pendingCount.value = res.data || null;
  } catch (error) {
    console.log(error);
  }
};

const fetchLoanPendingCount = async () => {
  try {
    const res = await axios.get(`${apiBase}/pay-loan-voucher/pending-count`, getToken());
    loanPendingCount.value = res.data || null;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchCollectionSummary();
  fetchSummary();
  fetchPendingCount();
  fetchLoanPendingCount();
});
</script>
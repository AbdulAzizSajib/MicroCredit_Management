<template>
  <MainLayout>
    <div class="space-y-8 px-4 md:px-6 xl:px-10 2xl:px-20 py-10">
      <!-- Header (Customer Dashboard) -->
      <div v-if="isCustomerDashboard" class="flex flex-wrap justify-between items-center gap-3">
        <h1 class="text-3xl font-bold text-primary" data-aos="fade-right">{{ $t('menu.customerDashboard') }}</h1>
        <div class="flex items-center gap-2">
          <a-range-picker v-model:value="dateRange" value-format="YYYY-MM-DD" format="DD-MMM-YYYY"
            @change="handleDateChange" />
        </div>
      </div>

      <!-- Hero Header (Accountant Dashboard) -->
      <div v-if="!isCustomerDashboard" class="dashboard-hero relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-10" data-aos="fade-down">
        <div class="hero-blob hero-blob-1"></div>
        <div class="hero-blob hero-blob-2"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
              <Icon icon="mdi:calendar-blank-outline" class="text-base" />
              <span>{{ todayDisplay }}</span>
            </div>
            <h1 class="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
              {{ $t('menu.accountantDashboard') }}
            </h1>
            <p class="text-white/70 text-sm md:text-base mt-2 max-w-2xl">
              Real-time overview of members, savings, loans, vouchers and overall financial health.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button
              class="hero-action-btn"
              @click="refreshAll"
              :disabled="loading"
            >
              <Icon :icon="loading ? 'line-md:loading-loop' : 'mdi:refresh'" class="text-lg" />
              <span class="font-semibold">Refresh</span>
            </button>
          </div>
        </div>

        <!-- KPI Strip -->
        <div class="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="kpi-pill">
            <div class="kpi-pill-icon"><Icon icon="mdi:bank-check" /></div>
            <div class="min-w-0">
              <div class="kpi-pill-label">{{ $t('dashboard.availableBalance') }}</div>
              <div class="kpi-pill-value">{{ formatAmount(availableBalance) }}</div>
            </div>
          </div>
          <div class="kpi-pill">
            <div class="kpi-pill-icon"><Icon icon="mdi:trending-up" /></div>
            <div class="min-w-0">
              <div class="kpi-pill-label">{{ $t('dashboard.totalEarning') }}</div>
              <div class="kpi-pill-value">{{ formatAmount(Number(summaryData?.totalEarning || 0)) }}</div>
            </div>
          </div>
          <div class="kpi-pill">
            <div class="kpi-pill-icon"><Icon icon="mdi:account-group-outline" /></div>
            <div class="min-w-0">
              <div class="kpi-pill-label">{{ $t('dashboard.totalSavingsMembers') }}</div>
              <div class="kpi-pill-value">{{ summaryData?.allMemberCount || 0 }}</div>
            </div>
          </div>
          <div class="kpi-pill">
            <div class="kpi-pill-icon"><Icon icon="mdi:wallet-outline" /></div>
            <div class="min-w-0">
              <div class="kpi-pill-label">{{ $t('dashboard.totalBalanceDue') }}</div>
              <div class="kpi-pill-value">{{ formatAmount(totalBalanceDue) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <a-spin size="large" />
        <div class="mt-3 text-gray-500">{{ $t('common.loadingDashboard') }}</div>
      </div>

      <!-- Collection Summary (Customer Dashboard) -->
      <!-- Collection Summary (Customer Dashboard) -->
      <div v-if="isCustomerDashboard && collectionData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card glass-purple cursor-pointer" @click="goToPage('/savings/customer')"
          data-aos="fade-up" data-aos-delay="100">
          <div class="flex items-center gap-4">
            <div class="bg-purple-200/40 rounded-xl p-3">
              <Icon icon="mdi:account-group-outline" class="text-purple-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-purple-400 uppercase tracking-wider leading-tight">{{
                $t('dashboard.cashierSavingsMembers') }}</div>
              <div class="text-2xl font-bold text-purple-700 mt-0.5">{{ collectionData.TotalMemeber }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-blue cursor-pointer" @click="goToPage('/savings/customer', { showSavingsPayable: 1 })" data-aos="fade-up"
          data-aos-delay="200">
          <div class="flex items-center gap-4">
            <div class="bg-blue-200/40 rounded-xl p-3">
              <Icon icon="mdi:cash-check" class="text-blue-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-blue-400 uppercase tracking-wider leading-tight">{{
                $t('dashboard.totalShouldPay') }}</div>
              <div class="text-2xl font-bold text-blue-700 mt-0.5">{{ formatAmount(Number(collectionData.totalShouldPay
                || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-green cursor-pointer" @click="goToPageWithTotal('/savings/member-collection', collectionData.TotalSaving, 'savingsPaid')"
          data-aos="fade-up" data-aos-delay="300">
          <div class="flex items-center gap-4">
            <div class="bg-green-200/40 rounded-xl p-3">
              <Icon icon="mdi:piggy-bank-outline" class="text-green-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-green-400 uppercase tracking-wider leading-tight">{{ $t('dashboard.cashierSavingsPaid')
              }}</div>
              <div class="text-2xl font-bold text-green-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalSaving ||
                0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-rose cursor-pointer" @click="goToPageWithTotal('/savings/customer', collectionData.TotalDue, 'savingsDue')"
          data-aos="fade-up" data-aos-delay="400">
          <div class="flex items-center gap-4">
            <div class="bg-rose-200/40 rounded-xl p-3">
              <Icon icon="mdi:alert-circle-outline" class="text-rose-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-rose-400 uppercase tracking-wider leading-tight">{{ $t('dashboard.totalDue') }}
              </div>
              <div class="text-2xl font-bold text-rose-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalDue || 0))
              }}</div>
            </div>
          </div>
        </div>

        <!-- Loan Summary Cards -->
        <div class="glass-card glass-indigo cursor-pointer" @click="goToPage('/savings/loan-member')"
          data-aos="fade-up" data-aos-delay="500">
          <div class="flex items-center gap-4">
            <div class="bg-indigo-200/40 rounded-xl p-3">
              <Icon icon="mdi:account-cash-outline" class="text-indigo-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-indigo-400 uppercase tracking-wider leading-tight">{{ $t('dashboard.cashierLoanMembers') }}</div>
              <div class="text-2xl font-bold text-indigo-700 mt-0.5">{{ collectionData.TotalLoanMemeber || collectionData.TotalLoanMembers || collectionData.LoanMemberCount || 0 }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-indigo cursor-pointer" @click="goToPage('/savings/loan-member', { showLoanPayable: 1 })"
          data-aos="fade-up" data-aos-delay="600">
          <div class="flex items-center gap-4">
            <div class="bg-indigo-200/40 rounded-xl p-3">
              <Icon icon="mdi:bank-outline" class="text-indigo-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-indigo-400 uppercase tracking-wider leading-tight">{{ $t('loan.totalLoanPayable') }}
              </div>
              <div class="text-2xl font-bold text-indigo-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalPayableLoanAmount ||
                0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-green cursor-pointer" @click="goToPageWithTotal('/loan/pay-loan', collectionData.TotalPayment, 'loanPaid')"
          data-aos="fade-up" data-aos-delay="700">
          <div class="flex items-center gap-4">
            <div class="bg-green-200/40 rounded-xl p-3">
              <Icon icon="mdi:cash-multiple" class="text-green-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-green-400 uppercase tracking-wider leading-tight">{{ $t('loan.totalPaid') }}
              </div>
              <div class="text-2xl font-bold text-green-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalPayment
                || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-rose cursor-pointer" @click="goToPageWithTotal('/savings/loan-member', collectionData.TotalDueAmount, 'loanDue')"
          data-aos="fade-up" data-aos-delay="800">
          <div class="flex items-center gap-4">
            <div class="bg-rose-200/40 rounded-xl p-3">
              <Icon icon="mdi:cash-clock" class="text-rose-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-rose-400 uppercase tracking-wider leading-tight">{{ $t('loan.remaining') }}</div>
              <div class="text-2xl font-bold text-rose-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalDueAmount
                || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-amber cursor-pointer" @click="goToPage('/dashboard/interest-amount')"
          data-aos="fade-up" data-aos-delay="900">
          <div class="flex items-center gap-4">
            <div class="bg-amber-200/40 rounded-xl p-3">
              <Icon icon="mdi:percent-outline" class="text-amber-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-amber-400 uppercase tracking-wider leading-tight">{{ $t('loan.interestAmount') }}</div>
              <div class="text-2xl font-bold text-amber-700 mt-0.5">{{ formatAmount(Number(collectionData.InterestAmount || 0)) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Accountant Dashboard Cards -->
      <div v-if="!isCustomerDashboard" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 2xl:gap-6">
        <!-- 1. Total Savings Members -->
        <div class="stat-card stat-purple cursor-pointer" @click="goToSavingsMembers()" data-aos="zoom-in" data-aos-delay="50">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:account-group-outline" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.totalSavingsMembers') }}</div>
              <div class="stat-value">{{ summaryData?.allMemberCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 2. Total Savings Voucher -->
        <div class="stat-card stat-blue cursor-pointer" @click="$router.push({ path: '/transaction/member-savings', query: { showVoucherTotal: 1 } })" data-aos="zoom-in" data-aos-delay="100">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:ticket-confirmation-outline" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.totalSavingsVoucher') }}</div>
              <div class="stat-value">{{ formatAmount(Number(pendingCount?.ForSavingApprovalAmount || 0)) }}</div>
              <div class="stat-sub">{{ $t('common.total') }}: {{ pendingCount?.ForSavingApprovalCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 3. Total Savings Paid -->
        <div class="stat-card stat-green cursor-pointer" @click="goToSavingsMembers(true)" data-aos="zoom-in" data-aos-delay="150">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:piggy-bank-outline" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.totalSavingsPosted') }}</div>
              <div class="stat-value">{{ formatAmount(Number(summaryData?.totalSaving || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 4. Total Balance Due -->
        <div class="stat-card stat-rose" data-aos="zoom-in" data-aos-delay="200">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:wallet-outline" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.totalBalanceDue') }}</div>
              <div class="stat-value">{{ formatAmount(totalBalanceDue) }}</div>
            </div>
          </div>
        </div>

        <!-- 5. Total Loan Members -->
        <div class="stat-card stat-indigo cursor-pointer" @click="$router.push('/dashboard/loan-members')" data-aos="zoom-in" data-aos-delay="250">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:account-cash-outline" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.totalLoanMembers') }}</div>
              <div class="stat-value">{{ summaryData?.loanMemberCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 6. Total Loan Voucher -->
        <div class="stat-card stat-cyan cursor-pointer" @click="$router.push('/transaction/member-loan')" data-aos="zoom-in" data-aos-delay="300">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:file-document-multiple-outline" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.totalLoanVoucher') }}</div>
              <div class="stat-value">{{ formatAmount(Number(loanPendingCount?.PendingAmount || 0)) }}</div>
              <div class="stat-sub">{{ $t('common.total') }}: {{ loanPendingCount?.PendingCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 7. Total Loan Vouchered -->
        <div class="stat-card stat-violet cursor-pointer" @click="$router.push({ path: '/dashboard/loan-members', query: { showLoanVouchered: 1 } })" data-aos="zoom-in" data-aos-delay="350">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:file-check-outline" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.totalLoanVouchered') }}</div>
              <div class="stat-value">{{ formatAmount(Number(loanPostedCount?.PostedAmount || 0)) }}</div>
              <div class="stat-sub">{{ $t('common.total') }}: {{ loanPostedCount?.PostedCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 8. Total Loan Given -->
        <div class="stat-card stat-teal cursor-pointer" @click="$router.push({ path: '/dashboard/loan-members', query: { showLoanGiven: 1 } })" data-aos="zoom-in" data-aos-delay="400">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:bank-outline" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.totalLoanPosted') }}</div>
              <div class="stat-value">{{ formatAmount(Number(summaryData?.totalLoan || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 9. Total Savings Payable -->
        <div class="stat-card stat-fuchsia cursor-pointer" @click="goToSavingsCustomers(collectionData?.totalShouldPay, 'savingsPayable')" data-aos="zoom-in" data-aos-delay="450">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:cash-check" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.totalShouldPay') }}</div>
              <div class="stat-value">{{ formatAmount(Number(collectionData?.totalShouldPay || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 10. Remaining Collection -->
        <div class="stat-card stat-orange cursor-pointer" @click="goToSavingsCustomers(remainingCollection, 'savingsDue')" data-aos="zoom-in" data-aos-delay="500">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:cash-clock" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.remainingCollection') }}</div>
              <div class="stat-value">{{ formatAmount(remainingCollection) }}</div>
            </div>
          </div>
        </div>

        <!-- 11. Total Earning -->
        <div class="stat-card stat-amber cursor-pointer" @click="$router.push('/dashboard/total-loan')" data-aos="zoom-in" data-aos-delay="550">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:trending-up" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.totalEarning') }}</div>
              <div class="stat-value">{{ formatAmount(Number(summaryData?.totalEarning || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 12. Available Balance -->
        <div class="stat-card stat-emerald cursor-pointer" data-aos="zoom-in" data-aos-delay="600">
          <div class="stat-card-blob"></div>
          <div class="relative flex items-start gap-3 xl:gap-4 min-w-0">
            <div class="stat-icon-wrap"><Icon icon="mdi:bank-check" /></div>
            <div class="flex-1 text-right min-w-0">
              <div class="stat-label">{{ $t('dashboard.availableBalance') }}</div>
              <div class="stat-value">{{ formatAmount(availableBalance) }}</div>
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
/* ============ Hero (Accountant Dashboard) ============ */
.dashboard-hero {
  background: linear-gradient(135deg, #0b3d91 0%, #1e3a8a 35%, #4338ca 70%, #7c3aed 100%);
  box-shadow:
    0 10px 40px rgba(30, 58, 138, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.45;
  pointer-events: none;
}
.hero-blob-1 {
  width: 320px;
  height: 320px;
  top: -100px;
  right: -80px;
  background: radial-gradient(circle, #f0abfc 0%, transparent 70%);
  animation: float 12s ease-in-out infinite;
}
.hero-blob-2 {
  width: 280px;
  height: 280px;
  bottom: -120px;
  left: -60px;
  background: radial-gradient(circle, #38bdf8 0%, transparent 70%);
  animation: float 14s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -20px) scale(1.1); }
}

.hero-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  transition: all 0.25s ease;
}
.hero-action-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-1px);
}
.hero-action-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* KPI strip pills inside hero */
.kpi-pill {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.25s ease;
}
.kpi-pill:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
}
.kpi-pill-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.kpi-pill-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kpi-pill-value {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ============ Stat cards (Accountant grid) ============ */
.stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  padding: 1rem 1.1rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
              box-shadow 0.3s ease;
}
.stat-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: var(--accent, #6366f1);
  opacity: 0.95;
}
.stat-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.12);
}

.stat-card-blob {
  position: absolute;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  top: -40px;
  right: -40px;
  background: var(--accent-soft, rgba(99, 102, 241, 0.18));
  filter: blur(20px);
  opacity: 0.9;
  pointer-events: none;
  transition: transform 0.5s ease;
}
.stat-card:hover .stat-card-blob {
  transform: scale(1.15) translate(-8px, 8px);
}

.stat-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--accent-soft, rgba(99, 102, 241, 0.15));
  color: var(--accent, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px var(--accent-soft, rgba(99, 102, 241, 0.18));
  transition: transform 0.3s ease;
}
.stat-card:hover .stat-icon-wrap {
  transform: rotate(-6deg) scale(1.05);
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.55);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--accent-dark, #312e81);
  margin-top: 0.35rem;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}
.stat-sub {
  margin-top: 0.25rem;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent, #6366f1);
}

@media (min-width: 1280px) {
  .stat-card { padding: 1.15rem 1.25rem; }
  .stat-icon-wrap { width: 56px; height: 56px; font-size: 30px; }
  .stat-value { font-size: 24px; }
}
@media (min-width: 1536px) {
  .stat-card { padding: 1.35rem 1.5rem; }
  .stat-icon-wrap { width: 62px; height: 62px; font-size: 34px; }
  .stat-value { font-size: 28px; }
  .stat-label, .stat-sub { font-size: 12px; }
}

/* Color variants — sets accent vars */
.stat-purple   { --accent: #9333ea; --accent-dark: #6b21a8; --accent-soft: rgba(147, 51, 234, 0.14); }
.stat-blue     { --accent: #2563eb; --accent-dark: #1e3a8a; --accent-soft: rgba(37, 99, 235, 0.14); }
.stat-green    { --accent: #16a34a; --accent-dark: #166534; --accent-soft: rgba(22, 163, 74, 0.14); }
.stat-rose     { --accent: #e11d48; --accent-dark: #9f1239; --accent-soft: rgba(225, 29, 72, 0.14); }
.stat-indigo   { --accent: #4f46e5; --accent-dark: #3730a3; --accent-soft: rgba(79, 70, 229, 0.14); }
.stat-cyan     { --accent: #0891b2; --accent-dark: #155e75; --accent-soft: rgba(8, 145, 178, 0.14); }
.stat-violet   { --accent: #7c3aed; --accent-dark: #5b21b6; --accent-soft: rgba(124, 58, 237, 0.14); }
.stat-teal     { --accent: #0d9488; --accent-dark: #115e59; --accent-soft: rgba(13, 148, 136, 0.14); }
.stat-fuchsia  { --accent: #c026d3; --accent-dark: #86198f; --accent-soft: rgba(192, 38, 211, 0.14); }
.stat-orange   { --accent: #ea580c; --accent-dark: #9a3412; --accent-soft: rgba(234, 88, 12, 0.14); }
.stat-amber    { --accent: #d97706; --accent-dark: #92400e; --accent-soft: rgba(217, 119, 6, 0.14); }
.stat-emerald  { --accent: #059669; --accent-dark: #065f46; --accent-soft: rgba(5, 150, 105, 0.14); }

/* Override the top accent bar with a subtle gradient using the same accent */
.stat-card::before {
  background: linear-gradient(90deg, var(--accent), var(--accent-dark));
}

/* ============ Customer Dashboard glass cards (kept) ============ */
.glass-card {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

@media (min-width: 1280px) {
  .glass-card {
    padding: 1rem;
  }
}

@media (min-width: 1536px) {
  .glass-card {
    padding: 1.25rem;
  }
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

.glass-violet {
  background: linear-gradient(135deg, rgba(237, 233, 254, 0.7), rgba(221, 214, 254, 0.5));
}

.glass-emerald {
  background: linear-gradient(135deg, rgba(209, 250, 229, 0.7), rgba(167, 243, 208, 0.5));
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
const loanPostedCount = ref(null);

const collectionData = ref(null);
const loading = ref(false);

const remainingCollection = computed(() => {
  const payable = Number(collectionData.value?.totalShouldPay || 0);
  const posted = Number(summaryData.value?.totalSaving || 0);
  return payable - posted;
});

const totalBalanceDue = computed(() => {
  const savingsVoucher = Number(pendingCount.value?.ForSavingApprovalAmount || 0);
  const savingsPosted = Number(summaryData.value?.totalSaving || 0);
  return savingsVoucher + savingsPosted;
});

const availableBalance = computed(() => {
  const savingsPosted = Number(summaryData.value?.totalSaving || 0);
  const loanGiven = Number(summaryData.value?.totalLoan || 0);
  const earning = Number(summaryData.value?.totalEarning || 0);
  return savingsPosted - loanGiven + earning;
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

const goToPage = (path, extra = {}) => {
  const query = { ...extra };
  if (dateRange.value?.length === 2 && dateRange.value[0] && dateRange.value[1]) {
    query.from_date = dateRange.value[0];
    query.to_date = dateRange.value[1];
  }
  router.push({ path, query });
};

const goToPageWithTotal = (path, total, kind) => {
  const query = { showTotal: 1 };
  if (total != null) query.total = total;
  if (kind) query.kind = kind;
  if (dateRange.value?.length === 2 && dateRange.value[0] && dateRange.value[1]) {
    query.from_date = dateRange.value[0];
    query.to_date = dateRange.value[1];
  }
  router.push({ path, query });
};

const goToSavingsMembers = (showVoucherTotal = false, showDueTotal = false) => {
  const [from, to] = getDateRange();
  const query = { from_date: from, to_date: to };
  if (showVoucherTotal) query.showVoucherTotal = 1;
  if (showDueTotal) query.showDueTotal = 1;
  router.push({ path: "/dashboard/savings-members", query });
};

const goToSavingsCustomers = (total, kind) => {
  const [from, to] = getDateRange();
  const query = { from_date: from, to_date: to, showTotal: 1 };
  if (total != null) query.total = total;
  if (kind) query.kind = kind;
  router.push({ path: "/dashboard/savings-customers", query });
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
    const res = await axios.get(`${apiBase}/pay-loan-payment-voucher/pending-count`, getToken());
    loanPendingCount.value = res.data || null;
  } catch (error) {
    console.log(error);
  }
};

const fetchLoanPostedCount = async () => {
  try {
    const res = await axios.get(`${apiBase}/pay-loan-payment-voucher/posted-count`, getToken());
    loanPostedCount.value = res.data || null;
  } catch (error) {
    console.log(error);
  }
};

const todayDisplay = computed(() => {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
});

const refreshAll = () => {
  fetchCollectionSummary();
  fetchSummary();
  fetchPendingCount();
  fetchLoanPendingCount();
  fetchLoanPostedCount();
};

onMounted(() => {
  refreshAll();
});
</script>
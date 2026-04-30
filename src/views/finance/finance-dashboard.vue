<template>
  <MainLayout>
    <div class="space-y-8 px-4 md:px-6 xl:px-10 2xl:px-20 py-10">
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
        <div class="glass-card glass-purple cursor-pointer" @click="goToPage('/savings/customer')" data-aos="fade-up"
          data-aos-delay="100">
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

        <div class="glass-card glass-blue cursor-pointer"
          @click="goToPage('/savings/customer', { showSavingsPayable: 1 })" data-aos="fade-up" data-aos-delay="200">
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

        <div class="glass-card glass-green cursor-pointer"
          @click="goToPageWithTotal('/savings/member-collection', collectionData.TotalSaving, 'savingsPaid')"
          data-aos="fade-up" data-aos-delay="300">
          <div class="flex items-center gap-4">
            <div class="bg-green-200/40 rounded-xl p-3">
              <Icon icon="mdi:piggy-bank-outline" class="text-green-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-green-400 uppercase tracking-wider leading-tight">{{
                $t('dashboard.cashierSavingsPaid')
                }}</div>
              <div class="text-2xl font-bold text-green-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalSaving ||
                0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-rose cursor-pointer"
          @click="goToPageWithTotal('/savings/customer', collectionData.TotalDue, 'savingsDue')" data-aos="fade-up"
          data-aos-delay="400">
          <div class="flex items-center gap-4">
            <div class="bg-rose-200/40 rounded-xl p-3">
              <Icon icon="mdi:alert-circle-outline" class="text-rose-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-rose-400 uppercase tracking-wider leading-tight">{{
                $t('dashboard.totalDue') }}
              </div>
              <div class="text-2xl font-bold text-rose-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalDue || 0))
              }}</div>
            </div>
          </div>
        </div>

        <!-- Loan Summary Cards -->
        <div class="glass-card glass-indigo cursor-pointer" @click="goToPage('/savings/loan-member')" data-aos="fade-up"
          data-aos-delay="500">
          <div class="flex items-center gap-4">
            <div class="bg-indigo-200/40 rounded-xl p-3">
              <Icon icon="mdi:account-cash-outline" class="text-indigo-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-indigo-400 uppercase tracking-wider leading-tight">{{
                $t('dashboard.cashierLoanMembers') }}</div>
              <div class="text-2xl font-bold text-indigo-700 mt-0.5">{{ collectionData.TotalLoanMemeber ||
                collectionData.TotalLoanMembers || collectionData.LoanMemberCount || 0 }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-indigo cursor-pointer"
          @click="goToPage('/savings/loan-member', { showLoanPayable: 1 })" data-aos="fade-up" data-aos-delay="600">
          <div class="flex items-center gap-4">
            <div class="bg-indigo-200/40 rounded-xl p-3">
              <Icon icon="mdi:bank-outline" class="text-indigo-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-indigo-400 uppercase tracking-wider leading-tight">{{
                $t('loan.totalLoanPayable') }}
              </div>
              <div class="text-2xl font-bold text-indigo-700 mt-0.5">{{
                formatAmount(Number(collectionData.TotalPayableLoanAmount ||
                0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-green cursor-pointer"
          @click="goToPageWithTotal('/loan/pay-loan', collectionData.TotalPayment, 'loanPaid')" data-aos="fade-up"
          data-aos-delay="700">
          <div class="flex items-center gap-4">
            <div class="bg-green-200/40 rounded-xl p-3">
              <Icon icon="mdi:cash-multiple" class="text-green-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-green-400 uppercase tracking-wider leading-tight">{{
                $t('loan.totalPaid') }}
              </div>
              <div class="text-2xl font-bold text-green-700 mt-0.5">{{ formatAmount(Number(collectionData.TotalPayment
                || 0)) }}</div>
            </div>
          </div>
        </div>

        <div class="glass-card glass-rose cursor-pointer"
          @click="goToPageWithTotal('/savings/loan-member', collectionData.TotalDueAmount, 'loanDue')"
          data-aos="fade-up" data-aos-delay="800">
          <div class="flex items-center gap-4">
            <div class="bg-rose-200/40 rounded-xl p-3">
              <Icon icon="mdi:cash-clock" class="text-rose-600 text-3xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div class="text-xs font-semibold text-rose-400 uppercase tracking-wider leading-tight">{{
                $t('loan.remaining') }}</div>
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
              <div class="text-xs font-semibold text-amber-400 uppercase tracking-wider leading-tight">{{
                $t('loan.interestAmount') }}</div>
              <div class="text-2xl font-bold text-amber-700 mt-0.5">{{ formatAmount(Number(collectionData.InterestAmount
                || 0)) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Accountant Dashboard Cards -->
      <div v-if="!isCustomerDashboard" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-4 2xl:gap-6">
        <!-- 1. Total Savings Members -->
        <div class="glass-card glass-purple cursor-pointer" @click="goToSavingsMembers()">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-purple-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:account-group-outline" class="text-purple-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-purple-400 uppercase tracking-wider leading-tight">
                {{
                  $t('dashboard.totalSavingsMembers') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-purple-700 mt-1 leading-tight whitespace-nowrap">
                {{ summaryData?.allMemberCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 2. Total Savings Voucher -->
        <div class="glass-card glass-blue cursor-pointer"
          @click="$router.push({ path: '/transaction/member-savings', query: { showVoucherTotal: 1 } })">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-blue-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:ticket-confirmation-outline" class="text-blue-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-blue-400 uppercase tracking-wider leading-tight">
                {{ $t('dashboard.totalSavingsVoucher') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-blue-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(Number(pendingCount?.ForSavingApprovalAmount || 0)) }}</div>
              <div class="text-[10px] xl:text-xs 2xl:text-sm font-bold text-blue-500 mt-0.5">{{ $t('common.total') }}:
                {{ pendingCount?.ForSavingApprovalCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 3. Total Savings Paid -->
        <div class="glass-card glass-green cursor-pointer" @click="goToSavingsMembers(true)">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-green-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:piggy-bank-outline" class="text-green-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-green-400 uppercase tracking-wider leading-tight">
                {{ $t('dashboard.totalSavingsPosted') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-green-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(Number(summaryData?.totalSaving ||
                  0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 4. Total Balance Due -->
        <div class="glass-card glass-rose">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-rose-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:wallet-outline" class="text-rose-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-rose-400 uppercase tracking-wider leading-tight">
                {{
                  $t('dashboard.totalBalanceDue') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-rose-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(totalBalanceDue) }}</div>
            </div>
          </div>
        </div>

        <!-- 5. Total Loan Members -->
        <div class="glass-card glass-indigo cursor-pointer" @click="$router.push('/dashboard/loan-members')">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-indigo-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:account-cash-outline" class="text-indigo-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-indigo-400 uppercase tracking-wider leading-tight">
                {{ $t('dashboard.totalLoanMembers')
                }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-indigo-700 mt-1 leading-tight whitespace-nowrap">
                {{ summaryData?.loanMemberCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 6. Total Loan Voucher -->
        <div class="glass-card glass-cyan cursor-pointer" @click="$router.push('/transaction/member-loan')">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-cyan-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:file-document-multiple-outline" class="text-cyan-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-cyan-400 uppercase tracking-wider leading-tight">
                {{ $t('dashboard.totalLoanVoucher') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-cyan-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(Number(loanPendingCount?.PendingAmount || 0)) }}</div>
              <div class="text-[10px] xl:text-xs 2xl:text-sm font-bold text-cyan-500 mt-0.5">{{ $t('common.total') }}:
                {{ loanPendingCount?.PendingCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 7. Total Loan Vouchered -->
        <div class="glass-card glass-violet cursor-pointer"
          @click="$router.push({ path: '/dashboard/loan-members', query: { showLoanVouchered: 1 } })">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-violet-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:file-check-outline" class="text-violet-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-violet-400 uppercase tracking-wider leading-tight">
                {{ $t('dashboard.totalLoanVouchered') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-violet-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(Number(loanPostedCount?.PostedAmount || 0)) }}</div>
              <div class="text-[10px] xl:text-xs 2xl:text-sm font-bold text-violet-500 mt-0.5">{{ $t('common.total') }}:
                {{ loanPostedCount?.PostedCount || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 8. Total Loan Given -->
        <div class="glass-card glass-teal cursor-pointer"
          @click="$router.push({ path: '/dashboard/loan-members', query: { showLoanGiven: 1 } })">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-teal-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:bank-outline" class="text-teal-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-teal-400 uppercase tracking-wider leading-tight">
                {{ $t('dashboard.totalLoanPosted') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-teal-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(Number(summaryData?.totalLoan || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 9. Total Savings Payable -->
        <div class="glass-card glass-fuchsia cursor-pointer"
          @click="goToSavingsCustomers(collectionData?.totalShouldPay, 'savingsPayable')">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-fuchsia-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:cash-check" class="text-fuchsia-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-fuchsia-400 uppercase tracking-wider leading-tight">
                {{ $t('dashboard.totalShouldPay') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-fuchsia-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(Number(collectionData?.totalShouldPay || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 10. Remaining Collection -->
        <div class="glass-card glass-orange cursor-pointer"
          @click="goToSavingsCustomers(remainingCollection, 'savingsDue')">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-orange-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:cash-clock" class="text-orange-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-orange-400 uppercase tracking-wider leading-tight">
                {{ $t('dashboard.remainingCollection') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-orange-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(remainingCollection) }}</div>
            </div>
          </div>
        </div>

        <!-- 11. Total Earning -->
        <div class="glass-card glass-amber cursor-pointer" @click="$router.push('/dashboard/total-loan')">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-amber-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:trending-up" class="text-amber-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-amber-400 uppercase tracking-wider leading-tight">
                {{ $t('dashboard.totalEarning') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-amber-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(Number(summaryData?.totalEarning || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 12. Available Balance -->
        <div class="glass-card glass-emerald cursor-pointer">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-emerald-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:bank-check" class="text-emerald-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-emerald-400 uppercase tracking-wider leading-tight">
                {{ $t('dashboard.availableBalance') }}</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-emerald-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(availableBalance) }}</div>
            </div>
          </div>
        </div>

        <!-- 13. Total Expense Voucherable -->
        <div class="glass-card glass-red cursor-pointer" @click="$router.push('/expense/expense-voucher')">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-red-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:receipt-text-outline" class="text-red-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-red-400 uppercase tracking-wider leading-tight">
                Total Expense Voucherable</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-red-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(Number(summaryData?.totalExpenseVoucharable || 0)) }}</div>
            </div>
          </div>
        </div>

        <!-- 14. Total Expense Vouchered -->
        <div class="glass-card glass-slate cursor-pointer" @click="$router.push('/expense/expense-voucher')">
          <div class="flex items-center gap-2.5 xl:gap-3 2xl:gap-5 min-w-0">
            <div class="bg-slate-200/40 rounded-2xl p-2.5 xl:p-3 2xl:p-4 shrink-0">
              <Icon icon="mdi:receipt-text-check-outline" class="text-slate-600 text-3xl xl:text-4xl 2xl:text-5xl" />
            </div>
            <div class="flex-1 text-right min-w-0">
              <div
                class="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-slate-400 uppercase tracking-wider leading-tight">
                Total Expense Vouchered</div>
              <div
                class="text-lg xl:text-xl 2xl:text-2xl min-[1920px]:text-3xl font-extrabold text-slate-700 mt-1 leading-tight whitespace-nowrap">
                {{ formatAmount(Number(summaryData?.totalExpenseVouchared || 0)) }}</div>
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

.glass-red {
  background: linear-gradient(135deg, rgba(254, 226, 226, 0.7), rgba(254, 202, 202, 0.5));
}

.glass-slate {
  background: linear-gradient(135deg, rgba(226, 232, 240, 0.7), rgba(203, 213, 225, 0.5));
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

onMounted(() => {
  fetchCollectionSummary();
  fetchSummary();
  fetchPendingCount();
  fetchLoanPendingCount();
  fetchLoanPostedCount();
});
</script>
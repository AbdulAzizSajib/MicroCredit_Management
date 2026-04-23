import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";

import Login from "@/views/login/index.vue";
import overview from "@/views/overview.vue";

import member from "@/views/member/member.vue";

// attendence
// attendence
// attendence
// attendence
import Shift from "@/views/attendence/shift.vue";
import ShiftDetails from "@/views/attendence/shift-details.vue";
import OvertimeReport from "@/views/attendence/overtime-report.vue";
import MonthlyAttendenceSummary from "@/views/attendence/monthly-attendence-summary.vue";
import JobCardWithSalary from "@/views/attendence/job-card-with-salary.vue";
import EmployeeHourlyRate from "@/views/attendence/employee-hourly-rate.vue";
import DailyAttendanceReport from "@/views/attendence/daily-attendance-report.vue";

// payroll
// payroll
// payroll
// payroll

// import EmployeeManagement from "@/views/payroll/employee-management/personal-info.vue";
import PersonalInfo from "@/views/payroll/employee-management/personal-info.vue";
import EmployeeInfo from "@/views/payroll/employee-management/employee-info.vue";
import BusinessPayroll from "@/views/payroll/settings/business-payroll.vue";
import DepartmentPayroll from "@/views/payroll/settings/department-payroll.vue";
import DesignationPayroll from "@/views/payroll/settings/designation-payroll.vue";
import MyPayslip from "@/views/payroll/payroll-settings/my-payslip.vue";
import Payslip from "@/views/payroll/payroll-settings/payslip.vue";
import SalaryCertificate from "@/views/payroll/payroll-settings/salary-certificate.vue";
import SalarySheet from "@/views/payroll/payroll-settings/salary-sheet.vue";
import TaxCertificate from "@/views/payroll/payroll-settings/tax-certificate.vue";

// finance
// finance
// finance
// finance
// finance
// finance
// transactions
import FinanceDashboard from "@/views/finance/finance-dashboard.vue";
import ShouldPay from "@/views/finance/should-pay.vue";
import TotalSavingDetails from "@/views/finance/total-saving-details.vue";
import TotalDueDetails from "@/views/finance/total-due-details.vue";

// files menu import
// files menu import
// files menu import
import GroupCode from "@/views/finance/files/group-code.vue";
import AcType from "@/views/finance/files/ac-type.vue";
import SubLedger from "@/views/finance/files/sub-ledger.vue";
import Opening from "@/views/finance/files/opening.vue";
import SubLedgerCategory from "@/views/finance/files/sub-ledger-category.vue";
import ChartOfAccounts from "@/views/finance/files/chart-of-accounts.vue";
import ChartOfAccountsEdit from "@/views/finance/files/chart-of-accounts-edit.vue";
import SearchChartOfAccounts from "@/views/finance/files/search-chart-of-accounts.vue";
import FinancialMonth from "@/views/finance/files/financial-month.vue";
import SetPeriod from "@/views/finance/files/set-period.vue";
import Site from "@/views/finance/files/site.vue";
import VendorEntry from "@/views/finance/files/vendor-entry.vue";
import VendorType from "@/views/finance/files/vendor-type.vue";
import ChequeNo from "@/views/finance/files/cheque-no.vue";
import ChequeBookEntry from "@/views/finance/files/cheque-book-entry.vue";
// transactions
import VoucherDateChange from "@/views/finance/transactions/voucher-date-change.vue";
import DeleteVoucher from "@/views/finance/transactions/delete-voucher.vue";
import VoucherPrint from "@/views/finance/transactions/voucher-print.vue";
import VoucherSearchChartOfAccounts from "@/views/finance/transactions/voucher-search-chart-of-accounts.vue";
import VoucherAdd from "@/views/finance/transactions/voucher-add.vue";
import InsertVoucher from "@/views/finance/transactions/insert-voucher.vue";
import VoucherList from "@/views/finance/transactions/voucher-list.vue";
import VoucherEdit from "@/views/finance/transactions/voucher-edit.vue";

// reports
import ChartOfAccountsReports from "@/views/finance/reports/chart-of-accounts-reports.vue";
import JournalBookReport from "@/views/finance/reports/journal-book-report.vue";
import LedgerReport from "@/views/finance/reports/ledger-report.vue";
import SearchVoucherReport from "@/views/finance/reports/search-voucher-report.vue";
import MonthlyExpenseDetails from "@/views/finance/reports/monthly-expense-details.vue";
import MonthlyExpense from "@/views/finance/reports/monthly-expense.vue";
import MonthlyStatement from "@/views/finance/reports/monthly-statement.vue";
import SubLedgerDetails from "@/views/finance/reports/sub-ledger-details.vue";
import SubLedgerSchedule from "@/views/finance/reports/sub-ledger-schedule.vue";
import SubLedgerWiseExpense from "@/views/finance/reports/sub-ledger-wise-expense.vue";
import TrialBalance from "@/views/finance/reports/trial-balance.vue";
import StatementOfFinance from "@/views/finance/reports/statement-of-finance.vue";
import IncomeStatement from "@/views/finance/reports/income-statement.vue";
import PaymentReceipt from "@/views/finance/reports/payment-receipt.vue";
// User Management
import User from "@/views/user-management/user.vue";
import RoleIndex from "@/views/user-management/role.vue";
import PermissionIndex from "@/views/user-management/permission.vue";
import SalesVoucher from "@/views/finance/reports/sales-voucher.vue";
import BillReceive from "@/views/finance/reports/bill-receive.vue";
import VoucherType from "@/views/finance/files/voucher-type.vue";
import VoucherCategory from "@/views/finance/files/voucher-category.vue";
import BalanceSheet from "@/views/finance/reports/Balance-sheet.vue";
import AcSubGroup from "@/views/finance/files/ac-sub-group.vue";
import VoucherListPrint from "@/views/finance/transactions/voucher-list-print.vue";
import CashFlowStatementReport from "@/views/finance/reports/cash-flow-statement-report.vue";
import BalanceSheetDetails from "@/views/finance/reports/Balance-sheet-details.vue";
import AccountRatioReport from "@/views/finance/reports/account-ratio-report.vue";

import TotalMembers from "@/views/finance/total-members.vue";
import LoanMembers from "@/views/finance/loan-members.vue";
import TotalSaving from "@/views/finance/total-saving.vue";
import TotalLoan from "@/views/finance/total-loan.vue";
import TotalLoanPayable from "@/views/finance/total-loan-payable.vue";
import TotalLoanPaid from "@/views/finance/total-loan-paid.vue";
import TotalLoanDue from "@/views/finance/total-loan-due.vue";
import TotalEarning from "@/views/finance/total-earning.vue";
import InterestAmount from "@/views/finance/interest-amount.vue";
import LoanForVoucher from "@/views/finance/loan-for-voucher.vue";
import SavingForVoucher from "@/views/finance/saving-for-voucher.vue";

//member savings
import MemberSavings from "@/views/finance/reports/member-savings.vue";
import MemberSavingsAdd from "@/views/finance/reports/member-savings-add.vue";
import MemberLoan from "@/views/finance/reports/member-loan.vue";

//Purchase Voucher
import PurchaseVoucher from "@/views/finance/reports/purchase-voucher.vue";
import TrialBalanceSub from "@/views/finance/reports/trial-balance-sub.vue";
import BalanceSheetNew from "@/views/finance/reports/Balance-sheet-new.vue";
import BalanceSheetPetra from "@/views/finance/reports/Balance-sheet-petra.vue";
import CashFlow from "@/views/finance/files/cash-flow.vue";
import PayLoan from "@/views/loan/pay-loan.vue";
import LoanListAccountant from "@/views/loan/loan-list-accountant.vue";
import CustomerLedger from "@/views/loan/customer-ledger.vue";
import MemberCollection from "@/views/savings/member-collection.vue";
import SavingsCustomer from "@/views/savings/customer.vue";
import LoanMember from "@/views/savings/loan-member.vue";
import FilesCustomer from "@/views/finance/files/customer.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/overview",
    name: "overview",
    component: overview,
  },

  {
    path: "/member",
    name: "member",
    component: member,
  },

  // attendence start
  // attendence start
  // attendence start
  // attendence start
  {
    path: "/shift",
    name: "shift",
    component: Shift,
  },
  {
    path: "/shift-details",
    name: "shift-details",
    component: ShiftDetails,
  },
  {
    path: "/overtime-report",
    name: "overtime-report",
    component: OvertimeReport,
  },
  {
    path: "/monthly-attendence-summary",
    name: "monthly-attendence-summary",
    component: MonthlyAttendenceSummary,
  },
  {
    path: "/job-card-with-salary",
    name: "job-card-with-salary",
    component: JobCardWithSalary,
  },
  {
    path: "/employee-hourly-rate",
    name: "employee-hourly-rate",
    component: EmployeeHourlyRate,
  },
  {
    path: "/daily-attendance-report",
    name: "daily-attendance-report",
    component: DailyAttendanceReport,
  },

  // attendence end
  // attendence end
  // attendence end
  // attendence end

  // payroll
  // payroll
  // payroll
  {
    path: "/employee-management/personal-info",
    name: "personal-info",
    component: PersonalInfo,
  },
  {
    path: "/employee-management/employee-info",
    name: "employee-info",
    component: EmployeeInfo,
  },
  {
    path: "/settings/business-payroll",
    name: "business-payroll",
    component: BusinessPayroll,
  },
  {
    path: "/settings/department-payroll",
    name: "department-payroll",
    component: DepartmentPayroll,
  },
  {
    path: "/settings/designation-payroll",
    name: "designation-payroll",
    component: DesignationPayroll,
  },
  {
    path: "/payroll-settings/my-payslip",
    name: "my-payslip",
    component: MyPayslip,
  },
  {
    path: "/payroll-settings/payslip",
    name: "payslip",
    component: Payslip,
  },
  {
    path: "/payroll-settings/salary-certificate",
    name: "salary-certificate",
    component: SalaryCertificate,
  },
  {
    path: "/payroll-settings/payslip",
    name: "payslip",
    component: Payslip,
  },
  {
    path: "/payroll-settings/salary-sheet",
    name: "salary-sheet",
    component: SalarySheet,
  },
  {
    path: "/payroll-settings/tax-certificate",
    name: "tax-certificate",
    component: TaxCertificate,
  },

  // finance
  // finance
  // finance
  // finance
  // finance
  {
    path: "/loan/pay-loan",
    name: "pay-loan",
    component: PayLoan,
    meta: { permission: "Loan" },
  },
  {
    path: "/loan/loan-list",
    name: "loan-list-accountant",
    component: LoanListAccountant,
    meta: { permission: "Accountant Dashboard" },
  },
  {
    path: "/loan/customer-ledger",
    name: "customer-ledger",
    component: CustomerLedger,
    meta: { permission: "Reports" },
  },
  {
    path: "/savings/member-collection",
    name: "member-collection",
    component: MemberCollection,
    meta: { permission: "Saving" },
  },
  {
    path: "/savings/customer",
    name: "savings-customer",
    component: SavingsCustomer,
    meta: { permission: "Saving" },
  },
  {
    path: "/savings/loan-member",
    name: "loan-member",
    component: LoanMember,
    meta: { permission: "Saving" },
  },
  {
    path: "/files/customer",
    name: "files-customer",
    component: FilesCustomer,
    meta: { permission: "Files" },
  },
  {
    path: "/files/group-code",
    name: "group-code",
    component: GroupCode,
    meta: { permission: "Files" },
  },
  {
    path: "/files/cash-flow",
    name: "cash-flow",
    component: CashFlow,
    meta: { permission: "Files" },
  },
  {
    path: "/files/voucher-type",
    name: "voucher-type",
    component: VoucherType,
    meta: { permission: "Files" },
  },
  {
    path: "/files/voucher-category",
    name: "voucher-category",
    component: VoucherCategory,
    meta: { permission: "Files" },
  },
  {
    path: "/files/ac-type",
    name: "ac-type",
    component: AcType,
    meta: { permission: "Files" },
  },
  {
    path: "/files/ac-sub-group",
    name: "ac-sub-group",
    component: AcSubGroup,
    meta: { permission: "Files" },
  },
  {
    path: "/files/sub-ledger",
    name: "sub-ledger",
    component: SubLedger,
    meta: { permission: "Files" },
  },
  {
    path: "/files/opening",
    name: "opening",
    component: Opening,
    meta: { permission: "Files" },
  },
  {
    path: "/finance-dashboard",
    name: "finance-dashboard",
    component: FinanceDashboard,
    meta: { permission: "Customer Dashboard" },
  },
  {
    path: "/accountant-dashboard",
    name: "accountant-dashboard",
    component: FinanceDashboard,
    meta: { permission: "Accountant Dashboard" },
  },
  {
    path: "/dashboard/should-pay",
    name: "should-pay",
    component: ShouldPay,
    meta: { permission: ["Customer Dashboard", "Accountant Dashboard"] },
  },
  {
    path: "/dashboard/total-saving-details",
    name: "total-saving-details",
    component: TotalSavingDetails,
    meta: { permission: "Customer Dashboard" },
  },
  {
    path: "/dashboard/total-due-details",
    name: "total-due-details",
    component: TotalDueDetails,
    meta: { permission: "Customer Dashboard" },
  },
  {
    path: "/home",
    name: "home",
    component: User,
  },
  {
    path: "/files/reports-head",
    name: "reports-head",
    component: User,
  },
  {
    path: "/user",
    name: "user",
    component: User,
    meta: { permission: "User Management" },
  },
  {
    path: "/role",
    name: "role",
    component: RoleIndex,
    meta: { permission: "User Management" },
  },
  {
    path: "/permission",
    name: "permission",
    component: PermissionIndex,
    meta: { permission: "User Management" },
  },

  {
    path: "/files/search-chart-of-accounts/chart-of-accounts",
    name: "chart-of-accounts",
    component: ChartOfAccounts,
    meta: { permission: "Files" },
  },
  {
    path: "/files/search-chart-of-accounts/chart-of-accounts-edit/:am_code",
    name: "chart-of-accounts-edit",
    component: ChartOfAccountsEdit,
    meta: { permission: "Files" },
  },
  {
    path: "/files/search-chart-of-accounts",
    name: "search-chart-of-accounts",
    component: SearchChartOfAccounts,
    meta: { permission: "Files" },
  },
  {
    path: "/files/financial-month",
    name: "financial-month",
    component: FinancialMonth,
    meta: { permission: "Files" },
  },
  {
    path: "/files/set-period",
    name: "set-period",
    component: SetPeriod,
    meta: { permission: "Files" },
  },
  {
    path: "/files/site",
    name: "site",
    component: Site,
    meta: { permission: "Files" },
  },
  {
    path: "/files/vendor-entry",
    name: "vendor-entry",
    component: VendorEntry,
    meta: { permission: "Files" },
  },
  {
    path: "/files/vendor-type",
    name: "vendor-type",
    component: VendorType,
    meta: { permission: "Files" },
  },
  {
    path: "/files/sub-ledger-category",
    name: "sub-ledger-category",
    component: SubLedgerCategory,
    meta: { permission: "Files" },
  },
  {
    path: "/files/cheque-no",
    name: "cheque-no",
    component: ChequeNo,
    meta: { permission: "Files" },
  },

  // transactions voucher
  {
    path: "/transaction/voucher-list",
    name: "voucher-list",
    component: VoucherList,
  },

  {
    path: "/transaction/voucher-list/voucher-add",
    name: "voucher-add",
    component: VoucherAdd,
  },
  // /:Period/:SiteCode/:JVNo
  {
    path: "/transaction/voucher-list/voucher-edit",
    name: "voucher-edit",
    component: VoucherEdit,
  },

  {
    path: "/transaction/voucher-list/insert-voucher-entry",
    name: "temp-insert-voucher-entry",
    component: InsertVoucher,
  },
  {
    path: "/transaction/voucher-date-change",
    name: "voucher-date-change",
    component: VoucherDateChange,
  },
  {
    path: "/transaction/delete-voucher",
    name: "delete-voucher",
    component: DeleteVoucher,
  },
  {
    path: "/transaction/voucher-list-print",
    name: "voucher-list-print",
    component: VoucherListPrint,
  },
  {
    path: "/transaction/voucher-search-chart-of-accounts",
    name: "voucher-search-chart-of-accounts",
    component: VoucherSearchChartOfAccounts,
  },

  // report

  {
    path: "/reports/voucher-print",
    name: "voucher-print",
    component: VoucherPrint,
  },
  {
    path: "/reports/chart-of-accounts-reports",
    name: "chart-of-accounts-reports",
    component: ChartOfAccountsReports,
  },
  {
    path: "/reports/journal-book-report",
    name: "journal-book-report",
    component: JournalBookReport,
  },
  {
    path: "/reports/ledger-report",
    name: "ledger-report",
    component: LedgerReport,
  },
  {
    path: "/reports/search-voucher-report",
    name: "search-voucher-report",
    component: SearchVoucherReport,
  },
  {
    path: "/reports/monthly-expense-details",
    name: "monthly-expense-details",
    component: MonthlyExpenseDetails,
  },
  {
    path: "/reports/monthly-expense",
    name: "monthly-expense",
    component: MonthlyExpense,
  },
  {
    path: "/reports/monthly-statement",
    name: "monthly-statement",
    component: MonthlyStatement,
  },
  {
    path: "/reports/sub-ledger-details",
    name: "sub-ledger-details",
    component: SubLedgerDetails,
  },
  {
    path: "/reports/sub-ledger-schedule",
    name: "sub-ledger-schedule",
    component: SubLedgerSchedule,
  },
  {
    path: "/reports/sub-ledger-wise-expense",
    name: "sub-ledger-wise-expense",
    component: SubLedgerWiseExpense,
  },
  {
    path: "/reports/trial-balance",
    name: "trial-balance",
    component: TrialBalance,
  },
  {
    path: "/reports/trial-balance-sub",
    name: "trial-balance-sub",
    component: TrialBalanceSub,
  },
  {
    path: "/reports/cash-flow-statement-report",
    name: "cash-flow-statement-report",
    component: CashFlowStatementReport,
  },
  {
    path: "/reports/account-ratio-report",
    name: "account-ratio-report",
    component: AccountRatioReport,
  },
  {
    path: "/reports/statement-of-finance",
    name: "statement-of-finance",
    component: StatementOfFinance,
  },

  {
    path: "/reports/income-statement",
    name: "income-statement",
    component: IncomeStatement,
  },
  {
    path: "/reports/payment-receipt",
    name: "payment-receipt",
    component: PaymentReceipt,
  },
  {
    path: "/reports/balance-sheet",
    name: "balance-sheet",
    component: BalanceSheet,
  },
  {
    path: "/reports/balance-sheet-new",
    name: "balance-sheet-new",
    component: BalanceSheetNew,
  },
  {
    path: "/reports/balance-sheet-petra",
    name: "balance-sheet-petra",
    component: BalanceSheetPetra,
  },
  {
    path: "/reports/balance-sheet-details",
    name: "balance-sheet-details",
    component: BalanceSheetDetails,
  },
  {
    path: "/transaction/sales-voucher",
    name: "sales-voucher",
    component: SalesVoucher,
  },

  {
    path: "/transaction/voucher-list/voucher-add",
    name: "voucher-add",
    component: VoucherAdd,
  },
  {
    path: "/transaction/member-savings",
    name: "member-savings",
    component: MemberSavings,
  },
  {
    path: "/transaction/member-loan",
    name: "member-loan",
    component: MemberLoan,
  },
  {
    path: "/dashboard/total-members",
    name: "total-members",
    component: TotalMembers,
  },
  {
    path: "/dashboard/loan-members",
    name: "loan-members",
    component: LoanMembers,
  },
  {
    path: "/dashboard/total-saving",
    name: "total-saving",
    component: TotalSaving,
  },
  {
    path: "/dashboard/total-loan",
    name: "total-loan",
    component: TotalLoan,
  },
  {
    path: "/dashboard/total-loan-payable",
    name: "total-loan-payable",
    component: TotalLoanPayable,
    meta: { permission: "Customer Dashboard" },
  },
  {
    path: "/dashboard/total-loan-paid",
    name: "total-loan-paid",
    component: TotalLoanPaid,
    meta: { permission: "Customer Dashboard" },
  },
  {
    path: "/dashboard/total-loan-due",
    name: "total-loan-due",
    component: TotalLoanDue,
    meta: { permission: "Customer Dashboard" },
  },
  {
    path: "/dashboard/total-earning",
    name: "total-earning",
    component: TotalEarning,
  },
  {
    path: "/dashboard/interest-amount",
    name: "interest-amount",
    component: InterestAmount,
    meta: { permission: "Customer Dashboard" },
  },
  {
    path: "/dashboard/loan-for-voucher",
    name: "loan-for-voucher",
    component: LoanForVoucher,
    meta: { permission: "Accountant Dashboard" },
  },
  {
    path: "/dashboard/saving-for-voucher",
    name: "saving-for-voucher",
    component: SavingForVoucher,
    meta: { permission: "Accountant Dashboard" },
  },
  {
    path: "/transaction/purchase-voucher",
    name: "purchase-voucher",
    component: PurchaseVoucher,
  },
  {
    path: "/transaction/member-savings/member-savings-add",
    name: "member-savings-add",
    component: MemberSavingsAdd,
  },
  {
    path: "/transaction/bill-receive",
    name: "bill-receive",
    component: BillReceive,
  },

  // cheque register
  {
    path: "/files/cheque-book-entry",
    name: "cheque-book-entry",
    component: ChequeBookEntry,
  },

  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Path-to-permission mapping for routes without meta.permission
// Array = any one of those permissions allows access
const pathPermissionMap = {
  "/transaction": "Transaction",
  "/reports": "Reports",
  "/files": "Files",
  "/dashboard/total-members": ["Customer Dashboard", "Accountant Dashboard"],
  "/dashboard/loan-members": "Accountant Dashboard",
  "/dashboard/total-saving": "Accountant Dashboard",
  "/dashboard/total-loan": "Accountant Dashboard",
  "/dashboard/total-earning": "Accountant Dashboard",
};

router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  if (to.path === "/" && !token) {
    return next();
  } else if (to.path === "/" && token) {
    return next("/overview");
  } else if (!token) {
    return next("/");
  }

  // Permission check
  const requiredPermission =
    to.meta?.permission ||
    Object.entries(pathPermissionMap).find(([path]) =>
      to.path.startsWith(path),
    )?.[1];

  if (requiredPermission) {
    const permissions = JSON.parse(
      localStorage.getItem("user_permissions") || "[]",
    );
    const allowed = Array.isArray(requiredPermission)
      ? requiredPermission.some((p) => permissions.includes(p))
      : permissions.includes(requiredPermission);
    if (!allowed) {
      return next("/overview");
    }
  }

  next();
});
export default router;

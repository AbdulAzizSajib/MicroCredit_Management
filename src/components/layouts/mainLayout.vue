<template>
  <a-layout has-sider class="finance-sidebar">
    <!-- Mobile overlay backdrop -->
    <div
      v-if="isMobile && !collapsed"
      class="sidebar-overlay"
      @click="collapsed = true"
    />

    <!-- Sidebar -->
    <a-layout-sider
      ref="siderRef"
      :collapsed="isMobile ? false : collapsed"
      :width="sidebarWidth"
      collapsed-width="70"
      breakpoint="lg"
      :trigger="null"
      collapsible
      :style="{
        overflowY: 'auto',
        height: '100vh',
        position: 'fixed',
        left: isMobile && collapsed ? `-${sidebarWidth}px` : '0',
        top: 0,
        zIndex: 1000,
        transition: 'left 0.3s ease',
      }"
    >
      <div class="logo px-5 pt-1 pb-0 my-2.5 flex justify-center items-center">
        <router-link :to="{ name: 'overview' }" class="!text-white">
          <AppLogo :size="collapsed && !isMobile ? 40 : 70" :dark="true" :showText="!collapsed || isMobile" />
        </router-link>
      </div>
      <a-menu
        :items="items"
        :openKeys="state.openKeys"
        :selectedKeys="state.selectedKeys"
        @openChange="(keys) => (state.openKeys = keys.length ? [keys[keys.length - 1]] : [])"
        theme="dark"
        mode="inline"
        class="capitalize"
      />
    </a-layout-sider>

    <a-layout :style="{ marginLeft: isMobile ? '0' : (collapsed ? '80px' : `${sidebarWidth}px`), transition: 'margin-left 0.3s ease' }">
      <!-- Header -->
      <Header :collapsed="collapsed" :isMobile="isMobile" @update:collapsed="collapsed = $event" />
      <!-- Content -->
      <a-layout-content>
        <div
          :style="{
            margin: '0 16px',
            padding: $route?.name === 'home' ? '16px 0' : (isMobile ? '12px 16px' : '16px 32px'),
            background: $route?.name === 'home' ? 'transparent' : '#fff',
            borderRadius: $route?.name === 'home' ? '0' : '30px',
            boxShadow: $route?.name === 'home' ? 'none' : '2px 2px 2px #d5d5d5',
            height: 'calc(100vh - 156px)',
            overflowY: 'auto',
          }"
        >
          <slot></slot>
        </div>
      </a-layout-content>
      <!-- Footer -->
      <a-layout-footer
        :style="{
          background: '#fff',
          padding: '16px 32px',
          margin: '16px 16px 8px',
          height: 'fit-content',
          lineHeight: 'normal',
          borderRadius: '30px',
          boxShadow: '1px 1px 1px #d5d5d5',
          textAlign: 'center',
        }"
      >
        All Reserved &copy; {{ new Date().getFullYear() }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, h, onMounted, onUnmounted, watch, reactive, computed, nextTick } from "vue";
import {
  UserOutlined,
  FileTextOutlined,
  ContainerOutlined,
  InboxOutlined,
} from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Header from "./header.vue";
import AppLogo from "@/components/AppLogo.vue";

const { t } = useI18n();

const collapsed = ref(false);
const isMobile = ref(false);
const siderRef = ref(null);
const route = useRoute();
const router = useRouter();

const checkMobile = () => {
  isMobile.value = window.innerWidth < 992;
  if (isMobile.value) {
    collapsed.value = true;
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  updateDateTime();
  setInterval(updateDateTime, 60000);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  if (isMobile.value) {
    collapsed.value = true;
  }
});

const userPermissions = JSON.parse(localStorage.getItem("user_permissions") || "[]");
const hasPermission = (name) => userPermissions.includes(name);

const sidebarWidth = 250;
let time = ref();
let date = ref();

let timeOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

let dateOptions = {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
};

function updateDateTime() {
  let now = new Date();
  time.value = now.toLocaleString("en-US", timeOptions);
  date.value = now.toLocaleString("en-US", dateOptions);
}

window.addEventListener("keydown", (event) => {
  if (event?.key === "F3") {
    event.preventDefault();
    router.push({ name: "sales" });
  }
});

const state = reactive({
  openKeys: [],
  selectedKeys: [route.path],
});

// Helper function to navigate with Ctrl+Click support
const navigateTo = (path) => {
  return (e) => {
    if (e.ctrlKey || e.metaKey) {
      // Use router.resolve to get the full URL with base
      const resolved = router.resolve(path);
      window.open(resolved.href, "_blank");
    } else {
      router.push(path);
    }
  };
};

const allMenuItems = computed(() => [
  {
    key: "/finance-dashboard",
    label: t("menu.customerDashboard"),
    icon: () => h(ContainerOutlined),
    onClick: navigateTo("/finance-dashboard"),
    permission: "Customer Dashboard",
  },
  {
    key: "/accountant-dashboard",
    label: t("menu.accountantDashboard"),
    icon: () => h(ContainerOutlined),
    onClick: navigateTo("/accountant-dashboard"),
    permission: "Accountant Dashboard",
  },
  {
    key: "/savings/customer",
    label: t("menu.customer"),
    icon: () => h(UserOutlined),
    onClick: navigateTo("/savings/customer"),
    permission: "Saving",
  },
  {
    key: "collection",
    label: t("menu.collection"),
    icon: () => h(InboxOutlined),
    children: [
      {
        key: "/savings/member-collection",
        label: t("menu.savings"),
        onClick: navigateTo("/savings/member-collection"),
      },
      {
        key: "/loan/pay-loan",
        label: t("menu.loan"),
        onClick: navigateTo("/loan/pay-loan"),
      },
    ],
    permission: "Saving",
  },

  {
    key: "files",
    label: t("menu.files"),
    icon: () => h(FileTextOutlined),
    permission: "Files",
    children: [
      {
        key: "/files/customer",
        label: t("menu.customer"),
        onClick: navigateTo("/files/customer"),
      },
      {
        key: "/files/group-code",
        label: t("menu.groupCode"),
        onClick: navigateTo("/files/group-code"),
      },
      {
        key: "/files/voucher-type",
        label: t("menu.voucherType"),
        onClick: navigateTo("/files/voucher-type"),
      },
      {
        key: "/files/voucher-category",
        label: t("menu.voucherCategory"),
        onClick: navigateTo("/files/voucher-category"),
      },
      {
        key: "/files/ac-type",
        label: t("menu.acType"),
        onClick: navigateTo("/files/ac-type"),
      },
      {
        key: "/files/ac-sub-group",
        label: t("menu.acSubGroup"),
        onClick: navigateTo("/files/ac-sub-group"),
      },
      {
        key: "/files/cash-flow",
        label: t("menu.cashFlow"),
        onClick: navigateTo("/files/cash-flow"),
      },
      {
        key: "/files/search-chart-of-accounts",
        label: t("menu.chartOfAccounts"),
        onClick: navigateTo("/files/search-chart-of-accounts"),
      },
      {
        key: "/files/sub-ledger-category",
        label: t("menu.subLedgerCategory"),
        onClick: navigateTo("/files/sub-ledger-category"),
      },
      {
        key: "/files/sub-ledger",
        label: t("menu.subLedger"),
        onClick: navigateTo("/files/sub-ledger"),
      },
      {
        key: "/files/opening",
        label: t("menu.opening"),
        onClick: navigateTo("/files/opening"),
      },
      {
        key: "/files/cheque-no",
        label: t("menu.chequeNo"),
        onClick: navigateTo("/files/cheque-no"),
      },
      {
        key: "/files/cheque-book-entry",
        label: t("menu.chequeBook"),
        onClick: navigateTo("/files/cheque-book-entry"),
      },
      {
        key: "/files/financial-month",
        label: t("menu.financialMonth"),
        onClick: navigateTo("/files/financial-month"),
      },
      {
        key: "/files/set-period",
        label: t("menu.setPeriod"),
        onClick: navigateTo("/files/set-period"),
      },
      {
        key: "/files/site",
        label: t("menu.site"),
        onClick: navigateTo("/files/site"),
      },
      {
        key: "/files/vendor-entry",
        label: t("menu.vendorEntry"),
        onClick: navigateTo("/files/vendor-entry"),
      },
      {
        key: "/files/vendor-type",
        label: t("menu.vendorType"),
        onClick: navigateTo("/files/vendor-type"),
      },
    ],
  },
  {
    key: "transaction",
    label: t("menu.transaction"),
    icon: () => h(FileTextOutlined),
    permission: "Transaction",
    children: [
      {
        key: "/transaction/voucher-list",
        label: t("menu.voucherEntry"),
        onClick: navigateTo("/transaction/voucher-list"),
      },
      // {
      //   key: "/transaction/voucher-date-change",
      //   label: "Voucher Data Change",
      //   onClick: navigateTo("/transaction/voucher-date-change"),
      // },
      // {
      //   key: "/transaction/delete-voucher",
      //   label: "Delete Voucher",
      //   onClick: navigateTo("/transaction/delete-voucher"),
      // },
      // {
      //   key: "/transaction/voucher-search-chart-of-accounts",
      //   label: "Search Chart of Accounts",
      //   onClick: navigateTo("/transaction/voucher-search-chart-of-accounts"),
      // },
      // {
      //   key: "/transaction/sales-voucher",
      //   label: "Member Savings",
      //   onClick: navigateTo("/transaction/sales-voucher"),
      // },
      {
        key: "/transaction/member-savings",
        label: t("menu.memberSavings"),
        onClick: navigateTo("/transaction/member-savings"),
      },
      // {
      //   key: "/transaction/purchase-voucher",
      //   label: "purchase voucher",
      //   onClick: navigateTo("/transaction/purchase-voucher"),
      // },
      // {
      //   key: "/transaction/bill-receive",
      //   label: "bill receive",
      //   onClick: navigateTo("/transaction/bill-receive"),
      // },
    ],
  },
  {
    key: "/reports",
    label: t("menu.reports"),
    icon: () => h(FileTextOutlined),
    permission: "Reports",
    children: [
      {
        key: "/loan/customer-ledger",
        label: t("menu.customerLedger"),
        onClick: navigateTo("/loan/customer-ledger"),
      },
      {
        key: "/reports/voucher-print",
        label: t("menu.voucherPrint"),
        onClick: navigateTo("/reports/voucher-print"),
      },
      {
        key: "/reports/search-voucher-report",
        label: t("menu.searchVoucher"),
        onClick: navigateTo("/reports/search-voucher-report"),
      },
      {
        key: "/reports/journal-book-report",
        label: t("menu.journalBook"),
        onClick: navigateTo("/reports/journal-book-report"),
      },
      {
        key: "/reports/ledger-report",
        label: t("menu.ledger"),
        onClick: navigateTo("/reports/ledger-report"),
      },
      // {
      //   key: "/reports/balance-sheet",
      //   label: "Balance Sheet",
      //   onClick: navigateTo("/reports/balance-sheet"),
      // },
      {
        key: "/reports/balance-sheet-new",
        label: t("menu.balanceSheet"),
        onClick: navigateTo("/reports/balance-sheet-new"),
      },
      {
        key: "/reports/balance-sheet-petra",
        label: t("menu.balanceSheetPetra"),
        onClick: navigateTo("/reports/balance-sheet-petra"),
      },
      {
        key: "/reports/payment-receipt",
        label: t("menu.paymentReceipt"),
        onClick: navigateTo("/reports/payment-receipt"),
      },
      {
        key: "/reports/income-statement",
        label: t("menu.incomeStatement"),
        onClick: navigateTo("/reports/income-statement"),
      },
      {
        key: "/reports/chart-of-accounts-reports",
        label: t("menu.chartOfAccounts"),
        onClick: navigateTo("/reports/chart-of-accounts-reports"),
      },
      {
        key: "/reports/cash-flow-statement-report",
        label: t("menu.cashFlowStatement"),
        onClick: navigateTo("/reports/cash-flow-statement-report"),
      },
      {
        key: "/reports/account-ratio-report",
        label: t("menu.accountRatio"),
        onClick: navigateTo("/reports/account-ratio-report"),
      },
      {
        key: "/reports/trial-balance",
        label: t("menu.trialBalance"),
        onClick: navigateTo("/reports/trial-balance"),
      },
      {
        key: "/reports/trial-balance-sub",
        label: t("menu.trialBalanceSub"),
        onClick: navigateTo("/reports/trial-balance-sub"),
      },
    ],
  },
  {
    key: "user",
    label: t("menu.userManagement"),
    icon: () => h(UserOutlined),
    permission: "User Management",
    children: [
      {
        key: "/user",
        label: t("menu.user"),
        onClick: navigateTo("/user"),
      },
      {
        key: "/role",
        label: t("menu.role"),
        onClick: navigateTo("/role"),
      },
      {
        key: "/permission",
        label: t("menu.permission"),
        onClick: navigateTo("/permission"),
      },
    ],
  },
]);

// Filter menu by permission
const items = computed(() => {
  return allMenuItems.value.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });
});

const normalizeKey = (key) => {
  return key.replace(/^\/+/, "");
};

function flattenItems(list, out = []) {
  list.forEach((it) => {
    out.push(it);
    if (it.children?.length) flattenItems(it.children, out);
  });
  return out;
}

const parentOf = new Map();
function indexItems(list, parentKey = null) {
  list.forEach((it) => {
    if (parentKey) parentOf.set(it.key, parentKey);
    if (it.children?.length) indexItems(it.children, it.key);
  });
}

// build the parent map once
indexItems(items.value);

// watch the route and update menu state
watch(
  () => route.path,
  async (newPath) => {
    const flat = flattenItems(items.value);

    // find exact match or fallback to prefix
    const exact = flat.find((i) => i.key === newPath);
    const prefix = flat.find(
      (i) => typeof i.key === "string" && newPath.startsWith(i.key),
    );
    const matchedKey = (exact || prefix)?.key || newPath;

    // parent key lookup
    const parentKey = parentOf.get(matchedKey) || null;

    // update menu state
    state.selectedKeys = [matchedKey];
    state.openKeys = parentKey ? [parentKey] : [];

    // scroll into view
    await nextTick();
    const siderEl = siderRef.value?.$el;
    const selected = siderEl?.querySelector(".ant-menu-item-selected");
    if (selected && siderEl) {
      selected.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  },
  { immediate: true },
);
</script>

<style>
.finance-sidebar .ant-menu-item {
  @apply !h-fit !px-5 !rounded-full;
}

.finance-sidebar .ant-menu-title-content svg {
  @apply !align-baseline;
}

.finance-sidebar .ant-menu-item-selected {
  @apply !bg-[#004280] !text-white !rounded-lg;
}

.finance-sidebar .ant-menu-submenu-selected .ant-menu-submenu-title {
  @apply !bg-[#00284d] font-semibold;
}

.finance-sidebar .ant-menu-submenu-selected .ant-menu-submenu-title.active {
  @apply !bg-[#00284d] font-semibold;
}

.finance-sidebar .ant-menu .ant-menu-submenu .ant-menu-item {
  @apply !pl-10;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
}
</style>

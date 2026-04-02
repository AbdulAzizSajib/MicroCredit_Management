<template>
  <a-layout has-sider class="finance-sidebar">
    <!-- Sidebar -->
    <a-layout-sider
      ref="siderRef"
      :collapsed="collapsed"
      :width="sidebarWidth"
      collapsed-width="70"
      breakpoint="lg"
      :trigger="null"
      collapsible
      :style="{
        overflowY: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 999,
      }"
    >
      <div class="logo px-5 pt-1 pb-0 my-2.5 flex justify-center items-center">
        <router-link :to="{ name: 'overview' }" class="!text-white">
          <img class="w-16" src="@/assets/images/finance.png" alt="" />
        </router-link>
      </div>
      <a-menu
        :items="items"
        :openKeys="state.openKeys"
        :selectedKeys="state.selectedKeys"
        @openChange="(keys) => (state.openKeys = keys)"
        theme="dark"
        mode="inline"
        class="capitalize"
      />
    </a-layout-sider>

    <a-layout :style="{ marginLeft: collapsed ? '80px' : `${sidebarWidth}px` }">
      <!-- Header -->
      <Header :collapsed="collapsed" @update:collapsed="collapsed = $event" />
      <!-- Content -->
      <a-layout-content>
        <div
          :style="{
            margin: '0 16px',
            padding: $route?.name === 'home' ? '16px 0' : '16px 32px',
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
import { ref, h, onMounted, watch, reactive, computed, nextTick } from "vue";
import {
  UserOutlined,
  FileTextOutlined,
  ContainerOutlined,
  InboxOutlined,
} from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
import Header from "./header.vue";

const collapsed = ref(false);
const siderRef = ref(null);
const route = useRoute();
const router = useRouter();

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

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 60000);
});

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

const items = reactive([
  {
    key: "/finance-dashboard",
    label: "Dashboard",
    icon: () => h(ContainerOutlined),
    onClick: navigateTo("/finance-dashboard"),
  },
  {
    key: "savings",
    label: "Savings",
    icon: () => h(UserOutlined),
    children: [
      {
        key: "/savings/member-collection",
        label: "Member Collection",
        onClick: navigateTo("/savings/member-collection"),
      },
      {
        key: "/savings/customer",
        label: "Customer",
        onClick: navigateTo("/savings/customer"),
      },
    ],
  },
  {
    key: "loan",
    label: "Loan",
    icon: () => h(InboxOutlined),
    children: [
      {
        key: "/loan/pay-loan",
        label: "Pay Loan",
        onClick: navigateTo("/loan/pay-loan"),
      },
      {
        key: "/loan/customer-ledger",
        label: "Customer Ledger",
        onClick: navigateTo("/loan/customer-ledger"),
      },
    ],
  },

  {
    key: "files",
    label: "Files",
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/files/group-code",
        label: "Group Code",
        onClick: navigateTo("/files/group-code"),
      },
      {
        key: "/files/voucher-type",
        label: "voucher type",
        onClick: navigateTo("/files/voucher-type"),
      },
      {
        key: "/files/voucher-category",
        label: "voucher category",
        onClick: navigateTo("/files/voucher-category"),
      },
      {
        key: "/files/ac-type",
        label: "A/C Type",
        onClick: navigateTo("/files/ac-type"),
      },
      {
        key: "/files/ac-sub-group",
        label: "A/C Sub Group",
        onClick: navigateTo("/files/ac-sub-group"),
      },
      {
        key: "/files/cash-flow",
        label: "Cash Flow",
        onClick: navigateTo("/files/cash-flow"),
      },
      {
        key: "/files/search-chart-of-accounts",
        label: "Chart of Accounts",
        onClick: navigateTo("/files/search-chart-of-accounts"),
      },
      {
        key: "/files/sub-ledger-category",
        label: "Sub-Ledger Category",
        onClick: navigateTo("/files/sub-ledger-category"),
      },
      {
        key: "/files/sub-ledger",
        label: "Sub Ledger",
        onClick: navigateTo("/files/sub-ledger"),
      },
      {
        key: "/files/opening",
        label: "Opening",
        onClick: navigateTo("/files/opening"),
      },
      {
        key: "/files/cheque-no",
        label: "Cheque No",
        onClick: navigateTo("/files/cheque-no"),
      },
      {
        key: "/files/cheque-book-entry",
        label: "Cheque Book",
        onClick: navigateTo("/files/cheque-book-entry"),
      },
      {
        key: "/files/financial-month",
        label: "Financial Month",
        onClick: navigateTo("/files/financial-month"),
      },
      {
        key: "/files/set-period",
        label: "Set Period",
        onClick: navigateTo("/files/set-period"),
      },
      {
        key: "/files/site",
        label: "Site",
        onClick: navigateTo("/files/site"),
      },
      {
        key: "/files/vendor-entry",
        label: "Vendor Entry",
        onClick: navigateTo("/files/vendor-entry"),
      },
      {
        key: "/files/vendor-type",
        label: "Vendor Type",
        onClick: navigateTo("/files/vendor-type"),
      },
    ],
  },
  {
    key: "transaction",
    label: "Transaction",
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/transaction/voucher-list",
        label: "Voucher Entry",
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
      {
        key: "/transaction/sales-voucher",
        label: "Member Savings",
        onClick: navigateTo("/transaction/sales-voucher"),
      },
      // {
      //   key: "/transaction/sale-voucher",
      //   label: "sales voucher",
      //   onClick: navigateTo("/transaction/sale-voucher"),
      // },
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
    label: "Reports",
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/reports/voucher-print",
        label: "Voucher Print",
        onClick: navigateTo("/reports/voucher-print"),
      },
      {
        key: "/reports/search-voucher-report",
        label: "Search Voucher",
        onClick: navigateTo("/reports/search-voucher-report"),
      },
      {
        key: "/reports/journal-book-report",
        label: "Journal Book",
        onClick: navigateTo("/reports/journal-book-report"),
      },
      {
        key: "/reports/ledger-report",
        label: "Ledger",
        onClick: navigateTo("/reports/ledger-report"),
      },
      // {
      //   key: "/reports/balance-sheet",
      //   label: "Balance Sheet",
      //   onClick: navigateTo("/reports/balance-sheet"),
      // },
      {
        key: "/reports/balance-sheet-new",
        label: "Balance Sheet ",
        onClick: navigateTo("/reports/balance-sheet-new"),
      },
      {
        key: "/reports/balance-sheet-petra",
        label: "Balance Sheet Petra",
        onClick: navigateTo("/reports/balance-sheet-petra"),
      },
      // {
      //   key: "/reports/balance-sheet-details",
      //   label: "Balance Sheet Details",
      //   onClick: navigateTo("/reports/balance-sheet-details"),
      // },
      {
        key: "/reports/payment-receipt",
        label: "Payment Receipt",
        onClick: navigateTo("/reports/payment-receipt"),
      },
      {
        key: "/reports/income-statement",
        label: "Income Statement",
        onClick: navigateTo("/reports/income-statement"),
      },
      {
        key: "/reports/chart-of-accounts-reports",
        label: "Chart of Accounts",
        onClick: navigateTo("/reports/chart-of-accounts-reports"),
      },
      {
        key: "/reports/cash-flow-statement-report",
        label: "Cash Flow Statement",
        onClick: navigateTo("/reports/cash-flow-statement-report"),
      },
      {
        key: "/reports/account-ratio-report",
        label: "Account Ratio",
        onClick: navigateTo("/reports/account-ratio-report"),
      },
      {
        key: "/reports/trial-balance",
        label: "Trial Balance",
        onClick: navigateTo("/reports/trial-balance"),
      },
      {
        key: "/reports/trial-balance-sub",
        label: "Trial Balance Sub",
        onClick: navigateTo("/reports/trial-balance-sub"),
      },
    ],
  },
  {
    key: "user",
    label: "User Management",
    icon: () => h(UserOutlined),
    children: [
      {
        key: "/user",
        label: "User",
        onClick: navigateTo("/user"),
      },
      {
        key: "/role",
        label: "Role",
        onClick: navigateTo("/role"),
      },
      {
        key: "/permission",
        label: "Permission",
        onClick: navigateTo("/permission"),
      },
    ],
  },
]);

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
indexItems(items);

// watch the route and update menu state
watch(
  () => route.path,
  async (newPath) => {
    const flat = flattenItems(items);

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
</style>

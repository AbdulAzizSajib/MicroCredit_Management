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

const items = reactive([
  {
    key: "/finance-dashboard",
    label: "Dashboard",
    icon: () => h(ContainerOutlined),
    onClick: () => router.push("/finance-dashboard"),
  },
  {
    key: "files",
    label: "Files",
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/files/group-code",
        label: "Group Code",
        onClick: () => router.push("/files/group-code"),
      },
      {
        key: "/files/voucher-type",
        label: "voucher type",
        onClick: () => router.push("/files/voucher-type"),
      },
      {
        key: "/files/voucher-category",
        label: "voucher category",
        onClick: () => router.push("/files/voucher-category"),
      },
      {
        key: "/files/ac-type",
        label: "A/C Type",
        onClick: () => router.push("/files/ac-type"),
      },
      {
        key: "/files/ac-sub-group",
        label: "A/C Sub Group",
        onClick: () => router.push("/files/ac-sub-group"),
      },

      {
        key: "/files/search-chart-of-accounts",
        label: "Chart of Accounts",
        onClick: () => router.push("/files/search-chart-of-accounts"),
      },

      {
        key: "/files/sub-ledger-category",
        label: "Sub-Ledger Category",
        onClick: () => router.push("/files/sub-ledger-category"),
        // icon: () => h(FileTextOutlined),
      },
      {
        key: "/files/sub-ledger",
        label: "Sub Ledger",
        onClick: () => router.push("/files/sub-ledger"),
      },
      {
        key: "/files/opening",
        label: "Opening",
        onClick: () => router.push("/files/opening"),
      },
      {
        key: "/files/cheque-no",
        label: "Cheque No",
        onClick: () => router.push("/files/cheque-no"),
      },
      {
        key: "/files/cheque-book-entry",
        label: "Cheque Book",
        onClick: () => router.push("/files/cheque-book-entry"),
      },

      {
        key: "/files/financial-month",
        label: "Financial Month",
        onClick: () => router.push("/files/financial-month"),
      },

      {
        key: "/files/set-period",
        label: "Set Period",
        onClick: () => router.push("/files/set-period"),
      },
      {
        key: "/files/site",
        label: "Site",
        onClick: () => router.push("/files/site"),
      },
      {
        key: "/files/vendor-entry",
        label: "Vendor Entry",
        onClick: () => router.push("/files/vendor-entry"),
      },
      {
        key: "/files/vendor-type",
        label: "Vendor Type",
        onClick: () => router.push("/files/vendor-type"),
      },
    ],
  },

  {
    key: "transaction", // Changed from specific route to parent
    label: "Transaction",
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/transaction/voucher-list",
        label: "Voucher Entry",
        onClick: () => router.push("/transaction/voucher-list"),
      },
      {
        key: "/transaction/voucher-date-change",
        label: "Voucher Data Change",
        onClick: () => router.push("/transaction/voucher-date-change"),
      },
      {
        key: "/transaction/delete-voucher",
        label: "Delete Voucher",
        onClick: () => router.push("/transaction/delete-voucher"),
      },

      {
        key: "/transaction/voucher-search-chart-of-accounts",
        label: "Search Chart of Accounts",
        onClick: () =>
          router.push("/transaction/voucher-search-chart-of-accounts"),
      },

      {
        key: "/transaction/sales-voucher",
        label: "sales voucher",
        onClick: () => router.push("/transaction/sales-voucher"),
      },
      {
        key: "/transaction/bill-receive",
        label: "bill receive",
        onClick: () => router.push("/transaction/bill-receive"),
      },
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
        onClick: () => router.push("/reports/voucher-print"),
      },
      {
        key: "/reports/search-voucher-report",
        label: "Search Voucher",
        onClick: () => router.push("/reports/search-voucher-report"),
      },
      {
        key: "/reports/journal-book-report",
        label: "Journal Book",
        onClick: () => router.push("/reports/journal-book-report"),
      },

      {
        key: "/reports/ledger-report",
        label: "Ledger",
        onClick: () => router.push("/reports/ledger-report"),
      },
      {
        key: "/reports/balance-sheet",
        label: "Balance Sheet",
        onClick: () => router.push("/reports/balance-sheet"),
      },

      {
        key: "/reports/balance-sheet-details",
        label: "Balance Sheet Details",
        onClick: () => router.push("/reports/balance-sheet-details"),
      },

      {
        key: "/reports/payment-receipt",
        label: "Payment Receipt",
        onClick: () => router.push("/reports/payment-receipt"),
      },

      {
        key: "/reports/income-statement",
        label: "Income Statement",
        onClick: () => router.push("/reports/income-statement"),
      },

      // {
      //   key: "/reports/statement-of-finance",
      //   label: "Statement of Finance",
      //   onClick: () => router.push("/reports/statement-of-finance"),
      // },

      {
        key: "/reports/chart-of-accounts-reports",
        label: "Chart of Accounts",
        onClick: () => router.push("/reports/chart-of-accounts-reports"),
      },

      {
        key: "/reports/cash-flow-statement-report",
        label: "Cash Flow Statement",
        onClick: () => router.push("/reports/cash-flow-statement-report"),
      },
      {
        key: "/reports/account-ratio-report",
        label: "Account Ratio",
        onClick: () => router.push("/reports/account-ratio-report"),
      },

      {
        key: "/reports/trial-balance",
        label: "Trial Balance",
        onClick: () => router.push("/reports/trial-balance"),
      },

      // {
      //   key: "/reports/monthly-expense-details",
      //   label: "Monthly Expense Details",
      //   onClick: () => router.push("/reports/monthly-expense-details"),
      // },

      // {
      //   key: "/reports/monthly-expense",
      //   label: "Monthly Expense",
      //   onClick: () => router.push("/reports/monthly-expense"),
      // },

      // {
      //   key: "/reports/monthly-statement",
      //   label: "Monthly Expense Statements",
      //   onClick: () => router.push("/reports/monthly-statement"),
      // },

      // {
      //   key: "/reports/sub-ledger-schedule",
      //   label: "Sub Ledger Schedule",
      //   onClick: () => router.push("/reports/sub-ledger-schedule"),
      // },
      // {
      //   key: "/reports/sub-ledger-details",
      //   label: "Sub Ledger Details",
      //   onClick: () => router.push("/reports/sub-ledger-details"),
      // },
      // {
      //   key: "/reports/sub-ledger-wise-expense",
      //   label: "Sub Ledger Wise Expense",
      //   onClick: () => router.push("/reports/sub-ledger-wise-expense"),
      // },
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
        onClick: () => router.push("/user"),
      },
      {
        key: "/role",
        label: "Role",
        onClick: () => router.push("/role"),
      },
      {
        key: "/permission",
        label: "Permission",
        onClick: () => router.push("/permission"),
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
      (i) => typeof i.key === "string" && newPath.startsWith(i.key)
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
  { immediate: true }
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

<!-- i want repotrs chart of account sub ledger financial year expose ratio user device access -->

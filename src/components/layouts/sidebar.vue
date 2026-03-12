<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    collapsible
    class="overflow-y-auto whitespace-nowrap"
  >
    <div class="flex flex-col justify-center items-center my-2">
      <img
        v-if="!collapsed"
        src="/src/assets/images/aa.png"
        alt="Logo"
        class="w-20 rounded-full"
      />

      <span class="text-white text-base font-semibold">
        Admin <span v-if="!collapsed">Panel</span>
      </span>
    </div>

    <!-- Sidebar Menu -->
    <a-menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      :items="items"
      @openChange="handleOpenChange"
    />
  </a-layout-sider>
</template>

<script setup>
import { ref, reactive, h, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  InboxOutlined,
  UserOutlined,
  FileTextOutlined,
  ContainerOutlined,
} from "@ant-design/icons-vue";

const route = useRoute();
const router = useRouter();

const collapsed = ref(false);
const state = reactive({
  openKeys: [],
  selectedKeys: [route.path],
});

// Defining menu structure with submenus
const items = reactive([
  {
    key: "/profile-settings",
    label: "Settingssssssssss",
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/category-of-accounts",
        label: "Category of Accounts",
        onClick: () => router.push("/settings/category-of-accounts"),
      },

      {
        key: "/head-of-accounts",
        label: "Head of Accounts",
        onClick: () => router.push("/settings/head-of-accounts"),
      },

      // {
      //   key: "/head-of-accounts",
      //   label: "Head of Accounts",
      //   onClick: () => router.push("/settings/head-of-accounts"),
      // },
      {
        key: "/sub-head-of-accounts",
        label: "Sub Head of Accounts",
        onClick: () => router.push("/settings/sub-head-of-accounts"),
      },
      {
        key: "/department",
        label: "Department",
        onClick: () => router.push("/settings/department"),
      },
      {
        key: "/business",
        label: "Business",
        onClick: () => router.push("/settings/business"),
      },
      {
        key: "/sub-business",
        label: "Sub-Business",
        onClick: () => router.push("/settings/sub-business"),
      },
      {
        key: "/sub-department",
        label: "Sub-Department",
        onClick: () => router.push("/settings/sub-department"),
      },

      {
        key: "/voucher-category",
        label: "Voucher Category",
        onClick: () => router.push("/settings/voucher-category"),
      },
    ],
  },
  {
    key: "/transition",
    label: "Transitions",
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/voucher-entry",
        label: "Voucher Entry",
        onClick: () => router.push("/voucher-entry"),
      },
    ],
  },
  {
    key: "/reports",
    label: "Reports",
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/reports-head",
        label: "Report Head",
        onClick: () => router.push("/reports-head"),
      },
      {
        key: "/reports-group",
        label: "Report Group",
        onClick: () => router.push("/reports-group"),
      },
    ],
  },
  {
    key: "/accounts",
    label: "Category of Accounts", // Main Menu
    icon: () => h(FileTextOutlined),
    children: [
      // {
      //   key: "/head-of-accounts",
      //   label: "Head of Accounts", // Sub-menu under Category of Accounts
      //   onClick: () => router.push("/head-of-accounts"),
      // },
      {
        key: "/sub-head-of-accounts",
        label: "Group Code",
        // onClick: () => router.push("/sub-head-of-accounts"),
      },
      {
        key: "/sub-head-of-accounts",
        label: "Sub Head of Accounts", // Another sub-menu item
        onClick: () => router.push("/sub-head-of-accounts"),
      },
      {
        key: "/department",
        label: "Department", // Another sub-menu item
        onClick: () => router.push("/department"),
      },
      {
        key: "/business",
        label: "Business", // Sub-menu for Business
        onClick: () => router.push("/business"),
      },
      {
        key: "/sub-business",
        label: "Sub-Business", // Sub-menu for Sub-Business
        onClick: () => router.push("/sub-business"),
      },
      {
        key: "/sub-department",
        label: "Sub-Department", // Sub-menu for Sub-Department
        onClick: () => router.push("/sub-department"),
      },
    ],
  },
  {
    key: "/chart-of-accounts",
    label: "Chart of Accounts", // Main Menu
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/search-chart-of-accounts",
        label: "Search Chart of Accounts", // Another sub-menu item
        onClick: () => router.push("/search-chart-of-accounts"),
      },
      {
        key: "/chart-of-accounts/print",
        label: "Print Chart of Accounts", // Another sub-menu item
        onClick: () => router.push("/chart-of-accounts/print"),
      },
    ],
  },
  {
    key: "/sub-ledger",
    label: "Sub Ledger",
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/sub-ledger/vendorid-id",
        label: "Vendor ID",
        onClick: () => router.push("/sub-ledger/vendorid-id"),
      },
      {
        key: "/import-vendorid",
        label: "Import Vendor List",
        onClick: () => router.push("/import-vendorid"),
      },
      {
        key: "/deposit-category",
        label: "Deposit Category",
        onClick: () => router.push("/deposit-category"),
      },
      {
        key: "/voucher-category",
        label: "Voucher Category",
        onClick: () => router.push("/voucher-category"),
      },
      {
        key: "/cheque-print-format",
        label: "Cheque Print Format",
        onClick: () => router.push("/cheque-print-format"),
      },
    ],
  },
  {
    key: "/financial",
    label: "Financial Year",
    icon: () => h(ContainerOutlined),
    children: [
      {
        key: "/financial/financial-month",
        label: "Financial Month",
        onClick: () => router.push("/financial/financial-month"),
      },
      {
        key: "/financial/change-current-day",
        label: "Change Current Day",
        onClick: () => router.push("/financial/change-current-day"),
      },
      {
        key: "/financial/set-period",
        label: "Set Period",
        onClick: () => router.push("/financial/set-period"),
      },
      {
        key: "/financial/set-company",
        label: "Set Company",
        onClick: () => router.push("/financial/set-company"),
      },
      {
        key: "/financial/month-close",
        label: "Month Close",
        onClick: () => router.push("/financial/month-close"),
      },
      {
        key: "/financial/details-cash-flow-allocation-ratio",
        label: "Details Cash Flow Allocation Ratio",
        onClick: () =>
          router.push("/financial/details-cash-flow-allocation-ratio"),
      },
      {
        key: "/financial/synchronize-chart-of-accounts",
        label: "Synchronize Chart of Accounts",
        onClick: () => router.push("/financial/synchronize-chart-of-accounts"),
      },
      {
        key: "/financial/update-cheque-status",
        label: "Update Cheque Status",
        onClick: () => router.push("/financial/update-cheque-status"),
      },
      {
        key: "/financial/sync-beftn-vendorid-list",
        label: "Sync BEFTN Vendor List",
        onClick: () => router.push("/financial/sync-beftn-vendorid-list"),
      },
    ],
  },
  {
    key: "/expense-ratio",
    label: "Expense Ratio",
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: "/expense-ratio/opening-balance",
        label: "Opening Balance",
        onClick: () => router.push("/expense-ratio/opening-balance"),
      },
      {
        key: "/expense-ratio/transfer-last-closing",
        label: "Transfer Last Year Closing Balance",
        onClick: () => router.push("/expense-ratio/transfer-last-closing"),
      },
      {
        key: "/expense-ratio/brand-pl-designer",
        label: "Brand PL Designer",
        onClick: () => router.push("/expense-ratio/brand-pl-designer"),
      },
    ],
  },
  {
    key: "/user-device-access",
    label: "User Device Access",
    icon: () => h(InboxOutlined),
    onClick: () => router.push("/user-device-access"),
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
watch(
  () => route.path,
  (newPath) => {
    // Find the parent key for the current path
    const parentKey = items.find((item) =>
      item.children?.some((child) => newPath.startsWith(child.key))
    )?.key;

    // Only open one submenu (parentKey) at a time
    state.openKeys = parentKey ? [parentKey] : [];

    // Set selected key
    state.selectedKeys = [
      items
        .flatMap((item) => (item.children ? item.children : item))
        .find((child) => newPath.startsWith(child.key))?.key || newPath,
    ];
  },
  { immediate: true }
);

function handleOpenChange(keys) {
  // Only allow one submenu to be open
  if (keys.length > 0) {
    state.openKeys = [keys[keys.length - 1]];
  } else {
    state.openKeys = [];
  }
}
</script>

<style>
.ant-menu-item-selected,
.ant-layout-sider-trigger,
.ant-menu-item:not(.ant-menu-item-selected):hover {
  background: #0d47a1 !important;
}

.ant-menu-sub.ant-menu-inline {
  background: #0d47a11f !important;
}

.anticon svg {
  opacity: 1;
}
</style>

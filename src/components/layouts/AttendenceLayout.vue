<template>
  <a-layout has-sider>
    <!-- Sidebar -->
    <a-layout-sider ref="siderRef" :collapsed="collapsed" :width="sidebarWidth" collapsed-width="70" breakpoint="lg"
      :trigger="null" collapsible :style="{
        overflowY: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 999,
      }">
      <div class="logo px-5 text-center py-3">
        <router-link :to="{ name: 'overview' }" class="!text-white text-bold text-xl">
          Daily Attendance
        </router-link>
      </div>
      <a-menu :items="items" :openKeys="state.openKeys" :selectedKeys="state.selectedKeys"
        @openChange="(keys) => (state.openKeys = keys)" theme="dark" mode="inline" class="capitalize" />
    </a-layout-sider>

    <a-layout :style="{ marginLeft: collapsed ? '80px' : `${sidebarWidth}px` }">
      <!-- Header -->
      <Header :collapsed="collapsed" @update:collapsed="collapsed = $event" />
      <!-- Content -->
      <a-layout-content>
        <div :style="{
          margin: '0 16px',
          padding: $route?.name === 'home' ? '16px 0' : '16px 32px',
          background: $route?.name === 'home' ? 'transparent' : '#fff',
          borderRadius: $route?.name === 'home' ? '0' : '30px',
          boxShadow: $route?.name === 'home' ? 'none' : '2px 2px 2px #d5d5d5',
          height: 'calc(100vh - 156px)',
          overflowY: 'auto',
        }">
          <slot></slot>
        </div>
      </a-layout-content>
      <!-- Footer -->
      <a-layout-footer :style="{
        background: '#fff',
        padding: '16px 32px',
        margin: '16px 16px 8px',
        height: 'fit-content',
        lineHeight: 'normal',
        borderRadius: '30px',
        boxShadow: '1px 1px 1px #d5d5d5',
        textAlign: 'center',
      }">
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
    key: "/shift",
    label: "Shift",
    icon: () => h(FileTextOutlined),
    onClick: () => router.push("/shift"),
  },
  {
    key: "/shift-details",
    label: "Shift Details",
    icon: () => h(FileTextOutlined),
    onClick: () => router.push("/shift-details"),
  },
  {
    key: "/employee-hourly-rate",
    label: "Employee Hourly Rate",
    icon: () => h(FileTextOutlined),
    onClick: () => router.push("/employee-hourly-rate"),
  },
  {
    key: "/daily-attendance-report",
    label: "Daily Attendance Report",
    icon: () => h(FileTextOutlined),
    onClick: () => router.push("/daily-attendance-report"),
  },
  {
    key: "/overtime-report",
    label: "Overtime Report",
    icon: () => h(FileTextOutlined),
    onClick: () => router.push("/overtime-report"),
  },
  {
    key: "/monthly-attendence-summary",
    label: "Monthly Attendance Summary",
    icon: () => h(FileTextOutlined),
    onClick: () => router.push("/monthly-attendence-summary"),
  },
  {
    key: "/job-card-with-salary",
    label: "Job Card with Salary",
    icon: () => h(FileTextOutlined),
    onClick: () => router.push("/job-card-with-salary"),
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

<style scoped>
.ant-menu-item {
  @apply !h-fit !px-5 !rounded-full;
}

.ant-menu-title-content svg {
  @apply !align-baseline;
}

.ant-menu-item-selected {
  @apply !bg-primary !text-white;
}

.ant-menu-submenu-selected .ant-menu-submenu-title {
  @apply !bg-primary font-semibold;
}

.ant-menu .ant-menu-submenu .ant-menu-item {
  @apply !pl-10;
}
</style>

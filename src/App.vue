<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<style>
.ant-layout-sider {
  background: #001529;
  flex: 0 0 250px !important;
  max-width: 250px !important;
  min-width: 250px !important;
  width: 250px !important;
}

.ant-layout-sider-collapsed {
  flex: 0 0 80px !important;
  max-width: 80px !important;
  min-width: 80px !important;
  width: 80px !important;
}

.ant-layout-sider-trigger {
  width: 250px !important;
}

.ant-layout-sider-collapsed .ant-layout-sider-trigger {
  width: 80px !important;
}

/* .ant-menu-dark .ant-menu-item-selected {
  background: #0d47a1 !important;
}

.ant-menu-dark .ant-menu-item:hover {
  background: #0d47a1 !important;
} */

section.ant-layout {
  min-height: 100vh;
  overflow: auto !important;
}

/* Page transition */
.page-fade-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-fade-leave-active {
  transition: opacity 0.15s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-fade-leave-to {
  opacity: 0;
}
</style>

<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
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

/* .ant-select-item-option.ant-select-item-option-selected {
  background-color: #99d3ff !important;
}

.ant-select-item-option:hover{
  background-color: #cce9ff !important;
} */
</style>

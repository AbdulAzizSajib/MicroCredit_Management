<template>
  <a-dropdown :trigger="['click']">
    <a-button>
      {{ currentLabel }}
      <DownOutlined />
    </a-button>
    <template #overlay>
      <a-menu @click="handleChange">
        <a-menu-item key="en">English</a-menu-item>
        <a-menu-item key="bn">বাংলা</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { DownOutlined } from "@ant-design/icons-vue";
import { setLocale } from "@/locales";

const { locale } = useI18n();

const currentLabel = computed(() => (locale.value === "bn" ? "বাংলা" : "English"));

const handleChange = ({ key }) => {
  setLocale(key);
};
</script>

<template>
  <a-popconfirm @confirm="$emit('delete')">
    <template #title>
      Are you sure delete
      <span class="text-info font-semibold">{{ title }}</span
      >?
    </template>
    <button type="button" class="table_del_btn" title="Delete">
      <i class="bi bi-trash3"></i>
    </button>
  </a-popconfirm>
</template>

<script setup>
defineProps(["title"]);
defineEmits(["delete"]);
</script>

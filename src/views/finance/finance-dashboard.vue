<template>
  <MainLayout>
    <div class="mb-4 flex justify-end">
    
    </div>

    <div class="text-2xl text-primary text-center">
      Work in progress
    </div>
  </MainLayout>

</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: 'overview' });
};

</script>
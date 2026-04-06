<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-indigo-700">Total Members</h1>
        <a-button @click="$router.back()">Back</a-button>
      </div>

      <div class="">
        <div v-if="loading" class="text-center py-10">
          <a-spin size="large" />
        </div>

        <table v-else class="w-full border border-collapse text-left">
          <thead>
            <tr class="bg-primary text-white">
              <th class="border border-white px-4 py-2">#</th>
              <th class="border border-white px-4 py-2">AM Code</th>
              <th class="border border-white px-4 py-2">AM Details</th>
              <th class="border border-white px-4 py-2">Member Code</th>
              <th class="border border-white px-4 py-2">AC Type</th>
              <th class="border border-white px-4 py-2">User Id</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="members.length === 0">
              <td colspan="6" class="text-center py-4 text-gray-500">
                No data available.
              </td>
            </tr>
            <tr v-for="(item, index) in members" :key="item.AMCode">
              <td class="px-4 border">{{ index + 1 }}</td>
              <td class="px-4 border">{{ item.AMCode }}</td>
              <td class="px-4 border">{{ item.AMDetails }}</td>
              <td class="px-4 border">{{ item.MemberCode }}</td>
              <td class="px-4 border">{{ item.ACType1 }}</td>
              <td class="px-4 border">{{ item.UserId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";

const loading = ref(false);
const members = ref([]);

const fetchMembers = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${apiBase}/dashboard/members`, getToken());
    members.value = res?.data?.data || [];
  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to fetch members.");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMembers);
</script>

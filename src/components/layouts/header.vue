<template>
  <a-layout-header :style="{
    background: '#fff',
    padding: '16px 32px',
    margin: '8px 16px',
    height: 'fit-content',
    lineHeight: 'normal',
    borderRadius: '30px',
    boxShadow: '1px 1px 1px #d5d5d5',
  }">
    <div class="flex justify-between items-center">
      <!-- Custom Back Button with Iconify Icon -->
      <div v-if="showBackButton" class="flex items-center">
        <button @click="goBack"
          class="custom-back-btn bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300 flex items-center justify-center">
          <icon :icon="'akar-icons:arrow-back'" class="icon" /> Back
        </button>
      </div>

      <!-- Address & Time Section -->
      <div class="text-secondary font-bold uppercase text-center text-[10px]">
        <p class="text-[8px]">{{ userInfo?.branch?.address }}</p>
      </div>

      <!-- Profile Menu Section -->
      <div>
        <ul class="flex items-center space-x-3 list-none p-0 profile-menu">
          <li class="hidden md:block">
            <span class="font-bold">{{ time }}</span>
          </li>
          <li class="hidden md:block">
            <span class="font-bold">{{ date }}</span>
          </li>
          <li>
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link cursor-pointer flex items-center gap-2" @click.prevent>
                <i class="bi bi-person-circle text-lg mr-2 text-indigo-500"></i>
                <!-- <Icon icon="uim:user-nurse" class="size-6"/> -->
                <span class="text-xs lg:text-base">{{ userInfo?.name || 'Admin' }}</span>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <button type="button" class="w-full text-left" @click="handleLogout($router)">
                      Logout
                    </button>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </li>
        </ul>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup>
import Cookies from "js-cookie";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Icon } from '@iconify/vue'; // Import Iconify component
import axios from "axios";


// Define props, emits, and state variables
const companyName = ref(localStorage.getItem("company_name") || "");
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const cash_opening = JSON.parse(localStorage.getItem("cash_opening"));
const router = useRouter();
const showBackButton = ref(true); // Control whether to show the back button or not

const props = defineProps(["collapsed"]);
const emit = defineEmits();

const toggleCollapsed = () => {
  emit("update:collapsed", !props.collapsed);
};

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

let time = ref();
let date = ref();

function updateDateTime() {
  let now = new Date();
  time.value = now.toLocaleString("en-US", timeOptions);
  date.value = now.toLocaleString("en-US", dateOptions);
}

onMounted(async () => {
  updateDateTime();
  setInterval(updateDateTime, 60000);
  const res = await getAuth();
  if (res) handleLogout(router);
});

// Add listener for the back button action
const goBack = () => {
  window.history.back(); // Navigates to the previous page in history
};

window.addEventListener("keydown", (event) => {
  if (event?.key === "F3") {
    event.preventDefault();
    router.push({ name: "sales" });
  }
});

const getAuth = async () => {
  // Authentication check logic here
};

const handleLogout = (router) => {
  Cookies.remove("token");
  Cookies.set("isOpening", 0);
  localStorage.clear();
  router.push({ name: "login" });
};
</script>

<style scoped>


.icon {
  font-size: 20px;
  margin-right: 8px;
}
</style>

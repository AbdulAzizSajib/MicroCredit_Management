<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-spin-slow"
      ></div>
    </div>

    <!-- Header Section -->
    <div class="px-6 lg:px-16 xl:px-24 mb-10 pt-6">
      <div
        class="relative bg-white/90 backdrop-blur border border-gray-200/70 py-4 px-6 rounded-xl shadow-sm"
      >
        <div class="flex justify-between items-center gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div
              class="w-11 h-11 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/20"
            >
              <Icon class="w-6 h-6 text-white" icon="mdi:office-building-cog" />
            </div>
            <div class="flex flex-col leading-tight">
              <h2 class="text-xl md:text-2xl font-bold text-primary tracking-tight">
                {{ $t('overview.appTitle') }}
              </h2>
              <span class="text-xs text-gray-500">Enterprise Dashboard</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              @click="handleLogout($router)"
              class="flex items-center gap-2 px-4 py-2 text-danger hover:text-white hover:bg-danger border border-danger/30 hover:border-danger rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              <Icon class="w-4 h-4" icon="mdi:logout" />
              <span>{{ $t('common.logout') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Welcome Section -->
    <div class="relative z-10 text-center mb-12">
      <p class="text-base lg:text-lg text-gray-600">
        {{ $t('login.welcome') }}
        <span class="font-semibold text-primary">{{ $t('overview.appTitle') }}</span>
      </p>
      <div class="w-16 h-0.5 bg-primary/70 mx-auto mt-3 rounded-full"></div>
    </div>

    <!-- Enhanced Cards Grid -->
    <div class="relative z-10 px-8 lg:px-32 pb-20">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <button
          v-for="(item, index) in filteredCard"
          :key="index"
          class="group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          :style="{ animationDelay: `${index * 100}ms` }"
          :disabled="item?.disabled"
          @click="$router.push({ name: item?.route })"
        >
          <div
            class="card-animation relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-white/70 xl:h-48"
          >
            <!-- Hover gradient overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
              :style="{
                background: `linear-gradient(135deg, ${item.iconBg}33, ${item.iconBg}66)`,
              }"
            ></div>

            <!-- Content -->
            <div
              class="relative p-5 flex flex-col items-center justify-center gap-3 h-full"
            >
              <!-- Icon Container -->
              <div class="relative">
                <div
                  class="absolute inset-0 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                  :style="{ backgroundColor: item.iconBg }"
                ></div>
                <div
                  class="relative w-14 h-14 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 shadow-md"
                  :style="{ backgroundColor: item.iconBg }"
                >
                  <img
                    class="w-7 h-7 filter brightness-0 invert"
                    :src="item.icon"
                    alt=""
                  />
                </div>
              </div>

              <!-- Title -->
              <h2
                class="text-center font-semibold text-sm text-gray-800 group-hover:text-gray-900 transition-colors duration-300 leading-snug"
              >
                {{ $t(item.titleKey) }}
              </h2>
            </div>
          </div>
        </button>
      </div>
    </div>

  
  </div>
</template>

<script setup>
import customerIcon from "@/assets/images/icons/Costumers.png";
import performanceIcon from "@/assets/images/icons/performance.png";
import knowledgeIcon from "@/assets/images/icons/dept.png";
import learnIcon from "@/assets/images/icons/indivisual.png";
import project from "@/assets/images/icons/project.png";
import approveIcon from "@/assets/images/icons/approveal.png";
import reportIcon from "@/assets/images/icons/report.png";
import { Icon } from "@iconify/vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import Cookies from "js-cookie";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogout = (router) => {
  Cookies.remove("token");
  localStorage.clear();
  router.push({ name: "login" });
};

const user_permissions = ref(
  JSON.parse(localStorage.getItem("user_permissions") || "[]"),
);

const hasPermission = (permission) => {
  return user_permissions.value.includes(permission);
};

const card = [
  {
    titleKey: "menu.customerDashboard",
    icon: customerIcon,
    route: "finance-dashboard",
    bg: "#ffe2e5",
    iconBg: "#fa5a7d",
    permission: "Customer Dashboard",
  },
  {
    titleKey: "menu.accountantDashboard",
    icon: performanceIcon,
    route: "accountant-dashboard",
    bg: "#fff4de",
    iconBg: "#ff947a",
    permission: "Accountant Dashboard",
  },
  {
    titleKey: "menu.inventory",
    icon: project,
    route: "requisition-list",
    bg: "#dcfce7",
    iconBg: "#3cd856",
  },
];

const filteredCard = computed(() =>
  card.filter((item) => !item.permission || hasPermission(item.permission)),
);

// Auto-redirect if only one card available
onMounted(() => {
  if (filteredCard.value.length === 1) {
    router.replace({ name: filteredCard.value[0].route });
    return;
  }

  // Entrance animations
  const cards = document.querySelectorAll(".card-animation");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });
});
</script>

<style scoped>
/* Custom animations */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes spin-slow {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.card-animation {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.group:hover .filter {
  filter: brightness(1.1);
}

/* Glassmorphism effect */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

/* Enhanced hover states */
.group:hover {
  z-index: 10;
}

/* Notification pulse */
@keyframes pulse-notification {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse-notification 2s infinite;
}
</style>

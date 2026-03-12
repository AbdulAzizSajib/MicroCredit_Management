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
    <div class="px-8 lg:px-32 mb-8 mt-12">
      <div
        class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-6 px-8 rounded-xl shadow-2xl border border-slate-700/50"
      >
        <!-- Animated background glow -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/10 to-blue-500/5 animate-pulse"
        ></div>

        <!-- Subtle grid pattern -->
        <div
          class="absolute inset-0 opacity-10"
          style="
            background-image: radial-gradient(
              circle,
              #fff 1px,
              transparent 1px
            );
            background-size: 20px 20px;
          "
        ></div>

        <div class="relative flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <!-- Vibrant gradient icon -->
            <div
              class="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse"
            >
              <div class="w-6 h-6 bg-white rounded-lg"></div>
            </div>
            <!-- Gradient text -->
            <h2
              class="text-4xl font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
              ERPSA
            </h2>
          </div>

          <button
            @click="handleLogout($router)"
            class="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/30"
          >
            <Icon
              class="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors duration-300"
              icon="mdi:logout"
            />
            <span
              class="text-red-400 group-hover:text-red-300 text-sm font-semibold uppercase tracking-wide transition-colors duration-300"
              >Logout</span
            >
          </button>
        </div>
      </div>
    </div>

    <!-- Welcome Section -->
    <div class="relative z-10 text-center mb-16">
      <div class="inline-block">
        <!-- <h3
          class="text-2xl lg:text-3xl text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 bg-clip-text font-light">
          Hi, <span class="font-bold">{{ name }}</span>!
        </h3> -->
        <p class="text-lg lg:text-xl text-gray-600 mt-2">
          Welcome to your
          <span class="font-bold uppercase text-indigo-600">ERPSA</span>
          Dashboard
        </p>
        <div
          class="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"
        ></div>
      </div>
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
                {{ item.title }}
              </h2>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Floating Action Elements -->
    <div class="fixed bottom-8 right-8 z-20">
      <div class="relative group">
        <div
          class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-110"
        >
          <Icon class="w-8 h-8 text-white" icon="mdi:message-text" />
        </div>
        <div
          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span class="text-white text-xs font-bold">3</span>
        </div>
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
import Cookies from "js-cookie";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const name = localStorage.getItem("name");
const router = useRouter();

const handleLogout = (router) => {
  Cookies.remove("token");
  localStorage.clear();
  router.push({ name: "login" });
};

const card = [
  {
    title: "Finance & Accounting",
    icon: customerIcon,
    route: "finance-dashboard",
    bg: "#ffe2e5",
    iconBg: "#fa5a7d",
    disabled: false,
  },
  {
    title: "PAYROLL",
    icon: performanceIcon,
    route: "personal-info",
    bg: "#fff4de",
    iconBg: "#ff947a",
    disabled: false,
  },

  {
    title: "REPORT",
    icon: reportIcon,
    // route: "reports",
    bg: "#cbd7ff",
    iconBg: "#3c60d8",
    disabled: true,
  },
];

const filteredCard = computed(() =>
  card.filter((item) => !item.permission || hasPermission(item.permission)),
);

const user_permissions = ref(
  JSON.parse(localStorage.getItem("user_permissions") || "[]"),
);

const hasPermission = (permission) => {
  return user_permissions.value.includes(permission);
};

const roles = JSON.parse(localStorage.getItem("roles") || "[]");

const roleRouteMap = {
  "Super Admin": "business-dashboard",
  Admin: "individual-target",
  User: "individual-target",
  Supervisor: "individual-target",
  "Senior Supervisor": "department-target-result",
  "Head of Department": "department-dashboard",
  "Head of Business": "business-dashboard",
};

const priorityList = [
  "Super Admin",
  "Admin",
  "User",
  "Supervisor",
  "Senior Supervisor",
  "Head of Department",
  "Head of Business",
];

const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]");
const roleNames = storedRoles.map((role) => role.name);
const matchedRole = priorityList.find((role) => roleNames.includes(role));

card.forEach((item) => {
  if (item.title === "PERFORMANCE MANAGEMENT") {
    item.route = roleRouteMap[matchedRole];
  }
});

// Add entrance animations
onMounted(() => {
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

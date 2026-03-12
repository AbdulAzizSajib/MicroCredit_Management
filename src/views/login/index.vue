<template>
  <section class="login-wrapper">
    <div class="min-h-screen flex flex-col lg:flex-row">

      <!-- Left Side - Image -->
      <div class="lg:w-1/2 relative overflow-hidden">
        <!-- Background Image - Replace this URL with your Shutterstock image -->
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style="background-image: url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=1600&fit=crop');">
          <!-- Dark Overlay for better text visibility -->
          <div class="absolute inset-0 bg-gradient-to-br from-purple-900/70 to-indigo-900/70"></div>
        </div>

        <!-- Content Overlay -->
        <div class="relative z-10 h-full flex items-center justify-center p-8 lg:p-16">
          <div class="text-center lg:text-left max-w-lg">
            <img src="@/assets/images/aa.png" class="w-32 h-32 mx-auto lg:mx-0 mb-8 drop-shadow-2xl" alt="Logo" />
            <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Welcome Back!
            </h1>
            <p class="text-white/90 text-lg lg:text-xl leading-relaxed">
              Sign in to continue your journey with us. Secure, fast, and reliable access to your account.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-50">
        <div class="w-full max-w-md">

          <!-- Mobile Logo (hidden on desktop) -->
          <div class="lg:hidden mb-8 text-center">
            <img src="@/assets/images/aa.png" class="w-24 h-24 mx-auto" alt="Logo" />
          </div>

          <!-- Form Header -->
          <div class="mb-10">
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">Sign In</h2>
            <p class="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-6">

            <!-- User ID Input -->
            <div class="group">
              <label for="userId" class="block text-sm font-semibold text-gray-700 mb-2">
                User ID
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <img src="@/assets/images/user.png" alt="User" class="w-5 h-5 opacity-60" />
                </div>
                <input id="userId" v-model="form.UserId" type="text" required placeholder="Enter your user ID"
                  class="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300  focus:outline-none hover:border-gray-300" />
              </div>
            </div>

            <!-- Password Input -->
            <div class="group">
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <img src="@/assets/images/lock.png" alt="Lock" class="w-5 h-5 opacity-60" />
                </div>
                <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                  placeholder="Enter your password"
                  class="w-full pl-12 pr-14 py-4 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300  focus:outline-none hover:border-gray-300" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-purple-600 transition-colors">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="isLoading"
              class="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-purple-300">
              <span v-if="!isLoading" class="flex items-center justify-center">
                <span>Sign In</span>
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </span>
            </button>




          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { login } from "@/stores/login.js";
import router from "@/router/index.js";

const form = ref({
  UserId: "",
  password: "",
});

const isLoading = ref(false);
const showPassword = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  let res = await login(form.value, router);
  res && (isLoading.value = false);
};
</script>

<style scoped>
@keyframes pulse {

  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }

  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}

/* Custom scrollbar for the page */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #a855f7, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #9333ea, #db2777);
}


</style>
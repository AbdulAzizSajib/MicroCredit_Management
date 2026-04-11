<template>
  <div class="flex flex-col items-center gap-1">
    <svg :width="size" :height="size" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer circle -->
      <circle cx="60" cy="60" r="56" :stroke="dark ? '#60a5fa' : '#0D47A1'" stroke-width="3" fill="none" opacity="0.3" />
      <circle cx="60" cy="60" r="48" :fill="dark ? '#1e3a5f' : '#0D47A1'" />

      <!-- Shield shape -->
      <path d="M60 22 L88 38 L88 62 C88 80 74 94 60 98 C46 94 32 80 32 62 L32 38 Z"
        :fill="dark ? '#2563eb' : '#1565C0'" />
      <path d="M60 26 L84 40 L84 62 C84 78 72 90 60 94 C48 90 36 78 36 62 L36 40 Z"
        :fill="dark ? '#1e3a5f' : '#0D47A1'" />

      <!-- Currency symbol (Taka ৳) -->
      <text x="60" y="72" text-anchor="middle" :fill="dark ? '#93c5fd' : '#ffffff'"
        font-size="36" font-weight="bold" font-family="Arial, sans-serif">৳</text>

      <!-- Decorative dots -->
      <circle cx="48" cy="40" r="2.5" :fill="dark ? '#60a5fa' : '#64B5F6'" opacity="0.8" />
      <circle cx="60" cy="35" r="2.5" :fill="dark ? '#60a5fa' : '#64B5F6'" opacity="0.8" />
      <circle cx="72" cy="40" r="2.5" :fill="dark ? '#60a5fa' : '#64B5F6'" opacity="0.8" />

      <!-- Growth arrow -->
      <path d="M42 85 L55 75 L68 80 L80 68" :stroke="dark ? '#34d399' : '#4CAF50'" stroke-width="2.5"
        fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M74 68 L80 68 L80 74" :stroke="dark ? '#34d399' : '#4CAF50'" stroke-width="2.5"
        fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span v-if="showText" class="font-bold tracking-wide" :class="dark ? 'text-white' : 'text-primary'"
      :style="{ fontSize: size * 0.14 + 'px' }">
      MCM
    </span>
  </div>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 80 },
  dark: { type: Boolean, default: false },
  showText: { type: Boolean, default: true },
});
</script>

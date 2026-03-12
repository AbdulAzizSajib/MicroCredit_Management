<template>
  <AttendenceLayout>
    <div class="min-h-screen pt-8">
      <div class="">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-slate-800 mb-2">Shift Management</h1>
          <p class="text-slate-600">Manage and track employee shift schedules</p>
        </div>

        <!-- Main Form Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">


          <!-- Form Content -->
          <div class="p-8">
            <a-form layout="vertical" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <!-- Location -->
              <a-form-item label="Location" class="col-span-1">
                <a-select placeholder="AC1 PURE Flour Mill" size="large" class="w-full">
                  <a-select-option value="ac1">AC1 PURE Flour Mill</a-select-option>
                </a-select>
              </a-form-item>

              <!-- Shift1 -->
              <a-form-item label="Shift1" class="col-span-1">
                <a-input placeholder="1" size="large" class="w-full" />
              </a-form-item>

              <!-- Shift2 -->
              <a-form-item label="Shift2" class="col-span-1">
                <a-input placeholder="Regular A" size="large" class="w-full" />
              </a-form-item>

              <!-- Shift Serial -->
              <a-form-item label="Shift Serial" class="col-span-1">
                <a-input placeholder="1" size="large" class="w-full" />
              </a-form-item>

              <!-- In Time -->
              <a-form-item label="In Time" class="col-span-1">
                <a-input placeholder="2016-01-08 08:00:00" size="large" class="w-full" />
              </a-form-item>

              <!-- Duration -->
              <a-form-item label="Duration" class="col-span-1">
                <a-input placeholder="540" size="large" class="w-full" />
              </a-form-item>

              <!-- Min Over time -->
              <a-form-item label="Min Over time" class="col-span-1">
                <a-input placeholder="60" size="large" class="w-full" />
              </a-form-item>

              <!-- Max Over Time -->
              <a-form-item label="Max Over Time" class="col-span-1">
                <a-input placeholder="480" size="large" class="w-full" />
              </a-form-item>

              <!-- Over Time Deduction -->
              <a-form-item label="Over Time Deduction" class="col-span-1">
                <a-input placeholder="0" size="large" class="w-full" />
              </a-form-item>

              <!-- Before -->
              <a-form-item label="Before" class="col-span-1">
                <a-input placeholder="120" size="large" class="w-full" />
              </a-form-item>

              <!-- After -->
              <a-form-item label="After" class="col-span-1">
                <a-input placeholder="420" size="large" class="w-full" />
              </a-form-item>

              <!-- Late Time -->
              <a-form-item label="Late Time" class="col-span-1">
                <a-input placeholder="2016-01-08 08:16:00" size="large" class="w-full" />
              </a-form-item>
              <a-form-item label="Absent Time" class="col-span-1">
                <a-input placeholder="2016-01-08 08:16:00" size="large" class="w-full" />
              </a-form-item>
            </a-form>

          </div>
        </div>

        <!-- Additional Actions -->
        <div class="mt-8 flex justify-end gap-4">
          <a-button size="large"
            class="px-8 py-2 h-12 border-slate-300 text-gray-100 hover:border-slate-400 hover:text-slate-700 shadow-md hover:shadow-lg transition-all duration-200">
            Reset
          </a-button>
          <a-button type="primary" size="large"
            class="px-8 py-2 h-12 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
            Save Changes
          </a-button>
        </div>

      
      </div>
    </div>
  </AttendenceLayout>
</template>

<script setup>
import { ref } from 'vue';
import AttendenceLayout from '@/components/layouts/AttendenceLayout.vue';


</script>

<style scoped>
/* Enhanced visual styling */
.ant-form-item-label>label {
  @apply text-slate-700 font-semibold text-sm tracking-wide;
}

.ant-select-selector,
.ant-input {
  @apply border-slate-300 text-slate-700 font-medium;
}

.ant-select-selector[disabled],
.ant-input[disabled] {
  @apply  border-slate-200 text-slate-600 cursor-default;
}

.ant-btn {
  @apply font-semibold tracking-wide;
}

/* Card animations */
.bg-white {
  animation: slideInUp 0.8s ease-out;
}

.grid>.bg-white:nth-child(1) {
  animation-delay: 0.1s;
}

.grid>.bg-white:nth-child(2) {
  animation-delay: 0.2s;
}

.grid>.bg-white:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Gradient text effect */
h1 {
  background: linear-gradient(135deg, #1e293b, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Hover effects */
.hover\:shadow-xl:hover {
  transform: translateY(-2px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-slate-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-slate-300 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400;
}
</style>
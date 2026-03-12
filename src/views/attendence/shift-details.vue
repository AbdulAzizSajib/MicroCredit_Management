<template>
  <AttendenceLayout>
    <div class="min-h-screen mt-5">
      <!-- Header -->
      <div class="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 rounded-t-lg shadow-lg">
        <h1 class="text-xl font-semibold">Shift Details</h1>
      </div>

      <!-- Filter Section -->
      <div class="bg-white px-6 py-4  border-gray-200 shadow-sm">
        <div class="flex items-center gap-4">
          <a-select v-model:value="selectedLocation" placeholder="Select Location" class="w-64" size="large">
            <a-select-option value="">Select Location</a-select-option>
            <a-select-option value="sanitary">Sanitary Napkin & Diaper Plant</a-select-option>
            <a-select-option value="factory-a">Factory A</a-select-option>
            <a-select-option value="factory-b">Factory B</a-select-option>
          </a-select>
          <a-button type="primary" size="large"
            class="bg-slate-700 hover:bg-slate-600 border-slate-700 hover:border-slate-600">
            Submit
          </a-button>
        </div>
      </div>

      <!-- Add Shift Button -->
      <div class="bg-white px-6 py-4 border-x border-gray-200 shadow-sm">
        <a-button type="primary" size="large"
          class="bg-blue-600 hover:bg-blue-500 border-blue-600 hover:border-blue-500" @click="handleAddShift">
          Add Shift
        </a-button>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-b-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <!-- Table Header -->
            <thead>
              <tr class="bg-gradient-to-r from-violet-600 to-purple-500 text-white">
                <th class="px-4 py-3 rounded-s text-left text-base font-semibold border-r border-slate-600">#</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">Location</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">Shift1</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">Shift2</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">ShiftSerial</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">InTime</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">Duration</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">MinOvertime</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">MaxOverTime</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">OverTimeDeduction</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">Before</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">After</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">LateTime</th>
                <th class="px-4 py-3 text-left text-base font-semibold border-r border-slate-600">AbsentTime</th>
                <th class="px-4 py-3 rounded-e text-left text-base font-semibold">Action</th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody>
              <tr v-for="(shift, index) in shifts" :key="shift.id"
                class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ index + 1 }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.location }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.shift1 }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.shift2 }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.shiftSerial }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.inTime }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.duration }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.minOvertime }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.maxOverTime }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.overTimeDeduction }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.before }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.after }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.lateTime }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{{ shift.absentTime }}</td>
                <td class="px-4 py-3 text-sm">
                  <a-button type="primary" size="small"
                    class="bg-green-600 text-xs hover:bg-green-500 border-green-600 hover:border-green-500"
                    @click="handleEdit(shift.id)">
                    Edit
                  </a-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary mb-4"> Shift Details working progress (0)</h1>
  </AttendenceLayout>
</template>

<script setup>
import AttendenceLayout from '@/components/layouts/AttendenceLayout.vue';
import { ref, onMounted } from 'vue'

// Reactive data
const selectedLocation = ref('')

const shifts = ref([
  {
    id: 1,
    location: 'Sanitary Napkin & Diaper Plant',
    shift1: 'Daily',
    shift2: 'Daily',
    shiftSerial: 4,
    inTime: '2016-01-08 20:16:00.000',
    duration: 1440,
    minOvertime: 0,
    maxOverTime: 0,
    overTimeDeduction: 0,
    before: 0,
    after: 60,
    lateTime: '2016-01-08 04:16:00.000',
    absentTime: '2016-01-08 11:46:00.000'
  },
  {
    id: 2,
    location: 'Sanitary Napkin & Diaper Plant',
    shift1: 'Shift',
    shift2: 'Shift A',
    shiftSerial: 1,
    inTime: '2016-01-08 06:00:00.000',
    duration: 480,
    minOvertime: 30,
    maxOverTime: 480,
    overTimeDeduction: 0,
    before: 120,
    after: 360,
    lateTime: '2016-01-08 06:30:00.000',
    absentTime: '2016-01-08 07:30:00.000'
  },
  {
    id: 3,
    location: 'Sanitary Napkin & Diaper Plant',
    shift1: 'Shift',
    shift2: 'Shift B',
    shiftSerial: 2,
    inTime: '2016-01-08 14:00:00.000',
    duration: 480,
    minOvertime: 30,
    maxOverTime: 480,
    overTimeDeduction: 0,
    before: 120,
    after: 360,
    lateTime: '2016-01-08 14:30:00.000',
    absentTime: '2016-01-08 15:30:00.000'
  },
  {
    id: 4,
    location: 'Sanitary Napkin & Diaper Plant',
    shift1: 'Shift',
    shift2: 'Shift C',
    shiftSerial: 3,
    inTime: '2016-01-08 22:00:00.000',
    duration: 480,
    minOvertime: 30,
    maxOverTime: 480,
    overTimeDeduction: 0,
    before: 120,
    after: 360,
    lateTime: '2016-01-08 22:30:00.000',
    absentTime: '2016-01-08 11:30:00.000'
  },
  {
    id: 5,
    location: 'Sanitary Napkin & Diaper Plant',
    shift1: 'Shift G',
    shift2: 'Shift G',
    shiftSerial: 5,
    inTime: '2016-01-08 08:00:00.000',
    duration: 540,
    minOvertime: 30,
    maxOverTime: 480,
    overTimeDeduction: 0,
    before: 120,
    after: 360,
    lateTime: '2016-01-08 08:30:00.000',
    absentTime: '2016-01-08 09:30:00.000'
  }
])

// Methods
const handleAddShift = () => {
  console.log('Add shift clicked')
  // Add your add shift logic here
}

const handleEdit = (id) => {
  console.log('Edit shift with id:', id)
  // Add your edit logic here
}

onMounted(() => {
  console.log('Shift Details component mounted')
})
</script>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Ant Design Vue custom styles */
:deep(.ant-select-selector) {
  border-color: #d1d5db !important;
  border-radius: 6px !important;
}

:deep(.ant-select-selector:hover) {
  border-color: #9ca3af !important;
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}

:deep(.ant-btn) {
  border-radius: 6px !important;
  font-weight: 500 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.ant-btn-primary) {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
}

:deep(.ant-btn-primary:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15) !important;
  transition: all 0.2s ease !important;
}
</style>
<template>
  <AttendenceLayout>
    <div class="min-h-screen pt-8">
      <!-- Header -->
      <div class="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 rounded-t-lg shadow-lg">
        <h1 class="text-xl font-semibold">Monthly Attendance Summary</h1>
      </div>

      <!-- Filter Section -->
      <div class="bg-white px-2 py-6 border-x border-gray-200 shadow-sm">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4 items-end">
          <!-- Location -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Location</label>
            <a-select v-model:value="filters.location" placeholder="Select Location" size="large" class="w-full">
              <a-select-option value="">Select Location</a-select-option>
              <a-select-option value="plant1">Plant 1</a-select-option>
              <a-select-option value="plant2">Plant 2</a-select-option>
            </a-select>
          </div>

          <!-- Date From -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Date from:</label>
            <a-date-picker v-model:value="filters.dateFrom" size="large" class="w-full" format="YYYY-MM-DD"
              placeholder="2022-09-24" />
          </div>

          <!-- Date To -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Date to:</label>
            <a-date-picker v-model:value="filters.dateTo" size="large" class="w-full" format="YYYY-MM-DD"
              placeholder="2022-09-24" />
          </div>

          <!-- Department -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Department</label>
            <a-select v-model:value="filters.department" placeholder="Select Department" size="large" class="w-full">
              <a-select-option value="">Select Department</a-select-option>
              <a-select-option value="production">Production</a-select-option>
              <a-select-option value="quality">Quality</a-select-option>
              <a-select-option value="maintenance">Maintenance</a-select-option>
            </a-select>
          </div>

          <!-- Section -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Section</label>
            <a-select v-model:value="filters.section" placeholder="Select Section" size="large" class="w-full">
              <a-select-option value="">Select Section</a-select-option>
              <a-select-option value="section1">Section 1</a-select-option>
              <a-select-option value="section2">Section 2</a-select-option>
            </a-select>
          </div>

          <!-- SubSection -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">SubSection</label>
            <a-select v-model:value="filters.subSection" placeholder="Select SubSection" size="large" class="w-full">
              <a-select-option value="">Select SubSection</a-select-option>
              <a-select-option value="sub1">Sub Section 1</a-select-option>
              <a-select-option value="sub2">Sub Section 2</a-select-option>
            </a-select>
          </div>

          <!-- Emp Code -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Emp Code</label>
            <a-input v-model:value="filters.empCode" placeholder="Enter Emp Code" size="large" class="w-full" />
          </div>

          <!-- Report Type -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">ReportType</label>
            <a-select v-model:value="filters.reportType" placeholder="Select ReportType" size="large" class="w-full">
              <a-select-option value="">Select ReportType</a-select-option>
              <a-select-option value="daily">Daily</a-select-option>
              <a-select-option value="weekly">Weekly</a-select-option>
              <a-select-option value="monthly">Monthly</a-select-option>
            </a-select>
          </div>

          <!-- Shift -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Shift</label>
            <a-select v-model:value="filters.shift" placeholder="Select Shift" size="large" class="w-full">
              <a-select-option value="">Select Shift</a-select-option>
              <a-select-option value="shift-a">Shift A</a-select-option>
              <a-select-option value="shift-b">Shift B</a-select-option>
              <a-select-option value="shift-c">Shift C</a-select-option>
            </a-select>
          </div>

          <!-- Employee Type -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Employee Type</label>
            <a-select v-model:value="filters.employeeType" placeholder="Select Employee Type" size="large"
              class="w-full">
              <a-select-option value="">Select Employee Type</a-select-option>
              <a-select-option value="worker">Worker</a-select-option>
              <a-select-option value="staff">Staff</a-select-option>
              <a-select-option value="officer">Officer</a-select-option>
            </a-select>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between mt-6">
          <div class="flex items-center gap-4">
            <a-button type="primary" size="large"
              class="bg-cyan-500 hover:bg-cyan-400 border-cyan-500 hover:border-cyan-400 px-8" @click="handleSubmit">
              Submit
            </a-button>
            <a-button type="primary" size="large"
              class="bg-green-600 hover:bg-green-500 border-green-600 hover:border-green-500 px-8"
              @click="handleExport">
              Export
            </a-button>
            <a-button type="primary" size="large"
              class="bg-blue-600 hover:bg-blue-500 border-blue-600 hover:border-blue-500 px-8" @click="handlePrint">
              🖨 Print
            </a-button>
          </div>
        </div>
      </div>

      <!-- Show entries and Search Section -->
      <div class="bg-white px-6 py-4 border-x border-gray-200 shadow-sm">
        <div class="flex items-center justify-between">
          <!-- <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Show</span>
            <a-select v-model:value="entriesPerPage" size="small" class="w-20">
              <a-select-option :value="10">10</a-select-option>
              <a-select-option :value="25">25</a-select-option>
              <a-select-option :value="50">50</a-select-option>
              <a-select-option :value="100">100</a-select-option>
            </a-select>
            <span class="text-sm text-gray-700">entries</span>
          </div> -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-gray-700">Search:</span>
            <a-input v-model:value="searchTerm" class="w-48" placeholder="Search..." />
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-b-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-max">
            <!-- Table Header -->
            <thead>
              <tr class="bg-gradient-to-r from-violet-600 to-purple-500 text-white">
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Location</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Department</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Employee Code</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Employee Name</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Designation</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Card Number</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Leave</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Off Day</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Holiday</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Absent</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Late</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Present</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Total</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Actual Hour</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Working Hour</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Overtime</th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody>
              <tr v-for="(employee, index) in filteredEmployees" :key="employee.id"
                class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.location }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.department }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.empCode }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.empName }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.designation }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.cardNumber }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.leave }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.offDay }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.holiday }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.absent }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.late }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.present }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.total }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.actualHour }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.workingHour }}</td>
                <td class="px-3 py-2 text-xs text-gray-700">{{ employee.overtime }}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  </AttendenceLayout>
</template>

<script setup>
import AttendenceLayout from '@/components/layouts/AttendenceLayout.vue';

import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'

// Reactive data
const filters = ref({
  location: '',
  dateFrom: null,
  dateTo: null,
  department: '',
  section: '',
  subSection: '',
  empCode: '',
  reportType: '',
  shift: '',
  employeeType: ''
})

const entriesPerPage = ref(10)
const searchTerm = ref('')

const employees = ref([
  {
    id: 1,
    location: 'Factory A',
    department: 'Production',
    empCode: '1001',
    empName: 'Siriya Khatun',
    designation: 'Worker',
    cardNumber: '001',
    leave: 0,
    offDay: 1,
    holiday: 2,
    absent: 0,
    late: 1,
    present: 20,
    total: 24,
    actualHour: '160:00',
    workingHour: '160:00',
    overtime: '00:00'
  },
  {
    id: 2,
    location: 'Factory A',
    department: 'Quality',
    empCode: '1002',
    empName: 'Md. Alok',
    designation: 'Worker',
    cardNumber: '002',
    leave: 1,
    offDay: 0,
    holiday: 0,
    absent: 0,
    late: 0,
    present: 23,
    total: 24,
    actualHour: '160:00',
    workingHour: '160:00',
    overtime: '00:00'
  }
  // Add more employee objects as needed.
])

// Computed properties
const filteredEmployees = computed(() => {
  let filtered = employees.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(emp =>
      emp.empName.toLowerCase().includes(search) ||
      emp.staffId.toLowerCase().includes(search) ||
      emp.department.toLowerCase().includes(search)
    )
  }

  return filtered.slice(0, entriesPerPage.value)
})

// Methods
const handleSubmit = () => {
  console.log('Submit filters:', filters.value)
}

const handleExport = () => {
  console.log('Export data')
}

const handlePrint = () => {
  console.log('Print report')
  window.print()
}

onMounted(() => {
  console.log('Employee Attendance Report mounted')
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

:deep(.ant-input) {
  border-color: #d1d5db !important;
  border-radius: 6px !important;
}

:deep(.ant-input:hover) {
  border-color: #9ca3af !important;
}

:deep(.ant-input:focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}

:deep(.ant-picker) {
  border-color: #d1d5db !important;
  border-radius: 6px !important;
  width: 100% !important;
}

:deep(.ant-picker:hover) {
  border-color: #9ca3af !important;
}

:deep(.ant-picker-focused) {
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
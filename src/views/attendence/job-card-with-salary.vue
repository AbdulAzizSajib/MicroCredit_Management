<template>
  <AttendenceLayout>
    <div class="min-h-screen pt-8">

      <div class="m-auto">
        <div class="text-center">
          <div class="flex justify-center">
            <img src="../../assets/images/aci-logo.png" alt="ACI Logo" class="size-16" />
          </div>
          <p class="font-semibold text-xl pt-2">ACI LIMITED</p>
          <p class="text-sm">Sanitary Napkin & Diaper Plant</p>
          <p class="text-sm">Nilnagar, Konabari, Gazipur</p>
          <p class="text-sm">Monthly Job Card</p>
        </div>
      </div>
      <div class="flex justify-between items-center p-4 mb-4">
        <!-- Left section with name and ID -->
        <!-- Center with ACI logo and company information -->

        <div>
          <p class="font-bold text-lg">Name: Dipankar Biswas (3373)</p>
        </div>



        <!-- Right section with job title -->
        <div class="text-right">
          <p class="font-bold text-lg">Job Title: General Manager</p>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-b-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-max">
            <!-- Table Header -->
            <thead>
              <tr class="bg-gradient-to-r from-violet-600 to-purple-500 text-white">
                <th class="px-3 py-3 rounded-s text-left text-xs font-semibold border-r border-slate-600">Date</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">In Time</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Out Time</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Status</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Working Hour</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Actual Hour</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Short / Excess</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">OT (Hours)</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Rate</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Regular Total</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Overtime Total</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Net Total</th>
                <th class="px-3 py-3 text-left text-xs font-semibold border-r border-slate-600">Total</th>
                <th class="px-3 py-3 text-left text-xs font-semibold rounded-e ">Reason</th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody>
              <tr v-for="(employee, index) in filteredEmployees" :key="employee.id"
                class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.date }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.inTime }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.outTime }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.status }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.workingHour }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.actualHour }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.shortExcess }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.otHour }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.rate }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.regularTotal }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.overtimeTotal }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.netTotal }}</td>
                <td class="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{{ employee.total }}</td>
                <td class="px-3 py-2 text-xs text-gray-700">{{ employee.reason }}</td>
              </tr>
            </tbody>
          </table>


        </div>
      </div>
      <div class="flex justify-between pt-20">
        <div class="text-center w-1/3">
          <span class="border-t-2 px-1 border-gray-500 pt-2">Prepared By</span>
        </div>
        <div class="text-center w-1/3">
          <span class="border-t-2 px-1 border-gray-500 pt-2">Checked By</span>
        </div>
        <div class="text-center w-1/3">
          <span class="border-t-2 px-1 border-gray-500 pt-2">Approved By</span>
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
    date: '2025-09-01',
    inTime: '08:00 AM',
    outTime: '04:00 PM',
    status: 'Present',
    workingHour: '8.0',
    actualHour: '8.0',
    shortExcess: '0.0',
    otHour: '0.0',
    rate: '50',
    regularTotal: '400',
    overtimeTotal: '0',
    netTotal: '400',
    total: '400',
    reason: 'N/A'
  },
  {
    id: 2,
    date: '2025-09-02',
    inTime: '08:00 AM',
    outTime: '04:00 PM',
    status: 'Present',
    workingHour: '8.0',
    actualHour: '8.0',
    shortExcess: '0.0',
    otHour: '0.0',
    rate: '50',
    regularTotal: '400',
    overtimeTotal: '0',
    netTotal: '400',
    total: '400',
    reason: 'N/A'
  },
  {
    id: 3,
    date: '2025-09-03',
    inTime: '08:00 AM',
    outTime: '04:00 PM',
    status: 'Late',
    workingHour: '8.0',
    actualHour: '7.5',
    shortExcess: '-0.5',
    otHour: '0.0',
    rate: '50',
    regularTotal: '375',
    overtimeTotal: '0',
    netTotal: '375',
    total: '375',
    reason: 'Late arrival'
  },
  {
    id: 4,
    date: '2025-09-04',
    inTime: '08:00 AM',
    outTime: '04:00 PM',
    status: 'Absent',
    workingHour: '0.0',
    actualHour: '0.0',
    shortExcess: '0.0',
    otHour: '0.0',
    rate: '50',
    regularTotal: '0',
    overtimeTotal: '0',
    netTotal: '0',
    total: '0',
    reason: 'Sick leave'
  }
  // Add more employee records as needed
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
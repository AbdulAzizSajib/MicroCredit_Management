<template>
  <PayrollLayout>

    <div class="min-h-screen py-8 px-4">
      <div class="flex gap-2" v-if="!addNewMode">
        <!-- Employee Code Selection -->
        <div class="md:w-0/2 lg:w-1/4 mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-1">Employee Code</label>
          <a-select show-search v-model:value="employee.employeeCode" class="w-full" :filter-option="false" @search="(val) => {
                employeeCodesFiltered = employeeCodes.filter((e) =>
                  e?.toLowerCase().includes(val.toLowerCase())
                );
              }">
            <a-select-option v-for="code in employeeCodesFiltered" :key="code" :value="code">
              {{ code }}
            </a-select-option>
          </a-select>

        </div>
        <div class="flex space-x-4 mt-2">
          <a-button type="primary" class="mt-4" :loading="loadingEmployee" @click="fetchEmployeeInfo">View</a-button>
          <a-button type="dashed" class="mt-4">Print</a-button>
          <a-button type="default" class="mt-4" @click="enableAddNew">Add New Personal</a-button>
        </div>
      </div>
      <div>

        <div class="2">
          <div class="mb-8 bg-gray-100 p-6 rounded-lg">
            <h2 class="text-lg font-medium text-gray-700 mb-6 border-b border-gray-300 pb-2">
              Submission of Personal Information
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Employee ID:</label>
                  <a-input class="h-10" v-model:value="personal.employeeId" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Employee Name:</label>
                  <a-input class="h-10" v-model:value="personal.employeeName" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mother's Name:</label>
                  <a-input class="h-10" v-model:value="personal.motherName" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Blood Group:</label>
                  <a-select placeholder="Select Blood Group" class="h-10 w-full" v-model:value="personal.bloodGroup">
                    <a-select-option v-for="bg in bloodGroups" :key="bg" :value="bg">
                      {{ bg }}
                    </a-select-option>
                  </a-select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Birth Date:</label>
                  <a-date-picker placeholder="dd/mm/yyyy" format="DD/MM/YYYY" class="w-full h-10"
                    v-model:value="personal.birthDate" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Marital Status:</label>
                  <a-select placeholder="Select Marital Status" class="h-10 w-full"
                    v-model:value="personal.maritalStatus">
                    <a-select-option value="Single">Single</a-select-option>
                    <a-select-option value="Married">Married</a-select-option>
                    <a-select-option value="Divorced">Divorced</a-select-option>
                    <a-select-option value="Widowed">Widowed</a-select-option>
                  </a-select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone No:</label>
                  <a-input class="h-10" v-model:value="personal.phoneNo" />
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                  <a-select placeholder="Select Status" class="h-10 w-full" v-model:value="personal.status">
                    <a-select-option value="Active">Active</a-select-option>
                    <a-select-option value="Inactive">Inactive</a-select-option>
                    <a-select-option value="Hold">Hold</a-select-option>
                  </a-select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Father's Name:</label>
                  <a-input class="h-10" v-model:value="personal.fatherName" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Religion:</label>
                  <a-select placeholder="Select Religion" class="h-10 w-full" v-model:value="personal.religion">
                    <a-select-option v-for="rel in religions" :key="rel" :value="rel">
                      {{ rel }}
                    </a-select-option>
                  </a-select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Employee NID:</label>
                  <a-input class="h-10" v-model:value="personal.nid" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Birth Certificate:</label>
                  <a-input class="h-10" v-model:value="personal.birthCert" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Gender:</label>
                  <a-select placeholder="Select Gender" class="h-10 w-full" v-model:value="personal.gender">
                    <a-select-option value="Male">Male</a-select-option>
                    <a-select-option value="Female">Female</a-select-option>
                    <a-select-option value="Other">Other</a-select-option>
                  </a-select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mobile No:</label>
                  <a-input class="h-10" v-model:value="personal.mobileNo" />
                </div>
              </div>
            </div>
            <!-- Present Address Section -->
            <div class="mt-8">
              <h2 class="text-lg font-medium text-gray-700 mb-6 border-b border-gray-300 pb-2">
                Present Address
              </h2>
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">House/Road/Village/Union/Post
                    Office:</label>
                  <a-textarea :rows="3" v-model:value="personal.presentAddress.house" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Police Station/Upazila:</label>
                  <a-input class="h-10" v-model:value="personal.presentAddress.policeStation" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">District:</label>
                  <a-select placeholder="Select District" class="h-10 w-full"
                    v-model:value="personal.presentAddress.district">
                    <a-select-option v-for="d in districts" :key="d.code" :value="d.name">
                      {{ d.name }}
                    </a-select-option>
                  </a-select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Post Code:</label>
                  <a-input class="h-10" v-model:value="personal.presentAddress.postCode" />
                </div>
              </div>
            </div>
            <!-- Permanent Address Section -->
            <div class="mt-8 ">
              <h2 class="text-lg font-medium text-gray-700 mb-4 border-b border-gray-300 pb-2">
                Permanent Address
              </h2>
              <div class="flex items-center mb-4">
                <input type="checkbox" id="sameAsPresent" v-model="sameAsPresent" @change="copyPresentAddress"
                  class="mr-2" />
                <label for="sameAsPresent">Same as Present Address</label>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">House/Road/Village/Union/Post
                    Office:</label>
                  <a-textarea :rows="3" v-model:value="personal.permanentAddress.house" :disabled="permanentSame" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Police Station / Upazila:</label>
                  <a-input class="h-10" v-model:value="personal.permanentAddress.policeStation"
                    :disabled="permanentSame" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">District:</label>
                  <a-select placeholder="Select District" class="h-10 w-full"
                    v-model:value="personal.permanentAddress.district" :disabled="permanentSame">
                    <a-select-option v-for="d in districts" :key="d.code" :value="d.name">
                      {{ d.name }}
                    </a-select-option>
                  </a-select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Post Code:</label>
                  <a-input class="h-10" v-model:value="personal.permanentAddress.postCode" :disabled="permanentSame" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <a-button type="primary" size="large"
              class="bg-gray-800 hover:bg-gray-700 border-gray-800 hover:border-gray-700 px-12 py-2 h-12 text-white font-medium"
              :loading="submitLoading" :disabled="!isFormValid" @click="submitForm">
              {{ addNewMode ? 'CREATE' : 'UPDATE' }}
            </a-button>
          </div>
        </div>

      </div>
    </div>
  </PayrollLayout>
</template>

<script setup>
import PayrollLayout from '@/components/layouts/PayrollLayout.vue';
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import {ref, watch, onMounted, computed} from 'vue';
import axios from "axios";
import {apiBase} from "@/config.js";
import {getToken, showNotification} from "@/utilities/common.js";
import dayjs from "dayjs";

const router = useRouter();
const currentStep = ref(0);

const goBack = () => {
  router.push({ name: 'overview' });
};

const nextStep = () => {
  currentStep.value = 1;
};

const prevStep = () => {
  currentStep.value = 0;
};

const permanentSame = ref(false);

// ===== Personal Info =====
const personal = ref({
  employeeId: '',
  employeeName: '',
  fatherName: '',
  motherName: '',
  religion: '',
  bloodGroup: '',
  birthDate: null,
  maritalStatus: '',
  phoneNo: '',
  mobileNo: '',
  nid: '',
  birthCert: '',
  gender: '',
  status: '',
  presentAddress: { house: '', policeStation: '', district: '', postCode: '' },
  permanentAddress: { house: '', policeStation: '', district: '', postCode: '' }
});

const employee = ref({
  employeeCode: '',
  business: '',
  designation: '',
  contractFrom: null,
  remuneration: '',
  jobLocation: '',
  supervisorStaffId: '',
  supervisorContactNo: '',
  reason: '',
  department: '',
  joiningDate: null,
  expiryDate: null,
  jobType: '',
  location: '',
  supervisorName: '',
  supervisorDesignation: '',
  etin: '',
  leftDate: null,
  comment: ''
});

watch(permanentSame, (val) => {
  if (val) {
    personal.value.permanentAddress = { ...personal.value.presentAddress };
  }
});

const enableAddNew = () => {
  addNewMode.value = true;
  resetForm();
};

const resetForm = () => {
  personal.value = {
    employeeId: '',
    employeeName: '',
    fatherName: '',
    motherName: '',
    religion: '',
    bloodGroup: '',
    birthDate: null,
    maritalStatus: '',
    phoneNo: '',
    mobileNo: '',
    nid: '',
    birthCert: '',
    gender: '',
    status: '',
    presentAddress: { house: '', policeStation: '', district: '', postCode: '' },
    permanentAddress: { house: '', policeStation: '', district: '', postCode: '' }
  };
  employee.value = {
    employeeCode: '',
    business: '',
    designation: '',
    contractFrom: null,
    remuneration: '',
    jobLocation: '',
    supervisorStaffId: '',
    supervisorContactNo: '',
    reason: '',
    department: '',
    joiningDate: null,
    expiryDate: null,
    jobType: '',
    location: '',
    supervisorName: '',
    supervisorDesignation: '',
    etin: '',
    leftDate: null,
    comment: ''
  };
};

const isFormValid = computed(() => {
  return personal.value.employeeName && personal.value.fatherName && employee.value.business;
});

// ===== Dropdown Options =====
// const religions = ref([]);
// const bloodGroups = ref([]);
// const districts = ref([]);
// const businesses = ref([]);
// const departments = ref([]);
// const designations = ref([]);
// const locations = ref([]);
// const jobTypes = ref([]);
// const reasons = ref([]);
// const employeeCodes = ref([]);
const loadingEmployee = ref(false);
const addNewMode = ref(false);
const employeeCodes = ref([]);
const employeeCodesFiltered = ref([]);
const submitLoading = ref(false);
const religions = ref([]);
const religionsFiltered = ref([]);
const sameAsPresent = ref(false);
const bloodGroups = ref([]);
const bloodGroupsFiltered = ref([]);

const districts = ref([]);
const districtsFiltered = ref([]);

const businesses = ref([]);
const businessesFiltered = ref([]);

const designations = ref([]);
const designationsFiltered = ref([]);

const departments = ref([]);
const departmentsFiltered = ref([]);

const locations = ref([]);
const locationsFiltered = ref([]);

const jobTypes = ref([]);
const jobTypesFiltered = ref([]);

const reasons = ref([]);
const reasonsFiltered = ref([]);

const copyPresentAddress = () => {
  if (sameAsPresent.value) {
    personal.value.permanentAddress = { ...personal.value.presentAddress };
  } else {
    // reset if unchecked (optional)
    personal.value.permanentAddress = {
      house: "",
      policeStation: "",
      postCode: "",
      district: "",
    };
  }
};
// Load dropdown data
const loadDropdowns = async () => {
  try {
    let [rel, blood, dist, bus, dept, desg, loc, job, rea] = await Promise.all([
      axios.get(`${apiBase}/payroll/setting/religion_search?ReligionName=`, getToken()),
      axios.get(`${apiBase}/payroll/setting/bloodgroup_search?BloodGroup=`, getToken()),
      axios.get(`${apiBase}/payroll/setting/district_search?DistrictName=`, getToken()),
      axios.get(`${apiBase}/payroll/setting/business?BusinessName=`, getToken()),
      axios.get(`${apiBase}/payroll/setting/department?DeptName=`, getToken()),
      axios.get(`${apiBase}/payroll/setting/designation?DesgName=`, getToken()),
      axios.get(`${apiBase}/payroll/setting/location_search?LocationName=`, getToken()),
      axios.get(`${apiBase}/payroll/setting/jobtype_search?JobType=`, getToken()),
      axios.get(`${apiBase}/payroll/setting/reason_search?Reason=`, getToken())
    ]);

    religions.value = rel.data.data.data.map(r => r.ReligionName);
    bloodGroups.value = blood.data.data.data.map(b => b.BloodGroup);
    districts.value = dist.data.data.data.map(d => ({ code: d.District, name: d.DistrictName }));
    businesses.value = bus.data.data.data.map(b => ({ code: b.BusinessCode, name: b.BusinessName }));
    departments.value = dept.data.data.data.map(d => ({ code: d.DeptCode, name: d.DeptName }));
    designations.value = desg.data.data.data.map(d => ({ code: d.DesgCode, name: d.DesgName }));
    locations.value = loc.data.data.data.map(l => ({ code: l.LocationCode, name: l.LocationName }));
    jobTypes.value = job.data.data.data.map(j => ({ code: j.JobType, name: j.JobTypeDetails }));
    reasons.value = rea.data.data.data.map(r => ({ code: r.ReasonCode, name: r.Reason }));
  } catch (e) {
    console.error("Dropdown API Error:", e);
  }
};

// ===== Fetch Employee Info by Code =====

const loadEmployeeCodes = async () => {
  try {
    const res = await axios.get(`${apiBase}/payroll/employee/personal-info`, getToken());
    employeeCodes.value = res.data.data.data.map(emp => emp.EmpCode);
    employeeCodesFiltered.value = [...employeeCodes.value];
  } catch (e) {
    console.error("Employee Codes API Error:", e);
  }
};
const fetchEmployeeInfo = async () => {
  if (!employee.value.employeeCode) return;
  loadingEmployee.value = true;
  try {
    const res = await axios.get(
        `${apiBase}/payroll/employee/personal-info?EmpCode=${employee.value.employeeCode}`,
        getToken()
    );
    const emp = res.data.data.data[0];
    if (!emp) return;

    // Personal Info
    personal.value.employeeId = emp.EmpCode || "";
    personal.value.employeeName = emp.Name || "";
    personal.value.fatherName = emp.FatherName || "";
    personal.value.motherName = emp.MothersName || "";
    personal.value.religion = emp.Religion || "";
    personal.value.bloodGroup = emp.BloodGroup || "";
    personal.value.birthDate = emp.BirthDate ? dayjs(emp.BirthDate) : null;
    personal.value.phoneNo = emp.PhoneNo || "";
    personal.value.mobileNo = emp.MobileNo || "";
    personal.value.nid = emp.EmployeeNID || "";
    personal.value.birthCert = emp.BirthCertificate || "";
    personal.value.gender = emp.Gender || "";
    personal.value.maritalStatus = emp.MaritalStatus || "";
    personal.value.status = emp.Active === "Y" ? "Active" : "Inactive";
    personal.value.presentAddress = {
      house: emp.CAddress || "",
      policeStation: emp.CAddThana || "",
      district: emp.CAddDistrice || "",
      postCode: emp.CAddPostCode || ""
    };
    personal.value.permanentAddress = {
      house: emp.PAddress || "",
      policeStation: emp.PAddThana || "",
      district: emp.PAddDist || "",
      postCode: emp.PAddPostCode || ""
    };

    // Employee Info
    employee.value.business = emp.BusinessCode || "";
    employee.value.designation = emp.DesgCode || "";
    employee.value.contractFrom = emp.ContFromDate ? dayjs(emp.ContFromDate) : null;
    employee.value.remuneration = emp.Remuneration || "";
    employee.value.jobLocation = emp.JobLocation || "";
    employee.value.supervisorStaffId = emp.SupervisorEmpCode || "";
    employee.value.supervisorContactNo = emp.SupervisorsContactNo || "";
    employee.value.reason = emp.Reason || "";
    employee.value.department = emp.DeptCode || "";
    employee.value.joiningDate = emp.JoiningDate ? dayjs(emp.JoiningDate) : null;
    employee.value.expiryDate = emp.ExpairDate ? dayjs(emp.ExpairDate) : null; // fixed name
    employee.value.jobType = emp.JobType || "";
    employee.value.location = emp.Location || "";
    employee.value.supervisorName = emp.SupervisorName || "";
    employee.value.supervisorDesignation = emp.SupervisorDesgCode || "";
    employee.value.etin = emp.ETIN || emp.Tin || ""; // API sometimes has Tin
    employee.value.leftDate = emp.LeftDate ? dayjs(emp.LeftDate) : null;
    employee.value.comment = emp.Comment || "";
  } catch (e) {
    console.error("Fetch Employee Error:", e);
  } finally {
    loadingEmployee.value = false;
  }
};
const submitForm = async () => {
  submitLoading.value = true;
  try {
    const payload = {
      EmpCode: addNewMode.value
          ? personal.value.employeeId
          : employee.value.employeeCode,
      Name: personal.value.employeeName,
      FatherName: personal.value.fatherName,
      MothersName: personal.value.motherName,
      Religion: personal.value.religion,
      BloodGroup: personal.value.bloodGroup,
      BirthDate: personal.value.birthDate ? dayjs(personal.value.birthDate).format("YYYY-MM-DD") : null,
      CAddress: personal.value.presentAddress.house,
      CAddThana: personal.value.presentAddress.policeStation,
      CAddPostCode: personal.value.presentAddress.postCode,
      CAddDistrice: personal.value.presentAddress.district,
      PAddress: personal.value.permanentAddress.house,
      PAddThana: personal.value.permanentAddress.policeStation,
      PAddPostCode: personal.value.permanentAddress.postCode,
      PAddDist: personal.value.permanentAddress.district,
      PhoneNo: personal.value.phoneNo,
      MobileNo: personal.value.mobileNo,
      BusinessCode: employee.value.business,
      DeptCode: employee.value.department,
      DesgCode: employee.value.designation,
      JobType: employee.value.jobType,
      JoiningDate: employee.value.joiningDate ? dayjs(employee.value.joiningDate).format("YYYY-MM-DD") : null,
      ContFromDate: employee.value.contractFrom ? dayjs(employee.value.contractFrom).format("YYYY-MM-DD") : null,
      ExpairDate: employee.value.expiryDate ? dayjs(employee.value.expiryDate).format("YYYY-MM-DD") : null,
      Remuneration: employee.value.remuneration,
      Active: personal.value.status === "Active" ? 1 : 0,
      Gender: personal.value.gender,
      MaritalStatus: personal.value.maritalStatus,
      Comment: employee.value.comment,
      SupervisorEmpCode: employee.value.supervisorStaffId,
      SupervisorName: employee.value.supervisorName,
      SupervisorsContactNo: employee.value.supervisorContactNo,
      SupervisorDesgCode: employee.value.supervisorDesignation,
      ETIN: employee.value.etin,
      EmployeeNID: personal.value.nid,
      BirthCertificate: personal.value.birthCert,
      LeftDate: employee.value.leftDate ? dayjs(employee.value.leftDate).format("YYYY-MM-DD") : null,
      Location: employee.value.location,
      JobLocation: employee.value.jobLocation,
      Reason: employee.value.reason
    };

    if (addNewMode.value) {
      await axios.post(`${apiBase}/payroll/employee/personal-info`, payload, getToken());
      showNotification("success","Employee created successfully");
    } else {
      await axios.put(`${apiBase}/payroll/employee/personal-info/${employee.value.employeeCode}`, payload, getToken());
      showNotification("success","Employee updated successfully");
    }

    // Reset form
    personal.value = {
      employeeName: "",
      fatherName: "",
      motherName: "",
      religion: "",
      bloodGroup: "",
      birthDate: null,
      presentAddress: { house: "", policeStation: "", postCode: "", district: "" },
      permanentAddress: { house: "", policeStation: "", postCode: "", district: "" },
      phoneNo: "",
      mobileNo: "",
      status: "Active",
      gender: "",
      maritalStatus: "",
      nid: "",
      birthCert: ""
    };

    employee.value = {
      employeeCode: "",
      business: "",
      department: "",
      designation: "",
      jobType: "",
      joiningDate: null,
      contractFrom: null,
      expiryDate: null,
      remuneration: "",
      comment: "",
      supervisorStaffId: "",
      supervisorName: "",
      supervisorContactNo: "",
      supervisorDesignation: "",
      etin: "",
      leftDate: null,
      location: "",
      jobLocation: "",
      reason: ""
    };
    currentStep.value = 0;

  } catch (e) {
    // console.error("Submit Error:", e);
    showNotification("error","Something went wrong");
  } finally {
    submitLoading.value = false;
  }
};

// Load dropdowns when mounted
onMounted(() => {
  loadDropdowns();
  loadEmployeeCodes();
});
</script>

<style scoped>
:deep(.ant-input),
:deep(.ant-select-selector),
:deep(.ant-picker) {
  border-radius: 6px;
}

:deep(.ant-btn-primary) {
  background: #1f2937;
  border-color: #1f2937;
}

:deep(.ant-btn-primary:hover) {
  background: #374151 !important;
  border-color: #374151 !important;
}

:deep(.ant-select) {
  width: 100%;
}
</style>
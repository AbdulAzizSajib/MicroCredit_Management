<template>
  <MainLayout>
    <div class="flex justify-between">
      <div class="mb-4">
        <a-input
          placeholder="Search here..."
          v-model:value="search"
          @input="
            async () => {
              page = 1;
              await fetchAllData();
            }
          "
          class="w-64"
        />
      </div>
      <div class="mb-4">
        <button
          class="bg-primary text-white px-4 py-2 rounded"
          @click="isCreateModalVisible = true"
        >
          Add Vendor Entry
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-primary flex gap-3 mb-4">Vendor Entry</h1>
    <!-- Table -->
    <a-skeleton v-if="loading" />

    <div class="overflow-x-auto">
      <table class="w-full border border-collapse text-left">
        <thead>
          <tr class="bg-primary text-white">
            <th class="border border-white px-4 py-2">VendorId</th>
            <th class="border border-white px-4 py-2">VendorNo</th>
            <th class="border border-white px-4 py-2">VendorName</th>
            <th class="border border-white px-4 py-2">TINNo</th>
            <th class="border border-white px-4 py-2">AccountName</th>
            <th class="border border-white text-end px-4 py-2">AccountNo</th>

            <th class="border border-white px-4 py-2">Email</th>
            <th class="border border-white px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="capitalize">
          <tr v-for="(data, index) in allData" :key="index">
            <td class="px-4 border">{{ data?.VendorId }}</td>
            <td class="px-4 border">{{ data?.VendorNo }}</td>
            <td class="px-4 border">{{ data?.VendorName }}</td>
            <td class="px-4 border">{{ data?.TINNo }}</td>
            <td class="px-4 border">{{ data?.AccountName }}</td>
            <td class="px-4 border text-end">{{ data?.AccountNo }}</td>

            <td class="px-4 border">{{ data?.Email }}</td>

            <td class="px-4 border text-center w-8">
              <div class="flex justify-center gap-x-3">
                <button
                  @click="allData_idwise(data?.VendorId)"
                  type="button"
                  class="px-2 py-1 bg-secondary text-white rounded-md hover:bg-primary"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <a-popconfirm
                  @confirm="deleteData(data?.VendorId)"
                  title="Are you sure?"
                  ok-text="Yes"
                  cancel-text="No"
                >
                  <button
                    type="button"
                    class="px-2 py-1 bg-danger text-white rounded-md hover:bg-dangerDark"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </a-popconfirm>
              </div>
            </td>
          </tr>
          <tr v-if="!allData?.length && !loading">
            <td colspan="25">
              <a-empty />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- End of table -->

    <!-- Start Create Modal -->
    <a-modal
      v-model:open="isCreateModalVisible"
      title="Vendor Entry"
      @cancel="isCreateModalVisible = false"
      :footer="null"
      width="800px"
    >
      <form @submit.prevent="createallData" @keydown="handleEnterAsTab">
        <div class="grid grid-cols-2 gap-x-4 custom-form">
          <div>
            <!-- {{ formData.VendorType }} -->
            <!-- vendor type -->
            <a-form-item
              label="Vendor Type"
              class="w-full"
              name="VendorType"
              :rules="[{ required: false, message: 'Please select a Vendor Type!' }]"
            >
              <a-select class="w-full" v-model:value="formData.VendorType">
                <template v-for="(data, index) in allVendorData" :key="index">
                  <a-select-option :value="data?.VendorType"
                    >{{ data?.VendorTypeDetails }} -
                    {{ data?.VendorType }}</a-select-option
                  >
                </template>
              </a-select>
            </a-form-item>
          </div>
          <!-- vendor name -->
          <div>
            <a-form-item
              label="Vendor Name"
              name="VendorName"
              :rules="[{ required: false, message: 'Please select a Vendor Name!' }]"
            >
              <a-input
                class="w-full"
                placeholder="Enter Vendor Name"
                v-model:value="formData.VendorName"
              >
              </a-input>
            </a-form-item>
          </div>

          <!-- VATRegNo -->
          <div>
            <a-form-item
              label="VAT Reg No"
              name="VATRegNo"
              :rules="[{ required: false, message: 'Please select a VAT Reg No!' }]"
            >
              <a-input
                v-model:value="formData.VATRegNo"
                class="w-full"
                placeholder="Enter VAT Reg No"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- TINNo -->
          <div>
            <a-form-item
              label="TIN No"
              name="TINNo"
              :rules="[{ required: false, message: 'Please select a TIN No!' }]"
            >
              <a-input
                v-model:value="formData.TINNo"
                class="w-full"
                placeholder="Enter TIN No"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- AccountName -->
          <div>
            <a-form-item
              label="Account Name"
              name="AccountName"
              :rules="[{ required: false, message: 'Please select a Account Name!' }]"
            >
              <a-input
                v-model:value="formData.AccountName"
                class="w-full"
                placeholder="Enter Account Name"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- AccountNo -->
          <div>
            <a-form-item
              label="Account No"
              name="AccountNo"
              :rules="[{ required: false, message: 'Please select a Account No!' }]"
            >
              <a-input
                v-model:value="formData.AccountNo"
                class="w-full"
                placeholder="Enter Account No"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- BankName -->
          <div>
            <a-form-item
              label="Bank Name"
              name="BankName"
              :rules="[{ required: false, message: 'Please select a Bank Name!' }]"
            >
              <a-input
                v-model:value="formData.BankName"
                class="w-full"
                placeholder="Enter Bank Name"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- BranchName -->
          <div>
            <a-form-item
              label="Branch Name"
              name="BranchName"
              :rules="[{ required: false, message: 'Please select a Branch Name!' }]"
            >
              <a-input
                v-model:value="formData.BranchName"
                class="w-full"
                placeholder="Enter Branch Name"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- RoutinNo -->
          <div>
            <a-form-item
              label="Routin No"
              name="RoutinNo"
              :rules="[{ required: false, message: 'Please select a Routin No!' }]"
            >
              <a-input
                v-model:value="formData.RoutinNo"
                class="w-full"
                placeholder="Enter Routin No"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- VendorAddress -->
          <div>
            <a-form-item
              label="Vendor Address"
              name="VendorAddress"
              :rules="[{ required: false, message: 'Please select a Vendor Address!' }]"
            >
              <a-input
                v-model:value="formData.VendorAddress"
                class="w-full"
                placeholder="Enter Vendor Address"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- VendorTelephone -->
          <div>
            <a-form-item
              label="Vendor Telephone"
              name="VendorTelephone"
              :rules="[{ required: false, message: 'Please select a Vendor Telephone!' }]"
            >
              <a-input
                v-model:value="formData.VendorTelephone"
                class="w-full"
                placeholder="Enter Vendor Telephone"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- NonTaxable -->
          <div>
            <a-form-item
              label="Non Taxable"
              name="NonTaxable"
              :rules="[{ required: false, message: 'Please select a Non Taxable!' }]"
            >
              <a-select
                v-model:value="formData.NonTaxable"
                class="w-full"
                placeholder="Enter Non Taxable"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option></a-select
              >
            </a-form-item>
          </div>
          <!-- Region -->
          <div>
            <a-form-item
              label="Region"
              name="Region"
              :rules="[{ required: false, message: 'Please select a Region!' }]"
            >
              <a-input
                v-model:value="formData.Region"
                class="w-full"
                placeholder="Enter Region"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- SupplierID -->
          <div>
            <a-form-item
              label="Supplier ID"
              name="SupplierID"
              :rules="[
                { required: false, message: 'Please enter Supplier ID!' },
                {
                  max: 10,
                  message: 'Supplier ID must not be greater than 10 characters!',
                },
              ]"
            >
              <a-input
                v-model:value="formData.SupplierID"
                class="w-full"
                placeholder="Enter Supplier ID"
                :maxlength="10"
              />
            </a-form-item>
          </div>
          <!-- VendorCategory -->
          <div>
            <a-form-item
              label="Vendor Category"
              name="VendorCategory"
              :rules="[{ required: false, message: 'Please select a Vendor Category!' }]"
            >
              <a-input
                v-model:value="formData.VendorCategory"
                class="w-full"
                placeholder="Enter Vendor Category"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- TaxBearByACI -->
          <div>
            <a-form-item
              label="TaxBear By ACI"
              name="TaxBearByACI"
              :rules="[{ required: false, message: 'Please select a TaxBear By ACI!' }]"
            >
              <a-select
                v-model:value="formData.TaxBearByACI"
                class="w-full"
                placeholder="Enter TaxBear By ACI"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- Active -->
          <div>
            <a-form-item
              label="Active"
              name="Active"
              :rules="[{ required: false, message: 'Please select a Active!' }]"
            >
              <a-select
                v-model:value="formData.Active"
                class="w-full"
                placeholder="Enter Routin No"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- BEFTNApproved -->
          <div>
            <a-form-item
              label="BEFTN Approved"
              name="BEFTNApproved"
              :rules="[{ required: false, message: 'Please select a BEFTN Approved!' }]"
            >
              <a-select
                v-model:value="formData.BEFTNApproved"
                class="w-full"
                placeholder="Enter BEFTN Approved"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- UserID -->
          <div>
            <a-form-item
              label="User ID"
              name="UserID"
              :rules="[{ required: false, message: 'Please select a UserID!' }]"
            >
              <a-input
                v-model:value="formData.UserID"
                class="w-full"
                placeholder="Enter User ID"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- TaxReturnSubmitted -->
          <div>
            <a-form-item
              label="TaxReturnSubmitted"
              name="TaxReturnSubmitted"
              :rules="[
                { required: false, message: 'Please select a TaxReturn Submitted!' },
              ]"
            >
              <a-select
                v-model:value="formData.TaxReturnSubmitted"
                class="w-full"
                placeholder="Enter TaxReturn Submitted"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- AssessmentYear -->
          <div>
            <a-form-item
              label="Assessment Year"
              name="AssessmentYear"
              :rules="[{ required: false, message: 'Please select a Assessment Year!' }]"
            >
              <a-input
                v-model:value="formData.AssessmentYear"
                class="w-full"
                placeholder="Enter Assessment Year"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- ProofType -->
          <div>
            <a-form-item
              label="Proof Type"
              name="ProofType"
              :rules="[{ required: false, message: 'Please select a Proof Type!' }]"
            >
              <a-input
                v-model:value="formData.ProofType"
                class="w-full"
                placeholder="Enter Proof Type"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- ExpiryDate -->
          <div>
            <a-form-item
              label="Expiry Date"
              name="ExpiryDate"
              :rules="[{ required: false, message: 'Please select a Expiry Date!' }]"
            >
              <a-input
                v-model:value="formData.ExpiryDate"
                class="w-full"
                placeholder="Enter Expiry Date"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- TaxPayerType -->
          <div>
            <a-form-item
              label="TaxPayer Type"
              name="TaxPayerType"
              :rules="[{ required: false, message: 'Please select a TaxPayer Type!' }]"
            >
              <a-input
                v-model:value="formData.TaxPayerType"
                class="w-full"
                placeholder="Enter TaxPayer Type"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- ProofOfReturnReq -->
          <div>
            <a-form-item
              label="Proof Of ReturnReq"
              name="ProofOfReturnReq"
              :rules="[
                { required: false, message: 'Please select a Proof Of Return Req!' },
              ]"
            >
              <a-select
                v-model:value="formData.ProofOfReturnReq"
                class="w-full"
                placeholder="Enter Proof Of Return Req"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- Email -->
          <div>
            <a-form-item
              label="Email"
              name="Email"
              :rules="[{ required: false, message: 'Please select a Email!' }]"
            >
              <a-input
                v-model:value="formData.Email"
                class="w-full"
                placeholder="Enter Email"
              >
              </a-input>
            </a-form-item>
          </div>
        </div>
        <div class="flex items-center justify-end">
          <button
            type="submit"
            class="border px-6 py-1 rounded font-semibold bg-primary text-white"
          >
            Save
          </button>
        </div>
      </form>
    </a-modal>

    <!-- End Create Modal -->

    <!--Starting of Edit Modal -->
    <a-modal
      :footer="null"
      v-model:open="isEditModalVisible"
      title="Edit Vendor Entry"
      @cancel="isEditModalVisible = false"
      width="800px"
    >
      <form
        @submit.prevent="updateallData(updateformData.VendorId)"
        @keydown="handleEnterAsTab"
      >
        <div class="grid grid-cols-2 gap-x-4 custom-form">
          <!-- <div>
            
            <a-form-item
              label="Vendor Type"
              class="w-full"
              name="VendorType"
              :rules="[{ required: false, message: 'Please select a Vendor Type!' }]"
            >
              <a-select class="w-full" v-model:value="updateformData.VendorType">
                <template v-for="(data, index) in allVendorData" :key="index">
                  <a-select-option :value="data?.VendorType"
                    >{{ data?.VendorTypeDetails }} -
                    {{ data?.VendorType }}</a-select-option
                  >
                </template>
              </a-select>
            </a-form-item>
          </div> -->
          <!-- vendor name -->
          <div>
            <a-form-item
              label="Vendor Name"
              name="VendorName"
              :rules="[{ required: false, message: 'Please select a Vendor Name!' }]"
            >
              <a-input
                class="w-full"
                placeholder="Enter Vendor Name"
                v-model:value="updateformData.VendorName"
              >
              </a-input>
            </a-form-item>
          </div>

          <!-- VATRegNo -->
          <div>
            <a-form-item
              label="VAT Reg No"
              name="VATRegNo"
              :rules="[{ required: false, message: 'Please select a VAT Reg No!' }]"
            >
              <a-input
                v-model:value="updateformData.VATRegNo"
                class="w-full"
                placeholder="Enter VAT Reg No"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- TINNo -->
          <div>
            <a-form-item
              label="TIN No"
              name="TINNo"
              :rules="[{ required: false, message: 'Please select a TIN No!' }]"
            >
              <a-input
                v-model:value="updateformData.TINNo"
                class="w-full"
                placeholder="Enter TIN No"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- AccountName -->
          <div>
            <a-form-item
              label="Account Name"
              name="AccountName"
              :rules="[{ required: false, message: 'Please select a Account Name!' }]"
            >
              <a-input
                v-model:value="updateformData.AccountName"
                class="w-full"
                placeholder="Enter Account Name"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- AccountNo -->
          <div>
            <a-form-item
              label="Account No"
              name="AccountNo"
              :rules="[{ required: false, message: 'Please select a Account No!' }]"
            >
              <a-input
                v-model:value="updateformData.AccountNo"
                class="w-full"
                placeholder="Enter Account No"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- BankName -->
          <div>
            <a-form-item
              label="Bank Name"
              name="BankName"
              :rules="[{ required: false, message: 'Please select a Bank Name!' }]"
            >
              <a-input
                v-model:value="updateformData.BankName"
                class="w-full"
                placeholder="Enter Bank Name"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- BranchName -->
          <div>
            <a-form-item
              label="Branch Name"
              name="BranchName"
              :rules="[{ required: false, message: 'Please select a Branch Name!' }]"
            >
              <a-input
                v-model:value="updateformData.BranchName"
                class="w-full"
                placeholder="Enter Branch Name"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- RoutinNo -->
          <div>
            <a-form-item
              label="Routin No"
              name="RoutinNo"
              :rules="[{ required: false, message: 'Please select a Routin No!' }]"
            >
              <a-input
                v-model:value="updateformData.RoutinNo"
                class="w-full"
                placeholder="Enter Routin No"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- VendorAddress -->
          <div>
            <a-form-item
              label="Vendor Address"
              name="VendorAddress"
              :rules="[{ required: false, message: 'Please select a Vendor Address!' }]"
            >
              <a-input
                v-model:value="updateformData.VendorAddress"
                class="w-full"
                placeholder="Enter Vendor Address"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- VendorTelephone -->
          <div>
            <a-form-item
              label="Vendor Telephone"
              name="VendorTelephone"
              :rules="[{ required: false, message: 'Please select a Vendor Telephone!' }]"
            >
              <a-input
                v-model:value="updateformData.VendorTelephone"
                class="w-full"
                placeholder="Enter Vendor Telephone"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- NonTaxable -->
          <div>
            <a-form-item
              label="Non Taxable"
              name="NonTaxable"
              :rules="[{ required: false, message: 'Please select a Non Taxable!' }]"
            >
              <a-select
                v-model:value="updateformData.NonTaxable"
                class="w-full"
                placeholder="Enter Non Taxable"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option></a-select
              >
            </a-form-item>
          </div>
          <!-- Region -->
          <div>
            <a-form-item
              label="Region"
              name="Region"
              :rules="[{ required: false, message: 'Please select a Region!' }]"
            >
              <a-input
                v-model:value="updateformData.Region"
                class="w-full"
                placeholder="Enter Region"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- SupplierID -->
          <div>
            <a-form-item
              label="Supplier ID"
              name="SupplierID"
              :rules="[
                { required: false, message: 'Please enter Supplier ID!' },
                {
                  max: 10,
                  message: 'Supplier ID must not be greater than 10 characters!',
                },
              ]"
            >
              <a-input
                v-model:value="updateformData.SupplierID"
                class="w-full"
                placeholder="Enter Supplier ID"
                :maxlength="10"
              />
            </a-form-item>
          </div>
          <!-- VendorCategory -->
          <div>
            <a-form-item
              label="Vendor Category"
              name="VendorCategory"
              :rules="[{ required: false, message: 'Please select a Vendor Category!' }]"
            >
              <a-input
                v-model:value="updateformData.VendorCategory"
                class="w-full"
                placeholder="Enter Vendor Category"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- TaxBearByACI -->
          <div>
            <a-form-item
              label="TaxBear By ACI"
              name="TaxBearByACI"
              :rules="[{ required: false, message: 'Please select a TaxBear By ACI!' }]"
            >
              <a-select
                v-model:value="updateformData.TaxBearByACI"
                class="w-full"
                placeholder="Enter TaxBear By ACI"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- Active -->
          <div>
            <a-form-item
              label="Active"
              name="Active"
              :rules="[{ required: false, message: 'Please select a Active!' }]"
            >
              <a-select
                v-model:value="updateformData.Active"
                class="w-full"
                placeholder="Enter Routin No"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- BEFTNApproved -->
          <div>
            <a-form-item
              label="BEFTN Approved"
              name="BEFTNApproved"
              :rules="[{ required: false, message: 'Please select a BEFTN Approved!' }]"
            >
              <a-select
                v-model:value="updateformData.BEFTNApproved"
                class="w-full"
                placeholder="Enter BEFTN Approved"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- UserID -->
          <div>
            <a-form-item
              label="User ID"
              name="UserID"
              :rules="[{ required: false, message: 'Please select a UserID!' }]"
            >
              <a-input
                v-model:value="updateformData.UserID"
                class="w-full"
                placeholder="Enter User ID"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- TaxReturnSubmitted -->
          <div>
            <a-form-item
              label="TaxReturnSubmitted"
              name="TaxReturnSubmitted"
              :rules="[
                { required: false, message: 'Please select a TaxReturn Submitted!' },
              ]"
            >
              <a-select
                v-model:value="updateformData.TaxReturnSubmitted"
                class="w-full"
                placeholder="Enter TaxReturn Submitted"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- AssessmentYear -->
          <div>
            <a-form-item
              label="Assessment Year"
              name="AssessmentYear"
              :rules="[{ required: false, message: 'Please select a Assessment Year!' }]"
            >
              <a-input
                v-model:value="updateformData.AssessmentYear"
                class="w-full"
                placeholder="Enter Assessment Year"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- ProofType -->
          <div>
            <a-form-item
              label="Proof Type"
              name="ProofType"
              :rules="[{ required: false, message: 'Please select a Proof Type!' }]"
            >
              <a-input
                v-model:value="updateformData.ProofType"
                class="w-full"
                placeholder="Enter Proof Type"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- ExpiryDate -->
          <div>
            <a-form-item
              label="Expiry Date"
              name="ExpiryDate"
              :rules="[{ required: false, message: 'Please select a Expiry Date!' }]"
            >
              <a-input
                v-model:value="updateformData.ExpiryDate"
                class="w-full"
                placeholder="Enter Expiry Date"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- TaxPayerType -->
          <div>
            <a-form-item
              label="TaxPayer Type"
              name="TaxPayerType"
              :rules="[{ required: false, message: 'Please select a TaxPayer Type!' }]"
            >
              <a-input
                v-model:value="updateformData.TaxPayerType"
                class="w-full"
                placeholder="Enter TaxPayer Type"
              >
              </a-input>
            </a-form-item>
          </div>
          <!-- ProofOfReturnReq -->
          <div>
            <a-form-item
              label="Proof Of ReturnReq"
              name="ProofOfReturnReq"
              :rules="[
                { required: false, message: 'Please select a Proof Of Return Req!' },
              ]"
            >
              <a-select
                v-model:value="updateformData.ProofOfReturnReq"
                class="w-full"
                placeholder="Enter Proof Of Return Req"
              >
                <a-select-option value="1">Yes</a-select-option>
                <a-select-option value="0">No</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- Email -->
          <div>
            <a-form-item
              label="Email"
              name="Email"
              :rules="[{ required: false, message: 'Please select a Email!' }]"
            >
              <a-input
                v-model:value="updateformData.Email"
                class="w-full"
                placeholder="Enter Email"
              >
              </a-input>
            </a-form-item>
          </div>
        </div>

        <div class="flex items-center justify-end">
          <button
            type="submit"
            class="border px-6 py-1 rounded font-semibold bg-primary text-white"
          >
            Update
          </button>
        </div>
      </form>
    </a-modal>
    <!--Ending of Edit Modal -->
  </MainLayout>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from "@/config";
import axios from "axios";
import { getToken, showNotification } from "@/utilities/common";

import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.push({ name: "overview" });
};

const user_info = JSON.parse(localStorage.getItem("user_info"));
const isCreateModalVisible = ref(false);
const allData = ref();
const allVendorData = ref([]);
const search = ref();
const isCreating = ref(false);
const isShowLoading = ref(false);
const isEditModalVisible = ref(false);
const isUpdating = ref(false);
const loading = ref(false);
const total = ref();

const formData = ref({
  // VendorId: "",
  VendorType: "",
  // VendorNo: "",
  VendorName: "",
  VATRegNo: "",
  TINNo: "",
  AccountName: "",
  AccountNo: "",
  BankName: "",
  BranchName: "",
  RoutinNo: "",
  VendorAddress: "",
  VendorTelephone: "",
  NonTaxable: "1",
  Region: "",
  SupplierID: "",
  VendorCategory: "",
  TaxBearByACI: "1",
  Active: "1",
  BEFTNApproved: "1",
  UserID: user_info?.UserId,
  TaxReturnSubmitted: "1",
  AssessmentYear: "",
  ProofType: "",
  ExpiryDate: "",
  TaxPayerType: "",
  ProofOfReturnReq: "1",
  Email: "",
});

const updateformData = ref({
  // VendorId: "",
  VendorType: "",
  // VendorNo: "",
  VendorName: "",
  VATRegNo: "",
  TINNo: "",
  AccountName: "",
  AccountNo: "",
  BankName: "",
  BranchName: "",
  RoutinNo: "",
  VendorAddress: "",
  VendorTelephone: "",
  NonTaxable: "",
  Region: "",
  SupplierID: "",
  VendorCategory: "",
  TaxBearByACI: "",
  Active: "",
  BEFTNApproved: "",
  UserID: "",
  TaxReturnSubmitted: "",
  AssessmentYear: "",
  ProofType: "",
  ExpiryDate: "",
  TaxPayerType: "",
  ProofOfReturnReq: "",
  Email: "",
});

// Fetch allData with search and pagination
const page = ref(1);
const per_page = ref(10);

const fetchAllData = async () => {
  loading.value = true;
  try {
    console.log(apiBase);
    const res = await axios.get(
      `${apiBase}/settings/vendor-list?page=${page.value}&per_page=${
        per_page.value
      }&search=${search.value || ""}`,
      //?page=${page.value}&per_page=${per_page.value}&{search.value}
      getToken()
    );

    loading.value = false;
    allData.value = res?.data?.data?.data;

    total.value = res?.data?.data?.total;
  } catch (err) {
    loading.value = false;
    allData.value = [];
    total.value = 0;
    console.error("Failed to fetch allData:", err);
  }
};

// vendor type API
const fetchvendorTypeData = async () => {
  try {
    const res = await axios.get(`${apiBase}/settings/vendor-type/all`, getToken());
    console.log(res.data);
    allVendorData.value = res?.data?.data;

    // if (allVendorData.value.length > 0) {
    //   formData.value.VendorType = allVendorData.value[0].VendorType;
    // }
  } catch (error) {
    console.error("Failed to fetch vendor types:", error);
  }
};

// Create API
const createallData = async () => {
  isCreating.value = true;
  try {
    const res = await axios.post(
      `${apiBase}/settings/vendor-list/`,
      formData.value,
      getToken()
    );
    isCreating.value = false;

    if (res.data.success === true) {
      showNotification(res?.data?.success ? "success" : "error", res?.data?.message);
      await fetchAllData();

      formData.value = {
        VendorType: "",
        // VendorNo: "",
        VendorName: "",
        VATRegNo: "",
        TINNo: "",
        AccountName: "",
        AccountNo: "",
        BankName: "",
        BranchName: "",
        RoutinNo: "",
        VendorAddress: "",
        VendorTelephone: "",
        NonTaxable: "1",
        Region: "",
        SupplierID: "",
        VendorCategory: "",
        TaxBearByACI: "1",
        Active: "1",
        BEFTNApproved: "1",
        UserID: user_info?.id,
        TaxReturnSubmitted: "1",
        AssessmentYear: "",
        ProofType: "",
        ExpiryDate: "",
        TaxPayerType: "",
        ProofOfReturnReq: "1",
        Email: "",
      };
      isCreateModalVisible.value = false;
    }
  } catch (error) {
    isCreating.value = false;
    isCreateModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// AllData ID wise
const allData_idwise = async (id) => {
  try {
    isShowLoading.value = true;
    console.log(apiBase);
    const res = await axios.get(
      `${apiBase}/settings/vendor-list/show?vendorId=${id}`,
      getToken()
    );
    isShowLoading.value = false;
    console.log(res);

    updateformData.value = {
      VendorId: res?.data?.data?.VendorId,
      VendorType: res?.data?.data?.VendorType,
      VendorName: res?.data?.data?.VendorName,
      VATRegNo: res?.data?.data?.VATRegNo,
      TINNo: res?.data?.data?.TINNo,
      AccountName: res?.data?.data?.AccountName,
      AccountNo: res?.data?.data?.AccountNo,
      BankName: res?.data?.data?.BankName,
      BranchName: res?.data?.data?.BranchName,
      RoutinNo: res?.data?.data?.RoutinNo,
      VendorAddress: res?.data?.data?.VendorAddress,
      VendorTelephone: res?.data?.data?.VendorTelephone,
      NonTaxable: res?.data?.data?.NonTaxable,
      Region: res?.data?.data?.Region,
      SupplierID: res?.data?.data?.SupplierID,
      VendorCategory: res?.data?.data?.VendorCategory,
      TaxBearByACI: res?.data?.data?.TaxBearByACI,
      Active: res?.data?.data?.Active,
      BEFTNApproved: res?.data?.data?.BEFTNApproved,
      UserID: res?.data?.data?.UserID,
      TaxReturnSubmitted: res?.data?.data?.TaxReturnSubmitted,
      AssessmentYear: res?.data?.data?.AssessmentYear,
      ProofType: res?.data?.data?.ProofType,
      ExpiryDate: res?.data?.data?.ExpiryDate,
      TaxPayerType: res?.data?.data?.TaxPayerType,
      ProofOfReturnReq: res?.data?.data?.ProofOfReturnReq,
      Email: res?.data?.data?.Email,
    };
    console.log(updateformData.value);
    isEditModalVisible.value = true;
  } catch (error) {
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// update
const updateallData = async (VendorId) => {
  const finalFormData = {
    // VendorId: "",
    // VendorType: updateformData.value.VendorType,
    // VendorNo: "",
    VendorName: updateformData.value.VendorName,
    VATRegNo: updateformData.value.VATRegNo,
    TINNo: updateformData.value.TINNo,
    AccountName: updateformData.value.AccountName,
    AccountNo: updateformData.value.AccountNo,
    BankName: updateformData.value.BankName,
    BranchName: updateformData.value.BranchName,
    RoutinNo: updateformData.value.RoutinNo,
    VendorAddress: updateformData.value.VendorAddress,
    VendorTelephone: updateformData.value.VendorTelephone,
    NonTaxable: updateformData.value.NonTaxable,
    Region: updateformData.value.Region,
    SupplierID: updateformData.value.SupplierID,
    VendorCategory: updateformData.value.VendorCategory,
    TaxBearByACI: updateformData.value.TaxBearByACI,
    Active: updateformData.value.Active,
    BEFTNApproved: updateformData.value.BEFTNApproved,
    UserID: updateformData.value.UserID,
    TaxReturnSubmitted: updateformData.value.TaxReturnSubmitted,
    AssessmentYear: updateformData.value.AssessmentYear,
    ProofType: updateformData.value.ProofType,
    ExpiryDate: updateformData.value.ExpiryDate,
    TaxPayerType: updateformData.value.TaxPayerType,
    ProofOfReturnReq: updateformData.value.ProofOfReturnReq,
    Email: updateformData.value.Email,
  };
  isUpdating.value = true;
  try {
    const res = await axios.put(
      `${apiBase}/settings/vendor-list?vendorId=${VendorId}`,
      finalFormData,
      getToken()
    );
    isUpdating.value = false;
    showNotification(res?.data?.success ? "success" : "error", res?.data?.message);

    updateformData.value = {
      // VendorId: "",
      // VendorType: "",
      // VendorNo: "",
      VendorName: "",
      VATRegNo: "",
      TINNo: "",
      AccountName: "",
      AccountNo: "",
      BankName: "",
      BranchName: "",
      RoutinNo: "",
      VendorAddress: "",
      VendorTelephone: "",
      NonTaxable: "",
      Region: "",
      SupplierID: "",
      VendorCategory: "",
      TaxBearByACI: "",
      Active: "",
      BEFTNApproved: "",
      UserID: "",
      TaxReturnSubmitted: "",
      AssessmentYear: "",
      ProofType: "",
      ExpiryDate: "",
      TaxPayerType: "",
      ProofOfReturnReq: "",
      Email: "",
    };
    await fetchAllData();
    isEditModalVisible.value = false;
  } catch (error) {
    isUpdating.value = false;
    isEditModalVisible.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

//Delete API
const deleteData = async (VendorId) => {
  loading.value = true;
  try {
    const res = await axios.delete(
      `${apiBase}/settings/vendor-list?vendorId=${VendorId}`,
      getToken()
    );
    showNotification(res?.data ? "success" : "error", res?.data?.message);
    await fetchAllData();
  } catch (err) {
    loading.value = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }
};

// next input when pressing Enter
const handleEnterAsTab = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll(
        "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])"
      )
    );

    const index = focusableElements.indexOf(event.target);
    if (index > -1 && index < focusableElements.length - 1) {
      focusableElements[index + 1].focus();
    } else {
      event.currentTarget.requestSubmit();
    }
  }
};

onMounted(async () => {
  await fetchAllData();
  await fetchvendorTypeData();
});
</script>

<style>
.ant-input-number-input {
  @apply !text-right !pr-10;
}
</style>

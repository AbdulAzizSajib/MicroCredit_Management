<template>
  <MainLayout>
    <div
      class="bg-white min-h-screen p-8 border max-w-3xl mx-auto border-black"
    >
      <!-- Balance Sheet Table -->
      <table class="w-full max-w-3xl mx-auto border-collapse text-sm">
        <!-- Header Row -->
        <thead>
          <tr class="border border-black">
            <th class="text-left py-2 px-4 font-bold text-black">
              Particulars
            </th>
            <th
              class="py-2 px-4 font-bold text-black border-l border-r border-black"
            >
              Notes
            </th>
            <th class="text-right py-2 px-4 font-bold text-black">
              30.06.2025
            </th>
          </tr>
        </thead>

        <tbody class="text-black">
          <!-- ASSETS Section -->
          <tr>
            <td class="pt-4 px-4 font-bold underline">ASSETS</td>
            <td></td>
            <td></td>
          </tr>

          <!-- Non Current Assets -->
          <tr>
            <td class="px-4 font-bold underline">Non Current Assets</td>
            <td></td>
            <td class="text-right px-4 font-bold">16,484,925</td>
          </tr>
          <tr>
            <td class="px-4 pl-8">Property, Plant & Equipment</td>
            <td class="text-center">Annex-A</td>
            <td class="text-right px-4 border border-black">16,484,925</td>
          </tr>

          <!-- Current Assets -->
          <tr>
            <td class="pt-4 px-4 font-bold underline">Current Assets</td>
            <td></td>
            <td class="text-right px-4 font-bold">377,336,440</td>
          </tr>
          <tr>
            <td class="px-4 pl-8">Inventories</td>
            <td class="text-center">2</td>
            <td class="text-right px-4 border-x border-t border-black">
              132,195,857
            </td>
          </tr>
          <tr>
            <td class="px-4 pl-8">Trade & Other Receivables</td>
            <td class="text-center">3</td>
            <td class="text-right px-4 border-x border-black">214,191,087</td>
          </tr>
          <tr>
            <td class="px-4 pl-8">Advances, Deposits and Prepayments</td>
            <td class="text-center">4</td>
            <td class="text-right px-4 border-x border-black">20,260,444</td>
          </tr>
          <tr>
            <td class="px-4 pl-8">Cash & Cash Equivalents</td>
            <td class="text-center">5</td>
            <td class="text-right px-4 border-x border-b border-black">
              10,689,052
            </td>
          </tr>

          <!-- Total Assets -->
          <tr class="">
            <td class="py-3 px-4 font-bold">TOTAL ASSETS</td>
            <td></td>
            <td
              class="text-right px-4 font-bold border-b-4 border-black border-double"
            >
              393,821,365
            </td>
          </tr>

          <!-- Empty row for spacing -->
          <tr>
            <td class="py-2"></td>
            <td></td>
            <td></td>
          </tr>

          <!-- EQUITIES & LIABILITIES Section -->
          <tr>
            <td class="px-4 font-bold underline">EQUITIES & LIABILITIES</td>
            <td></td>
            <td></td>
          </tr>

          <!-- Owners' Equity -->
          <tr>
            <td class="px-4 font-bold underline">Owners' Equity</td>
            <td></td>
            <td class="text-right px-4 font-bold">179,295,445</td>
          </tr>
          <tr>
            <td class="px-4 pl-8">Retained Earnings</td>
            <td class="text-center">6</td>
            <td class="text-right px-4 border border-black">179,295,445</td>
          </tr>

          <!-- Non-Current Liabilities -->
          <tr>
            <td class="pt-2 px-4 font-bold underline">
              Non-Current Liabilities
            </td>
            <td></td>
            <td class="text-right px-4 font-bold">15,245,390</td>
          </tr>
          <tr>
            <td class="px-4 pl-8">BRAC Bank Term Loan</td>
            <td></td>
            <td class="text-right px-4 border border-black">15,245,390</td>
          </tr>

          <!-- Current Liabilities -->
          <tr>
            <td class="pt-4 px-4 font-bold underline">Current Liabilities</td>
            <td></td>
            <td class="text-right px-4 font-bold">199,280,530</td>
          </tr>
          <tr>
            <td class="px-4 pl-8">Short Term Borrowing</td>
            <td class="text-center">7</td>
            <td class="text-right px-4 border-t border-x border-black">
              69,686,238
            </td>
          </tr>
          <tr>
            <td class="px-4 pl-8">Trade & Other Payables</td>
            <td class="text-center">8</td>
            <td class="text-right px-4 border-x border-black">115,692,401</td>
          </tr>
          <tr>
            <td class="px-4 pl-8">Accrued Expenses</td>
            <td class="text-center">9</td>
            <td class="text-right px-4 border-x border-black">13,901,892</td>
          </tr>

          <!-- Total Equities Liabilities -->
          <tr class="">
            <td class="py-3 px-4 font-bold">TOTAL EQUITIES LIABILITIES</td>
            <td></td>
            <td
              class="text-right px-4 font-bold border-b-4 border-black border-double border-t"
            >
              393,821,365
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Footer Notes -->
      <div class="max-w-3xl mx-auto mt-8 text-sm text-black">
        <p class="text-center pt-4">
          The annexed notes form an integral part of these Financial Statements.
        </p>
      </div>

      <!-- Signature Section -->
      <div class="mx-auto mt-12 text-black text-center">
        <p class="mb-8 text-lg">
          This is the Statement of Financial Position referred to in our
          separate report of
        </p>
      </div>
      <div class="mt-16">
        <p><span class="font-semibold">Date:</span></p>
        <p><span class="font-semibold">Place:</span> Dhaka</p>
        <p><span class="font-semibold">DVC No:</span></p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
</script>

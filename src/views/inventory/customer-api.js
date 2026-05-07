import axios from "axios";
import { apiBase } from "@/config";
import { getToken } from "@/utilities/common";

const _cache = new Map();

export async function fetchCustomers(plantCode, business) {
  if (!plantCode || !business) return [];
  const key = `${plantCode}|${business}`;
  if (_cache.has(key)) return _cache.get(key);
  const params = new URLSearchParams({
    PlantCode: plantCode,
    Business: business,
  }).toString();
  const res = await axios.get(`${apiBase}/inventory/customer/all?${params}`, getToken());
  const data = res?.data?.data ?? res?.data ?? [];
  _cache.set(key, data);
  return data;
}

export function clearCustomerCache() {
  _cache.clear();
}

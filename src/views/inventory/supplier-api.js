import axios from "axios";
import { apiBase } from "@/config";
import { getToken } from "@/utilities/common";

let _cache = null;

export async function fetchAllSuppliers() {
  if (_cache) return _cache;
  const res = await axios.get(
    `${apiBase}/inventory/supplier?per_page=500&page=1`,
    getToken(),
  );
  const payload = res?.data?.data ?? res?.data;
  _cache = payload?.data ?? payload ?? [];
  return _cache;
}

export function clearSuppliersCache() {
  _cache = null;
}

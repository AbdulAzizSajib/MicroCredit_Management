import axios from "axios";
import { apiBase } from "@/config";
import { getToken } from "@/utilities/common";

let _cache = null;

export async function fetchAllBusinesses() {
  if (_cache) return _cache;
  const res = await axios.get(`${apiBase}/inventory/business/all`, getToken());
  _cache = res?.data?.data ?? res?.data ?? [];
  return _cache;
}

export function clearBusinessCache() {
  _cache = null;
}

import axios from "axios";
import { apiBase } from "@/config";
import { getToken } from "@/utilities/common";

let _cache = null;

export async function fetchAllMovementTypes() {
  if (_cache) return _cache;
  const params = new URLSearchParams({ per_page: 200, page: 1 }).toString();
  const res = await axios.get(`${apiBase}/inventory/movement-type?${params}`, getToken());
  const payload = res?.data?.data ?? res?.data;
  _cache = payload?.data ?? payload ?? [];
  return _cache;
}

export function clearMovementTypeCache() {
  _cache = null;
}

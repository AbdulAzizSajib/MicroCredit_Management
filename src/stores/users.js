import { apiBase, } from "@/config";
import { getToken } from "@/utilities/common";
import { showNotification } from "@/utilities/common";
import axios from "axios";

/* ----- USER ----- */
export const getUsers = async () => {
  let res = [];
  try {
    res = await axios.get(`${apiBase}/user_list`, getToken());
  } catch (error) {
    res = [];
    showNotification("error", error?.response?.data?.message || error?.message);
  }
  return res?.data?.users || [];
};

export const createUser = async (form) => {
  let result = false;
  try {
    const res = await axios.post(`${apiBase}/register`, form, getToken());
    showNotification(
      res?.data?.status?.toLowerCase(),
      res?.data?.message?.email?.at(-1) || res?.data?.message
    );
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

export const updateUser = async (id, form) => {
  let result = false;
  try {
    const res = await axios.put(
      `${apiBase}/user_update/${id}`,
      form,
      getToken()
    );
    showNotification(
      res?.data?.status?.toLowerCase(),
      res?.data?.message?.email?.at(-1) || res?.data?.message
    );
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

export const deleteUser = async (id) => {
  console.log(id);
  let result = false;
  try {
    const res = await axios.delete(`${apiBase}/user_delete/${id}`, getToken());
    showNotification(res?.data?.status?.toLowerCase(), res?.data?.message);
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

/* ----- ROLE ----- */
export const getRoles = async () => {
  let res = [];
  try {
    res = await axios.get(`${apiBase}/roles`, getToken());
  } catch (error) {
    res = [];
    showNotification("error", error?.response?.data?.message || error?.message);
  }
  return res?.data?.role || [];
};

export const createRole = async (form) => {
  let result = false;
  try {
    const res = await axios.post(`${apiBase}/roles`, form, getToken());
    showNotification(
      res?.data?.status?.toLowerCase(),
      res?.data?.message?.name?.at(-1) || res?.data?.message
    );
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

export const updateRole = async (id, form) => {
  let result = false;
  try {
    const res = await axios.put(`${apiBase}/roles/${id}`, form, getToken());
    showNotification(res?.data?.status?.toLowerCase(), res?.data?.message?.email?.at(-1) || res?.data?.message)
    if (res?.data?.status?.toLowerCase() == 'success') result = true
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message)
  }

  return result
}
export const deleteRole = async (id) => {

  let result = false;
  try {
    const res = await axios.delete(`${apiBase}/roles/${id}`, getToken());
    showNotification(res?.data?.status?.toLowerCase(), res?.data?.message)
    if (res?.data?.status?.toLowerCase() == 'success') result = true
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message)
  }

  return result
}
/* ----- PERMISSION ----- */
export const getPermissions = async () => {
  let res = [];
  try {
    res = await axios.get(`${apiBase}/permissions`, getToken());
  } catch (error) {
    res = [];
    showNotification("error", error?.response?.data?.message || error?.message);
  }
  return res?.data?.permissions || [];
};

export const createPermission = async (form) => {

  const name = form?.name?.toLowerCase().replace(/\s+/g, '-');
  let result = false;
  try {
    const res = await axios.post(`${apiBase}/permissions`, { name: name }, getToken());
    showNotification(
      res?.data?.status?.toLowerCase(),
      res?.data?.message?.name?.at(-1) || res?.data?.message
    );
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

export const updatePermission = async (id, form) => {
  const name = form?.name?.toLowerCase().replace(/\s+/g, '-');
  let result = false;
  try {
    const res = await axios.put(
      `${apiBase}/permissions/${id}?name=${name}`,
      "",
      getToken()
    );
    showNotification(
      res?.data?.status?.toLowerCase(),
      res?.data?.message?.name?.at(-1) || res?.data?.message
    );
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

export const deletePermission = async (id) => {
  let result = false;
  try {
    const res = await axios.delete(`${apiBase}/permissions/${id}`, getToken());
    showNotification(res?.data?.status?.toLowerCase(), res?.data?.message);
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};
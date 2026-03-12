import { apiBase } from "@/config"
import { showNotification } from "@/utilities/common"
import axios from "axios"
import Cookies from "js-cookie"

export const login = async (data, router) => {
    if (data?.email && !data.email.endsWith("@gmail.com")) {
        data.email += "@gmail.com";
    }
    let isLoading = true;
    try {
        const res = await axios.post(`${apiBase}/login`, data);
        isLoading = false;
        showNotification(res?.data?.status, res?.data?.message?.email?.at(-1) || res?.data?.message);
        if (res?.data?.status == "success") {
            Cookies.set("token", res?.data?.token);
            localStorage.setItem("user_info", JSON.stringify(res?.data?.user));
            localStorage.setItem("user_permissions", JSON.stringify(res?.data?.user?.all_permissions?.map((item) => item?.name)));
            localStorage.setItem("company_code", data.CompanyCode);
            localStorage.setItem("company_name", data.CompanyName || "");
            router.push({ name: "overview" });
        }

    } catch (err) {
        isLoading = false;
        Cookies.remove("token");
        localStorage.clear();
        showNotification("error", err?.response?.data?.message || err?.message);
    }
    return 1;
}

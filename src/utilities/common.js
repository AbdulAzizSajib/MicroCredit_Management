import { toast } from 'vue3-toastify';
import Cookies from "js-cookie";
import 'vue3-toastify/dist/index.css';

export const highlightedText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text?.replace(
        regex,
        '<span class="bg-yellow-200 font-semibold">$1</span>'
    );
};

export function formatNumber(number) {
    return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
}

export function hasPermission(route) {
    const user_permissions = JSON.parse(localStorage.getItem("user_permissions"));
    return user_permissions?.some((item) => item == route?.name);
}

export const getToken = () => {
    return {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        },
    };
};

export const showNotification = (type, message) => {
    toast(message, {
        "theme": "colored",
        "type": type,
    })
};
